# 🚀 Deploy SUPER SIMPLES - Sem GitHub!

## ⚡ JEITO MAIS FÁCIL - 15 MINUTOS

### **OPÇÃO 1: Vercel CLI (Recomendado - Mais Simples)**

#### Passo 1: Instalar Vercel CLI

No terminal:
```bash
npm install -g vercel
```

#### Passo 2: Fazer Login

```bash
vercel login
```

Vai abrir o navegador para você fazer login (crie conta se não tiver).

#### Passo 3: Deploy do Frontend

Na pasta do projeto:
```bash
cd /home/izaque/Documentos/Lumora
vercel
```

Responda as perguntas:
- Set up and deploy? → **Y (yes)**
- Which scope? → Escolha seu usuário
- Link to existing project? → **N (no)**
- What's your project's name? → **lumora** (ou o que quiser)
- In which directory is your code? → **./** (enter)
- Override settings? → **N (no)**

**PRONTO!** Seu site vai subir e você recebe um link tipo:
`https://lumora-abc123.vercel.app`

#### Passo 4: Deploy do Backend (Railway)

Para o backend Python, você PRECISA criar conta no Railway:

1. Acesse: https://railway.app
2. Clique em "Start a New Project"
3. Escolha "Deploy from GitHub" OU "Empty Project"
4. Se escolher Empty Project:
   - Clique em "New" → "GitHub Repo"
   - Se não quiser GitHub, use Docker (mais complicado)

**MAS...** para Railway você vai precisar do GitHub mesmo. 😕

---

## 🎯 **OPÇÃO 2: Só Frontend (Mais Simples Ainda)**

Se você quiser colocar no ar AGORA sem complicação:

### Deploy só o frontend (análise client-side):

```bash
cd /home/izaque/Documentos/Lumora

# Remover dependência do backend temporariamente
vercel --prod
```

**Vantagens:**
- ✅ No ar em 5 minutos
- ✅ Não precisa backend rodando
- ✅ Análise client-side funciona

**Desvantagens:**
- ⚠️ Não usa o MODO AVANÇADO (backend Python)
- ⚠️ Análise menos precisa (só JavaScript)

---

## 💡 **PARA FUNCIONAR 100% (Frontend + Backend)**

Infelizmente você VAI precisar usar GitHub para o backend. Mas é simples:

### Mini Guia GitHub (10 minutos):

```bash
# 1. Instalar GitHub CLI (se não tiver)
# No Kali Linux:
sudo apt install gh

# 2. Fazer login
gh auth login

# 3. Criar repositório e subir código
cd /home/izaque/Documentos/Lumora
git init
git add .
git commit -m "Deploy do Lumora"
gh repo create lumora --public --source=. --push

# PRONTO! Código no GitHub!
```

### Depois:

1. **Railway** (backend): https://railway.app
   - Login com GitHub
   - "New Project" → "Deploy from GitHub"
   - Selecionar "lumora"
   - Pegar URL: `https://seu-backend.railway.app`

2. **Vercel** (frontend): atualizar variável
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   # Colar: https://seu-backend.railway.app
   vercel --prod
   ```

---

## 🏃 **O JEITO MAIS RÁPIDO AGORA**

### Ver o site funcionando HOJE:

```bash
cd /home/izaque/Documentos/Lumora
npm install -g vercel
vercel login
vercel
```

Vai dar um link tipo: `https://lumora-xyz.vercel.app`

**Você pode compartilhar esse link com todo mundo!** 🎉

---

## 🌐 **E o Domínio Próprio?**

Depois que o site estiver no ar (no link do Vercel), você pode:

1. Comprar domínio (Registro.br - R$ 40/ano)
2. No Vercel: Settings → Domains → Adicionar seu domínio
3. Configurar DNS conforme instruções
4. Pronto! `https://seusite.com.br` ✨

---

## 📱 **RESUMÃO**

### Para começar AGORA:
```bash
npm install -g vercel
vercel login
vercel
```

### Para funcionar 100% (com backend):
- Precisa GitHub (mas é fácil!)
- Usar Railway para backend
- Conectar tudo

---

**Quer que eu te ajude a fazer o deploy agora?** 🚀
