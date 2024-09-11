import { AuthForm } from "@/components/AuthForm";

const SessionSignUp = () => {
  return (
    <section className="max-w-md w-full px-4 text-center">
      <h1 className="text-4xl font-bold mb-12">Get Started</h1>
      <AuthForm mode="signup" />
    </section>
  );
};

export default SessionSignUp;
