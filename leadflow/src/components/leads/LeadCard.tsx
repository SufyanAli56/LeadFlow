import { ExternalLink, MapPin, Phone, Star } from "lucide-react";
import type { Lead } from "../../types/leads";

interface LeadCardProps {
  lead: Lead;
}

export default function LeadCard({ lead }: LeadCardProps) {
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <h3 className="text-base font-semibold text-slate-900">{lead.name}</h3>

      <ul className="mt-4 flex flex-1 flex-col gap-2.5 text-sm text-slate-600">
        <li className="flex gap-2">
          <MapPin
            className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
            strokeWidth={2}
          />
          <span>{lead.address}</span>
        </li>

        <li className="flex gap-2">
          <Phone
            className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
            strokeWidth={2}
          />
          <span>{lead.phone}</span>
        </li>

        {lead.rating && (
          <li className="flex items-center gap-2 text-slate-700">
            <Star
              className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400"
              strokeWidth={2}
            />
            <span className="font-medium tabular-nums">{lead.rating}</span>
            {lead.totalRatings ? (
              <span className="text-slate-500">
                ({lead.totalRatings} reviews)
              </span>
            ) : null}
          </li>
        )}
      </ul>

      {(lead.website || lead.googleMapsUri) && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {lead.website && (
            <a
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-white hover:text-brand-700"
            >
              Website
              <ExternalLink className="h-3 w-3" strokeWidth={2} />
            </a>
          )}

          {lead.googleMapsUri && (
            <a
              href={lead.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 transition hover:bg-brand-100"
            >
              Google Maps
              <ExternalLink className="h-3 w-3" strokeWidth={2} />
            </a>
          )}
        </div>
      )}
    </article>
  );
}
