import PageMeta from "../../components/common/PageMeta";
import SignUpForm from "../../components/SignUpForm";
import AuthLayout from "./AuthPageLayout";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="WOW Sign Up"
        description="This is the Sign Up page for WOW"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
