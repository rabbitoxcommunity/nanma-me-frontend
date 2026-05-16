import { Link } from "react-router-dom";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import SplitText from "../../animations/SplitText";
import BlurText from "../../animations/BlurText";

const items = [
  { Icon: FiMapPin, label: "Visit", value: "One Park Avenue, Worli, Mumbai 400 018" },
  { Icon: FiPhone, label: "Call", value: "+91 99999 99999", href: "tel:+919999999999" },
  { Icon: FiMail, label: "Write", value: "hello@nanmaconstruct.com", href: "mailto:hello@nanmaconstruct.com" },
];

export default function ContactPreview() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <span className="eyebrow mb-5">
            <span className="number-tag">(08)</span> Get in Touch
          </span>
          <h2 className="display-2 mt-6">
            <SplitText text="A quiet" splitBy="word" stagger={0.06} />{" "}
            <span className="editorial text-terracotta">
              <SplitText text="introduction." splitBy="char" stagger={0.04} delay={0.4} />
            </span>
          </h2>
          <BlurText
            text="Visit our atelier, share what you're looking for, and we'll respond personally — within 24 hours."
            className="body-lg block mt-8 max-w-md"
            delay={0.5}
          />
          <Link to="/contact" data-cursor="hover" className="btn-primary mt-10">
            Begin a Conversation <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 space-y-6">
          {items.map((it, i) => {
            const Inner = (
              <>
                <it.Icon className="w-7 h-7 text-terracotta shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs uppercase tracking-ultrawide text-smoke mb-1">{it.label}</div>
                  <div className="font-display text-xl md:text-2xl text-graphite font-light leading-snug">
                    {it.value}
                  </div>
                </div>
              </>
            );
            return it.href ? (
              <a
                key={i}
                href={it.href}
                data-cursor="hover"
                className="group flex items-start gap-5 bg-cream hover:bg-pearl rounded-sm p-6 md:p-8 transition-colors duration-300"
              >
                {Inner}
              </a>
            ) : (
              <div
                key={i}
                className="flex items-start gap-5 bg-cream rounded-sm p-6 md:p-8"
              >
                {Inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
