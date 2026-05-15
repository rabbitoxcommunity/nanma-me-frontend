import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

export default function InquiryForm({ projectTitle = "" }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 800));
    console.log("Inquiry:", { ...data, project: projectTitle });
    setSent(true);
    reset();
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cream rounded-sm p-8 md:p-10"
      >
        <div className="number-tag mb-3">Received</div>
        <h3 className="font-display text-2xl text-graphite mb-3">
          Thank you. <span className="editorial text-terracotta">Truly.</span>
        </h3>
        <p className="text-smoke text-sm mb-6">
          A Nanma advisor will reach out personally within 24 hours.
        </p>
        <button
          onClick={() => setSent(false)}
          data-cursor="hover"
          className="text-sm text-terracotta underline-hover"
        >
          Send another →
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="bg-cream rounded-sm p-8 md:p-10 space-y-5"
    >
      <div>
        <div className="number-tag mb-2">Enquire</div>
        <h3 className="font-display text-2xl md:text-3xl text-graphite leading-tight">
          Request the project memorandum
        </h3>
        <p className="text-smoke text-sm mt-2">
          Receive floor plans, pricing, and a private viewing schedule.
        </p>
      </div>

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
        <select
          {...register("config")}
          className="bg-transparent border-b border-line focus:border-graphite outline-none text-graphite text-sm py-2.5 transition-colors appearance-none cursor-pointer"
        >
          <option value="">Select…</option>
          <option value="3 BHK">3 BHK</option>
          <option value="4 BHK">4 BHK</option>
          <option value="Penthouse">Penthouse</option>
          <option value="Villa">Villa</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-xs uppercase tracking-ultrawide text-smoke mb-2">Message</label>
        <textarea
          rows={3}
          placeholder="A few words about what you're looking for…"
          {...register("message")}
          className="bg-transparent border-b border-line focus:border-graphite outline-none text-graphite text-sm py-2.5 placeholder:text-ash resize-none transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        data-cursor="hover"
        className="btn-primary w-full justify-center disabled:opacity-50"
      >
        {isSubmitting ? "Sending…" : (
          <>
            Send Enquiry <span aria-hidden>→</span>
          </>
        )}
      </button>
    </form>
  );
}

function Field({ label, type = "text", error, register }) {
  return (
    <div className="flex flex-col">
      <label className="text-xs uppercase tracking-ultrawide text-smoke mb-2">{label}</label>
      <input
        type={type}
        {...register}
        className={`bg-transparent border-b outline-none text-graphite text-sm py-2.5 transition-colors ${
          error ? "border-red-500" : "border-line focus:border-graphite"
        }`}
      />
      {error && <span className="text-red-600 text-xs mt-1.5">{error}</span>}
    </div>
  );
}
