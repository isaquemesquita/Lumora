interface Finding {
  type: string;
  icon: string;
  title: string;
  explain: string;
  impact: string;
  weight: number;
}

interface AnalysisResult {
  findings: Finding[];
  scores: { ai: number; real: number };
  confidence: number;
  aiProbability: number;
}

function calculateCorrelation(array1: number[], array2: number[]): number {
  const n = array1.length;
  let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0;
  
  for (let i = 0; i < n; i++) {
    sum1 += array1[i];
    sum2 += array2[i];
    sum1Sq += array1[i] * array1[i];
    sum2Sq += array2[i] * array2[i];
    pSum += array1[i] * array2[i];
  }
  
  const num = pSum - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  
  return den === 0 ? 0 : num / den;
}

export async function analyzeImage(
  file: File,
  dataUrl: string,
  onProgress?: (percent: number, message: string) => void
): Promise<AnalysisResult> {
  const findings: Finding[] = [];
  const scores = { ai: 0, real: 0 };
  let confidence = 0;

  // Load image
  const img = new Image();
  img.src = dataUrl;
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  onProgress?.(30, '📋 Extraindo metadados...');

  // Setup canvas
  const canvas = document.createElement('canvas');
  const maxDim = 1024;
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  canvas.width = Math.floor(img.width * scale);
  canvas.height = Math.floor(img.height * scale);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  onProgress?.(50, '🔬 Analisando padrões de pixels...');

  // DETECTION 1: Filename Analysis
  const criticalKeywords = ['chatgpt', 'gpt', 'dalle', 'dall-e', 'midjourney', 'stablediffusion', 'stable-diffusion'];
  const filename = file.name.toLowerCase();
  
  const criticalMatch = criticalKeywords.find(k => filename.includes(k));
  if (criticalMatch) {
    findings.push({
      type: 'critical',
      icon: '🚨',
      title: `Nome do arquivo contém "${criticalMatch.toUpperCase()}"`,
      explain: 'O nome do arquivo indica claramente que foi gerado por IA. Geradores costumam adicionar suas marcas no nome.',
      impact: 'ai',
      weight: 180
    });
    scores.ai += 180;
    confidence += 30;
  }

  // DETECTION 2: Noise Analysis
  let totalNoise = 0;
  let noiseCount = 0;
  
  for (let y = 10; y < canvas.height - 10; y += 6) {
    for (let x = 10; x < canvas.width - 10; x += 6) {
      const idx = (y * canvas.width + x) * 4;
      const neighbors: number[] = [];
      for (let dy = -2; dy <= 2; dy += 2) {
        for (let dx = -2; dx <= 2; dx += 2) {
          const nIdx = ((y + dy) * canvas.width + (x + dx)) * 4;
          neighbors.push((pixels[nIdx] + pixels[nIdx + 1] + pixels[nIdx + 2]) / 3);
        }
      }
      const mean = neighbors.reduce((a, b) => a + b) / neighbors.length;
      const variance = neighbors.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / neighbors.length;
      totalNoise += Math.sqrt(variance);
      noiseCount++;
    }
  }
  
  const avgNoise = totalNoise / noiseCount;

  onProgress?.(65, '🧠 Aplicando algoritmos de detecção...');

  if (avgNoise < 2.5) {
    findings.push({
      type: 'high',
      icon: '⚠️',
      title: 'Imagem extremamente lisa e uniforme',
      explain: 'Fotos de câmera real sempre têm ruído natural do sensor. Esta imagem está artificialmente lisa, característico de IA.',
      impact: 'ai',
      weight: 95
    });
    scores.ai += 95;
    confidence += 25;
  } else if (avgNoise > 7) {
    findings.push({
      type: 'good',
      icon: '✅',
      title: 'Ruído natural de sensor detectado',
      explain: 'A imagem apresenta variações naturais típicas de fotos reais tiradas por câmeras físicas.',
      impact: 'real',
      weight: 90
    });
    scores.real += 90;
    confidence += 25;
  } else if (avgNoise > 4.5) {
    findings.push({
      type: 'neutral',
      icon: 'ℹ️',
      title: 'Nível de ruído moderado',
      explain: 'Pode ser foto real comprimida ou IA com ruído adicionado artificialmente.',
      impact: 'real',
      weight: 40
    });
    scores.real += 40;
    confidence += 10;
  } else {
    findings.push({
      type: 'warning',
      icon: '⚡',
      title: 'Ruído baixo detectado',
      explain: 'Menos ruído do que esperado para foto real. Pode indicar IA ou edição pesada.',
      impact: 'ai',
      weight: 55
    });
    scores.ai += 55;
    confidence += 15;
  }

  // DETECTION 3: Color Analysis
  const colorData = { r: [] as number[], g: [] as number[], b: [] as number[] };
  
  for (let i = 0; i < pixels.length; i += 30) {
    colorData.r.push(pixels[i]);
    colorData.g.push(pixels[i + 1]);
    colorData.b.push(pixels[i + 2]);
  }

  const corrRG = calculateCorrelation(colorData.r, colorData.g);
  const corrRB = calculateCorrelation(colorData.r, colorData.b);
  const corrGB = calculateCorrelation(colorData.g, colorData.b);
  const avgCorr = (corrRG + corrRB + corrGB) / 3;

  onProgress?.(80, '🎨 Analisando distribuição de cores...');

  if (avgCorr > 0.96) {
    findings.push({
      type: 'high',
      icon: '🎨',
      title: 'Cores artificialmente correlacionadas',
      explain: 'Os canais de cor estão muito sincronizados, o que não acontece em fotos naturais. Típico de IA.',
      impact: 'ai',
      weight: 70
    });
    scores.ai += 70;
    confidence += 20;
  } else if (avgCorr < 0.7) {
    findings.push({
      type: 'good',
      icon: '🌈',
      title: 'Distribuição natural de cores',
      explain: 'As cores apresentam variação independente, como esperado em cenas reais.',
      impact: 'real',
      weight: 60
    });
    scores.real += 60;
    confidence += 15;
  }

  // DETECTION 4: Edge Analysis
  const edgeStrengths: number[] = [];
  
  for (let y = 2; y < canvas.height - 2; y += 4) {
    for (let x = 2; x < canvas.width - 2; x += 4) {
      const idx = (y * canvas.width + x) * 4;
      const center = pixels[idx];
      const right = pixels[idx + 4] || center;
      const bottom = pixels[idx + canvas.width * 4] || center;
      const edge = Math.abs(center - right) + Math.abs(center - bottom);
      edgeStrengths.push(edge);
    }
  }

  const avgEdge = edgeStrengths.reduce((a, b) => a + b) / edgeStrengths.length;
  const edgeStdDev = Math.sqrt(
    edgeStrengths.reduce((s, v) => s + Math.pow(v - avgEdge, 2), 0) / edgeStrengths.length
  );

  onProgress?.(90, '📐 Analisando bordas e texturas...');

  if (edgeStdDev < 12) {
    findings.push({
      type: 'warning',
      icon: '📐',
      title: 'Bordas uniformes demais',
      explain: 'As bordas têm consistência artificial. Fotos reais têm bordas mais variadas.',
      impact: 'ai',
      weight: 50
    });
    scores.ai += 50;
    confidence += 15;
  } else if (edgeStdDev > 30) {
    findings.push({
      type: 'good',
      icon: '🔲',
      title: 'Complexidade natural de bordas',
      explain: 'Padrão de bordas irregular típico de cenas fotografadas',
      impact: 'real',
      weight: 65
    });
    scores.real += 65;
    confidence += 20;
  }

  // DETECTION 5: Pattern Detection
  let artificialPatterns = 0;
  const blockSize = 8;
  
  for (let y = 0; y < canvas.height - blockSize; y += blockSize) {
    for (let x = 0; x < canvas.width - blockSize; x += blockSize) {
      const blockValues: number[] = [];
      for (let by = 0; by < blockSize; by++) {
        for (let bx = 0; bx < blockSize; bx++) {
          const idx = ((y + by) * canvas.width + (x + bx)) * 4;
          blockValues.push(pixels[idx]);
        }
      }
      
      const blockMean = blockValues.reduce((a, b) => a + b) / blockValues.length;
      const deviation = blockValues.reduce((s, v) => s + Math.abs(v - blockMean), 0) / blockValues.length;
      
      if (deviation < 3) artificialPatterns++;
    }
  }

  const patternRatio = artificialPatterns / ((canvas.width * canvas.height) / (blockSize * blockSize));
  
  if (patternRatio > 0.4) {
    findings.push({
      type: 'high',
      icon: '🤖',
      title: 'Padrões artificiais detectados',
      explain: 'Foram encontrados padrões muito regulares e repetitivos, característicos de imagens geradas por IA',
      impact: 'ai',
      weight: 85
    });
    scores.ai += 85;
    confidence += 25;
  }

  onProgress?.(100, '✅ Finalizando análise...');

  // Calculate final result
  const total = scores.ai + scores.real;
  const aiProbability = total > 0 ? (scores.ai / total) * 100 : 50;
  confidence = Math.min(100, confidence);

  return {
    findings,
    scores,
    confidence,
    aiProbability
  };
}
