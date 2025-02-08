
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Users, FileText, Calendar, Filter, Download, Badge, Lock, RefreshCw, UserCog, ShieldCheck, Key } from "lucide-react";
import { motion } from "framer-motion";
import { Badge as UIBadge } from "@/components/ui/badge";

interface HeroProps {
  onGetStarted?: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 opacity-90" />
      
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
                className="relative text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-white drop-shadow-lg hover:scale-105 transition-transform duration-300 cursor-default"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                whileHover={{ 
                  textShadow: "0 0 8px rgba(255,255,255,0.5)",
                }}
              >
                <span className="inline-block hover:text-orange-300 transition-colors duration-300">Creating</span>{" "}
                <span className="inline-block hover:text-orange-300 transition-colors duration-300">a</span>{" "}
                <span className="inline-block hover:text-orange-300 transition-colors duration-300">world</span>{" "}
                <span className="inline-block hover:text-orange-300 transition-colors duration-300">where...</span>
                <br />
                <span className="mt-2 block">
                  <span className="inline-block hover:text-orange-300 transition-colors duration-300">understanding</span>{" "}
                  <span className="inline-block hover:text-orange-300 transition-colors duration-300">is</span>{" "}
                  <span className="inline-block hover:text-orange-300 transition-colors duration-300">universal</span>
                </span>
              </motion.h1>
              <motion.p 
                className="max-w-[600px] text-white font-medium text-lg md:text-xl mt-6 text-shadow hover:scale-102 transition-transform duration-300 cursor-default"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                whileHover={{
                  textShadow: "0 0 8px rgba(255,255,255,0.5)",
                }}
              >
                Streamline your institution's record-keeping with our advanced platform. Secure,
                efficient, and compliant with global standards.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <UIBadge variant="secondary" className="bg-white/20 text-white border-none shadow-sm backdrop-blur-sm hover:bg-white/30 transition-colors duration-300">
                  <ShieldCheck className="w-4 h-4 mr-1" /> GDPR Compliant
                </UIBadge>
                <UIBadge variant="secondary" className="bg-white/20 text-white border-none shadow-sm backdrop-blur-sm hover:bg-white/30 transition-colors duration-300">
                  <Key className="w-4 h-4 mr-1" /> AES-256 Encryption
                </UIBadge>
              </motion.div>
            </motion.div>
            <motion.div 
              className="flex flex-col gap-2 min-[400px]:flex-row mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-white text-brand-500 hover:bg-white/90 transition-all duration-300 shadow-lg hover:scale-105"
                onClick={onGetStarted}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-cyan-300/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 0%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <span className="relative z-10 flex items-center font-semibold">
                  Get Started 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-12"
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
                    className="group h-full transition-all duration-300 hover:shadow-xl backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20 hover:scale-105 hover:rotate-1"
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
                        <h3 className="font-semibold text-white group-hover:text-orange-300 transition-colors duration-300 relative">
                          {feature.title}
                          <motion.div
                            className="absolute -bottom-1 left-0 h-0.5 w-0 bg-orange-300"
                            initial={{ width: "0%" }}
                            whileHover={{ width: "100%" }}
                            transition={{ duration: 0.3 }}
                          />
                        </h3>
                      </div>
                      <p className="mt-2 text-sm text-white/90 font-medium group-hover:text-white transition-colors duration-300">{feature.description}</p>
                      {feature.badge && (
                        <UIBadge 
                          variant="secondary" 
                          className="mt-3 self-start bg-white/10 text-white border-none text-xs"
                        >
                          {feature.badge}
                        </UIBadge>
                      )}
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
            className="mx-auto flex flex-col items-center justify-center w-full gap-6 relative"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl backdrop-blur-sm -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            />
            
            <motion.h3
              className="text-xl font-semibold text-white/90 text-center mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Trusted Credentials Platform
            </motion.h3>

            <motion.img
              src="https://storage.googleapis.com/msgsndr/R1MobQG4jgSbc6WgB6Wz/media/67a7cacf23290201043e3897.png"
              alt="Certificate"
              className="w-[90%] h-auto rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            />

            <div className="relative w-full">
              <div className="absolute -inset-4">
                <div className="h-full w-full rotate-6 rounded-3xl bg-gradient-to-r from-orange-300/20 to-purple-400/20 opacity-30 blur-xl animate-pulse">
                </div>
              </div>
              <Card className="relative group flex flex-col space-y-6 overflow-hidden rounded-3xl p-8 backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-500 hover:shadow-xl hover:scale-[1.02] hover:rotate-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white group-hover:text-orange-300 transition-colors duration-300">Student Records</h3>
                    <p className="text-sm text-white/90 group-hover:text-white transition-colors duration-300">Total Active Records</p>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-300/20 text-orange-300"
                  >
                    <Users className="h-6 w-6" />
                  </motion.div>
                </div>
                <div className="text-4xl font-bold text-white group-hover:text-orange-300 transition-colors duration-300">2,547</div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
                    <motion.div 
                      className="h-full rounded-full bg-orange-300"
                      initial={{ width: "0%" }}
                      animate={{ width: "80%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <div className="text-sm text-white/90 group-hover:text-white transition-colors duration-300 font-medium">80% storage used</div>
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
    badge: "AES-256 Protected"
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
    badge: "Automated Security"
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
    badge: "GDPR Compliant"
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
