import type { LeadStatus } from "../../types/lead";

interface LeadFiltersProps {
  search: string;
  status: LeadStatus | "all";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: LeadStatus | "all") => void;
}

function LeadFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: LeadFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 md:flex-row">
      <div className="flex-1">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, company or email..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="md:w-52">
        <select
          value={status}
          onChange={(e) =>
            onStatusChange(
              e.target.value as LeadStatus | "all"
            )
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="closed">Closed</option>
        </select>
      </div>
    </div>
  );
}

export default LeadFilters;