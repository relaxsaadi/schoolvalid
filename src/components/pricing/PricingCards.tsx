
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
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

  return (
    <div className="mt-12">
      <div className="flex items-center justify-center gap-4 mb-8">
        <span className={`text-sm ${!isYearly ? 'font-bold' : ''}`}>Monthly</span>
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />
        <span className={`text-sm ${isYearly ? 'font-bold' : ''}`}>
          Yearly <span className="text-green-600">(Save 20%)</span>
        </span>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <Card className={`relative p-6 ${plan.is_popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  ${isYearly ? (plan.price_yearly / 12).toFixed(2) : plan.price_monthly}
                </span>
                <span className="text-muted-foreground">/month</span>
                {isYearly && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Billed annually (${plan.price_yearly}/year)
                  </div>
                )}
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full transition-all duration-300 hover:scale-105"
                variant={plan.is_popular ? "default" : "outline"}
                onClick={() => onSelectPlan(plan.id)}
              >
                Get Started
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
