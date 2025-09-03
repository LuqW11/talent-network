"use client";

import Button from "./ui/Button";

interface SaveFileButtonProps {
  filename: string;
  content: string;
  onSave?: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function SaveFileButton({ 
  filename, 
  content, 
  onSave, 
  children, 
  className = "" 
}: SaveFileButtonProps) {
  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onSave?.();
  };

  return (
    <Button 
      variant="secondary" 
      size="sm" 
      onClick={handleSave} 
      className={className}
    >
      {children}
    </Button>
  );
}