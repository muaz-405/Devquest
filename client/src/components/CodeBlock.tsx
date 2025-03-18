import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const codeRef = useRef<HTMLPreElement>(null);
  const { toast } = useToast();

  // Simple utility to escape HTML entities
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  useEffect(() => {
    // Try to highlight with Prism if it's available
    const highlight = () => {
      if (typeof window !== 'undefined' && 
          window.Prism && 
          codeRef.current && 
          typeof window.Prism.highlightElement === 'function') {
        try {
          window.Prism.highlightElement(codeRef.current);
        } catch (err) {
          console.error('Prism highlighting error:', err);
        }
      }
    };

    // Run once on mount
    highlight();

    // Set up a fallback timer in case Prism loads later
    const timer = setTimeout(highlight, 500);
    return () => clearTimeout(timer);
  }, [code, language]);

  const copyToClipboard = () => {
    if (code) {
      navigator.clipboard.writeText(code).then(
        () => {
          toast({
            title: "Copied to clipboard",
            description: "Code has been copied to your clipboard",
          });
        },
        (err) => {
          console.error('Could not copy text: ', err);
          toast({
            title: "Copy failed",
            description: "Could not copy code to clipboard",
            variant: "destructive",
          });
        }
      );
    }
  };

  // If Prism fails, we'll at least have a properly formatted code block
  const safeCode = escapeHtml(code);

  return (
    <div className="code-block relative rounded-md bg-[#1e293b] overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-[#1e1e3f] text-white text-sm">
        <span>{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 text-white hover:text-white hover:bg-[#2d3748]"
        >
          <Copy className="h-4 w-4 mr-1" />
          <span>Copy</span>
        </Button>
      </div>
      <pre ref={codeRef} className={`language-${language} p-4 m-0 overflow-x-auto`}>
        <code dangerouslySetInnerHTML={{ __html: safeCode }} />
      </pre>
    </div>
  );
}
