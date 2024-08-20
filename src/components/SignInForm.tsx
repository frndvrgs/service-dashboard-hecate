"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createAccount, FormState } from "../actions/account";

function SubmitButton({ isDisabled }: { isDisabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={isDisabled || pending}
      className="w-full bg-gray-600 hover:bg-gray-500 text-white py-3 px-4 rounded disabled:opacity-30 disabled:hover:bg-gray-500 disabled:bg-gray-500 transition-colors duration-200 ease-in-out"
    >
      {pending ? "Creating account..." : "Create Account"}
    </button>
  );
}

const initialState: FormState = {
  success: false,
  message: "",
  validation: null,
  data: null,
  errors: null,
};

export function SignInForm() {
  const [state, formAction] = useFormState(createAccount, initialState);
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      state.validation && console.error("validation errors:", state.validation);
      state.errors && console.error("action errors:", state.errors);
    }
    if (state.success) {
      router.push("/login");
    }
  }, [state, router]);

  return (
    <div className="bg-white shadow rounded p-6 w-full max-w-md mx-auto">
      <form action={formAction} className="space-y-4 w-full">
        <div>
          <input
            type="email"
            name="email"
            placeholder="E-mail Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded py-2 px-3 text-black"
          />
          {state.errors?.email && (
            <p className="text-red-500 text-xs mt-1">{state.errors.email[0]}</p>
          )}
        </div>
        <SubmitButton isDisabled={!email.trim()} />
      </form>
      {state.message && (
        <p
          className={`text-sm mt-2 ${state.errors ? "text-red-500" : "text-green-500"}`}
        >
          {state.message}
        </p>
      )}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:text-blue-700">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
