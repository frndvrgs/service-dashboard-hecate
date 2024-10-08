import { AuthForm } from "@/components/AuthForm";

const SessionLogIn = () => {
  return (
    <section className="max-w-md w-full px-4 text-center">
      <h1 className="text-4xl font-bold mb-12">Log In to Service</h1>
      <AuthForm mode="login" />
    </section>
  );
};

export default SessionLogIn;
