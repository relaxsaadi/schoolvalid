
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2 nav-link-scale">
            <GraduationCap className="h-6 w-6" />
            <span className="inline-block font-bold">EduArchive</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-6">
            <Button variant="ghost" className="nav-link-underline">
              About
            </Button>
            <Button variant="ghost" className="nav-link-fade">
              Features
            </Button>
            <Button variant="ghost" className="nav-link-bounce">
              Pricing
            </Button>
            <Link to="/sign-in">
              <Button className="nav-link-rotate">
                Sign In
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
