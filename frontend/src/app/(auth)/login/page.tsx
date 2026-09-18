"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/schemas/auth.schema";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api-client";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const user = await login(values.email, values.password);
      router.replace(user.globalRole === "SUPER_ADMIN" ? "/super-admin/overview" : "/dashboard");
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="mb-1">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">Log in to your TripLedger account.</p>
      </div>
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email}
        {...register("email")}
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password}
        {...register("password")}
      />
      {serverError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</p>
      )}
      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        Log in
      </Button>
      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-indigo-600 hover:underline">
          Sign up your company
        </Link>
      </p>
    </form>
  );
}
