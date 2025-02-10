
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/home/Navigation";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { motion } from "framer-motion";

const Checkout = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const { data: plan, isLoading } = useQuery({
    queryKey: ['plan', planId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!plan) {
    navigate('/pricing');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-6xl"
          >
            <div className="grid gap-8 md:grid-cols-2">
              <CheckoutForm plan={plan} />
              <OrderSummary plan={plan} />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
