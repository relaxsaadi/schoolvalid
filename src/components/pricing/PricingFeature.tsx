
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { featureVariants } from "./animations/pricingAnimations";

interface PricingFeatureProps {
  feature: string;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export const PricingFeature = ({ 
  feature, 
  isHovered, 
  onHoverStart, 
  onHoverEnd 
}: PricingFeatureProps) => {
  return (
    <motion.li 
      className="flex items-center gap-2"
      variants={featureVariants}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.2 : 1,
          rotate: isHovered ? 360 : 0
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Check className="h-4 w-4 text-brand-500" />
      </motion.div>
      <span className="text-sm transition-colors duration-200 hover:text-brand-500">
        {feature}
      </span>
    </motion.li>
  );
};
