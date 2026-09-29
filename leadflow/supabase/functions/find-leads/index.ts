import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FindLeadsRequestBody {
  businessType?: string;
  location?: string;
  keywords?: string;
  limit?: number;
}

interface SerpApiLocalResult {
  title?: string;
  place_id?: string;
  data_id?: string;
  type?: string;
  types?: string[];
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviews?: number;
  place_id_search?: string;
  links?: {
    directions?: string;
    website?: string;
  };
}

interface NormalizedLead {
  sourceId: string | null;
  name: string;
  category: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  rating: number | null;
  reviewsCount: number | null;
  googleMapsUrl: string | null;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function buildSearchQuery(
  businessType: string,
  location: string,
  keywords?: string,
): string {
  const keywordPart = keywords?.trim();
  const typePart = businessType.trim();
  const locationPart = location.trim();

  if (keywordPart) {
    return `${keywordPart} ${typePart} in ${locationPart}`;
  }

  return `${typePart} in ${locationPart}`;
}

function pickSourceId(result: SerpApiLocalResult): string | null {
  const placeId = result.place_id?.trim();
  if (placeId) return placeId;

  const dataId = result.data_id?.trim();
  if (dataId) return dataId;

  return null;
}

function pickGoogleMapsUrl(result: SerpApiLocalResult): string | null {
  const directions = result.links?.directions?.trim();
  if (directions?.includes("google.com/maps")) {
    return directions;
  }

  const placeId = result.place_id?.trim();
  if (placeId) {
    return `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(placeId)}`;
  }

  return null;
}

function normalizeResult(result: SerpApiLocalResult): NormalizedLead | null {
  const name = result.title?.trim();
  if (!name) return null;

  const category =
    result.type?.trim() ??
    (Array.isArray(result.types) && result.types.length > 0
      ? result.types[0]?.trim() ?? null
      : null);

  const rating =
    typeof result.rating === "number" && !Number.isNaN(result.rating)
      ? result.rating
      : null;

  const reviewsCount =
    typeof result.reviews === "number" && Number.isInteger(result.reviews)
      ? result.reviews
      : null;

  return {
    sourceId: pickSourceId(result),
    name,
    category,
    address: result.address?.trim() || null,
    phone: result.phone?.trim() || null,
    website: result.website?.trim() || result.links?.website?.trim() || null,
    rating,
    reviewsCount,
    googleMapsUrl: pickGoogleMapsUrl(result),
  };
}

async function fetchSerpApiPage(
  apiKey: string,
  query: string,
  start: number,
): Promise<SerpApiLocalResult[]> {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_maps");
  url.searchParams.set("type", "search");
  url.searchParams.set("q", query);
  url.searchParams.set("api_key", apiKey);
  if (start > 0) {
    url.searchParams.set("start", String(start));
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `SerpApi request failed (${response.status}): ${text.slice(0, 200)}`,
    );
  }

  const payload = (await response.json()) as {
    local_results?: SerpApiLocalResult[];
    error?: string;
  };

  if (payload.error) {
    throw new Error(payload.error);
  }

  return Array.isArray(payload.local_results) ? payload.local_results : [];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ error: "Missing authorization header" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    return jsonResponse({ error: "Server configuration error" }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const serpApiKey = Deno.env.get("SERPAPI_API_KEY");
  if (!serpApiKey) {
    return jsonResponse({ error: "SERPAPI_API_KEY is not configured" }, 500);
  }

  let body: FindLeadsRequestBody;
  try {
    body = (await req.json()) as FindLeadsRequestBody;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const businessType = body.businessType?.trim() ?? "";
  const location = body.location?.trim() ?? "";
  const keywords = body.keywords?.trim() ?? "";
  const limitRaw = body.limit ?? 20;

  if (!businessType) {
    return jsonResponse({ error: "businessType is required" }, 400);
  }

  if (!location) {
    return jsonResponse({ error: "location is required" }, 400);
  }

  if (!Number.isFinite(limitRaw) || limitRaw < 1 || limitRaw > 100) {
    return jsonResponse(
      { error: "limit must be a number between 1 and 100" },
      400,
    );
  }

  const limit = Math.floor(limitRaw);
  const query = buildSearchQuery(businessType, location, keywords);

  try {
    const leads: NormalizedLead[] = [];
    const seenSourceIds = new Set<string>();
    let start = 0;

    while (leads.length < limit) {
      const page = await fetchSerpApiPage(serpApiKey, query, start);

      if (page.length === 0) {
        break;
      }

      for (const item of page) {
        const normalized = normalizeResult(item);
        if (!normalized) continue;

        if (normalized.sourceId) {
          if (seenSourceIds.has(normalized.sourceId)) continue;
          seenSourceIds.add(normalized.sourceId);
        }

        leads.push(normalized);
        if (leads.length >= limit) break;
      }

      if (page.length < 20) {
        break;
      }

      start += 20;
    }

    return jsonResponse({ leads });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch leads from SerpApi";
    return jsonResponse({ error: message }, 502);
  }
});
