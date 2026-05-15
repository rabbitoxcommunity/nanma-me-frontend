import { motion } from "framer-motion";
import SplitText from "../../animations/SplitText";
import Counter from "../../animations/Counter";

const stats = [
  { value: 18, label: "Years in Practice", suffix: "+" },
  { value: 42, label: "Projects Delivered", suffix: "" },
  { value: 4200, label: "Crores Transacted", prefix: "₹", suffix: " Cr" },
  { value: 98, label: "Client Retention", suffix: "%" },
];

export default function Counters() {
  return (
    <section className="py-24 md:py-32 bg-graphite text-bone overflow-hidden grain">
      <div className="container-x">
        <div className="max-w-3xl mb-16">
          <span className="eyebrow text-bone/50 mb-5">
            <span className="text-terracotta editorial italic normal-case text-base">(05)</span>
            <span className="ml-2">By the numbers</span>
          </span>
          <h2 className="display-2 !text-bone mt-6">
            <SplitText text="Two decades, " splitBy="word" stagger={0.06} />
            <span className="editorial text-terracotta">
              <SplitText text="counted carefully." splitBy="word" stagger={0.06} delay={0.3} />
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-bone/10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-graphite p-8 md:p-10 lg:p-12 group"
            >
              <div className="font-display text-5xl md:text-6xl lg:text-7xl text-bone font-light tracking-tightest group-hover:text-terracotta transition-colors duration-500">
                <Counter to={s.value} prefix={s.prefix || ""} suffix={s.suffix || ""} duration={2.4} />
              </div>
              <div className="text-xs uppercase tracking-ultrawide text-bone/60 mt-4">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
