"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";

export function LogInForm() {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loadingStates, setLoadingStates] = useState({
    github: false,
    google: false,
    magicLink: false,
  });

  const setLoading = (
    provider: keyof typeof loadingStates,
    isLoading: boolean,
  ) => {
    setLoadingStates((prev) => ({ ...prev, [provider]: isLoading }));
  };

  const handleProviderSignIn = (provider: "github" | "google") => {
    setLoading(provider, true);
    signIn(provider, { callbackUrl: "/dashboard" }).catch((error) => {
      console.error(`Sign in error with ${provider}:`, error);
      setError(
        `An unexpected error occurred with ${provider} sign in. Please try again.`,
      );
    });
    // .finally(() => {
    //   setLoading(provider, false);
    // });
  };

  const handleMagicLinkSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading("magicLink", true);

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccessMessage("Check your email for the magic link!");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading("magicLink", false);
    }
  };

  return (
    <div className="bg-white shadow rounded p-6 w-full max-w-md mx-auto">
      <div className="mb-6 space-y-2">
        <button
          onClick={() => handleProviderSignIn("github")}
          disabled={loadingStates.github}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-4 rounded disabled:opacity-40 disabled:hover:bg-gray-800 disabled:bg-gray-800 transition-colors duration-200 ease-in-out"
        >
          {loadingStates.github
            ? "Logging in with GitHub..."
            : "Log In with GitHub"}
        </button>
        <button
          onClick={() => handleProviderSignIn("google")}
          disabled={loadingStates.google}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded disabled:opacity-40 disabled:hover:bg-red-500 disabled:bg-red-500 transition-colors duration-200 ease-in-out"
        >
          {loadingStates.google
            ? "Logging in with Google..."
            : "Log In with Google"}
        </button>
      </div>

      <div className="mt-4">
        <form onSubmit={handleMagicLinkSignIn} className="space-y-4 w-full">
          <div>
            <input
              type="email"
              name="emailAuth"
              placeholder="E-mail Address"
              required
              value={email}
              onChange={(value) => setEmail(value.target.value)}
              className="w-full border rounded py-2 px-3 text-black"
            />
          </div>
          <button
            type="submit"
            disabled={loadingStates.magicLink || !email.trim()}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white py-3 px-4 rounded disabled:opacity-30 disabled:hover:bg-gray-500 disabled:bg-gray-500 transition-colors duration-200 ease-in-out"
          >
            {loadingStates.magicLink
              ? "Sending Magic Link..."
              : "Continue with E-mail"}
          </button>
        </form>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {successMessage && (
        <p className="text-green-500 text-sm mt-2">{successMessage}</p>
      )}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:text-blue-700">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
