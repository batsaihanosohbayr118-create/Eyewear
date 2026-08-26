"use client";

import { useState } from "react";

const field =
  "w-full rounded-lg border border-line/40 bg-ink/60 px-4 py-3 text-[15px] text-ivory placeholder:text-ivory/30 outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20";
const label = "block text-[11px] font-mono tracking-[0.14em] uppercase text-ivory/40 mb-2";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-gold/40 bg-charcoal/40 rounded-2xl p-8">
        <div className="w-11 h-11 rounded-full bg-gold/15 flex items-center justify-center mb-5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#49b6ff" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="font-display text-2xl mb-2">Баярлалаа, {values.name || "танд"}.</p>
        <p className="text-ivory/60 leading-relaxed">
          Таны хүсэлтийг хүлээн авлаа. Манай баг 1 ажлын өдрийн дотор
          холбогдох болно.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 border border-line/30 bg-charcoal/40 rounded-2xl p-6 md:p-8"
    >
      <div>
        <label htmlFor="name" className={label}>
          Нэр
        </label>
        <input
          id="name"
          required
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          className={field}
          placeholder="Таны нэр"
        />
      </div>
      <div>
        <label htmlFor="email" className={label}>
          И-мэйл
        </label>
        <input
          id="email"
          type="email"
          required
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          className={field}
          placeholder="name@example.com"
        />
      </div>
      <div>
        <label htmlFor="message" className={label}>
          Мессеж
        </label>
        <textarea
          id="message"
          required
          rows={4}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          className={`${field} resize-none`}
          placeholder="Бид танд юугаар туслах вэ?"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center gap-3 bg-gold text-ink px-8 py-3.5 rounded-lg text-[13px] tracking-[0.14em] uppercase hover:bg-gold-light transition-colors duration-300"
      >
        Илгээх
      </button>
    </form>
  );
}
