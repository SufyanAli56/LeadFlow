import AuthLayout from "../../layouts/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";

function Login() {
  return (
    <AuthLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to continue to LeadFlow.
        </p>
      </div>

      <LoginForm />
    </AuthLayout>
  );
}

export default Login;
