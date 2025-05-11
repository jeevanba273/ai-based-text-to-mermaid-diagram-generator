import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import AIPrompt from '@/components/AIPrompt';
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { saveAs } from 'file-saver';

const DEFAULT_DIAGRAM = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[Alternative Action]
    C --> E[Result]
    D --> E`;

const Index = () => {
  const [code, setCode] = useState<string>(DEFAULT_DIAGRAM);
  const [prompt, setPrompt] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize theme on component mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Re-render the diagram with the new theme
    // This forces the Mermaid renderer to use the new theme
    const currentCode = code;
    setCode('');
    setTimeout(() => setCode(currentCode), 10);
  };

  const handleExport = (format: 'svg' | 'png' | 'jpg' | 'jpeg') => {
    try {
      const svgElement = document.querySelector('.diagram-container svg');
      if (!svgElement) {
        toast({
          title: "Export failed",
          description: "No diagram to export",
          variant: "destructive",
        });
        return;
      }
      
      // Generate filename from first line of diagram or use default
      let filename = `mermaid-diagram.${format}`;
      const firstLine = code.split('\n')[0];
      if (firstLine) {
        const cleanName = firstLine
          .replace(/[^\w\s]/gi, '')
          .trim()
          .replace(/\s+/g, '-')
          .toLowerCase();
        if (cleanName) {
          filename = `${cleanName}.${format}`;
        }
      }
      
      if (format === 'svg') {
        // Direct SVG export
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        saveAs(svgBlob, filename);
        
        toast({
          title: "Export successful",
          description: `Saved as ${filename}`,
        });
      } else {
        // For bitmap formats (PNG, JPG, JPEG), we need to convert SVG to canvas first
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set dimensions based on SVG viewBox or size
        const svgRect = svgElement.getBoundingClientRect();
        canvas.width = svgRect.width * 2; // 2x for better resolution
        canvas.height = svgRect.height * 2;
        
        if (ctx) {
          // For JPG/JPEG, fill with white background (SVG default is transparent)
          if (format === 'jpg' || format === 'jpeg') {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          
          // Create image from SVG
          const img = new Image();
          const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
          const url = URL.createObjectURL(svgBlob);
          
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            
            // Convert canvas to the requested format
            const mimeType = `image/${format}`;
            canvas.toBlob((blob) => {
              if (blob) {
                saveAs(blob, filename);
                toast({
                  title: "Export successful",
                  description: `Saved as ${filename}`,
                });
              } else {
                toast({
                  title: "Export failed",
                  description: `Failed to convert to ${format.toUpperCase()}`,
                  variant: "destructive",
                });
              }
            }, mimeType, 0.95); // 0.95 quality for JPEG
          };
          
          img.src = url;
        } else {
          throw new Error("Could not get canvas context");
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Failed to export diagram",
        variant: "destructive",
      });
    }
  };

  const handleDiagramGenerated = (generatedCode: string) => {
    setCode(generatedCode);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 animate-fade-in">
      <Header 
        onExport={handleExport} 
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      
      <main className="flex-1 container py-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <div className="glass-panel p-4 flex flex-col animate-slide-in">
            <Editor 
              value={code} 
              onChange={setCode} 
              className="flex-1"
              promptValue={prompt}
              onPromptChange={setPrompt}
            />
            <Separator className="my-4" />
            <AIPrompt 
              prompt={prompt} 
              onDiagramGenerated={handleDiagramGenerated} 
            />
          </div>
          
          <div className="glass-panel p-4 flex flex-col animate-slide-in" style={{ animationDelay: '100ms' }}>
            <Preview code={code} className="flex-1" />
          </div>
        </div>
        
        <div className="glass-panel p-4 text-center text-sm text-slate-500 dark:text-slate-400 animate-slide-in" style={{ animationDelay: '200ms' }}>
          <p>
            Create beautiful diagrams with Mermaid syntax and AI assistance. 
            Made with precision and care.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
