
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileImage, File, Download } from 'lucide-react';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExportFormat: (format: 'svg' | 'png' | 'jpg' | 'jpeg') => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onOpenChange,
  onExportFormat,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Diagram</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 gap-2"
            onClick={() => onExportFormat('svg')}
          >
            <File className="h-8 w-8 text-blue-500" />
            <span>SVG Format</span>
            <span className="text-xs text-muted-foreground">Vector graphics</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 gap-2"
            onClick={() => onExportFormat('png')}
          >
            <FileImage className="h-8 w-8 text-green-500" />
            <span>PNG Format</span>
            <span className="text-xs text-muted-foreground">Transparent background</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 gap-2"
            onClick={() => onExportFormat('jpg')}
          >
            <FileImage className="h-8 w-8 text-orange-500" />
            <span>JPG Format</span>
            <span className="text-xs text-muted-foreground">Smaller file size</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 gap-2"
            onClick={() => onExportFormat('jpeg')}
          >
            <FileImage className="h-8 w-8 text-purple-500" />
            <span>JPEG Format</span>
            <span className="text-xs text-muted-foreground">Standard image format</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
