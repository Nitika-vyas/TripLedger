"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormValues } from "@/schemas/auth.schema";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api-client";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupFormValues) => {
    setServerError(null);
    try {
      await signup(values);
      router.replace("/dashboard");
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="mb-1">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">Create your company</h1>
        <p className="mt-1 text-sm text-gray-500">Set up TripLedger for your fleet in a minute.</p>
      </div>
      <TextField label="Company name" error={errors.companyName} {...register("companyName")} />
      <TextField
        label="Company contact email"
        type="email"
        error={errors.contactEmail}
        {...register("contactEmail")}
      />
      <TextField
        label="Company phone (optional)"
        error={errors.contactPhone}
        {...register("contactPhone")}
      />
      <div className="my-1 flex items-center gap-3">
        <hr className="flex-1 border-gray-200" />
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Admin account</span>
        <hr className="flex-1 border-gray-200" />
      </div>
      <TextField label="Your full name" error={errors.adminFullName} {...register("adminFullName")} />
      <TextField
        label="Your email (login)"
        type="email"
        autoComplete="email"
        error={errors.adminEmail}
        {...register("adminEmail")}
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="new-password"
        error={errors.password}
        {...register("password")}
      />
      {serverError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</p>
      )}
      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        Create account
      </Button>
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-indigo-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
