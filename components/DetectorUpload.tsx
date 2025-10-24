import { Upload } from 'lucide-react';

interface DetectorUploadProps {
  onFileSelect: (file: File) => void;
}

export function DetectorUpload({ onFileSelect }: DetectorUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndProcess(file);
  };

  const validateAndProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem (JPG, PNG, GIF, WEBP).');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande! Máximo: 10MB');
      return;
    }
    
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) validateAndProcess(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <label
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="group relative block cursor-pointer"
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] p-16 text-center transition-all duration-500 hover:border-amber-500/50 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-amber-500/10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <div className="relative z-10">
          <div className="mb-6 inline-flex rounded-full bg-gradient-to-br from-amber-500/20 to-blue-500/20 p-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
            <Upload className="h-12 w-12 text-amber-400" />
          </div>
          
          <h3 className="mb-3 bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-xl text-transparent">
            Clique ou arraste uma imagem
          </h3>
          
          <p className="text-sm text-gray-500">
            Formatos: JPG, PNG, GIF, WEBP • Máximo: 10MB
          </p>
        </div>
      </div>
    </label>
  );
}
