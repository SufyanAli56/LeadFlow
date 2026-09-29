import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import LeadFilters from "../../components/leads/LeadFilters";
import LeadTable from "../../components/leads/LeadTable";

import {
  deleteLead,
  getLeads,
} from "../../services/leadService";

import type {
  Lead,
  LeadStatus,
} from "../../types/lead";

function Leads() {
  const navigate = useNavigate();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    LeadStatus | "all"
  >("all");

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getLeads();

      setLeads(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load leads."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return leads.filter((lead) => {
      const matchesSearch =
        !searchValue ||
        lead.name.toLowerCase().includes(searchValue) ||
        lead.company.toLowerCase().includes(searchValue) ||
        (lead.email ?? "").toLowerCase().includes(searchValue);

      const matchesStatus =
        status === "all" || lead.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, status]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmed) return;

    try {
      await deleteLead(id);

      setLeads((currentLeads) =>
        currentLeads.filter((lead) => lead.id !== id)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete lead."
      );
    }
  };

  const handleView = (id: string) => {
    navigate(`/leads/${id}`);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Leads
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all your leads from one place.
          </p>
        </div>

        <Link
          to="/lead-finder"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
        >
          + Find New Leads
        </Link>
      </div>

      <LeadFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          Loading leads...
        </div>
      ) : (
        <LeadTable
          leads={filteredLeads}
          onView={handleView}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default Leads;