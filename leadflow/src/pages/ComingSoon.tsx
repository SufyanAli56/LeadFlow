import { Link } from "react-router-dom";

interface ComingSoonProps {
  title: string;
}

function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">
        This section is coming soon. Your account and dashboard are ready to
        use.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
      >
        Back to dashboard
      </Link>
    </div>
  );
}

export default ComingSoon;
