import { Card } from './ui/card';

interface ImagePreviewProps {
  src: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export function ImagePreview({ src, fileName, fileSize, fileType }: ImagePreviewProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="group relative overflow-hidden rounded-2xl">
        <img
          src={src}
          alt="Preview"
          className="h-full w-full rounded-2xl border border-white/10 object-contain shadow-2xl transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <Card className="border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
        <div className="mb-4 text-gray-200">📋 Informações da Imagem</div>
        <div className="space-y-3">
          <div className="flex justify-between border-b border-white/5 pb-3 text-sm">
            <span className="text-gray-500">Nome:</span>
            <span className="text-gray-300">{fileName}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-3 text-sm">
            <span className="text-gray-500">Tamanho:</span>
            <span className="text-gray-300">{(fileSize / 1024).toFixed(1)} KB</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tipo:</span>
            <span className="text-gray-300">{fileType}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
