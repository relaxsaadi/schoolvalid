
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Users, FileText, Calendar, Filter, Download, Badge, Lock, RefreshCw, UserCog } from "lucide-react";
import { motion } from "framer-motion";

interface HeroProps {
  onGetStarted?: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 opacity-90" />
      
      <div className="container relative px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-2"
            >
              <motion.h1 
                className="relative text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-white drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Creating a world where...
                <br />
                <span className="mt-2 block">understanding is universal</span>
              </motion.h1>
              <motion.p 
                className="max-w-[600px] text-white font-medium text-lg md:text-xl mt-6 text-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Streamline your institution's record-keeping with our advanced platform. Secure,
                efficient, and compliant with global standards.
              </motion.p>
            </motion.div>
            <motion.div 
              className="flex flex-col gap-2 min-[400px]:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-white text-brand-500 hover:bg-white/90 transition-all duration-300 shadow-lg"
                onClick={onGetStarted}
              >
                <span className="relative z-10 flex items-center font-semibold">
                  Get Started 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-8"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        type: "spring",
                        duration: 0.5,
                        bounce: 0.3
                      }
                    }
                  }}
                >
                  <Card 
                    className="group h-full transition-all duration-300 hover:shadow-xl backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
                  >
                    <div className="flex flex-col p-6">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 10 }}
                          className="text-orange-300"
                        >
                          <feature.icon className="h-6 w-6" />
                        </motion.div>
                        <h3 className="font-semibold text-white">{feature.title}</h3>
                      </div>
                      <p className="mt-2 text-sm text-white/90 font-medium">{feature.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto flex items-center justify-center w-full"
          >
            <div className="relative w-full">
              <div className="absolute -inset-4">
                <div className="h-full w-full rotate-6 rounded-3xl bg-gradient-to-r from-orange-300/20 to-purple-400/20 opacity-30 blur-xl animate-pulse">
                </div>
              </div>
              <Card className="relative group flex flex-col space-y-6 overflow-hidden rounded-3xl p-8 backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-500 hover:shadow-xl hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white">Student Records</h3>
                    <p className="text-sm text-white/90">Total Active Records</p>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-300/20 text-orange-300"
                  >
                    <Users className="h-6 w-6" />
                  </motion.div>
                </div>
                <div className="text-4xl font-bold text-white">2,547</div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
                    <motion.div 
                      className="h-full rounded-full bg-orange-300"
                      initial={{ width: "0%" }}
                      animate={{ width: "80%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <div className="text-sm text-white/90 font-medium">80% storage used</div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    title: "Secure Storage",
    description: "Bank-level encryption for all your sensitive data",
    icon: Shield,
  },
  {
    title: "Easy Management",
    description: "Intuitive interface for managing student records",
    icon: Users,
  },
  {
    title: "Real-Time Updates",
    description: "Update issued credentials instantly with a few clicks",
    icon: RefreshCw,
  },
  {
    title: "Expiration Management",
    description: "Set and update certificate expiration dates easily",
    icon: Calendar,
  },
  {
    title: "Change Request Handling",
    description: "Manage change requests directly from the dashboard",
    icon: UserCog,
  },
  {
    title: "Advanced Filtering",
    description: "Filter certificates by group and data efficiently",
    icon: Filter,
  },
  {
    title: "Certificate Control",
    description: "Monitor and change certificate statuses seamlessly",
    icon: FileText,
  },
  {
    title: "PDF Export",
    description: "Download and print credentials as PDF documents",
    icon: Download,
  },
  {
    title: "Digital Badges",
    description: "Issue expirable digital badges for recognition",
    icon: Badge,
  },
  {
    title: "Access Control",
    description: "Manage and control credential access permissions",
    icon: Lock,
  }
];
