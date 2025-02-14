
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
    <form onSubmit={handleSubmit} className={cn("relative w-64 max-w-sm", className)}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="search"
        placeholder="Search records..."
        className="pl-9"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </form>
  );
};
