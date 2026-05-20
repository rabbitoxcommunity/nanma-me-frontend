import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FiPhone, FiCheckCircle } from "react-icons/fi";
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

  // ─── SUCCESS STATE ───────────────────────────────────
  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-line rounded-sm p-8 h-full flex flex-col justify-center"
      >
        <div className="w-12 h-12 rounded-sm bg-terracotta/10 flex items-center justify-center mb-5">
          <FiCheckCircle className="w-6 h-6 text-terracotta" />
        </div>
        <h3 className="font-display text-2xl text-graphite mb-2 leading-tight">
          Thank you. <span className="editorial text-terracotta">Truly.</span>
        </h3>
        <p className="text-smoke text-sm leading-relaxed mb-6">
          A Nanma advisor will reach out personally within 24 hours.
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href={`tel:+${PHONE}`}
            data-cursor="hover"
            className="inline-flex items-center gap-2 bg-graphite text-bone text-xs font-medium px-4 py-2.5 rounded-full hover:bg-terracotta transition-colors"
          >
            <FiPhone className="w-3.5 h-3.5" /> Call us
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

  // ─── FORM ────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-line rounded-sm h-full flex flex-col"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-line">
        <h3 className="font-display text-xl text-graphite leading-tight">
          Request the{" "}
          <span className="editorial text-terracotta">memorandum</span>
        </h3>
        <p className="text-smoke text-xs mt-1.5 leading-relaxed">
          Floor plans, pricing and a private viewing — sent the same day.
        </p>
        <div className="flex gap-2 mt-4">
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
        className="flex-1 flex flex-col px-6 py-5 gap-4"
      >
        <Field
          label="Full Name"
          placeholder="Your full name"
          error={errors.name?.message}
          register={register("name", { required: "Please share your name" })}
        />
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            register={register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
          />
          <Field
            label="Phone"
            type="tel"
            placeholder="+91 98765 43210"
            error={errors.phone?.message}
            register={register("phone", {
              required: "Phone is required",
              minLength: { value: 8, message: "Enter a valid number" },
            })}
          />
        </div>
        <Field
          label="Configuration"
          placeholder="e.g. 3 BHK, 2200 sq ft"
          register={register("config")}
        />

        {submitError && (
          <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          data-cursor="hover"
          className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-graphite hover:bg-terracotta text-bone text-sm font-medium px-6 py-3 rounded-sm transition-all duration-300 disabled:opacity-50"
        >
          {isSubmitting ? "Sending…" : <>Send Enquiry <span aria-hidden>→</span></>}
        </button>
      </form>
    </motion.div>
  );
}

function Field({ label, type = "text", placeholder, error, register }) {
  return (
    <div className="flex flex-col">
      <label className="text-[10px] uppercase tracking-ultrawide text-smoke mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...register}
        className={`bg-transparent border-b outline-none text-graphite text-sm py-2 placeholder:text-ash/60 transition-colors ${
          error ? "border-red-400" : "border-line focus:border-graphite"
        }`}
      />
      {error && <span className="text-red-600 text-[10px] mt-1">{error}</span>}
    </div>
  );
}
