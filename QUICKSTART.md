# 🚀 Guia Rápido - Lumora v3.3

## Início Rápido (3 Passos)

### 1️⃣ Instale as Dependências

```bash
cd /home/izaque/Documentos/Lumora
pip install -r requirements.txt
```

### 2️⃣ Inicie o Backend

**Linux/Mac:**
```bash
./start.sh
```

**Ou manualmente:**
```bash
python3 backend.py
```

**Windows:**
```cmd
start.bat
```

### 3️⃣ Abra o Frontend

Abra o arquivo `lumora.html` no seu navegador favorito.

---

## ✅ Como Saber que Está Funcionando

1. **Terminal mostra**: "Servidor rodando em http://localhost:5000"
2. **No navegador**: Caixa verde aparece: "🚀 MODO AVANÇADO: Usando backend Python com Machine Learning"
3. **Console do navegador** (F12): "✅ Backend Python conectado"

---

## 🎯 Diferenças dos Modos

| Característica | JavaScript Básico | Python ML (Backend) |
|----------------|-------------------|---------------------|
| **Precisão** | 70-85% | 85-95% ⭐ |
| **Análises** | 6 técnicas | 12 técnicas |
| **Requer Backend** | ❌ Não | ✅ Sim |
| **Performance** | Rápida | Muito precisa |

---

## 🧪 Teste Rápido

1. Inicie o backend
2. Abra `lumora.html`
3. Faça upload de uma foto da sua câmera (foto REAL)
4. Faça upload de uma imagem do Google Images ou gerada por IA
5. Compare os resultados!

---

## 🐛 Problemas Comuns

### Backend não inicia
```bash
# Verifique Python
python3 --version

# Instale novamente
pip install --upgrade -r requirements.txt
```

### Caixa verde não aparece
- Backend não está rodando
- Verifique se porta 5000 está livre: `lsof -i :5000`

### Erro de importação (ModuleNotFoundError)
```bash
# Instale dependências faltantes
pip install flask flask-cors numpy opencv-python pillow scipy
```

---

## 📊 O Que o Sistema Detecta

### ✅ Forte Indicador de IA:
- Nome contém "dalle", "midjourney", "chatgpt"
- Sem metadados EXIF de câmera
- Espectro de frequência muito liso
- Blocos uniformes (artefatos GAN)
- Cores artificialmente correlacionadas
- Ruído sintético uniforme

### ✅ Forte Indicador de Foto Real:
- Metadados de câmera (Make, Model, GPS)
- Ruído natural de sensor
- Aberração cromática de lentes
- Artefatos JPEG 8x8
- Distribuição natural de frequências
- Variação de foco natural

---

## 🎓 Dicas para Testes

### Fotos que funcionam MELHOR:
- ✅ Fotos originais da câmera/celular
- ✅ JPG não comprimido
- ✅ Imagens direto do gerador de IA
- ✅ Alta resolução (>1000px)

### Fotos com precisão REDUZIDA:
- ⚠️ Screenshots de WhatsApp/Instagram
- ⚠️ Imagens muito comprimidas
- ⚠️ Fotos editadas em Photoshop
- ⚠️ Baixa resolução (<500px)

---

## 🔥 Próximos Passos

Depois de testar, veja o `README.md` completo para entender todas as 12 técnicas de análise implementadas!
