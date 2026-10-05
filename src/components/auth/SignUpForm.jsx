"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  Button,
  Checkbox,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  Radio,
  RadioGroup,
  TextField,
} from "@heroui/react";

import {
  ArrowUpRight,
  Eye,
  EyeOff,
  MoveLeft,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export default function SignUpForm() {
  const [form, setForm] = useState(initialForm);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [role, setRole] = useState("user");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = "Password must contain at least one number.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!agreeTerms) {
      newErrors.terms = "You must agree to the Terms and Privacy Policy.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const safeRole = role === "artist" ? "artist" : "user";
    setIsSubmitting(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        password: form.password,
        role: safeRole,
        callbackURL: "/",
      });

      if (error) {
        toast.error(
          error.message || "Unable to create your account."
        );
        return;
      }

      toast.success("Sign Up Successful");

      console.log("Signup data:", data);
      console.log("role:", role);
    } catch (error) {
      console.error("Sign up error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error("Unable to sign up with Google. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-art-background px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <section
        className="
          mx-auto grid min-h-[calc(100svh-32px)] w-full max-w-[1320px]
          overflow-hidden rounded-[22px] bg-art-white
          shadow-[0_24px_80px_rgba(16,16,16,0.10)]
          sm:min-h-[calc(100svh-48px)]
          lg:grid-cols-[0.92fr_1.08fr] lg:min-h-[calc(100svh-64px)]
        "
      >
        {/* LEFT — SIGNUP FORM */}
        <div
          className="
            relative flex flex-col px-6 py-8
            sm:px-10 sm:py-10 md:px-14
            lg:px-12 lg:py-12 xl:px-16 xl:py-14
          "
        >
          {/* Decorative mark */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute left-0 top-0 h-24 w-24
              bg-[radial-gradient(circle_at_top_left,rgba(217,181,109,0.10),transparent_65%)]
            "
          />

          {/* Brand */}
          <Link
            href="/"
            aria-label="ArtHub Home"
            className="group flex shrink-0 items-center gap-2"
          >
            <span className="font-art-display text-3xl font-semibold leading-none tracking-[-0.04em] text-art-text sm:text-4xl">
              Art<span className="text-art-primary">Hub</span>
            </span>
          </Link>

          {/* Heading */}
          <div className="relative z-10 pt-10 sm:pt-12 lg:pt-14">
            <Link
              href="/"
              className="
                group inline-flex items-center gap-1.5 font-art-body
                text-[10px] font-semibold uppercase tracking-widest
                text-art-primary transition-colors hover:text-art-text
              "
            >
              <MoveLeft
                size={12}
                className="
                  transition-transform duration-200
                  group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                "
              />
              Back to home
            </Link>

            <p className="pt-4 font-art-body text-[9px] font-semibold uppercase tracking-[0.2em] text-art-muted">
              Create your account
            </p>

            <h1
              className="
                pt-3 font-art-display text-[46px] font-medium leading-[0.92]
                tracking-[-0.045em] text-art-text
                sm:text-[52px] lg:text-[56px] xl:text-[60px]
              "
            >
              Join the
              <br />
              <span className="text-art-primary">collection.</span>
            </h1>

            <p className="max-w-[29.375rem] pt-4 font-art-body text-sm leading-6 text-art-secondary">
              Create your account and start discovering original art from
              independent artists.
            </p>
          </div>

          {/* FORM */}
          <Form
            onSubmit={handleSignUp}
            noValidate
            className="relative z-10 mt-8 w-full max-w-[560px] sm:mt-10"
          >
            {errors.form && (
              <div
                className="
                  mb-5 rounded-[5px] border border-art-primary/20
                  bg-art-primary/5 px-4 py-3 font-art-body text-xs text-art-primary
                "
              >
                {errors.form}
              </div>
            )}

            {/* First / Last name */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <TextField
                name="firstName"
                isRequired
                isInvalid={Boolean(errors.firstName)}
                className="w-full"
              >
                <Label className="mb-2 font-art-body text-[9px] font-semibold uppercase tracking-[0.16em] text-art-text">
                  First Name
                </Label>

                <Input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Jane"
                  autoComplete="given-name"
                  className="
                    h-11 border-0 border-b border-art-border bg-transparent pl-4
                    font-art-body text-sm text-art-text shadow-none outline-none
                    transition-colors placeholder:text-art-muted/40 focus:border-art-primary
                  "
                />

                {errors.firstName && (
                  <FieldError className="mt-1.5 font-art-body text-[10px] text-art-primary">
                    {errors.firstName}
                  </FieldError>
                )}
              </TextField>

              <TextField
                name="lastName"
                isRequired
                isInvalid={Boolean(errors.lastName)}
                className="w-full"
              >
                <Label className="mb-2 font-art-body text-[9px] font-semibold uppercase tracking-[0.16em] text-art-text">
                  Last Name
                </Label>

                <Input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  autoComplete="family-name"
                  className="
                    h-11 border-0 border-b border-art-border bg-transparent pl-4
                    font-art-body text-sm text-art-text shadow-none outline-none
                    transition-colors placeholder:text-art-muted/40 focus:border-art-primary
                  "
                />

                {errors.lastName && (
                  <FieldError className="mt-1.5 font-art-body text-[10px] text-art-primary">
                    {errors.lastName}
                  </FieldError>
                )}
              </TextField>
            </div>

            {/* Email */}
            <TextField
              name="email"
              type="email"
              isRequired
              isInvalid={Boolean(errors.email)}
              className="mt-5 w-full"
            >
              <Label className="mb-2 font-art-body text-[9px] font-semibold uppercase tracking-[0.16em] text-art-text">
                Email Address
              </Label>

              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                autoComplete="email"
                className="
                  h-11 border-0 border-b border-art-border bg-transparent pl-4
                  font-art-body text-sm text-art-text shadow-none outline-none
                  transition-colors placeholder:text-art-muted/40 focus:border-art-primary
                "
              />

              {errors.email && (
                <FieldError className="mt-1.5 font-art-body text-[10px] text-art-primary">
                  {errors.email}
                </FieldError>
              )}
            </TextField>

            {/* Password */}
            <TextField
              name="password"
              isRequired
              isInvalid={Boolean(errors.password)}
              className="mt-5 w-full"
            >
              <Label className="mb-2 font-art-body text-[9px] font-semibold uppercase tracking-[0.16em] text-art-text">
                Password
              </Label>

              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="
                    h-11 w-full border-0 border-b border-art-border bg-transparent
                    pl-4 pr-10 font-art-body text-sm text-art-text shadow-none
                    outline-none transition-colors placeholder:text-art-muted/35
                    focus:border-art-primary
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="
                    absolute right-0 top-1/2 flex size-8 -translate-y-1/2
                    items-center justify-center text-art-muted transition-colors
                    hover:text-art-text
                  "
                >
                  {showPassword ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>
              </div>

              {!errors.password && (
                <p className="mt-2 font-art-body text-[9px] text-art-muted">
                  At least 8 characters, including uppercase, lowercase, and a
                  number.
                </p>
              )}

              {errors.password && (
                <FieldError className="mt-1.5 font-art-body text-[10px] text-art-primary">
                  {errors.password}
                </FieldError>
              )}
            </TextField>

            {/* Confirm password */}
            <TextField
              name="confirmPassword"
              isRequired
              isInvalid={Boolean(errors.confirmPassword)}
              className="mt-5 w-full"
            >
              <Label className="mb-2 font-art-body text-[9px] font-semibold uppercase tracking-[0.16em] text-art-text">
                Confirm Password
              </Label>

              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);

                    setErrors((previous) => ({
                      ...previous,
                      confirmPassword: "",
                    }));
                  }}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="
                    h-11 w-full border-0 border-b border-art-border bg-transparent
                    pl-4 pr-10 font-art-body text-sm text-art-text shadow-none
                    outline-none transition-colors placeholder:text-art-muted/35
                    focus:border-art-primary
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="
                    absolute right-0 top-1/2 flex size-8 -translate-y-1/2
                    items-center justify-center text-art-muted transition-colors
                    hover:text-art-text
                  "
                >
                  {showConfirmPassword ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <FieldError className="mt-1.5 font-art-body text-[10px] text-art-primary">
                  {errors.confirmPassword}
                </FieldError>
              )}
            </TextField>

            {/* ============================================================
                ACCOUNT TYPE — RADIO GROUP
            ============================================================ */}
            {/* ACCOUNT TYPE */}
            <RadioGroup
              name="role"
              value={role}
              onChange={(value) => setRole(value)}
              isRequired
              className="mt-7 w-full"
            >
              <Label className="mb-2 font-art-body text-[9px] font-semibold uppercase tracking-[0.16em] text-art-text">
                Role
              </Label>

              <Description className="mb-4 font-art-body text-[10px] leading-5 text-art-muted">
                Choose how you want to use ArtHub.
              </Description>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* User */}
                <Radio
                  value="user"
                  className="
        group relative cursor-pointer
        rounded-xl border border-art-border
        bg-transparent p-4
        transition-all duration-300
        hover:border-art-primary/40
        hover:bg-art-primary/2.5
        data-[selected=true]:border-art-primary
        data-[selected=true]:bg-art-primary/4.5
      "
                >
                  <Radio.Content className="w-full items-start gap-3">
                    {/* Radio control */}
                    <Radio.Control
                      className="
            mt-0.5 size-4 shrink-0 rounded-full
            border border-art-border bg-transparent
            transition-all duration-200
            group-data-[selected=true]:border-art-primary
            group-data-[selected=true]:bg-art-primary
          "
                    >
                      <Radio.Indicator className="text-white">
                        <span className="text-[8px] leading-none">✓</span>
                      </Radio.Indicator>
                    </Radio.Control>

                    {/* Content */}
                    <div className="min-w-0 flex-1 -mt-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-art-display text-lg font-medium tracking-[-0.02em] text-art-text">
                          User
                        </span>

                        <span
                          className="
                font-art-body text-[8px] font-semibold
                uppercase tracking-[0.16em]
                text-art-muted
                transition-colors
                group-data-[selected=true]:text-art-primary
              "
                        >
                          Explore
                        </span>
                      </div>

                      <Description className="mt-1.5 font-art-body text-[9px] leading-5 text-art-muted">
                        Discover and collect original artworks.
                      </Description>
                    </div>
                  </Radio.Content>

                  <FieldError />
                </Radio>

                {/* ARTIST */}
                <Radio
                  value="artist"
                  className="
        group relative cursor-pointer
        rounded-xl border border-art-border
        bg-transparent p-4
        transition-all duration-300
        hover:border-art-primary/40
        hover:bg-art-primary/2.5
        data-[selected=true]:border-art-primary
        data-[selected=true]:bg-art-primary/4.5
      "
                >
                  <Radio.Content className="w-full items-start gap-3">
                    {/* Radio control */}
                    <Radio.Control
                      className="
            mt-0.5 size-4 shrink-0 rounded-full
            border border-art-border bg-transparent
            transition-all duration-200
            group-data-[selected=true]:border-art-primary
            group-data-[selected=true]:bg-art-primary
          "
                    >
                      <Radio.Indicator className="text-white">
                        <span className="text-[8px] leading-none">✓</span>
                      </Radio.Indicator>
                    </Radio.Control>

                    {/* Content */}
                    <div className="min-w-0 flex-1 -mt-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-art-display text-lg font-medium tracking-[-0.02em] text-art-text">
                          Artist
                        </span>

                        <span
                          className="
                font-art-body text-[8px] font-semibold
                uppercase tracking-[0.16em]
                text-art-muted
                transition-colors
                group-data-[selected=true]:text-art-primary
              "
                        >
                          Create
                        </span>
                      </div>

                      <Description className="mt-1.5 font-art-body text-[9px] leading-5 text-art-muted">
                        Showcase and sell your original artworks.
                      </Description>
                    </div>
                  </Radio.Content>

                  <FieldError />
                </Radio>
              </div>

              <FieldError className="mt-2 font-art-body text-[10px] text-art-primary" />
            </RadioGroup>

            {/* TERMS */}
            <div className="mt-7">
              <Checkbox
                isSelected={agreeTerms}
                onChange={setAgreeTerms}
                isInvalid={Boolean(errors.terms)}
                variant="secondary"
                className="w-full"
              >
                <Checkbox.Content className="items-start gap-3">
                  <Checkbox.Control
                    className="
                      mt-0.5 size-4 shrink-0 rounded-md border border-art-border
                      bg-white data-[selected=true]:border-art-primary
                      data-[selected=true]:bg-art-primary
                    "
                  >
                    <Checkbox.Indicator className="text-white" />
                  </Checkbox.Control>

                  <span className="font-art-body text-[10px] leading-5 text-art-secondary">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="
                        font-medium text-art-primary underline
                        decoration-art-primary/30 underline-offset-2
                        transition-colors hover:text-art-text
                      "
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="
                        font-medium text-art-primary underline
                        decoration-art-primary/30 underline-offset-2
                        transition-colors hover:text-art-text
                      "
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </Checkbox.Content>
              </Checkbox>

              {errors.terms && (
                <p className="mt-1.5 pl-7 font-art-body text-[10px] text-art-primary">
                  {errors.terms}
                </p>
              )}
            </div>

            {/* CREATE ACCOUNT */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isPending={isSubmitting}
              className="
                mt-7 h-13 rounded-[5px] bg-art-primary font-art-body
                text-[10px] font-semibold uppercase tracking-[0.14em] text-white
                shadow-none transition-all duration-300
                hover:bg-art-primary-hover
                hover:shadow-[0_12px_30px_rgba(228,87,79,0.18)]
              "
            >
              {isSubmitting
                ? "Creating account..."
                : "Create account"}
            </Button>

            {/* DIVIDER */}
            <div className="my-7 flex items-center gap-4">
              <span className="h-px flex-1 bg-art-border" />

              <span className="shrink-0 font-art-body text-[8px] font-semibold uppercase tracking-[0.18em] text-art-muted">
                Or continue with
              </span>

              <span className="h-px flex-1 bg-art-border" />
            </div>

            {/* SOCIAL AUTH */}
            <div className="flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                onPress={handleGoogleSignup}
                className="
                  h-12 rounded-[5px] border-art-border bg-transparent
                  font-art-body text-[10px] font-semibold uppercase tracking-widest
                  text-art-text shadow-none hover:border-art-text hover:bg-art-background
                "
              >
                <GoogleIcon />
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="
                  h-12 rounded-[5px] border-art-border bg-transparent
                  font-art-body text-[10px] font-semibold uppercase tracking-widest
                  text-art-text shadow-none hover:border-art-text hover:bg-art-background
                "
              >
                <AppleIcon />
                Apple
              </Button>
            </div>

            {/* LOGIN LINK */}
            <div className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
              <span className="font-art-body text-[10px] text-art-muted">
                Already have an account?
              </span>

              <Link
                href="/log-in"
                className="
                  group inline-flex items-center gap-1.5 font-art-body
                  text-[10px] font-semibold uppercase tracking-widest
                  text-art-primary transition-colors hover:text-art-text
                "
              >
                Log in here

                <ArrowUpRight
                  size={12}
                  className="
                    transition-transform duration-200
                    group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                  "
                />
              </Link>
            </div>
          </Form>
        </div>

        {/* RIGHT — ARTWORK / EDITORIAL PANEL */}
        <aside className="relative hidden min-h-162.5 overflow-hidden bg-art-charcoal lg:block">
          <Image
            src="https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1800&q=90"
            alt="Contemporary artwork displayed in an artist studio"
            fill
            priority
            sizes="55vw"
            className="object-cover object-center brightness-[0.88] saturate-[0.72]"
          />

          {/* Warm editorial overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/5" />

          <div className="absolute inset-0 bg-art-gold/[0.06] mix-blend-screen" />

          {/* Grain */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay
              [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 180 180%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%22.6%22/%3E%3C/svg%3E')]
            "
          />

          {/* Editorial frame */}
          <div className="pointer-events-none absolute inset-7 border border-white/15 xl:inset-9" />

          {/* Gold symbol */}
          <div className="absolute right-8 top-8 font-art-display text-4xl leading-none text-art-gold xl:right-10 xl:top-10">
            ✦
          </div>

          {/* Top label */}
          <div className="absolute left-8 top-8 flex items-center gap-3 xl:left-10 xl:top-10">
            <span className="h-px w-8 bg-white/40" />

            <span className="font-art-body text-[8px] font-semibold uppercase tracking-[0.2em] text-white/65">
              ArtHub / Studio
            </span>
          </div>

          {/* Quote */}
          <div className="absolute bottom-8 left-8 right-8 xl:bottom-10 xl:left-10 xl:right-10">
            <blockquote
              className="
                max-w-[560px] font-art-display text-[30px] font-medium italic
                leading-[1.05] tracking-tight text-white xl:text-[38px]
              "
            >
              “Every child is an artist. The problem is how to remain an artist
              once we grow up.”
            </blockquote>

            <div className="mt-5 flex items-center gap-3">
              <span className="h-px w-7 bg-art-gold" />

              <span className="font-art-body text-[8px] font-semibold uppercase tracking-[0.18em] text-white/60">
                Pablo Picasso
              </span>
            </div>
          </div>

          {/* Vertical editorial number */}
          <div className="absolute bottom-10 right-8 hidden flex-col items-center gap-2 xl:flex">
            <span className="font-art-body text-[8px] font-semibold uppercase tracking-[0.2em] text-white/35 [writing-mode:vertical-rl]">
              Original · Curated · Collected
            </span>

            <span className="h-12 w-px bg-white/20" />
          </div>
        </aside>
      </section>
    </main>
  );
}

/* ============================================================
   GOOGLE ICON
============================================================ */
function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.95 2.94v2.45h3.16c1.85-1.7 2.9-4.2 2.9-7.26Z"
      />

      <path
        fill="#34A853"
        d="M12 21.75c2.65 0 4.88-.88 6.5-2.38l-3.16-2.45c-.88.59-2 .94-3.34.94-2.57 0-4.75-1.74-5.53-4.08H3.2v2.53A9.82 9.82 0 0 0 12 21.75Z"
      />

      <path
        fill="#FBBC05"
        d="M6.47 13.78a5.9 5.9 0 0 1 0-3.56V7.69H3.2a9.77 9.77 0 0 0 0 8.62l3.27-2.53Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.14c1.44 0 2.74.5 3.76 1.48l2.82-2.82C16.88 3.2 14.65 2.25 12 2.25a9.82 9.82 0 0 0-8.8 5.44l3.27 2.53C7.25 7.88 9.43 6.14 12 6.14Z"
      />
    </svg>
  );
}

/* ============================================================
   APPLE ICON
============================================================ */
function AppleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4 fill-current"
    >
      <path d="M16.77 12.76c.02 2.23 1.96 2.97 1.98 2.98-.02.05-.31 1.07-1.02 2.12-.62.91-1.27 1.82-2.29 1.84-1 .02-1.33-.59-2.49-.59-1.17 0-1.53.57-2.48.61-1 .04-1.77-.98-2.39-1.89-1.27-1.85-2.24-5.23-.94-7.51.65-1.14 1.81-1.86 3.07-1.88.96-.02 1.87.65 2.49.65.61 0 1.75-.8 2.94-.68.5.02 1.92.2 2.83 1.51-.07.04-1.69.99-1.7 2.84ZM14.83 5.13c.53-.64.89-1.53.79-2.42-.76.03-1.67.5-2.21 1.13-.48.55-.9 1.46-.79 2.32.84.07 1.69-.43 2.21-1.03Z" />
    </svg>
  );
}