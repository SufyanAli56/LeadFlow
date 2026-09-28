interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit";
  loading?: boolean;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

function Button({
  children,
  type = "button",
  loading = false,
  variant = "primary",
  onClick,
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500"
      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${styles}`}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;
