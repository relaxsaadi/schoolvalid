
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cardVariants, popularBadgeVariants } from "./animations/pricingAnimations";
import { PricingFeature } from "./PricingFeature";

interface Plan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  features: string[];
  is_popular: boolean;
}

interface PricingCardProps {
  plan: Plan;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

const getStripeLink = (planName: string) => {
  switch (planName.toLowerCase()) {
    case "pay as you go":
      return "https://buy.stripe.com/8wM8AD0pu3apgFieUU";
    case "professional":
      return "https://buy.stripe.com/dR68AD2xC8uJdt6001";
    case "enterprise":
      return "https://buy.stripe.com/28o2cfa04eT7gFi7su";
    default:
      return "https://buy.stripe.com/8wM8AD0pu3apgFieUU"; // Default to "Pay as you go" link
  }
};

const MotionButton = motion(Button);

export const PricingCard = ({ 
  plan, 
  isHovered, 
  onHoverStart, 
  onHoverEnd 
}: PricingCardProps) => {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const handleGetStarted = () => {
    const stripeUrl = getStripeLink(plan.name);
    window.open(stripeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      variants={cardVariants}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      whileHover={{ 
        scale: 1.02,
        transition: { 
          type: "spring", 
          stiffness: 300,
          duration: 0.3
        }
      }}
      className="relative"
    >
      <Card 
        className={`relative p-6 h-full transition-all duration-300
          ${plan.is_popular ? 'border-brand-500 shadow-lg hover:shadow-brand-500/20' : 'hover:shadow-lg'}
          ${!isHovered ? 'opacity-50' : ''}
        `}
      >
        {plan.is_popular && (
          <motion.div 
            className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-500 text-white text-sm rounded-full"
            variants={popularBadgeVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            Most Popular
          </motion.div>
        )}
        <div className="mb-4">
          <motion.h3 
            className="text-xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {plan.name}
          </motion.h3>
          <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <span className="text-3xl font-bold">
            ${plan.price_monthly}
          </span>
        </motion.div>
        <motion.ul 
          className="space-y-3 mb-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {plan.features.map((feature, index) => (
            <PricingFeature
              key={index}
              feature={feature}
              isHovered={hoveredFeature === feature}
              onHoverStart={() => setHoveredFeature(feature)}
              onHoverEnd={() => setHoveredFeature(null)}
            />
          ))}
        </motion.ul>
        <MotionButton
          className={`w-full transition-all duration-300 ${plan.is_popular ? 'bg-brand-500 hover:bg-brand-600' : 'border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white'}`}
          variant={plan.is_popular ? "default" : "outline"}
          onClick={handleGetStarted}
          whileHover={{ 
            scale: 1.05,
            transition: { 
              duration: 0.2,
              ease: "easeInOut"
            }
          }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </MotionButton>
      </Card>
    </motion.div>
  );
};
