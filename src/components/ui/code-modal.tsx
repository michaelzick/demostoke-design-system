import { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, X, Maximize2, Check } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  componentName: string;
  code: string;
}

export function CodeModal({ isOpen, onClose, componentName, code }: CodeModalProps) {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Code copied",
        description: "Component code copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard.",
        variant: "destructive",
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const isDarkTheme = resolvedTheme === 'dark';
  const syntaxTheme = isDarkTheme ? vscDarkPlus : vs;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`${isFullscreen ? 'max-w-[95vw] max-h-[95vh]' : 'max-w-4xl max-h-[80vh]'} transition-all duration-300`}
      >
        <DialogHeader className="flex-row items-center justify-between space-y-0 pb-4 border-b">
          <DialogTitle className="text-lg font-semibold">
            {componentName} Component
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="h-8 w-8 p-0"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto rounded-md border">
            <SyntaxHighlighter
              language="tsx"
              style={syntaxTheme}
              showLineNumbers={true}
              wrapLines={true}
              customStyle={{
                margin: 0,
                fontSize: '14px',
                lineHeight: '1.5',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                background: 'transparent',
              }}
              lineNumberStyle={{
                minWidth: '3em',
                paddingRight: '1em',
                userSelect: 'none',
                opacity: 0.5,
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Press Ctrl/Cmd + C to copy • ESC to close
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}