import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type {
  CreateLeadData,
  Lead,
  LeadStatus,
  UpdateLeadData,
} from "../../types/lead";

interface LeadFormProps {
  lead?: Lead | null;
  loading?: boolean;
  onSubmit: (
    data: CreateLeadData | UpdateLeadData
  ) => Promise<void>;
  onCancel?: () => void;
}

function LeadForm({
  lead,
  loading = false,
  onSubmit,
  onCancel,
}: LeadFormProps) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [status, setStatus] = useState<LeadStatus>("new");

  const [error, setError] = useState("");

  useEffect(() => {
    if (lead) {
      setName(lead.name);
      setCompany(lead.company);
      setEmail(lead.email ?? "");
      setPhone(lead.phone ?? "");
      setWebsite(lead.website ?? "");
      setLinkedinUrl(lead.linkedin_url ?? "");
      setStatus(lead.status);
    } else {
      setName("");
      setCompany("");
      setEmail("");
      setPhone("");
      setWebsite("");
      setLinkedinUrl("");
      setStatus("new");
    }

    setError("");
  }, [lead]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Lead name is required.");
      return;
    }

    if (!company.trim()) {
      setError("Company is required.");
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        company: company.trim(),
        email: email.trim() || null,
        phone: phone.trim(),
        website: website.trim(),
        linkedin_url: linkedinUrl.trim(),
        status,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Company
        </label>

        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Acme Inc."
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@company.com"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Phone
        </label>

        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+92 300 1234567"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Website
        </label>

        <input
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://company.com"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          LinkedIn URL
        </label>

        <input
          type="url"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          placeholder="https://linkedin.com/in/johndoe"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {lead && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as LeadStatus)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : lead
              ? "Update Lead"
              : "Create Lead"}
        </button>
      </div>
    </form>
  );
}

export default LeadForm;