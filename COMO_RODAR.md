# 🚀 Como Rodar o Lumora React

## Passo a Passo Rápido

### 1️⃣ Configurar Backend Python

```bash
# Terminal 1
cd /home/izaque/Documentos/Lumora
python3 backend.py
```

Você verá:
```
🛡️ Lumora Backend v3.3 - Detector Avançado de IA [SECURE]
Servidor rodando em http://localhost:5000
```

### 2️⃣ Configurar Variável de Ambiente

```bash
# Criar arquivo .env.local
cp .env.example .env.local
```

O arquivo já está configurado para `http://localhost:5000`.

### 3️⃣ Rodar Frontend React

```bash
# Terminal 2 (novo terminal)
cd /home/izaque/Documentos/Lumora
npm run dev
```

Você verá:
```
  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

### 4️⃣ Abrir no Navegador

Acesse: **http://localhost:3000**

---

## ✅ Como Testar

1. **Veja o logo animado** - Passe o mouse sobre ele por 3 segundos
2. **Partículas atacam** - Símbolos #@%$ aparecem
3. **Explosão épica** - Flash amarelo com ondas de choque
4. **Upload de imagem** - Clique na área de upload
5. **Análise** - Clique em "Analisar Imagem"

---

## 🐛 Problemas Comuns

### Backend não conecta

**Erro:** "Erro ao analisar imagem"

**Solução:**
```bash
# Verificar se backend está rodando
curl http://localhost:5000/health

# Deve retornar: {"status":"healthy","version":"3.3"}
```

### Porta 3000 em uso

**Solução:**
```bash
# Usar porta diferente
PORT=3001 npm run dev
```

### Animações não funcionam

**Verifique:**
- Dependências instaladas: `npm list motion`
- Console do navegador (F12) por erros

### CSS não carrega

**Solução:**
```bash
# Limpar cache e rebuildar
rm -rf .next
npm run dev
```

---

## 📦 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Rodar build
npm run start

# Verificar erros
npm run lint

# Reinstalar tudo
rm -rf node_modules package-lock.json
npm install
```

---

## 🎨 Ver Animação do Logo

1. Abra http://localhost:3000
2. **Mantenha o mouse sobre o logo por 3 segundos**
3. Observe a sequência:
   - ⏳ Waiting (3s)
   - 🎯 Attacking (1s) - partículas se aproximam
   - ⚡ Charging (0.8s) - logo tremendo
   - 💥 Exploding (0.3s) - BOOM!
   - 💀 Dying (1.5s) - partículas caem

---

## 🎥 O Que Esperar

### Logo Animado
- Escudo dourado com farol
- Brilho suave constante
- Hover = brilho intenso
- Animação completa = EXPLOSÃO ÉPICA

### Interface
- Design glassmorphism (vidro fosco)
- Gradientes suaves
- Animações 60fps buttery smooth
- Responsivo (funciona no celular)

### Detector
- Upload drag & drop
- Preview da imagem
- Loading animado
- Resultados com cores (verde = real, vermelho = IA)
- Lista de análises detectadas

---

## 🔥 Próximo: Deploy

Depois de testar localmente, veja `README_REACT.md` para instruções de deploy em **Vercel** (grátis e 1 clique).

---

**Pronto! Agora você tem um detector de IA com React profissional!** 🎉
