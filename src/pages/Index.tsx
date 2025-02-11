
import { Navigation } from "@/components/home/Navigation";
import { Hero } from "@/components/home/Hero";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/pricing');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero onGetStarted={handleGetStarted} />
      </main>
    </div>
  );
};

export default Index;
