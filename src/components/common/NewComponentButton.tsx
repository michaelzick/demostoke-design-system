import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NewComponentButtonProps {
  className?: string;
  children?: React.ReactNode;
  showLabel?: boolean;
}

export function NewComponentButton({
  className,
  children,
  showLabel = true,
}: NewComponentButtonProps) {
  const navigate = useNavigate();
  const label = children ?? "Add Component";

  return (
    <Button
      variant="on-surface"
      className={cn(showLabel && "gap-2", !showLabel && "justify-center px-0", className)}
      onClick={() => navigate("/new-component")}
    >
      <Plus className="h-4 w-4" />
      {showLabel ? label : <span className="sr-only">{label}</span>}
    </Button>
  );
}
