import React from "react";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface DocumentUploadProps {
  files: { biFront?: File; biBack?: File };
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, field: 'biFront' | 'biBack') => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ files, onFileChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <FormLabel>BI (Frente)</FormLabel>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange(e, 'biFront')}
            className="hidden"
            id="biFront"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 px-3 flex items-center gap-2"
            onClick={() => document.getElementById('biFront')?.click()}
          >
            <Upload size={16} />
            <span>Explorar...</span>
          </Button>
          <span className="text-sm text-muted-foreground truncate max-w-[180px]">
            {files.biFront?.name || "Nenhum ficheiro selecionado"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <FormLabel>BI (Verso)</FormLabel>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange(e, 'biBack')}
            className="hidden"
            id="biBack"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 px-3 flex items-center gap-2"
            onClick={() => document.getElementById('biBack')?.click()}
          >
            <Upload size={16} />
            <span>Explorar...</span>
          </Button>
          <span className="text-sm text-muted-foreground truncate max-w-[180px]">
            {files.biBack?.name || "Nenhum ficheiro selecionado"}
          </span>
        </div>
      </div>
    </div>
  );
};
