"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Button,
  Checkbox,
  FieldError,
  Input,
  Label,
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
  email: "",
  password: "",
};

export default function LogInForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      form: "",
    }));
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  // EMAIL LOGIN
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: form.email.trim(),
        password: form.password,
        callbackURL: "/",
      });

      if (error) {
        setErrors({
          form: error.message || "Invalid email or password.",
        });

        toast.error(
          error.message || "Unable to sign in. Please try again."
        );

        return;
      }

      toast.success("Sign in successful!");

      const role = data?.user?.role;
      setTimeout(() => {
        if (role === "admin") router.push("/dashboard/admin");
        else if (role === "artist") router.push("/dashboard/artist");
        else router.push("/");
        router.refresh();
      }, 500);
      console.error("Sign in error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setErrors({
        form: message,
      });

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // GOOGLE LOGIN
  // ============================================================

  const handleGoogleLogin = async () => {
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(
          error.message || "Unable to continue with Google."
        );
      }
    } catch (error) {
      console.error("Google login error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <main
      className="
        min-h-screen
        bg-art-background
        px-4
        py-4
        sm:px-6
        sm:py-6
        lg:px-8
        lg:py-8
      "
    >
      <section
        className="
          mx-auto
          grid
          min-h-[calc(100svh-32px)]
          w-full
          max-w-330
          overflow-hidden
          rounded-[22px]
          bg-art-white
          shadow-[0_24px_80px_rgba(16,16,16,0.10)]
          sm:min-h-[calc(100svh-48px)]
          lg:grid-cols-[1.08fr_0.92fr]
          lg:min-h-[calc(100svh-64px)]
        "
      >
        {/* =====================================================
            LEFT — ARTWORK
        ====================================================== */}

        <aside
          className="
            relative
            hidden
            min-h-162.5
            overflow-hidden
            bg-art-charcoal
            lg:block
          "
        >
          <Image
            src="https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=2000&q=90"
            alt="Artwork displayed inside an art gallery"
            fill
            priority
            sizes="55vw"
            className="
              object-cover
              object-center
              brightness-[0.82]
              saturate-[0.78]
            "
          />

          {/* Main dark linear */}
          <div
            className="
              absolute
              inset-0
              bg-linear-to-t
              from-black/75
              via-black/15
              to-black/5
            "
          />

          {/* Warm ArtHub tint */}
          <div
            className="
              absolute
              inset-0
              bg-art-gold/5.5
              mix-blend-screen
            "
          />

          {/* Editorial frame */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-7
              border
              border-white/15
              xl:inset-9
            "
          />

          {/* Top brand */}
          <Link
            href="/"
            className="
              absolute
              left-8
              top-8
              z-20
              flex
              items-center
              gap-2
              xl:left-10
              xl:top-10
            "
          >
            <span
              className="
                font-art-display
                text-[27px]
                font-semibold
                leading-none
                tracking-[-0.04em]
                text-white
              "
            >
              ArtHub
            </span>

            <span
              className="
                -mt-3
                text-sm
                text-art-gold
              "
            >
              ✦
            </span>
          </Link>

          {/* Top right label */}
          <div
            className="
              absolute
              right-8
              top-8
              z-20
              flex
              items-center
              gap-3
              xl:right-10
              xl:top-10
            "
          >
            <span
              className="
                font-art-body
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-white/55
              "
            >
              ArtHub / Gallery
            </span>

            <span className="size-1.5 rounded-full bg-art-gold" />
          </div>

          {/* Quote */}
          <div
            className="
              absolute
              bottom-10
              left-8
              right-8
              z-20
              xl:bottom-12
              xl:left-10
              xl:right-10
            "
          >
            <blockquote
              className="
                max-w-147.5
                font-art-display
                text-[34px]
                font-medium
                italic
                leading-[1.02]
                tracking-tight
                text-white
                xl:text-[42px]
              "
            >
              “Art washing away from the soul the dust of
              everyday life.”
            </blockquote>

            <div
              className="
                mt-5
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  h-px
                  w-8
                  bg-art-gold
                "
              />

              <span
                className="
                  font-art-body
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-white/65
                "
              >
                Pablo Picasso
              </span>
            </div>
          </div>

          {/* Vertical editorial label */}
          <div
            className="
              absolute
              bottom-12
              right-9
              z-20
              hidden
              flex-col
              items-center
              gap-3
              xl:flex
            "
          >
            <span
              className="
                font-art-body
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-white/35
                [writing-mode:vertical-rl]
              "
            >
              Original · Curated · Collected
            </span>

            <span
              className="
                h-12
                w-px
                bg-white/20
              "
            />
          </div>
        </aside>

        {/* =====================================================
            RIGHT — LOGIN FORM
        ====================================================== */}

        <div
          className="
            relative
            flex
            flex-col
            justify-center
            px-6
            py-10
            sm:px-10
            sm:py-12
            md:px-14
            lg:px-12
            lg:py-14
            xl:px-16
          "
        >
          {/* Decorative gold glow */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              right-0
              top-0
              size-40
              bg-[radial-gradient(circle_at_top_right,rgba(217,181,109,0.10),transparent_70%)]
            "
          />

          <div
            className="
              relative
              z-10
              mx-auto
              w-full
              max-w-130
            "
          >
            {/* Brand */}
            <Link
              href="/"
              aria-label="ArtHub Home"
              className="
                group
                flex
                shrink-0
                items-center
                gap-2
              "
            >
              <span
                className="
                  font-art-display
                  text-3xl
                  font-semibold
                  leading-none
                  tracking-[-0.04em]
                  text-art-text
                  sm:text-4xl
                "
              >
                Art
                <span className="text-art-primary">Hub</span>
              </span>
            </Link>

            {/* Heading */}
            <div className="mt-12">
              <Link
                href="/"
                className="
                  group
                  inline-flex
                  items-center
                  gap-1.5
                  font-art-body
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-widest
                  text-art-primary
                  transition-colors
                  hover:text-art-text
                "
              >
                <MoveLeft
                  size={12}
                  className="
                    transition-transform
                    duration-200
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                />

                Back to home
              </Link>

              <p
                className="
                  pt-4
                  font-art-body
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-art-muted
                "
              >
                Member access
              </p>

              <h1
                className="
                  pt-3
                  font-art-display
                  text-[48px]
                  font-medium
                  leading-[0.92]
                  tracking-[-0.045em]
                  text-art-text
                  sm:text-[56px]
                  lg:text-[58px]
                "
              >
                Welcome back.
              </h1>

              <p
                className="
                  pt-4
                  font-art-body
                  text-sm
                  leading-6
                  text-art-secondary
                "
              >
                Please enter your details to sign in to
                your ArtHub account.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-10"
            >
              {/* General error */}
              {errors.form && (
                <div
                  className="
                    mb-5
                    rounded-[5px]
                    border
                    border-art-primary/20
                    bg-art-primary/5
                    px-4
                    py-3
                    font-art-body
                    text-xs
                    text-art-primary
                  "
                >
                  {errors.form}
                </div>
              )}

              {/* Email */}
              <TextField
                name="email"
                type="email"
                isRequired
                isInvalid={Boolean(errors.email)}
              >
                <Label
                  className="
                    mb-2
                    font-art-body
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-art-text
                  "
                >
                  Email Address
                </Label>

                <Input
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  autoComplete="email"
                  className="
                    h-12
                    border-0
                    border-b
                    border-art-border
                    bg-transparent
                    pl-4
                    font-art-body
                    text-sm
                    text-art-text
                    shadow-none
                    outline-none
                    transition-colors
                    placeholder:text-art-muted/40
                    focus:border-art-primary
                  "
                />

                {errors.email && (
                  <FieldError
                    className="
                      mt-1.5
                      font-art-body
                      text-[10px]
                      text-art-primary
                    "
                  >
                    {errors.email}
                  </FieldError>
                )}
              </TextField>

              {/* Password */}
              <TextField
                name="password"
                type={showPassword ? "text" : "password"}
                isRequired
                isInvalid={Boolean(errors.password)}
                className="mt-7"
              >
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <Label
                    className="
                      font-art-body
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-art-text
                    "
                  >
                    Password
                  </Label>

                  <Link
                    href="/forgot-password"
                    className="
                      font-art-body
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      text-art-primary
                      transition-colors
                      hover:text-art-text
                    "
                  >
                    Forgot?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="
                      h-12
                      w-full
                      border-0
                      border-b
                      border-art-border
                      bg-transparent
                      pl-4
                      pr-10
                      font-art-body
                      text-sm
                      text-art-text
                      shadow-none
                      outline-none
                      transition-colors
                      placeholder:text-art-muted/35
                      focus:border-art-primary
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="
                      absolute
                      right-0
                      top-1/2
                      flex
                      size-8
                      -translate-y-1/2
                      items-center
                      justify-center
                      text-art-muted
                      transition-colors
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

                {errors.password && (
                  <FieldError
                    className="
                      mt-1.5
                      font-art-body
                      text-[10px]
                      text-art-primary
                    "
                  >
                    {errors.password}
                  </FieldError>
                )}
              </TextField>

              {/* Remember me */}
              <div className="mt-7">
                <Checkbox
                  isSelected={rememberMe}
                  onChange={setRememberMe}
                  variant="secondary"
                >
                  <Checkbox.Content
                    className="
                      items-center
                      gap-3
                    "
                  >
                    <Checkbox.Control
                      className="
                        size-4
                        shrink-0
                        rounded-md
                        border
                        border-art-border
                        bg-white
                        data-[selected=true]:border-art-primary
                        data-[selected=true]:bg-art-primary
                      "
                    >
                      <Checkbox.Indicator className="text-white" />
                    </Checkbox.Control>

                    <span
                      className="
                        font-art-body
                        text-[10px]
                        text-art-secondary
                      "
                    >
                      Remember me for 30 days
                    </span>
                  </Checkbox.Content>
                </Checkbox>
              </div>

              {/* Sign in */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isPending={isSubmitting}
                className="
                  mt-7
                  h-14
                  rounded-xl
                  bg-art-primary
                  font-art-body
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-white
                  shadow-none
                  transition-all
                  duration-300
                  hover:bg-art-primary-hover
                  hover:shadow-[0_12px_30px_rgba(228,87,79,0.18)]
                "
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>

              {/* Divider */}
              <div
                className="
                  my-8
                  flex
                  items-center
                  gap-4
                "
              >
                <span className="h-px flex-1 bg-art-border" />

                <span
                  className="
                    shrink-0
                    font-art-body
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-art-muted
                  "
                >
                  Or continue with
                </span>

                <span className="h-px flex-1 bg-art-border" />
              </div>

              {/* Social login */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onPress={handleGoogleLogin}
                  className="
                    h-12
                    rounded-xl
                    border-art-border
                    bg-transparent
                    font-art-body
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-widest
                    text-art-text
                    shadow-none
                    hover:border-art-text
                    hover:bg-art-background
                  "
                >
                  <GoogleIcon />
                  Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="
                    h-12
                    rounded-xl
                    border-art-border
                    bg-transparent
                    font-art-body
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-widest
                    text-art-text
                    shadow-none
                    hover:border-art-text
                    hover:bg-art-background
                  "
                >
                  <AppleIcon />
                  Apple
                </Button>
              </div>

              {/* Signup */}
              <div
                className="
                  mt-9
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-2
                  sm:flex-row
                  sm:gap-3
                "
              >
                <span
                  className="
                    font-art-body
                    text-[10px]
                    text-art-muted
                  "
                >
                  Dont have an account?
                </span>

                <Link
                  href="/sign-up"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-1.5
                    font-art-body
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-widest
                    text-art-primary
                    transition-colors
                    hover:text-art-text
                  "
                >
                  Sign up for free

                  <ArrowUpRight
                    size={12}
                    className="
                      transition-transform
                      duration-200
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                  />
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ==============================================================
   GOOGLE ICON
============================================================== */

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
        d="M6.47 13.78a5.9 5.9 0 0 1 0-3.56V7.69H3.2a9.77 9.77 0 0 0 0 8.62l3.27-2.53 3.27 2.53Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.14c1.44 0 2.74.5 3.76 1.48l2.82-2.82C16.88 3.2 14.65 2.25 12 2.25a9.82 9.82 0 0 0-8.8 5.44l3.27 2.53C7.25 7.88 9.43 6.14 12 6.14Z"
      />
    </svg>
  );
}

/* ==============================================================
   APPLE ICON
============================================================== */

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
