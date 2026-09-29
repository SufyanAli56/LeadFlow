import { supabase } from "../lib/supabase";
import type {
  CreateLeadData,
  Lead,
  UpdateLeadData,
} from "../types/lead";

export const getLeads = async (): Promise<Lead[]> => {
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
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as Lead[];
};

export const getLeadById = async (id: string): Promise<Lead> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return data as Lead;
};

export const createLead = async (
  lead: CreateLeadData,
): Promise<Lead> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const email = lead.email?.trim();
  const { data, error } = await supabase
    .from("leads")
    .insert([
      {
        user_id: user.id,
        name: lead.name,
        company: lead.company,
        email: email || null,
        phone: lead.phone || null,
        website: lead.website || null,
        linkedin_url: lead.linkedin_url || null,
        address: lead.address || null,
        category: lead.category || null,
        rating: lead.rating ?? null,
        reviews_count: lead.reviews_count ?? null,
        google_maps_url: lead.google_maps_url || null,
        source: lead.source || "manual",
        source_id: lead.source_id || null,
        status: lead.status || "new",
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Lead;
};

export const updateLead = async (
  id: string,
  lead: UpdateLeadData,
): Promise<Lead> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const email = lead.email?.trim();

  const { data, error } = await supabase
    .from("leads")
    .update({
      name: lead.name,
      company: lead.company,
      email: email || null,
      phone: lead.phone || null,
      website: lead.website || null,
      linkedin_url: lead.linkedin_url || null,
      address: lead.address || null,
      category: lead.category || null,
      rating: lead.rating ?? null,
      reviews_count: lead.reviews_count ?? null,
      google_maps_url: lead.google_maps_url || null,
      status: lead.status,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Lead;
};

export const deleteLead = async (id: string): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }
};
