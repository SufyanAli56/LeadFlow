interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit";
  loading?: boolean;
  onClick?: () => void;
}

function Button({
  children,
  type = "button",
  loading = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;