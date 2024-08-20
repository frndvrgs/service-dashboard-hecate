import Link from "next/link";
const SessionLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="container mx-auto h-screen flex flex-col items-center justify-center">
      {children}
      <Link className="mb-4 mt-4 text-gray-500" href="/">
        Back to Home
      </Link>
    </main>
  );
};

export default SessionLayout;
