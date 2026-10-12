"use client";
import { useActionState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { logIn } from "@/app/admin/actions";

export default function AdminLogin() {
  const [state, action, pending] = useActionState(logIn, null);

  return (
    <form
      action={action}
      className="mt-10 max-w-md rounded-[2rem] border border-sand bg-white p-6 sm:p-9"
    >
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold text-pine-900">
          Slaptažodis
        </span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="field"
        />
      </label>
      {state && !state.ok && (
        <p
          role="alert"
          className="mt-4 rounded-2xl bg-berry/10 p-4 text-sm font-semibold text-berry"
        >
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn btn-dark mt-6 w-full disabled:opacity-60 sm:w-auto"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <LockKeyhole className="size-4" aria-hidden="true" />
        )}
        Prisijungti
      </button>
    </form>
  );
}
