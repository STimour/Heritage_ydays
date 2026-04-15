"use client";

import React, { useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/atoms/Button";
import { Divider } from "@/components/atoms/Divider";
import { Title, Text } from "@/components/atoms/Typography";
import { FormField } from "@/components/molecules/FormField";
import type { LoginRequest, SignupRequest } from "@/types/api";

export type AuthMode = "login" | "register";

export interface AuthFormProps {
  mode?: AuthMode;
  isLoading?: boolean;
  error?: string | null;
  onSubmit?: (data: LoginRequest | SignupRequest) => void;
  onModeChange?: (mode: AuthMode) => void;
  className?: string;
}

export function AuthForm({
  mode = "login",
  isLoading = false,
  error,
  onSubmit,
  onModeChange,
  className,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload =
      mode === "login"
        ? ({ email, password } satisfies LoginRequest)
        : ({ fullName, email, password, confirmPassword } satisfies SignupRequest);
    onSubmit?.(payload);
  };

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <Title level={2} className="mb-1">
        {mode === "login" ? "Welcome back" : "Create an account"}
      </Title>
      <Text muted size="sm" className="mb-6">
        {mode === "login"
          ? "Sign in to continue."
          : "Join the community today."}
      </Text>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {mode === "register" && (
          <>
            <FormField
              label="Full name"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
            />
            <FormField
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            />
          </>
        )}

        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />

        <FormField
          label="Password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isLoading}
          className="mt-2"
        >
          {mode === "login" ? "Sign in" : "Create account"}
        </Button>
      </form>

      <Divider className="my-6" />

      <Text size="sm" muted className="text-center">
        {mode === "login" ? "No account?" : "Already a member?"}{" "}
        <button
          type="button"
          onClick={() => onModeChange?.(mode === "login" ? "register" : "login")}
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </button>
      </Text>
    </div>
  );
}
