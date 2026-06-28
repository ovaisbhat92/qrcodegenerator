"use client";

import { useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="rounded-xl px-6 py-8 text-center"
        style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}
      >
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: "rgba(6,182,212,0.12)" }}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth={2} aria-hidden="true">
            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mb-1 font-semibold" style={{ color: "var(--text-primary)" }}>Thanks!</p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Please email us directly at{" "}
          <a
            href="mailto:ovaisbhat185@gmail.com"
            style={{ color: "#06b6d4" }}
            className="underline underline-offset-2"
          >
            ovaisbhat185@gmail.com
          </a>{" "}
          as our form is currently being set up.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="contact-name" className="block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="themed-input"
            autoComplete="name"
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="contact-email" className="block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="themed-input"
            autoComplete="email"
            required
          />
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor="contact-message" className="block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Your question, suggestion, or bug report…"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="themed-input resize-none"
          required
        />
      </div>
      <button type="submit" className="btn-cyan w-full rounded-xl px-6 py-3 text-sm font-semibold">
        Send Message
      </button>
    </form>
  );
}
