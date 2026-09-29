import { supabase } from "../lib/supabase";
import type { LeadSearchParams, LeadSearchResult } from "../types/leadFinder";
import type { Lead } from "../types/lead";

function isUniqueViolation(error: { code?: string }): boolean {
  return error.code === "23505";
}

export const findLeads = async (
  params: LeadSearchParams,
): Promise<LeadSearchResult[]> => {
  const { data, error } = await supabase.functions.invoke("find-leads", {
    body: {
      businessType: params.businessType,
      location: params.location,
      keywords: params.keywords,
      limit: params.limit,
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to search for leads.");
  }

  const payload = data as { leads?: LeadSearchResult[]; error?: string };

  if (payload?.error) {
    throw new Error(payload.error);
  }

  return Array.isArray(payload?.leads) ? payload.leads : [];
};

export const getGoogleMapsLeadBySourceId = async (
  sourceId: string,
): Promise<Lead | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", user.id)
    .eq("source", "google_maps")
    .eq("source_id", sourceId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Lead | null) ?? null;
};

export const addLeadFromSearchResult = async (
  result: LeadSearchResult,
): Promise<"added" | "already_added" | "missing_source_id"> => {
  const sourceId = result.sourceId?.trim();
  if (!sourceId) {
    return "missing_source_id";
  }

  const existing = await getGoogleMapsLeadBySourceId(sourceId);
  if (existing) {
    return "already_added";
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const { error } = await supabase.from("leads").insert([
    {
      user_id: user.id,
      name: result.name,
      company: result.name,
      email: null,
      phone: result.phone,
      website: result.website,
      address: result.address,
      category: result.category,
      rating: result.rating,
      reviews_count: result.reviewsCount,
      google_maps_url: result.googleMapsUrl,
      source: "google_maps",
      source_id: sourceId,
      status: "new",
    },
  ]);

  if (error) {
    if (isUniqueViolation(error)) {
      return "already_added";
    }
    throw error;
  }

  return "added";
};
