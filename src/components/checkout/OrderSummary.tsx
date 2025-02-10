
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

interface OrderSummaryProps {
  plan: any;
}

export const OrderSummary = ({ plan }: OrderSummaryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="p-6 sticky top-6">
        <h3 className="text-lg font-bold mb-4">Order Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>{plan.name} Plan</span>
            <span>${plan.price_monthly}/month</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Tax</span>
            <span>${(plan.price_monthly * 0.1).toFixed(2)}</span>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${(plan.price_monthly * 1.1).toFixed(2)}</span>
            </div>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">What's included:</h4>
            <ul className="space-y-2">
              {plan.features.map((feature: string, index: number) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-6">
            <Shield className="h-4 w-4" />
            <span>Secure checkout powered by Stripe</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
