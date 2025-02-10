
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";

interface StudentIdGeneratorProps {
  generatedId: string;
  onRegenerate: () => void;
}

export function StudentIdGenerator({ generatedId, onRegenerate }: StudentIdGeneratorProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="certificate_number">Student ID *</Label>
      <div className="flex gap-2">
        <Input
          id="certificate_number"
          name="certificate_number"
          type="text"
          value={generatedId}
          readOnly
          className="bg-gray-100 flex-1"
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={onRegenerate}
          className="flex-shrink-0"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
