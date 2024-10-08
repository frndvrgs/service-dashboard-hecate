"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  console.error(error);

  return (
    <div>
      <h1>Authentication Error</h1>
      <p>An error occurred during authentication: {error}</p>
      {error === "OAuthAccountNotLinked" && (
        <p>
          It seems you already have an account with this email address. Please
          sign in using your original authentication method.
        </p>
      )}
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
