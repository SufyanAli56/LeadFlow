import AuthLayout from "../../layouts/AuthLayout";
import SignUpForm from "../../components/auth/SignUpForm";

function SignUp() {
  return (
    <AuthLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Create account</h2>
        <p className="mt-1 text-sm text-slate-500">
          Start managing leads and outreach with LeadFlow.
        </p>
      </div>

      <SignUpForm />
    </AuthLayout>
  );
}

export default SignUp;
