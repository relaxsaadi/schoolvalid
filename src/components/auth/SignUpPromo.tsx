
import { GraduationCap } from "lucide-react";

export const SignUpPromo = () => {
  return (
    <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
      <div className="absolute inset-0 bg-brand-900" />
      <div className="relative z-20 flex items-center text-lg font-medium">
        <GraduationCap className="mr-2 h-6 w-6" />
        APGA
      </div>
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2">
          <p className="text-lg">
            "Join thousands of educational institutions who trust APGA for secure
            and efficient student record management."
          </p>
          <footer className="text-sm">Prof. Michael Chen - Department Head</footer>
        </blockquote>
      </div>
    </div>
  );
};
