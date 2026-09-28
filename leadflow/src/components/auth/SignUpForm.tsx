import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import Input from "../common/Input";
import Button from "../common/Button";

function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName.trim() || undefined },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      setLoading(false);
      return;
    }

    setSuccess(
      "Account created. Check your email to confirm your address, then sign in.",
    );
    setLoading(false);
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </div>
      )}

      <Input
        label="Full name"
        type="text"
        placeholder="Jane Doe"
        value={fullName}
        onChange={setFullName}
        autoComplete="name"
      />

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={setEmail}
        required
        autoComplete="email"
      />

      <Input
        label="Password"
        type="password"
        placeholder="At least 6 characters"
        value={password}
        onChange={setPassword}
        required
        autoComplete="new-password"
      />

      <Button type="submit" loading={loading}>
        Create account
      </Button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-brand-600 hover:text-brand-700"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default SignUpForm;
