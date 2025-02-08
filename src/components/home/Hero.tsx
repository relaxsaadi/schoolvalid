
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Users, FileText, Calendar, Filter, Download, Badge, Lock, RefreshCw, UserCog } from "lucide-react";
import { motion } from "framer-motion";

interface HeroProps {
  onGetStarted?: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-20">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-2"
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Secure Student Records Management
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Streamline your institution's record-keeping with our advanced platform. Secure,
                efficient, and compliant with global standards.
              </p>
            </motion.div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button 
                size="lg" 
                className="group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-primary/90"
                onClick={onGetStarted}
              >
                Get Started 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-8">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card 
                    className="group h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:bg-accent/5"
                  >
                    <div className="flex flex-col p-6">
                      <div className="flex items-center space-x-4">
                        <feature.icon className="h-6 w-6 text-brand-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
                        <h3 className="font-semibold">{feature.title}</h3>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto flex items-center justify-center w-full"
          >
            <div className="relative w-full">
              <div className="absolute -inset-4">
                <div className="h-full w-full rotate-6 rounded-3xl bg-gradient-to-r from-brand-500 to-brand-600 opacity-30 blur-xl animate-pulse">
                </div>
              </div>
              <Card className="relative group flex flex-col space-y-6 overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">Student Records</h3>
                    <p className="text-sm text-gray-500">Total Active Records</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 transition-transform duration-300 group-hover:scale-110">
                    <Users className="h-6 w-6 text-brand-500 transition-transform duration-300 group-hover:rotate-12" />
                  </div>
                </div>
                <div className="text-4xl font-bold">2,547</div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full w-4/5 rounded-full bg-brand-500 transition-all duration-500 group-hover:bg-brand-600"></div>
                  </div>
                  <div className="text-sm text-gray-500">80% storage used</div>
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
