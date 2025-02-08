
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

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

export const PricingCards = ({ plans, onSelectPlan }: PricingCardsProps) => {
  const [isYearly, setIsYearly] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.6
      }
    }
  };

  const popularBadgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <div className="mt-12">
      <motion.div 
        className="flex items-center justify-center gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className={`text-sm ${!isYearly ? 'font-bold' : ''}`}>Monthly</span>
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
          className="data-[state=checked]:animate-pulse"
        />
        <span className={`text-sm ${isYearly ? 'font-bold' : ''}`}>
          Yearly{' '}
          <motion.span 
            className="text-green-600"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            (Save 20%)
          </motion.span>
        </span>
      </motion.div>

      <motion.div 
        className="grid gap-8 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { type: "spring", stiffness: 300 }
            }}
            className="relative"
          >
            <Card 
              className={`relative p-6 h-full transition-shadow duration-300
                ${plan.is_popular ? 'border-primary shadow-lg hover:shadow-primary/20' : 'hover:shadow-lg'}
              `}
            >
              {plan.is_popular && (
                <motion.div 
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full"
                  variants={popularBadgeVariants}
                  initial="initial"
                  animate="animate"
                  whileHover={{ scale: 1.1 }}
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
              <AnimatePresence mode="wait">
                <motion.div 
                  key={isYearly ? 'yearly' : 'monthly'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4"
                >
                  <span className="text-3xl font-bold">
                    ${isYearly ? (plan.price_yearly / 12).toFixed(2) : plan.price_monthly}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                  {isYearly && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Billed annually (${plan.price_yearly}/year)
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-center gap-2"
                    onHoverStart={() => setHoveredFeature(feature)}
                    onHoverEnd={() => setHoveredFeature(null)}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      animate={{
                        scale: hoveredFeature === feature ? 1.2 : 1,
                        rotate: hoveredFeature === feature ? 360 : 0
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Check className="h-4 w-4 text-primary" />
                    </motion.div>
                    <span className="text-sm transition-colors duration-200 hover:text-primary">
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>
              <Button
                className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                variant={plan.is_popular ? "default" : "outline"}
                onClick={() => onSelectPlan(plan.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </Button>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
