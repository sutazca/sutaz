"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadInput } from "@/lib/validations";

/**
 * ContactForm — written-request alternative to the Calendly embed.
 *
 * One schema, two boundaries: react-hook-form validates with the SAME zod
 * `leadSchema` the API route parses, so client and server can't drift.
 * POSTs to /api/leads (persists the lead; the route emails hello@sutaz.ca +
 * the owner inbox when SMTP is configured).
 *
 * Honesty rules: success panel only on a real 201; distinct copy for 400
 * (field issues), 429 (rate limited) and 503/network (nothing saved — offer
 * the email + booking fallback). No fake optimism.
 *
 * Anti-abuse: a visually-hidden `website_url` honeypot input (outside RHF so
 * it never affects validation) is sent only when a bot filled it.
 */

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const inputClass =
  "mt-1.5 w-full rounded-button border border-[var(--color-input)] bg-[var(--color-surface-recessed)] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-mono text-xs uppercase tracking-[0.18em] text-slate-300"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadInput>({ resolver: zodResolver(leadSchema) });

  const aria = (name: keyof LeadInput) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  const onSubmit = async (data: LeadInput, event?: React.BaseSyntheticEvent) => {
    setState({ kind: "submitting" });
    try {
      // Honeypot read from the form element at submit time (no refs).
      const form = event?.target as HTMLFormElement | undefined;
      const honeypot =
        (form?.elements.namedItem("website_url") as HTMLInputElement | null)
          ?.value ?? "";
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          honeypot ? { ...data, website_url: honeypot } : data,
        ),
      });
      if (res.status === 201) {
        setState({ kind: "success" });
      } else if (res.status === 429) {
        setState({
          kind: "error",
          message: "Too many attempts — please try again in a minute.",
        });
      } else if (res.status === 400) {
        setState({
          kind: "error",
          message: "Please check the highlighted fields and try again.",
        });
      } else {
        setState({
          kind: "error",
          message:
            "We couldn't save your request right now — email hello@sutaz.ca or book a call instead.",
        });
      }
    } catch {
      setState({
        kind: "error",
        message:
          "We couldn't save your request right now — email hello@sutaz.ca or book a call instead.",
      });
    }
  };

  if (state.kind === "success") {
    return (
      <div className="glass-card rounded-card mt-6 p-6" role="status">
        <p className="flex items-center gap-2 font-semibold text-teal-300">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" aria-hidden />
          Request received
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Thanks — your request is saved and on its way to our inbox. We reply
          within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="glass-card rounded-card mt-6 space-y-4 p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="company_name"
          label="Company"
          error={errors.company_name?.message}
        >
          <input
            id="company_name"
            className={inputClass}
            autoComplete="organization"
            {...aria("company_name")}
            {...register("company_name")}
          />
        </Field>
        <Field
          id="contact_name"
          label="Your name"
          error={errors.contact_name?.message}
        >
          <input
            id="contact_name"
            className={inputClass}
            autoComplete="name"
            {...aria("contact_name")}
            {...register("contact_name")}
          />
        </Field>
        <Field
          id="contact_email"
          label="Email"
          error={errors.contact_email?.message}
        >
          <input
            id="contact_email"
            type="email"
            className={inputClass}
            autoComplete="email"
            {...aria("contact_email")}
            {...register("contact_email")}
          />
        </Field>
        <Field
          id="contact_phone"
          label="Phone (optional)"
          error={errors.contact_phone?.message}
        >
          <input
            id="contact_phone"
            type="tel"
            className={inputClass}
            autoComplete="tel"
            {...aria("contact_phone")}
            {...register("contact_phone")}
          />
        </Field>
        <Field id="industry" label="Industry" error={errors.industry?.message}>
          <input
            id="industry"
            className={inputClass}
            placeholder="e.g. Construction"
            {...aria("industry")}
            {...register("industry")}
          />
        </Field>
        <Field
          id="automation_interest"
          label="What to automate?"
          error={errors.automation_interest?.message}
        >
          <input
            id="automation_interest"
            className={inputClass}
            placeholder="e.g. Invoicing follow-ups"
            {...aria("automation_interest")}
            {...register("automation_interest")}
          />
        </Field>
      </div>
      <Field
        id="message"
        label="Message (optional)"
        error={errors.message?.message}
      >
        <textarea
          id="message"
          rows={4}
          className={inputClass}
          {...aria("message")}
          {...register("message")}
        />
      </Field>

      {/* Honeypot — visually hidden, outside RHF, never focusable. */}
      <span className="sr-only" aria-hidden="true">
        <label htmlFor="website_url">Leave this field empty</label>
        <input
          id="website_url"
          name="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </span>

      {state.kind === "error" ? (
        <p
          role="alert"
          className="rounded-button border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300"
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state.kind === "submitting"}
        className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-teal-700 px-7 py-3 text-base font-semibold text-white transition-all hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {state.kind === "submitting" ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
