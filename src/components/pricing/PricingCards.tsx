
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
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

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100
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
    },
    hover: {
      y: [0, -5, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const MotionButton = motion(Button);

  return (
    <div className="mt-12">
      <motion.div 
        className="grid gap-8 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            variants={cardVariants}
            onHoverStart={() => setHoveredCard(plan.id)}
            onHoverEnd={() => setHoveredCard(null)}
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
                ${hoveredCard && hoveredCard !== plan.id ? 'opacity-50' : ''}
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
                <span className="text-muted-foreground">/month</span>
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
                  <motion.li 
                    key={index} 
                    className="flex items-center gap-2"
                    variants={featureVariants}
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
                      <Check className="h-4 w-4 text-brand-500" />
                    </motion.div>
                    <span className="text-sm transition-colors duration-200 hover:text-brand-500">
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
              <MotionButton
                className={`w-full transition-all duration-300 ${plan.is_popular ? 'bg-brand-500 hover:bg-brand-600' : 'border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white'}`}
                variant={plan.is_popular ? "default" : "outline"}
                onClick={() => onSelectPlan(plan.id)}
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
        ))}
      </motion.div>
    </div>
  );
};
