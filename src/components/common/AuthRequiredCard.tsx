import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AuthRequiredCardProps {
  description?: string;
}

export function AuthRequiredCard({
  description = "Please sign in to access Figma integration.",
}: AuthRequiredCardProps) {
  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-6 text-center space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <div>
            <h3 className="mb-2 font-medium">Authentication Required</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <Button asChild className="mx-auto">
            <Link to="/auth">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
