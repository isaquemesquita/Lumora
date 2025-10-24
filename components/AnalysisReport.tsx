import { AlertTriangle, CheckCircle2, HelpCircle, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Card } from './ui/card';

interface Finding {
  type: string;
  icon: string;
  title: string;
  explain: string;
  impact: string;
  weight: number;
}

interface AnalysisReportProps {
  aiProbability: number;
  confidence: number;
  findings: Finding[];
  onReset: () => void;
}

export function AnalysisReport({ aiProbability, confidence, findings, onReset }: AnalysisReportProps) {
  const isAI = aiProbability > 70;
  const isReal = aiProbability < 30;
  const isInconclusive = !isAI && !isReal;

  const VerdictIcon = isAI ? AlertTriangle : isReal ? CheckCircle2 : HelpCircle;
  const verdictColor = isAI ? 'text-red-500' : isReal ? 'text-emerald-500' : 'text-amber-500';
  const verdictBg = isAI ? 'from-red-500/20' : isReal ? 'from-emerald-500/20' : 'from-amber-500/20';
  
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Verdict Card */}
      <Card className={`relative overflow-hidden border-white/10 bg-gradient-to-br ${verdictBg} to-transparent p-12 text-center backdrop-blur-xl`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
        
        <div className="relative z-10">
          <VerdictIcon className={`mx-auto mb-6 h-20 w-20 ${verdictColor} animate-pulse`} />
          
          <div className={`mb-3 ${verdictColor}`}>
            {isAI && 'PROVAVELMENTE IA'}
            {isReal && 'PROVAVELMENTE REAL'}
            {isInconclusive && 'INCONCLUSIVO'}
          </div>
          
          <p className="text-gray-400">
            {isAI && `${aiProbability.toFixed(1)}% de chance de ser gerada por IA`}
            {isReal && `${(100 - aiProbability).toFixed(1)}% de chance de ser uma foto real`}
            {isInconclusive && 'Não foi possível determinar com certeza'}
          </p>
        </div>
      </Card>

      {/* Confidence Meters */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="mb-4 text-center">
            <div className={`${confidence > 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
              {confidence.toFixed(0)}%
            </div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Confiança da Análise
            </p>
          </div>
          <Progress value={confidence} className="h-2" />
        </Card>

        <Card className="border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="mb-4 text-center">
            <div className={aiProbability > 70 ? 'text-red-500' : 'text-emerald-500'}>
              {aiProbability.toFixed(1)}%
            </div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Probabilidade de IA
            </p>
          </div>
          <Progress value={aiProbability} className="h-2" />
        </Card>
      </div>

      {/* Findings */}
      <Card className="border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-amber-400" />
          <span className="text-gray-200">Por que chegamos neste resultado?</span>
        </div>

        <div className="space-y-4">
          {findings.sort((a, b) => b.weight - a.weight).map((finding, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-amber-500/30 hover:bg-white/[0.04]"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-500 to-transparent opacity-50" />
              
              <div className="flex items-start gap-4">
                <span className="text-2xl">{finding.icon}</span>
                <div className="flex-1">
                  <div className="mb-1 text-gray-200">{finding.title}</div>
                  <p className="text-sm text-gray-500">{finding.explain}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Limitations */}
      <Card className="border-red-500/20 bg-red-500/5 p-6 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-2 text-red-400">
          <AlertTriangle className="h-5 w-5" />
          <span>Limitações Conhecidas</span>
        </div>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>• Compressão de redes sociais reduz precisão</li>
          <li>• Arte digital pode ser marcada como IA</li>
          <li>• Deepfakes profissionais podem passar</li>
          <li>• Geradores novos podem enganar</li>
          <li>• Não detecta manipulações tradicionais</li>
        </ul>
      </Card>

      {/* Actions */}
      <div className="flex justify-center">
        <Button
          onClick={onReset}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
        >
          🔄 Analisar Outra Imagem
        </Button>
      </div>
    </div>
  );
}
