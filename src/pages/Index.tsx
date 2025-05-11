import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import AIPrompt from '@/components/AIPrompt';
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { saveAs } from 'file-saver';
import { Github, Linkedin } from 'lucide-react';

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
        // For bitmap formats, we need to use a different approach to avoid tainted canvas issues
        
        // Get SVG data and create a Blob
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml'});
        
        // Convert SVG to a data URL
        const reader = new FileReader();
        reader.onload = function(e) {
          const dataUrl = e.target?.result as string;
          
          // Create an image from the data URL
          const img = new Image();
          img.onload = function() {
            // Create a canvas to draw the image
            const canvas = document.createElement('canvas');
            const svgRect = svgElement.getBoundingClientRect();
            canvas.width = svgRect.width * 2; // 2x for better resolution
            canvas.height = svgRect.height * 2;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              throw new Error("Could not get canvas context");
            }
            
            // For JPG/JPEG, fill with white background (SVG default is transparent)
            if (format === 'jpg' || format === 'jpeg') {
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Get the canvas data URL and convert to Blob
            const dataURL = canvas.toDataURL(`image/${format}`, 0.95);
            
            // Convert data URL to Blob
            const binaryString = atob(dataURL.split(',')[1]);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            
            const imageBlob = new Blob([bytes], {type: `image/${format}`});
            saveAs(imageBlob, filename);
            
            toast({
              title: "Export successful",
              description: `Saved as ${filename}`,
            });
          };
          
          img.src = dataUrl;
        };
        
        reader.readAsDataURL(svgBlob);
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
          <p className="mb-2">Create beautiful diagrams with Mermaid syntax and AI assistance.</p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <a href="https://github.com/jeevanba273" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
              <span className="sr-only">GitHub</span>
              <Github className="h-8 w-8" />
            </a>
            <a href="https://www.linkedin.com/in/jeevanba273/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-8 w-8" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
