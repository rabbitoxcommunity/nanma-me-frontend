import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FiPhone, FiCheckCircle, FiLock, FiClock } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { enquiriesApi } from "../../admin/api/endpoints";

const PHONE = process.env.REACT_APP_WHATSAPP || "919999999999";

export default function InquiryForm({ projectTitle = "", projectId = null }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const onSubmit = async (data) => {
    setSubmitError(null);
    try {
      const messageBody = [
        data.message,
        data.config && `\nConfiguration of interest: ${data.config}`,
      ]
        .filter(Boolean)
        .join("");

      await enquiriesApi.submit({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: projectTitle ? `Memorandum request — ${projectTitle}` : "Memorandum request",
        message: messageBody || "Memorandum requested.",
        projectName: projectTitle || "",
        projectId: projectId || null,
      });
      setSent(true);
      reset();
    } catch (err) {
      setSubmitError(
        err?.response?.data?.error || "Something went wrong. Please try again."
      );
    }
  };

  // ─── SUCCESS STATE ──────────────────────────────────
  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-2xl p-10 md:p-12 shadow-xl shadow-graphite/10 ring-1 ring-line overflow-hidden"
      >
        {/* Top accent bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-terracotta via-terracotta/70 to-transparent" />

        <div className="w-14 h-14 rounded-full bg-terracotta/10 flex items-center justify-center mb-5">
          <FiCheckCircle className="w-7 h-7 text-terracotta" />
        </div>

        <div className="number-tag mb-2">Received</div>
        <h3 className="font-display text-3xl md:text-4xl text-graphite mb-3 leading-tight">
          Thank you. <span className="editorial text-terracotta">Truly.</span>
        </h3>
        <p className="text-smoke text-sm leading-relaxed mb-8">
          A Nanma advisor will reach out personally within 24 hours.
          {projectTitle && <> Your enquiry about <span className="text-graphite font-medium">{projectTitle}</span> has been logged.</>}
        </p>

        <div className="flex flex-wrap gap-2">
          <a
            href={`tel:+${PHONE}`}
            data-cursor="hover"
            className="inline-flex items-center gap-2 bg-graphite text-bone text-xs font-medium px-4 py-2.5 rounded-full hover:bg-terracotta transition-colors"
          >
            <FiPhone className="w-3.5 h-3.5" /> Call advisor
          </a>
          <a
            href={`https://wa.me/${PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white text-xs font-medium px-4 py-2.5 rounded-full hover:bg-[#1da851] transition-colors"
          >
            <FaWhatsapp className="w-3.5 h-3.5" /> WhatsApp
          </a>
          <button
            onClick={() => setSent(false)}
            data-cursor="hover"
            className="inline-flex items-center gap-2 border border-line text-graphite text-xs font-medium px-4 py-2.5 rounded-full hover:bg-cream transition-colors"
          >
            Send another →
          </button>
        </div>
      </motion.div>
    );
  }

  // ─── FORM ───────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-white rounded-2xl shadow-xl shadow-graphite/10 ring-1 ring-line overflow-hidden"
    >
      {/* Top accent bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-terracotta via-terracotta/70 to-transparent" />

      {/* Header */}
      <div className="px-7 md:px-9 pt-9 pb-6 border-b border-line bg-gradient-to-b from-cream/40 to-transparent">
        <div className="number-tag mb-2">(02) Enquire</div>
        <h3 className="font-display text-2xl md:text-3xl text-graphite leading-tight">
          Request the{" "}
          <span className="editorial text-terracotta">memorandum</span>
        </h3>
        <p className="text-smoke text-sm mt-2 leading-relaxed">
          Floor plans, pricing, and a private viewing schedule — sent the same day.
        </p>

        {/* Quick contact strip */}
        <div className="flex flex-wrap gap-2 mt-5">
          <a
            href={`tel:+${PHONE}`}
            data-cursor="hover"
            className="inline-flex items-center gap-1.5 bg-cream hover:bg-graphite hover:text-bone text-graphite text-[11px] font-medium px-3 py-1.5 rounded-full transition-colors"
          >
            <FiPhone className="w-3 h-3" /> Call
          </a>
          <a
            href={`https://wa.me/${PHONE}?text=${encodeURIComponent(`Hi, I'd like more information on ${projectTitle || "your projects"}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="inline-flex items-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white text-[#1da851] text-[11px] font-medium px-3 py-1.5 rounded-full transition-colors"
          >
            <FaWhatsapp className="w-3 h-3" /> WhatsApp
          </a>
        </div>
      </div>

      {/* Form body */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="px-7 md:px-9 py-7 space-y-5"
      >
        <Field
          label="Full Name"
          error={errors.name?.message}
          register={register("name", { required: "Please share your name" })}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field
            label="Email"
            type="email"
            error={errors.email?.message}
            register={register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
          />
          <Field
            label="Phone"
            type="tel"
            error={errors.phone?.message}
            register={register("phone", {
              required: "Phone is required",
              minLength: { value: 8, message: "Enter a valid number" },
            })}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs uppercase tracking-ultrawide text-smoke mb-2">
            Configuration of interest
          </label>
          <input
            type="text"
            placeholder="e.g. 3 BHK, 4 BHK + Study, Penthouse…"
            {...register("config")}
            className="bg-transparent border-b border-line focus:border-graphite outline-none text-graphite text-sm py-2.5 placeholder:text-ash transition-colors"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs uppercase tracking-ultrawide text-smoke mb-2">
            Message
          </label>
          <textarea
            rows={3}
            placeholder="A few words about what you're looking for…"
            {...register("message")}
            className="bg-transparent border-b border-line focus:border-graphite outline-none text-graphite text-sm py-2.5 placeholder:text-ash resize-none transition-colors"
          />
        </div>

        {submitError && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          data-cursor="hover"
          className="w-full inline-flex items-center justify-center gap-2 bg-graphite hover:bg-terracotta text-bone text-sm font-medium px-6 py-3.5 rounded-full transition-all duration-300 hover:gap-3 active:scale-[0.99] disabled:opacity-50 shadow-md shadow-graphite/15 hover:shadow-lg hover:shadow-terracotta/30"
        >
          {isSubmitting ? "Sending…" : (
            <>
              Send Enquiry <span aria-hidden>→</span>
            </>
          )}
        </button>

        {/* Trust footer */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-line">
          <TrustItem Icon={FiClock} label="Reply in 24h" />
          <TrustItem Icon={FiLock} label="Confidential" />
          <TrustItem Icon={FiCheckCircle} label="No spam ever" />
        </div>
      </form>

      {/* Advisor footer */}
      <div className="flex items-center gap-3 px-7 md:px-9 py-5 bg-cream/50 border-t border-line">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80"
          alt=""
          className="w-10 h-10 rounded-full object-cover ring-2 ring-bone"
        />
        <div className="flex-1 min-w-0">
          <div className="text-xs text-smoke leading-tight">Your dedicated advisor</div>
          <div className="text-sm font-medium text-graphite leading-tight mt-0.5">
            Adriana Vance, Director of Sales
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Online
        </span>
      </div>
    </motion.div>
  );
}

// ─── Field ──────────────────────────────────────────
function Field({ label, type = "text", error, register }) {
  return (
    <div className="flex flex-col">
      <label className="text-xs uppercase tracking-ultrawide text-smoke mb-2">{label}</label>
      <input
        type={type}
        {...register}
        className={`bg-transparent border-b outline-none text-graphite text-sm py-2.5 transition-colors ${
          error ? "border-red-400" : "border-line focus:border-graphite"
        }`}
      />
      {error && <span className="text-red-600 text-xs mt-1.5">{error}</span>}
    </div>
  );
}

function TrustItem({ Icon, label }) {
  return (
    <div className="flex flex-col items-center text-center gap-1.5">
      <Icon className="w-3.5 h-3.5 text-terracotta" />
      <span className="text-[10px] text-smoke leading-tight">{label}</span>
    </div>
  );
}
