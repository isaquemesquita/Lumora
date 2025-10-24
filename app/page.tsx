'use client';

import { useState, useEffect } from 'react';
import { MouseSpotlight } from '@/components/MouseSpotlight';
import { DetectorUpload } from '@/components/DetectorUpload';
import { ImagePreview } from '@/components/ImagePreview';
import { LoadingAnalysis } from '@/components/LoadingAnalysis';
import { AnalysisReport } from '@/components/AnalysisReport';
import { LumoraLogo } from '@/components/LumoraLogo';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Lightbulb } from 'lucide-react';

type AppState = 'upload' | 'preview' | 'analyzing' | 'results';

interface FileData {
  file: File;
  dataUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

interface Finding {
  type: string;
  icon: string;
  title: string;
  explain: string;
  impact: string;
  weight: number;
}

interface AnalysisData {
  aiProbability: number;
  confidence: number;
  findings: Finding[];
}

export default function Home() {
  const [state, setState] = useState<AppState>('upload');
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [backendActive, setBackendActive] = useState(false);

  // Verificar backend ao carregar
  useEffect(() => {
    checkBackend();
  }, []);

  async function checkBackend() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/health`);
      if (res.ok) {
        setBackendActive(true);
      }
    } catch (error) {
      console.log('Backend não detectado, usando análise client-side');
    }
  }

  const handleFileSelect = async (file: File) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      
      setFileData({
        file,
        dataUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
      
      setState('preview');
      
      // Start analysis automatically
      setTimeout(async () => {
        setState('analyzing');
        setProgress(0);
        setProgressMessage('Inicializando análise...');
        
        try {
          let result: AnalysisData;
          
          if (backendActive) {
            // Usar backend Python
            result = await analyzeWithBackend(file, dataUrl);
          } else {
            // Usar análise client-side
            const { analyzeImage } = await import('@/lib/imageAnalysis');
            result = await analyzeImage(file, dataUrl, (percent, message) => {
              setProgress(percent);
              setProgressMessage(message);
            });
          }
          
          setAnalysisData(result);
          setState('results');
        } catch (error) {
          console.error('Erro na análise:', error);
          alert('Erro ao analisar a imagem. Por favor, tente outra.');
          handleReset();
        }
      }, 1000);
    };
    
    reader.readAsDataURL(file);
  };

  async function analyzeWithBackend(file: File, dataUrl: string): Promise<AnalysisData> {
    const formData = new FormData();
    formData.append('image', file);

    setProgressMessage('Enviando para servidor...');
    setProgress(30);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Erro na análise do backend');
    }

    setProgress(70);
    setProgressMessage('Processando resultados...');

    const data = await res.json();
    setProgress(100);
    
    return {
      aiProbability: data.aiProbability,
      confidence: data.confidence,
      findings: data.findings
    };
  }

  const handleReset = () => {
    setState('upload');
    setFileData(null);
    setAnalysisData(null);
    setProgress(0);
    setProgressMessage('');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Animated background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/5 blur-3xl delay-1000" />
      </div>

      {/* Mouse spotlight effect */}
      <MouseSpotlight />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center justify-center gap-4">
            <LumoraLogo size={72} />
            <h1 className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-5xl tracking-tight text-transparent">
              LUMORA
            </h1>
          </div>
          
          <div className="mb-2 inline-block rounded-full bg-gradient-to-r from-amber-500/20 to-blue-500/20 px-4 py-1 text-xs tracking-widest text-amber-400">
            {backendActive ? 'MODO AVANÇADO' : 'BETA'}
          </div>
          
          <p className="mb-2 text-gray-400">
            Detector de Imagens Geradas por IA
          </p>
          <p className="text-sm text-gray-600">
            Ferramenta educacional de análise forense digital
          </p>
        </header>

        {/* Warning & Info Cards */}
        <div className="mb-8 space-y-4">
          <Card className="border-amber-500/20 bg-amber-500/5 p-5 backdrop-blur-xl">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
              <div className="text-sm text-gray-400">
                <span className="text-amber-400">IMPORTANTE:</span> Esta é uma ferramenta {backendActive ? 'avançada com ML' : 'BETA educacional'}. 
                Não substitui análise forense profissional. Taxa de precisão estimada: <span className="text-amber-300">{backendActive ? '85-95%' : '70-85%'}</span> em condições ideais.
              </div>
            </div>
          </Card>

          <Card className="border-blue-500/20 bg-blue-500/5 p-5 backdrop-blur-xl">
            <div className="flex gap-3">
              <Lightbulb className="h-5 w-5 flex-shrink-0 text-blue-400" />
              <div className="text-sm text-gray-400">
                <span className="text-blue-400">DICA:</span> Para melhores resultados, use imagens{' '}
                <span className="text-blue-300">originais e não comprimidas</span>. 
                Fotos tiradas diretamente da câmera têm maior precisão.
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {state === 'upload' && (
            <DetectorUpload onFileSelect={handleFileSelect} />
          )}

          {state === 'preview' && fileData && (
            <ImagePreview
              src={fileData.dataUrl}
              fileName={fileData.fileName}
              fileSize={fileData.fileSize}
              fileType={fileData.fileType}
            />
          )}

          {state === 'analyzing' && (
            <LoadingAnalysis progress={progress} message={progressMessage} />
          )}

          {state === 'results' && analysisData && (
            <AnalysisReport
              aiProbability={analysisData.aiProbability}
              confidence={analysisData.confidence}
              findings={analysisData.findings}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Footer Philosophy */}
        <footer className="mt-16 text-center">
          <div className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl">
            <div className="mb-4 text-amber-400">✨ Nossa Filosofia</div>
            <p className="text-sm leading-relaxed text-gray-400">
              Lumora representa a luz da razão em um oceano de ilusões. Como um farol, 
              não apenas apontamos o perigo, mas guiamos para a segurança, simbolizando 
              esperança e estabilidade em um mundo onde a realidade é constantemente desafiada.
            </p>
            <p className="text-xs text-gray-600">
              Restaurando a verdade como um valor universal.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
