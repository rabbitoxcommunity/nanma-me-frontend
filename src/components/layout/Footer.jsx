import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import SplitText from "../../animations/SplitText";
import Logo from "../ui/Logo";

const navCols = {
  Explore: [
    { label: "Home", to: "/" },
    { label: "Projects", to: "/projects" },
    { label: "About Us", to: "/about" },
    { label: "Gallery", to: "/gallery" },
    { label: "Contact Us", to: "/contact" },
  ],
  Projects: [
    { label: "Ongoing", to: "/projects?status=ongoing" },
    { label: "Ready to Move In", to: "/projects?status=ready" },
    { label: "Completed", to: "/projects?status=completed" },
    { label: "Upcoming", to: "/projects?status=upcoming" },
  ],
};

const socials = [
  { Icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
  { Icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { Icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
  { Icon: FaWhatsapp, href: "https://wa.me/919999999999", label: "WhatsApp" },
];

export default function Footer() {
  return (
    <footer className="bg-graphite text-bone">
      {/* Big CTA */}
      <div className="container-x py-20 md:py-32 border-b border-bone/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <span className="eyebrow text-bone/50">(Begin)</span>
            <h2 className="display-1 !text-bone mt-6">
              <SplitText text="Let's craft" splitBy="word" stagger={0.08} />
              <br />
              <span className="editorial text-terracotta">
                <SplitText text="something timeless." splitBy="word" stagger={0.08} delay={0.3} />
              </span>
            </h2>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link
              to="/contact"
              data-cursor="hover"
              className="inline-flex items-center gap-3 px-7 py-4 bg-bone text-graphite text-sm rounded-full hover:bg-terracotta hover:text-bone transition-all duration-500 ease-out-expo hover:gap-4"
            >
              Begin a Conversation <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container-x py-16 grid grid-cols-2 md:grid-cols-12 gap-8">
        <div className="col-span-2 md:col-span-4">
          <div className="text-bone">
            <Logo showTagline taglineClass="text-bone/50" markClass="w-[150px] h-[140px] object-contain"  className="w-15 h-15" />
          </div>
          <p className="text-bone/60 text-sm max-w-xs leading-relaxed mb-6">
            Crafted living, built to endure. Limited-edition residential projects across India's most coveted addresses.
          </p>
          <div className="flex gap-3">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                data-cursor="hover"
                className="w-9 h-9 rounded-full border border-bone/20 flex items-center justify-center text-bone/70 hover:bg-terracotta hover:border-terracotta hover:text-bone transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {Object.entries(navCols).map(([head, items]) => (
          <div key={head} className="md:col-span-2">
            <div className="text-xs uppercase tracking-ultrawide text-bone/40 mb-5">{head}</div>
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it.label}>
                  <Link to={it.to} data-cursor="hover" className="text-sm text-bone/80 hover:text-terracotta underline-hover transition-colors">
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="md:col-span-4">
          <div className="text-xs uppercase tracking-ultrawide text-bone/40 mb-5">Reach Us</div>
          <ul className="space-y-4 text-sm text-bone/80 mb-6">
            <li className="flex items-start gap-3">
              <FiMapPin className="w-4 h-4 mt-0.5 text-terracotta shrink-0" />
              <span>One Park Avenue, Worli, Mumbai 400 018</span>
            </li>
            <li className="flex items-center gap-3">
              <FiPhone className="w-4 h-4 text-terracotta shrink-0" />
              <a href="tel:+919999999999" data-cursor="hover" className="hover:text-terracotta transition-colors">+91 99999 99999</a>
            </li>
            <li className="flex items-center gap-3">
              <FiMail className="w-4 h-4 text-terracotta shrink-0" />
              <a href="mailto:hello@nanmaconstruct.com" data-cursor="hover" className="hover:text-terracotta transition-colors">hello@nanmaconstruct.com</a>
            </li>
          </ul>
          {/* <form onSubmit={(e) => e.preventDefault()} className="flex border-b border-bone/30 focus-within:border-terracotta transition-colors">
            <input type="email" placeholder="your@email.com" className="flex-1 bg-transparent py-2 text-sm text-bone placeholder:text-bone/30 outline-none" />
            <button type="submit" data-cursor="hover" className="text-terracotta px-2" aria-label="Subscribe">→</button>
          </form> */}
        </div>
      </div>

      {/* Big wordmark */}
      <div className="container-x py-10 border-t border-bone/10 overflow-hidden">
        <div className="font-display text-[18vw] sm:text-[16vw] leading-none text-bone/[0.06] tracking-[0.18em] text-center select-none">
          NANMA
        </div>
      </div>

      <div className="container-x pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-bone/40">
        <span>© {new Date().getFullYear()} Nanma By Meeran Pvt. Ltd. All rights reserved.</span>
        <span>RERA Registered · Equal Housing Opportunity</span>
      </div>
    </footer>
  );
}
