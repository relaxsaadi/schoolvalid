
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/home/Navigation";
import { PricingCards } from "@/components/pricing/PricingCards";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Pricing = () => {
  const navigate = useNavigate();
  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price_monthly');
      
      if (error) throw error;
      return data.map(plan => ({
        ...plan,
        features: plan.features as string[]
      }));
    }
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/80 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-cyan-100/20"
          animate={{ 
            background: [
              "linear-gradient(to right, rgba(219,234,254,0.2), rgba(207,250,254,0.2))",
              "linear-gradient(to right, rgba(207,250,254,0.2), rgba(219,234,254,0.2))",
              "linear-gradient(to right, rgba(219,234,254,0.2), rgba(207,250,254,0.2))"
            ]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "linear" 
          }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-primary/5 -top-32 -left-32"
          animate={{ 
            y: [0, 20, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-primary/5 -bottom-48 -right-48"
          animate={{ 
            y: [0, -30, 0],
            x: [0, -20, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      <Navigation />
      <main className="flex-1">
        <section className="container px-4 py-16 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              type: "spring",
              stiffness: 100 
            }}
            className="mx-auto max-w-6xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that's right for your institution
            </p>
          </motion.div>
          <PricingCards plans={plans} onSelectPlan={(planId) => navigate(`/checkout/${planId}`)} />
        </section>
      </main>
    </div>
  );
};

export default Pricing;
