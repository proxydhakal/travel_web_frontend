import { FormEvent, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ApiError, api } from "./api";
import { useSession, type StaffUser } from "./AdminApp";
import { useToast } from "../context/ToastContext";

export function LoginPage() {
  const { user, loading, refresh } = useSession();
  const { push } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  if (!loading && user) return <Navigate to="/admin" replace />;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const next: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter the email you use to sign in.";
    if (password.length < 6) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) {
      push("Please correct the highlighted fields.", "error");
      return;
    }
    setPending(true);
    try {
      await api<{ user: StaffUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      push("Signed in.", "success");
      await refresh();
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Could not sign in.";
      const fieldErrors = reason instanceof ApiError ? reason.errors : {};
      setErrors(fieldErrors.email || fieldErrors.password ? fieldErrors : { password: message });
      push(message, "error");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[#eef2f6] px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-[420px] overflow-hidden rounded-[22px] bg-white shadow-[0_18px_50px_rgb(1_58_99/0.12)]" noValidate>
        <header className="bg-[#013A63] px-8 pb-7 pt-8 text-center text-white">
          <h1 className="font-serif text-[34px] font-semibold tracking-wide">Login</h1>
          <p className="mt-2 text-[15px] text-white/85">Enlighten Himalays Pvt. Ltd.</p>
        </header>
        <div className="px-8 pb-8 pt-7">
          <label className="block text-[15px] font-semibold text-[#243044]">
            Username
            <input
              name="email"
              type="email"
              autoComplete="username"
              defaultValue=""
              className="mt-2 w-full rounded-lg border border-transparent bg-[#e7f0fb] px-3 py-3 text-[15px] font-normal outline-none focus:border-[#f5b400]"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <span className="mt-1 block text-xs font-normal text-red-700">{errors.email}</span>}
          </label>
          <label className="mt-5 block text-[15px] font-semibold text-[#243044]">
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              className="mt-2 w-full rounded-lg border border-transparent bg-[#e7f0fb] px-3 py-3 text-[15px] font-normal outline-none focus:border-[#f5b400]"
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && <span className="mt-1 block text-xs font-normal text-red-700">{errors.password}</span>}
          </label>
          <button type="submit" disabled={pending} className="mt-6 w-full rounded-lg bg-[#f5b400] py-3 text-sm font-bold tracking-[0.14em] text-white disabled:opacity-70">
            {pending ? "SIGNING IN" : "LOGIN"}
          </button>
          <Link to="/" className="mt-5 block text-center text-sm font-medium text-[#f5b400]">
            Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
}
