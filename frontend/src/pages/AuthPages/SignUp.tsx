import PageMeta from "../../components/common/PageMeta";
import SignUpForm from "../../components/SignUpForm";
import AuthLayout from "./AuthPageLayout";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Sign Up"
        description="This is the Sign Up page"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
