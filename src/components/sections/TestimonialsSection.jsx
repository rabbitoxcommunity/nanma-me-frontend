import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SplitText from "../../animations/SplitText";
import { testimonials } from "../../data/testimonials";

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  return (
    <section className="py-24 md:py-32 bg-cream overflow-hidden">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="eyebrow mb-5">
              <span className="number-tag">(07)</span> Words from owners
            </span>
            <h2 className="display-2 mt-6">
              <SplitText text="What our " splitBy="word" stagger={0.06} />
              <span className="editorial text-terracotta">
                <SplitText text="residents say." splitBy="word" stagger={0.06} delay={0.3} />
              </span>
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              data-cursor="hover"
              onClick={() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)}
              aria-label="Previous"
              className="w-12 h-12 border border-line rounded-full flex items-center justify-center text-graphite hover:bg-terracotta hover:text-bone hover:border-terracotta transition-all duration-300"
            >
              ←
            </button>
            <button
              data-cursor="hover"
              onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
              aria-label="Next"
              className="w-12 h-12 border border-line rounded-full flex items-center justify-center text-graphite hover:bg-terracotta hover:text-bone hover:border-terracotta transition-all duration-300"
            >
              →
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
          >
            <div className="lg:col-span-9">
              <div className="font-display text-terracotta text-7xl leading-none mb-6 opacity-50">
                "
              </div>
              <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-graphite leading-snug max-w-4xl">
                {testimonials[current].quote}
              </blockquote>
              <div className="flex items-center gap-4 mt-10">
                <img
                  src={testimonials[current].img}
                  alt={testimonials[current].author}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <div className="text-graphite text-base">
                    {testimonials[current].author}
                  </div>
                  <div className="text-smoke text-xs uppercase tracking-widest mt-1">
                    {testimonials[current].title}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 flex lg:flex-col gap-2 self-end">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  data-cursor="hover"
                  onClick={() => setCurrent(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  className={`transition-all duration-500 ${
                    i === current
                      ? "lg:w-12 lg:h-px w-12 h-px bg-terracotta"
                      : "lg:w-6 lg:h-px w-6 h-px bg-smoke/30"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
