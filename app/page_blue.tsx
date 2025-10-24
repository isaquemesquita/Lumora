'use client';

import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

interface Finding {
  type: string;
  icon: string;
  title: string;
  explain: string;
  impact: 'ai' | 'real' | 'error';
  weight: number;
}

interface AnalysisResult {
  findings: Finding[];
  scores: { ai: number; real: number };
  confidence: number;
  aiProbability: number;
  exif: Record<string, string>;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [backendActive, setBackendActive] = useState(false);
  const [progress, setProgress] = useState(0);

  useState(() => {
    checkBackend();
  });

  async function checkBackend() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
      if (res.ok) {
        setBackendActive(true);
      }
    } catch (error) {
      console.log('Backend não detectado');
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 10MB.');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);
  }

  async function analyzeImage() {
    if (!file) return;

    setAnalyzing(true);
    setResult(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        throw new Error('Erro na análise');
      }

      const data = await res.json();
      setResult(data);
    } catch (error) {
      clearInterval(progressInterval);
      alert('Erro ao analisar imagem. Verifique se o backend está rodando.');
    } finally {
      setAnalyzing(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview('');
    setResult(null);
    setProgress(0);
  }

  return (
    <main className="min-h-screen p-8 md:p-10 relative z-10">
      <div className="mx-auto max-w-3xl bg-[var(--glass)] backdrop-blur-3xl rounded-2xl shadow-2xl p-12 border border-[var(--border)] animate-[fadeIn_0.6s_ease-out]">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-[var(--primary-light)] to-[var(--accent-light)] bg-clip-text text-transparent leading-tight tracking-tight">
            🛡️ LUMORA <span className="inline-block bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] text-[var(--bg-start)] px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase ml-3 shadow-lg animate-[pulse_3s_ease-in-out_infinite]">BETA</span>
          </h1>
          <p className="text-lg font-medium text-[var(--text-muted)] mb-2">
            Detector de Imagens Geradas por IA
          </p>
          <p className="text-sm text-[var(--text-dim)]">
            Ferramenta educacional de análise forense digital
          </p>
        </div>

        {/* Warning Box */}
        <div className="bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.2)] rounded-xl p-5 mb-5 text-sm text-[#fbbf24] relative overflow-hidden transition-all hover:translate-y-[-2px] hover:shadow-lg">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#f59e0b] to-transparent"></div>
          <strong className="text-[var(--text)] font-bold">⚠️ IMPORTANTE:</strong> Esta é uma ferramenta BETA educacional. Não substitui análise forense profissional.
          Taxa de precisão estimada: <strong className="text-[var(--text)]">70-85%</strong> em condições ideais.
          Fotos de redes sociais (WhatsApp, Instagram) têm precisão reduzida devido à compressão.
        </div>

        {/* Info Box */}
        <div className="bg-[rgba(59,130,246,0.06)] border border-[rgba(59,130,246,0.2)] rounded-xl p-5 mb-5 text-sm text-[#93c5fd] relative overflow-hidden transition-all hover:translate-y-[-2px] hover:shadow-lg">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--primary)] to-transparent"></div>
          <strong className="text-[var(--text)] font-bold">💡 DICA:</strong> Para melhores resultados, use imagens <strong className="text-[var(--text)]">originais e não comprimidas</strong>.
          Fotos tiradas diretamente da câmera/celular antes de enviar por apps de mensagem têm maior precisão.
        </div>

        {/* Backend Status */}
        {backendActive && (
          <div className="bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.2)] rounded-xl p-5 mb-5 text-sm text-[#34d399] relative overflow-hidden transition-all hover:translate-y-[-2px] hover:shadow-lg">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--success)] to-transparent"></div>
            <strong className="text-[var(--text)] font-bold">🚀 MODO AVANÇADO:</strong> Usando backend Python com Machine Learning.
            <strong className="text-[var(--text)]"> Precisão aumentada para 85-95%!</strong>
          </div>
        )}

        {/* Upload Area */}
        {!file && (
          <label className="block border-2 border-dashed border-[var(--border-strong)] rounded-2xl p-16 text-center cursor-pointer bg-[var(--surface)] transition-all duration-300 hover:bg-[var(--surface-hover)] hover:border-[var(--primary)] hover:translate-y-[-4px] hover:shadow-xl hover:shadow-[rgba(59,130,246,0.4)] relative overflow-hidden my-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)] opacity-0 hover:opacity-5 transition-opacity"></div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="text-7xl mb-6 grayscale-[0.3] transition-all hover:scale-110 hover:rotate-6 hover:grayscale-0">
              📸
            </div>
            <div className="text-2xl font-bold text-[var(--text)] mb-3 tracking-tight">
              Clique ou arraste uma imagem
            </div>
            <div className="text-sm text-[var(--text-dim)]">
              Formatos: JPG, PNG, GIF, WEBP • Máximo: 10MB
            </div>
          </label>
        )}

        {/* Preview */}
        {file && !analyzing && !result && (
          <div className="my-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-start)] aspect-square object-contain shadow-2xl transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]"
                />
              </div>
              <div className="bg-[var(--surface-strong)] p-6 rounded-2xl border border-[var(--border)] flex flex-col gap-1">
                <h3 className="text-base font-bold text-[var(--text)] mb-4 tracking-tight">
                  📋 Informações da Imagem
                </h3>
                <div className="flex justify-between py-3 border-b border-[var(--border)] text-sm transition-all hover:pl-2 hover:text-[var(--primary-light)]">
                  <span className="text-[var(--text-muted)] font-medium">Nome</span>
                  <span className="text-[var(--text)] font-semibold">{file.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-[var(--border)] text-sm transition-all hover:pl-2 hover:text-[var(--primary-light)]">
                  <span className="text-[var(--text-muted)] font-medium">Tamanho</span>
                  <span className="text-[var(--text)] font-semibold">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex justify-between py-3 text-sm transition-all hover:pl-2 hover:text-[var(--primary-light)]">
                  <span className="text-[var(--text-muted)] font-medium">Tipo</span>
                  <span className="text-[var(--text)] font-semibold">{file.type}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={analyzeImage}
                className="flex-1 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-[rgba(59,130,246,0.3)] hover:translate-y-[-2px] hover:shadow-xl hover:shadow-[rgba(59,130,246,0.4)] transition-all relative overflow-hidden">
                <span className="relative z-10">🔍 Analisar Imagem</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
              </button>
              <button
                onClick={reset}
                className="bg-[var(--surface-strong)] border border-[var(--border-strong)] text-[var(--text)] font-semibold py-4 px-8 rounded-xl hover:bg-[var(--surface-hover)] hover:border-[var(--primary)] hover:shadow-lg hover:shadow-[rgba(59,130,246,0.2)] transition-all">
                🔄 Nova Imagem
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {analyzing && (
          <div className="text-center py-12 animate-[fadeIn_0.4s_ease-out]">
            <div className="text-xl font-bold text-[var(--text)] mb-6 tracking-tight">
              🔍 Analisando imagem...
            </div>
            <div className="w-full h-2 bg-[var(--surface-strong)] rounded-full overflow-hidden border border-[var(--border)] relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_infinite]"></div>
              <div
                className="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--primary-light)] to-[var(--accent)] rounded-full transition-all duration-300 relative overflow-hidden animate-[gradientShift_2s_ease_infinite]"
                style={{ width: `${progress}%`, backgroundSize: '200% 100%' }}
              ></div>
            </div>
            <div className="text-sm text-[var(--text-muted)] font-medium mt-4">
              {progress < 30 ? 'Inicializando análise...' : progress < 60 ? 'Processando imagem...' : progress < 90 ? 'Analisando padrões...' : 'Finalizando...'}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-10 animate-[fadeIn_0.6s_ease-out]">
            {/* Verdict */}
            <div className={`bg-gradient-to-br from-[var(--surface)] to-[var(--surface-strong)] rounded-2xl p-12 mb-8 border ${
              result.aiProbability > 50 ? 'border-[var(--danger)]' : 'border-[var(--success)]'
            } text-center shadow-2xl relative overflow-hidden`}>
              <div className={`absolute inset-0 ${
                result.aiProbability > 50 ? 'bg-[radial-gradient(circle_at_center,var(--danger)_0%,transparent_70%)]' : 'bg-[radial-gradient(circle_at_center,var(--success)_0%,transparent_70%)]'
              } opacity-5`}></div>
              <div className={`text-8xl mb-5 animate-[bounce_2s_ease-in-out_infinite] ${
                result.aiProbability > 50 ? 'drop-shadow-[0_4px_12px_var(--danger)]' : 'drop-shadow-[0_4px_12px_var(--success)]'
              }`}>
                {result.aiProbability > 50 ? '⚠️' : '✅'}
              </div>
              <div className={`text-4xl font-extrabold mb-3 tracking-tight leading-tight ${
                result.aiProbability > 50 ? 'text-[var(--danger)]' : 'text-[var(--success)]'
              }`}>
                {result.aiProbability > 50 ? 'Provável IA' : 'Provável Real'}
              </div>
              <div className="text-xl text-[var(--text-muted)] font-medium">
                {result.aiProbability.toFixed(1)}% de probabilidade de ser IA
              </div>
            </div>

            {/* Meters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className="bg-[var(--surface-strong)] p-6 rounded-2xl text-center border border-[var(--border)] transition-all hover:translate-y-[-4px] hover:shadow-lg hover:border-[var(--border-strong)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-transparent opacity-0 hover:opacity-5 transition-opacity"></div>
                <div className="text-[11px] text-[var(--text-dim)] uppercase tracking-widest font-bold mb-3">
                  SCORE IA
                </div>
                <div className="text-5xl font-extrabold text-[var(--danger)] my-2 tracking-tight leading-none">
                  {result.scores.ai}
                </div>
                <div className="w-full h-2 bg-[var(--surface)] rounded-full overflow-hidden mt-4 border border-[var(--border)]">
                  <div
                    className="h-full bg-[var(--danger)] rounded-full transition-all duration-1000 relative overflow-hidden"
                    style={{ width: `${result.scores.ai}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--surface-strong)] p-6 rounded-2xl text-center border border-[var(--border)] transition-all hover:translate-y-[-4px] hover:shadow-lg hover:border-[var(--border-strong)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--success)] to-transparent opacity-0 hover:opacity-5 transition-opacity"></div>
                <div className="text-[11px] text-[var(--text-dim)] uppercase tracking-widest font-bold mb-3">
                  SCORE REAL
                </div>
                <div className="text-5xl font-extrabold text-[var(--success)] my-2 tracking-tight leading-none">
                  {result.scores.real}
                </div>
                <div className="w-full h-2 bg-[var(--surface)] rounded-full overflow-hidden mt-4 border border-[var(--border)]">
                  <div
                    className="h-full bg-[var(--success)] rounded-full transition-all duration-1000 relative overflow-hidden"
                    style={{ width: `${result.scores.real}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--surface-strong)] p-6 rounded-2xl text-center border border-[var(--border)] transition-all hover:translate-y-[-4px] hover:shadow-lg hover:border-[var(--border-strong)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-transparent opacity-0 hover:opacity-5 transition-opacity"></div>
                <div className="text-[11px] text-[var(--text-dim)] uppercase tracking-widest font-bold mb-3">
                  CONFIANÇA
                </div>
                <div className="text-5xl font-extrabold text-[var(--primary-light)] my-2 tracking-tight leading-none">
                  {result.confidence.toFixed(0)}%
                </div>
                <div className="w-full h-2 bg-[var(--surface)] rounded-full overflow-hidden mt-4 border border-[var(--border)]">
                  <div
                    className="h-full bg-[var(--primary)] rounded-full transition-all duration-1000 relative overflow-hidden"
                    style={{ width: `${result.confidence}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Findings */}
            <div className="bg-[var(--surface-strong)] rounded-2xl p-8 border border-[var(--border-strong)] shadow-lg">
              <div className="text-2xl font-bold mb-6 flex items-center gap-3 text-[var(--text)] tracking-tight">
                <span className="text-3xl">🎯</span>
                <span>Por que chegamos neste resultado?</span>
              </div>
              <div className="flex flex-col gap-4">
                {result.findings.map((finding, i) => (
                  <div
                    key={i}
                    className={`p-5 rounded-xl flex items-start gap-4 bg-[var(--surface)] border transition-all hover:translate-x-1 hover:bg-[var(--surface-hover)] hover:shadow-sm hover:border-[var(--border-strong)] relative overflow-hidden ${
                      finding.impact === 'ai' ? 'border-[var(--danger)] text-[var(--danger)]' :
                      finding.impact === 'real' ? 'border-[var(--success)] text-[var(--success)]' :
                      'border-[var(--border)] text-[var(--text-dim)]'
                    }`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 opacity-60 ${
                      finding.impact === 'ai' ? 'bg-[var(--danger)]' :
                      finding.impact === 'real' ? 'bg-[var(--success)]' :
                      'bg-[var(--border)]'
                    }`}></div>
                    <div className="text-2xl flex-shrink-0 mt-0.5 drop-shadow-[0_2px_4px_currentColor]">
                      {finding.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="font-bold text-base text-[var(--text)] mb-1.5 leading-tight">
                        {finding.title}
                      </div>
                      <div className="text-sm text-[var(--text-muted)] leading-relaxed">
                        {finding.explain}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={reset}
                className="flex-1 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-[rgba(59,130,246,0.3)] hover:translate-y-[-2px] hover:shadow-xl hover:shadow-[rgba(59,130,246,0.4)] transition-all">
                📸 Analisar Nova Imagem
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
