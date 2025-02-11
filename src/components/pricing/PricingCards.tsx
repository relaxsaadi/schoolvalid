
import { useState } from "react";
import { motion } from "framer-motion";
import { PricingCard } from "./PricingCard";
import { containerVariants } from "./animations/pricingAnimations";

interface Plan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_popular: boolean;
}

interface PricingCardsProps {
  plans: Plan[];
  onSelectPlan: (planId: string) => void;
}

export const PricingCards = ({ plans }: PricingCardsProps) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="mt-12">
      <motion.div 
        className="grid gap-8 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isHovered={!hoveredCard || hoveredCard === plan.id}
            onHoverStart={() => setHoveredCard(plan.id)}
            onHoverEnd={() => setHoveredCard(null)}
          />
        ))}
      </motion.div>
    </div>
  );
};
