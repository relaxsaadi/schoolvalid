import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Users, FileText, Calendar, Filter, Download, Badge, Lock, RefreshCw, UserCog } from "lucide-react";
import { motion } from "framer-motion";

interface HeroProps {
  onGetStarted?: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-transparent" />
      
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
                className="relative text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Secure Student Records Management
                <div className="absolute -inset-x-2 -inset-y-4 z-[-1] bg-gradient-to-r from-brand-100/20 to-brand-50/20 blur-2xl" />
              </motion.h1>
              <motion.p 
                className="max-w-[600px] text-gray-600 text-lg md:text-xl dark:text-gray-300"
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
                className="group relative overflow-hidden bg-brand-500 hover:bg-brand-600 transition-all duration-300"
                onClick={onGetStarted}
              >
                <span className="relative z-10 flex items-center">
                  Get Started 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                    className="group h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:bg-gradient-to-br from-white to-brand-50/30 border-brand-100/50"
                  >
                    <div className="flex flex-col p-6">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                          <feature.icon className="h-6 w-6 text-brand-500" />
                        </motion.div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
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
                <div className="h-full w-full rotate-6 rounded-3xl bg-gradient-to-r from-brand-500/20 to-brand-600/20 opacity-30 blur-xl animate-pulse">
                </div>
              </div>
              <Card className="relative group flex flex-col space-y-6 overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-white to-brand-50/50 transition-all duration-500 hover:shadow-xl hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Student Records</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Active Records</p>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50"
                  >
                    <Users className="h-6 w-6 text-brand-500" />
                  </motion.div>
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">2,547</div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-brand-100 overflow-hidden">
                    <motion.div 
                      className="h-full rounded-full bg-brand-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "80%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">80% storage used</div>
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
