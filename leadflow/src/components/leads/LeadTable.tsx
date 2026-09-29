import type { Lead } from "../../types/lead";

interface LeadTableProps {
  leads: Lead[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
}

function formatSource(source: Lead["source"]): string {
  return source === "google_maps" ? "Google Maps" : "Manual";
}

function LeadTable({
  leads,
  onView,
  onDelete,
}: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          No leads found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Use Find New Leads to discover businesses from Google Maps.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Website
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Address
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Reviews
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Source
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Created
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{lead.name}</p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {lead.company}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {lead.email ?? "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {lead.phone ?? "—"}
                </td>
                <td className="max-w-[160px] truncate px-4 py-3 text-sm text-gray-600">
                  {lead.website ? (
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      {lead.website}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="max-w-[180px] truncate px-4 py-3 text-sm text-gray-600">
                  {lead.address ?? "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {lead.category ?? "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {lead.rating ?? "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {lead.reviews_count ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium capitalize text-indigo-600">
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatSource(lead.source)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                  {formatDate(lead.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onView(lead.id)}
                      className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(lead.id)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeadTable;
