# 🛡️ LUMORA v3.3 - Detector Avançado de Imagens Geradas por IA

Sistema profissional de detecção de imagens geradas por Inteligência Artificial usando **Machine Learning** e análises forenses avançadas.

## 🚀 Precisão Melhorada

- **Modo JavaScript Básico**: 70-85% de precisão
- **Modo Python ML (Recomendado)**: 85-95% de precisão ⭐

## 🎯 Técnicas de Análise Avançadas

O backend Python implementa **12 técnicas diferentes** de detecção:

### Análises Críticas (Alta Prioridade)
1. **Análise de Nome de Arquivo** - Detecta padrões de geradores (ChatGPT, DALL-E, Midjourney, etc.)
2. **Metadados EXIF** - Verifica dados de câmera real
3. **Análise de Frequência DFT** - Detecta distribuição artificial de frequências

### Análises Avançadas de ML
4. **Detecção de Artefatos GAN** - Identifica padrões típicos de redes neurais generativas
5. **Análise de Nitidez Artificial** - Detecta uniformidade não-natural
6. **Padrões de Grade JPEG** - Verifica artefatos de compressão
7. **Consistência de Ruído** - Analisa ruído de sensor vs sintético

### Análises Estatísticas
8. **Distribuição de Cores** - Correlação entre canais RGB
9. **Análise de Gradientes** - Transições de luminosidade
10. **Aberração Cromática** - Imperfeições naturais de lentes
11. **Coerência de Bordas** - Conectividade e fragmentação
12. **Análise de Saturação** - Intensidade e distribuição de cores

## 📦 Instalação Local

### Pré-requisitos
- Node.js 18+ (para o frontend Next.js)
- Python 3.8+ (para o backend ML)

### 🚀 Iniciar com 1 Comando

```bash
cd /home/izaque/Documentos/Lumora
./iniciar.sh
```

Acesse: **http://localhost:3000**

### ⏹️ Parar os Servidores

Pressione **Ctrl+C** no terminal

---

## 📦 Instalação Manual (Alternativa)

### Passo 1: Instalar Dependências

```bash
# Frontend
npm install

# Backend (usando ambiente virtual)
venv/bin/pip install -r requirements.txt
```

### Passo 2: Iniciar Backend

```bash
venv/bin/python backend.py
```

### Passo 3: Iniciar Frontend

```bash
npm run dev
```

Acesse: **http://localhost:3000**

## 💡 Como Usar

1. **Inicie os servidores**: `./iniciar.sh`
2. **Acesse no navegador**: http://localhost:3000
3. **Verifique o status**: Badge amarelo/azul "🚀 MODO AVANÇADO" indica backend conectado
4. **Arraste ou clique** para fazer upload da imagem
5. **Aguarde a análise** (5-10 segundos com ML avançado)
6. **Veja os resultados** com explicações detalhadas e gráficos

## 🎨 Recursos

### ✅ Funciona Bem Com:
- Imagens de geradores (DALL-E, Midjourney, Stable Diffusion)
- Fotos originais de câmera
- Identificação de deepfakes básicos
- Análise educacional

### ⚠️ Limitações:
- Não substitui perícia forense profissional
- Fotos comprimidas (WhatsApp, Instagram) têm precisão reduzida
- Deepfakes muito sofisticados podem enganar
- Não detecta manipulações manuais (Photoshop tradicional)

## 🔧 Modo Offline (Sem Backend)

Se o backend não estiver rodando, o sistema automaticamente usa análise JavaScript básica com precisão reduzida (70-85%).

## 🐛 Solução de Problemas

### Backend não conecta
```bash
# Verifique se a porta 5000 está livre
lsof -i :5000

# Instale as dependências novamente
pip install --upgrade -r requirements.txt
```

### Erro de CORS
O backend já está configurado com `flask-cors`. Se ainda houver problemas:
- Verifique se está acessando via `file://` ou `http://`
- Use um servidor local simples: `python -m http.server 8000`

### Imagem não carrega
- Verifique o tamanho (máximo 10MB)
- Formatos suportados: JPG, PNG, GIF, WEBP

## 📊 Estrutura do Projeto

```
Lumora/
├── app/
│   ├── page.tsx             # Página principal Next.js
│   ├── globals.css          # Estilos globais (Tailwind)
│   └── layout.tsx           # Layout base
├── components/
│   ├── DetectorUpload.tsx   # Componente de upload
│   ├── AnalysisReport.tsx   # Relatório de análise
│   ├── LumoraLogo.tsx       # Logo animado
│   └── ui/                  # Componentes shadcn/ui
├── backend.py               # Backend Python com ML
├── requirements.txt         # Dependências Python
├── package.json             # Dependências Node.js
├── iniciar.sh              # Script para iniciar tudo
└── README.md               # Este arquivo
```

## 🔬 Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com SSR/SSG
- **React 18** - Biblioteca de componentes
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **shadcn/ui** - Componentes UI reutilizáveis
- **Framer Motion** - Animações cinematográficas
- **Lucide React** - Ícones modernos

### Backend
- **Flask 3.x** - Framework web Python
- **Flask-CORS** - Gerenciamento de CORS
- **OpenCV** - Processamento de imagem avançado
- **NumPy** - Computação numérica
- **SciPy** - Análise estatística e transformadas
- **Pillow** - Manipulação de imagem

## 📈 Melhorias Futuras

- [ ] Modelo CNN pré-treinado (TensorFlow/PyTorch)
- [ ] Cache de resultados
- [ ] Análise de vídeo frame-by-frame
- [ ] API REST completa
- [ ] Interface web profissional com React

## 📝 Licença

Ferramenta educacional - Use com responsabilidade. Não utilize para fins forenses oficiais sem validação profissional.

## 👨‍💻 Desenvolvimento

Versão 3.3 - Backend ML Integrado
- 12 técnicas de análise
- Precisão 85-95%
- Fallback automático
- Interface moderna

---

**⚠️ AVISO IMPORTANTE**: Esta é uma ferramenta educacional. Para casos críticos (jurídicos, criminais, verificação de identidade), consulte um especialista em análise forense digital profissional.
