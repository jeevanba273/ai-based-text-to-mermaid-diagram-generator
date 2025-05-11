
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Github, Moon, Sun } from "lucide-react";
import ExportDialog from './ExportDialog';

interface HeaderProps {
  onExport: (format: 'svg' | 'png' | 'jpg' | 'jpeg') => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onExport,
  toggleTheme,
  isDarkMode
}) => {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  
  return <header className="w-full py-4 px-6 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm bg-white/50 dark:bg-black/30 animate-fade-in">
      <div className="container max-w-full flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center overflow-hidden ml-[-8px]">
            <img 
              src="/lovable-uploads/9623232f-0e6e-4eee-98d7-5719878bf959.png" 
              alt="Mermaid Diagram Creator Logo" 
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="text-xl font-medium">Mermaid Diagram Creator</h1>
          <div className="flex items-center gap-2">
            <div className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">AI Powered</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="glass-button" onClick={toggleTheme}>
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="glass-button" 
            onClick={() => setExportDialogOpen(true)}
          >
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="glass-button" asChild>
            
          </Button>

          <ExportDialog 
            open={exportDialogOpen}
            onOpenChange={setExportDialogOpen}
            onExportFormat={onExport}
          />
        </div>
      </div>
    </header>;
};

export default Header;
