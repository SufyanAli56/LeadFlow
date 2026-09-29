import type { Lead } from "../types/leads";

export interface LeadSearchParams {
  category: string;
  city: string;
  state: string;
}

interface ApifyRun {
  id: string;
  status: string;
  defaultDatasetId: string;
}

interface ApifyPlace {
  placeId?: string;
  title?: string;
  address?: string;
  phone?: string;
  website?: string;
  totalScore?: number;
  reviewsCount?: number;
  url?: string;
}

const APIFY_BASE_URL = "https://api.apify.com/v2";
const APIFY_ACTOR_ID = "compass~crawler-google-places";
const LEAD_LIMIT = 20;
const WAIT_FOR_FINISH_SECONDS = 300;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getApifyToken(): string {
  const token = import.meta.env.VITE_APIFY_API_TOKEN;

  if (!token) {
    throw new Error(
      "Apify API token is missing. Set VITE_APIFY_API_TOKEN in your .env file.",
    );
  }

  return token;
}

async function apifyRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getApifyToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${APIFY_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const body = await response.text();

  let payload: { data?: T; error?: { message?: string } } = {};

  if (body) {
    try {
      payload = JSON.parse(body) as typeof payload;
    } catch {
      throw new Error("Apify returned an unexpected response.");
    }
  }

  if (!response.ok) {
    throw new Error(
      payload.error?.message ??
        "Apify request failed. Check your token and try again.",
    );
  }

  return payload.data as T;
}

async function waitForRunCompletion(run: ApifyRun): Promise<ApifyRun> {
  let current = run;

  while (current.status === "RUNNING" || current.status === "READY") {
    await sleep(3000);
    current = await apifyRequest<ApifyRun>(`/actor-runs/${current.id}`);
  }

  if (current.status !== "SUCCEEDED") {
    throw new Error(
      `Lead search did not complete (${current.status}). Please try again.`,
    );
  }

  return current;
}

function buildLocationQuery(city: string, state: string): string {
  return `${city.trim()}, ${state.trim()}`;
}

function mapPlaceToLead(place: ApifyPlace, index: number): Lead | null {
  const name = place.title?.trim();

  if (!name) {
    return null;
  }

  return {
    id: place.placeId ?? `apify-${index}`,
    name,
    address: place.address?.trim() || "Address not available",
    phone: place.phone?.trim() || "Phone not available",
    website: place.website?.trim() ?? "",
    rating: place.totalScore,
    totalRatings: place.reviewsCount,
    googleMapsUri: place.url,
  };
}

async function fetchDatasetLeads(datasetId: string): Promise<Lead[]> {
  const token = getApifyToken();
  const url = `${APIFY_BASE_URL}/datasets/${datasetId}/items?format=json&limit=${LEAD_LIMIT}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load lead results from Apify.");
  }

  const places = (await response.json()) as ApifyPlace[];
  const leads: Lead[] = [];

  places.forEach((place, index) => {
    const lead = mapPlaceToLead(place, index);

    if (lead) {
      leads.push(lead);
    }
  });

  return leads;
}

export const findLeads = async ({
  category,
  city,
  state,
}: LeadSearchParams): Promise<Lead[]> => {
  const actorInput = {
    searchStringsArray: [category.trim()],
    locationQuery: buildLocationQuery(city, state),
    maxCrawledPlacesPerSearch: LEAD_LIMIT,
    language: "en",
  };

  let run = await apifyRequest<ApifyRun>(
    `/acts/${APIFY_ACTOR_ID}/runs?waitForFinish=${WAIT_FOR_FINISH_SECONDS}`,
    {
      method: "POST",
      body: JSON.stringify(actorInput),
    },
  );

  if (run.status === "RUNNING" || run.status === "READY") {
    run = await waitForRunCompletion(run);
  } else if (run.status !== "SUCCEEDED") {
    throw new Error(
      `Lead search did not complete (${run.status}). Please try again.`,
    );
  }

  if (!run.defaultDatasetId) {
    throw new Error("Apify run finished without result data.");
  }

  return fetchDatasetLeads(run.defaultDatasetId);
};
