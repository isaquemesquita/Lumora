import { Progress } from './ui/progress';

interface LoadingAnalysisProps {
  progress: number;
  message: string;
}

export function LoadingAnalysis({ progress, message }: LoadingAnalysisProps) {
  return (
    <div className="space-y-6 py-12 text-center animate-in fade-in duration-500">
      <div className="inline-flex rounded-full bg-gradient-to-br from-amber-500/20 to-blue-500/20 p-8">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-amber-500/30 border-t-amber-500" />
      </div>
      
      <div>
        <div className="mb-4 bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
          Analisando imagem...
        </div>
        <p className="text-sm text-gray-500">{message}</p>
      </div>

      <div className="mx-auto max-w-md">
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
}
