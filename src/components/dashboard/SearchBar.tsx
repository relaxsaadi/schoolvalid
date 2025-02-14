
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar = ({ className, value, onChange, ...props }: SearchBarProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      (e.target as HTMLInputElement).value = '';
      onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className={cn("relative group", className)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none transition-colors duration-200" />
      <Input
        type="search"
        placeholder="Search certificates, recipients..."
        className={cn(
          "pl-9 w-full transition-all duration-200",
          "border-gray-200 focus:border-primary",
          "shadow-sm hover:shadow focus:shadow-md"
        )}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </motion.form>
  );
};
