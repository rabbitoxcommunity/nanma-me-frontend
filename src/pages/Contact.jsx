import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaWhatsapp, FaInstagram, FaLinkedinIn, FaFacebookF, FaYoutube } from "react-icons/fa";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";
import SplitText from "../animations/SplitText";
import BlurText from "../animations/BlurText";
import PageTransition from "../components/layout/PageTransition";
import SEO from "../components/ui/SEO";
import { enquiriesApi } from "../admin/api/endpoints";

const offices = [
  { city: "Dubai",  address: `Nanma Properties L.L.C. <br />207, L2, The Light 1, <br />Arjan, Dubai, UAE` },
    { city: "Kochi",  address: `NANMA PROPERTIES PVT LTD <br/>
Group Meeran HQ Building<br/>
NH Byepass, Edapally<br/>
Ernakulam - 682024` },
];

const socials = [
  { Icon: FaInstagram, href: "https://www.instagram.com/nanma.me", label: "Instagram" },
    // { Icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
  { Icon: FaFacebookF, href: "https://www.facebook.com/share/18pRxnfFUg/?mibextid=wwXIfr", label: "Facebook" },
  // { Icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
];

export default function Contact() {
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
      await enquiriesApi.submit(data);
      setSent(true);
      reset();
    } catch (err) {
      setSubmitError(
        err?.response?.data?.error || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <PageTransition>
      <SEO
        title="Contact Nanma Properties — Begin a Conversation"
        description="Get in touch with Nanma Properties. Visit our offices in Kochi and Dubai, message us on WhatsApp, or submit an enquiry."
        url="https://nanmaconstruct.com/contact"
      />

      {/* HERO */}
      <section className="pt-32 md:pt-44 pb-12">
        <div className="container-x">
          {/* <span className="eyebrow mt-12">
            <span className="number-tag">Contact</span>
          </span> */}
          <h1 className="display-1 mt-6 max-w-[14ch] text-balance">
            <SplitText text="A quiet " splitBy="word" stagger={0.06} />
            <span className="editorial text-terracotta">
              <SplitText text="introduction." splitBy="char" stagger={0.04} delay={0.4} />
            </span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-10">
            <div className="md:col-span-6 md:col-start-7">
              <BlurText
                text="Tell us a little about what you're looking for. We respond personally, within 24 hours, and never share your details."
                className="body-lg"
                delay={0.5}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FORM + QUICK CONTACT */}
      <section className="py-16 md:py-24">
        <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form */}
          <div className="lg:col-span-7">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-cream rounded-sm p-12 md:p-16"
              >
                <span className="number-tag mb-4 block">Received</span>
                <h2 className="display-3 text-graphite">
                  Thank you. <span className="editorial text-terracotta">Truly.</span>
                </h2>
                <p className="body-lg mt-6 max-w-md">
                  An advisor will reach out personally within 24 hours.
                </p>
                <button
                  data-cursor="hover"
                  onClick={() => setSent(false)}
                  className="btn-ghost mt-8"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="bg-cream rounded-sm p-8 md:p-12 space-y-6"
              >
                <div>
                  <span className="number-tag block mb-2">(Enquiry Form)</span>
                  <h2 className="font-display text-2xl md:text-3xl text-graphite">
                    Send us a message
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field
                    label="Full Name *"
                    error={errors.name?.message}
                    register={register("name", {
                      required: "Please share your name",
                      minLength: { value: 2, message: "Name is too short" },
                    })}
                  />
                  <Field
                    label="Email *"
                    type="email"
                    error={errors.email?.message}
                    register={register("email", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
                    })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field
                    label="Phone *"
                    type="tel"
                    error={errors.phone?.message}
                    register={register("phone", {
                      required: "Phone is required",
                      pattern: { value: /^[+0-9\s-]{8,}$/, message: "Enter a valid number" },
                    })}
                  />
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-ultrawide text-smoke mb-2">
                      I'm interested in
                    </label>
                    <select
                      {...register("interest")}
                      className="bg-transparent border-b border-line focus:border-graphite outline-none text-graphite text-sm py-2.5 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Select…</option>
                      <option value="buying">Buying</option>
                      <option value="invest">Investment</option>
                      <option value="visit">Site Visit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <Field
                  label="Subject *"
                  error={errors.subject?.message}
                  register={register("subject", {
                    required: "Please add a subject",
                  })}
                />

                <div className="flex flex-col">
                  <label className="text-xs uppercase tracking-ultrawide text-smoke mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us about your ideal home…"
                    {...register("message", {
                      required: "Please share a message",
                      minLength: { value: 10, message: "A few more words please" },
                    })}
                    className={`bg-transparent border-b outline-none text-graphite text-sm py-2.5 placeholder:text-ash resize-none transition-colors ${
                      errors.message ? "border-red-500" : "border-line focus:border-graphite"
                    }`}
                  />
                  {errors.message && (
                    <span className="text-red-600 text-xs mt-1.5">{errors.message.message}</span>
                  )}
                </div>

                {submitError && (
                  <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-cursor="hover"
                  className="btn-primary disabled:opacity-50"
                >
                  {isSubmitting ? "Sending…" : (
                    <>
                      Send Inquiry <span aria-hidden>→</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            {/* WhatsApp */}
            <motion.a
              href="https://wa.me/971547566000?text=Hi Nanma, I'd like to know more about your projects."
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              whileHover={{ y: -3 }}
              className="flex items-center gap-5 bg-[#25D366] text-white rounded-sm p-6 md:p-7 group"
            >
              <FaWhatsapp className="w-10 h-10 shrink-0" />
              <div className="flex-1">
                <div className="text-xs uppercase tracking-ultrawide opacity-80 mb-1">
                  Quick chat
                </div>
                <div className="font-display text-xl md:text-2xl font-light">
                  Message us on WhatsApp
                </div>
              </div>
              <span className="text-2xl opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                →
              </span>
            </motion.a>

            {/* Quick details */}
            <div className="bg-cream rounded-sm p-6 md:p-7 space-y-5">
                  <div className="flex items-start gap-4">
                <FiMapPin className="w-5 h-5 text-terracotta shrink-0 mt-1" />
                <div>
                  <div className="text-xs uppercase tracking-ultrawide text-smoke">Location</div>
                  <div className="text-graphite text-sm">Nanma Properties L.L.C. <br />207, L2, The Light 1, <br />Arjan, Dubai, UAE</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FiPhone className="w-5 h-5 text-terracotta shrink-0 mt-1" />
                <div>
                  <div className="text-xs uppercase tracking-ultrawide text-smoke">Call</div>
                  <a href="tel:+971547566000" data-cursor="hover" className="text-graphite hover:text-terracotta transition-colors">
                    +971 547566000
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FiMail className="w-5 h-5 text-terracotta shrink-0 mt-1" />
                <div>
                  <div className="text-xs uppercase tracking-ultrawide text-smoke">Email</div>
                  <a href="mailto:customerdelight@nanmaconstruct.com" data-cursor="hover" className="text-graphite hover:text-terracotta transition-colors">
                    customerdelight@nanmaconstruct.com
                  </a>
                </div>
              </div>
          
            </div>

            {/* Social */}
            <div className="bg-cream rounded-sm p-6 md:p-7">
              <div className="text-xs uppercase tracking-ultrawide text-smoke mb-4">Follow</div>
              <div className="flex flex-wrap gap-3">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    data-cursor="hover"
                    className="w-12 h-12 rounded-full bg-bone hover:bg-terracotta hover:text-bone text-graphite flex items-center justify-center transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFICES */}
      <section className="py-20 md:py-24 bg-cream">
        <div className="container-x">
          <div className="max-w-2xl mb-12">
            <span className="eyebrow mb-4">
              <span className="number-tag">Visit us</span>
            </span>
            <h2 className="display-2 mt-6">
              <SplitText text="Two Nations. " splitBy="word" stagger={0.06} />
              <br />
              <span className="editorial text-terracotta">
                <SplitText text="One philosophy." splitBy="word" stagger={0.06} delay={0.3} />
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line">
            {offices?.map((o, i) => (
              <motion.div
                key={o.city}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="bg-cream p-8 md:p-10 hover:bg-pearl transition-colors duration-500"
              >
                <FiMapPin className="w-7 h-7 text-terracotta mb-5" />
                <h3 className="font-display text-2xl md:text-3xl text-graphite mb-3">{o.city}</h3>
                <p className="text-md text-smoke leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: o.address }} />
                {/* <div className="space-y-1 text-sm">
                  <a href={`tel:${o.phone.replace(/\s/g, "")}`} data-cursor="hover" className="block text-graphite hover:text-terracotta transition-colors">
                    {o.phone}
                  </a>
                  <a href={`mailto:${o.email}`} data-cursor="hover" className="block text-graphite hover:text-terracotta transition-colors">
                    {o.email}
                  </a>
                </div> */}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="pb-0">
        <div className="aspect-[16/8] md:aspect-[21/8] w-full bg-cream">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.600162219114!2d55.226187499999995!3d24.9456875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f711dac0a9487%3A0xc699c0d347b95d19!2sNanma%20Lotus!5e0!3m2!1sen!2sin!4v1779868111807!5m2!1sen!2sin"
            title="Nanma Lotus"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
            allowFullScreen
          />
        </div>
      </section>
    </PageTransition>
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
