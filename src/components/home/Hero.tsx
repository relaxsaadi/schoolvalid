
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Award, Shield, Users, FileText, Calendar, Filter, Download, Badge, Lock, RefreshCw, UserCog } from "lucide-react";

export const Hero = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-20">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Secure Student Records Management
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Streamline your institution's record-keeping with our advanced platform. Secure,
                efficient, and compliant with global standards.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="animate-fadeIn">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-8">
              {features.map((feature, i) => (
                <Card 
                  key={feature.title} 
                  className="animate-fadeIn flex flex-col p-6 shadow-lg h-full" 
                  style={{
                    animationDelay: `${i * 150}ms`
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <feature.icon className="h-6 w-6 text-brand-500 shrink-0" />
                    <h3 className="font-semibold">{feature.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
          <div className="mx-auto flex items-center justify-center w-full">
            <div className="relative w-full">
              <div className="absolute -inset-4">
                <div className="h-full w-full rotate-6 rounded-3xl bg-gradient-to-r from-brand-500 to-brand-600 opacity-30 blur-xl">
                </div>
              </div>
              <Card className="relative flex flex-col space-y-6 overflow-hidden rounded-3xl p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">Student Records</h3>
                    <p className="text-sm text-gray-500">Total Active Records</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
                    <Users className="h-6 w-6 text-brand-500" />
                  </div>
                </div>
                <div className="text-4xl font-bold">2,547</div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className="h-full w-4/5 rounded-full bg-brand-500"></div>
                  </div>
                  <div className="text-sm text-gray-500">80% storage used</div>
                </div>
              </Card>
            </div>
          </div>
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
    title: "Certified",
    description: "Compliant with global education standards",
    icon: Award,
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

