
import { Navigation } from "@/components/home/Navigation";
import { Hero } from "@/components/home/Hero";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero />
      </main>
    </div>
  );
};

export default Index;
