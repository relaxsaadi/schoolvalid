
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();
  const isPricingPage = location.pathname === '/pricing';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2 nav-link-scale">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold">Schoolvalid</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-6">
            <Link to="/pricing">
              <Button 
                variant={isPricingPage ? "default" : "ghost"} 
                className={`nav-link-bounce ${isPricingPage ? 'bg-primary text-primary-foreground' : ''}`}
              >
                Pricing
              </Button>
            </Link>
            <Link to="/sign-in">
              <Button className="nav-link-rotate bg-brand-500 hover:bg-brand-600 text-white">
                Sign In
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
