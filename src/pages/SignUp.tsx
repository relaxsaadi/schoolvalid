
import { Link, useNavigate } from "react-router-dom";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { SignUpPromo } from "@/components/auth/SignUpPromo";

const SignUp = () => {
  const navigate = useNavigate();

  const handleSignUpSuccess = () => {
    navigate("/sign-in");
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your details to get started
            </p>
          </div>
          <SignUpForm onSuccess={handleSignUpSuccess} />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              to="/sign-in"
              className="hover:text-brand-900 underline underline-offset-4"
            >
              Already have an account? Sign in
            </Link>
          </p>
        </div>
      </div>
      <SignUpPromo />
    </div>
  );
};

export default SignUp;
