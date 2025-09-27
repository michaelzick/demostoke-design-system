import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NewComponentButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function NewComponentButton({ className, children }: NewComponentButtonProps) {
  const navigate = useNavigate();

  return (
    <Button 
      variant="on-surface"
      className={className}
      onClick={() => navigate('/new-component')}
    >
      <Plus className="h-4 w-4 mr-2" />
      {children || "Add Component"}
    </Button>
  );
}