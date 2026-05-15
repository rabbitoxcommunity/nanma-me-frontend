import { motion } from "framer-motion";
import { PiBuildings } from "react-icons/pi";
import { SPEC_ICONS } from "../../utils/iconCatalogs";

export default function SpecGrid({ specifications = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px ">
      {specifications.map((spec, i) => {
        const Icon = SPEC_ICONS[spec.icon]?.Icon || PiBuildings;
        return (
          <motion.div
            key={spec.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="bg-bone p-8 md:p-10 hover:bg-cream transition-colors duration-500 group"
          >
            <Icon className="w-8 h-8 text-terracotta mb-6 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="font-display text-xl text-graphite font-light mb-3">{spec.title}</h3>
            <p className="text-sm text-smoke leading-relaxed">{spec.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}