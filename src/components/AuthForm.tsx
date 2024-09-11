"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface AuthFormProps {
  mode: "login" | "signup";
}

type FormData = {
  email: string;
};

export function AuthForm({ mode }: AuthFormProps) {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingStates, setLoadingStates] = useState({
    github: false,
    google: false,
    magicLink: false,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const isLogin = mode === "login";
  const activeMode = isLogin ? "Sign in" : "Sign up";

  const setLoading = (
    provider: keyof typeof loadingStates,
    isLoading: boolean,
  ) => {
    setLoadingStates((prev) => ({ ...prev, [provider]: isLoading }));
  };

  const handleSocial = (provider: "github" | "google") => {
    setLoading(provider, true);
    signIn(provider, { callbackUrl: "/dashboard" }).catch((error) => {
      console.error(`${activeMode} error with ${provider}:`, error);
      setError(
        `An unexpected error occurred with ${provider} sign in. Please try again.`,
      );
      setLoading(provider, false);
    });
  };

  const handleMagicLink = async (data: FormData) => {
    setError("");
    setSuccessMessage("");
    setLoading("magicLink", true);

    try {
      const result = await signIn("email", {
        email: data.email,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccessMessage("Check your e-mail to continue.");
      }
    } catch (error) {
      console.error(`${activeMode} error with e-mail:`, error);
      setError(
        `An unexpected error occurred with e-mail ${activeMode}. Please try again.`,
      );
    } finally {
      setLoading("magicLink", false);
    }
  };

  return (
    <div className="bg-white shadow rounded p-6 w-full max-w-md mx-auto">
      <div className="mb-6 space-y-2">
        <button
          onClick={() => handleSocial("github")}
          disabled={loadingStates.github}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-4 rounded disabled:opacity-40 disabled:hover:bg-gray-800 disabled:bg-gray-800 transition-colors duration-200 ease-in-out"
        >
          {loadingStates.github ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin inline mr-2" />
          ) : null}
          {loadingStates.github
            ? `${isLogin ? "Logging in" : "Signing up"} with GitHub...`
            : `${isLogin ? "Log In" : "Sign Up"} with GitHub`}
        </button>
        <button
          onClick={() => handleSocial("google")}
          disabled={loadingStates.google}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded disabled:opacity-40 disabled:hover:bg-red-500 disabled:bg-red-500 transition-colors duration-200 ease-in-out"
        >
          {loadingStates.google ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin inline mr-2" />
          ) : null}
          {loadingStates.google
            ? `${isLogin ? "Logging in" : "Signing up"} with Google...`
            : `${isLogin ? "Log In" : "Sign Up"} with Google`}
        </button>
      </div>

      <div className="mt-4">
        <form
          onSubmit={handleSubmit(handleMagicLink)}
          className="space-y-4 w-full"
        >
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required.",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address.",
              },
            }}
            render={({ field }) => (
              <div>
                <input
                  {...field}
                  type="email"
                  placeholder="E-mail Address"
                  className={`w-full border rounded py-2 px-3 text-black ${errors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            )}
          />
          <button
            type="submit"
            disabled={loadingStates.magicLink || !!errors.email}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white py-3 px-4 rounded disabled:opacity-30 disabled:hover:bg-gray-500 disabled:bg-gray-500 transition-colors duration-200 ease-in-out"
          >
            {loadingStates.magicLink ? (
              <ArrowPathIcon className="w-5 h-5 animate-spin inline mr-2" />
            ) : null}
            {loadingStates.magicLink
              ? "Sending Magic Link..."
              : `Continue with E-mail`}
          </button>
        </form>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {successMessage && (
        <p className="text-green-500 text-sm mt-2">{successMessage}</p>
      )}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <a
            href={isLogin ? "/signup" : "/login"}
            className="text-blue-500 hover:text-blue-700"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </a>
        </p>
      </div>
    </div>
  );
}
