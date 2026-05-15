import {
  PiSwimmingPool,
  PiBarbell,
  PiFlower,
  PiBaby,
  PiCouch,
  PiBriefcase,
  PiShieldCheck,
  PiCar,
  PiBellRinging,
  PiSparkle,
} from "react-icons/pi";

export const amenityCatalog = {
  pool: { label: "Infinity Pool", icon: PiSwimmingPool },
  gym: { label: "Wellness & Gym", icon: PiBarbell },
  spa: { label: "Spa & Sauna", icon: PiSparkle },
  garden: { label: "Landscaped Gardens", icon: PiFlower },
  kids: { label: "Children's Play", icon: PiBaby },
  lounge: { label: "Resident Lounge", icon: PiCouch },
  business: { label: "Business Suite", icon: PiBriefcase },
  security: { label: "24×7 Security", icon: PiShieldCheck },
  parking: { label: "Valet Parking", icon: PiCar },
  concierge: { label: "Concierge Service", icon: PiBellRinging },
};
