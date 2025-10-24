# 🌐 Deploy Via Web - RESUMO ULTRA SIMPLES

## ✅ **CHECKLIST RÁPIDO**

### 1. GITHUB (Obrigatório) ✅
- [ ] Criar conta: https://github.com/signup
- [ ] Criar repositório "lumora"
- [ ] Subir código (comandos abaixo)

### 2. VERCEL (Frontend - GRÁTIS) ✅
- [ ] Criar conta: https://vercel.com
- [ ] Login com GitHub
- [ ] Import projeto "lumora"
- [ ] Deploy automático!

### 3. RAILWAY (Backend - GRÁTIS) ✅
- [ ] Criar conta: https://railway.app
- [ ] Login com GitHub
- [ ] Deploy projeto "lumora"
- [ ] Copiar URL

### 4. CONECTAR (5 minutos) ✅
- [ ] Voltar no Vercel
- [ ] Adicionar variável `NEXT_PUBLIC_API_URL`
- [ ] Redeploy

---

## 💻 **COMANDOS PARA SUBIR NO GITHUB**

Copie e cole no terminal (UM DE CADA VEZ):

```bash
# 1. Ir para a pasta do projeto
cd /home/izaque/Documentos/Lumora

# 2. Inicializar Git
git init

# 3. Adicionar tudo
git add .

# 4. Fazer commit
git commit -m "Deploy inicial Lumora"

# 5. CRIAR REPOSITÓRIO NO GITHUB PRIMEIRO!
# Vá em: https://github.com/new
# Nome: lumora
# Public
# NÃO marque "Add README"
# Clique em "Create repository"

# 6. Conectar (TROQUE "SEU_USUARIO" pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/lumora.git

# 7. Enviar
git branch -M main
git push -u origin main
```

**IMPORTANTE**: No `git push`, você vai precisar de um **Personal Access Token**:

1. GitHub → Settings (seu perfil)
2. Developer settings (rodapé)
3. Personal access tokens → Tokens (classic)
4. Generate new token
5. Marque: **repo** (todos)
6. Copie o token
7. Use como senha no `git push`

---

## 🚀 **NO VERCEL**

1. https://vercel.com → Login with GitHub
2. New Project
3. Selecione "lumora"
4. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL = http://localhost:5000
   ```
   (você muda depois)
5. Deploy
6. Copie o link: `https://lumora-xxx.vercel.app`

---

## 🚂 **NO RAILWAY**

1. https://railway.app → Login with GitHub
2. New Project → Deploy from GitHub
3. Selecione "lumora"
4. Aguarde deploy
5. Settings → Generate Domain
6. Copie a URL: `https://lumora-production.up.railway.app`

---

## 🔗 **CONECTAR OS DOIS**

1. Volte no Vercel
2. Seu projeto → Settings → Environment Variables
3. Edite `NEXT_PUBLIC_API_URL`
4. Cole a URL do Railway: `https://lumora-production.up.railway.app`
5. Save
6. Deployments → Redeploy (último deploy)

---

## 🎉 **PRONTO!**

Seu site está no ar:
- Frontend: `https://lumora-xxx.vercel.app`
- Backend: `https://lumora-production.up.railway.app`

---

## 💰 **CUSTO TOTAL**

- GitHub: **GRÁTIS**
- Vercel: **GRÁTIS**
- Railway: **GRÁTIS** (500h/mês)

**ZERO CUSTOS!** 🎉

---

## 🌐 **ADICIONAR DOMÍNIO PRÓPRIO (OPCIONAL)**

Depois que tudo funcionar:

1. Compre domínio (Registro.br - R$ 40/ano)
2. Vercel → Settings → Domains → Add
3. Configure DNS conforme instruções
4. Aguarde 10min-48h

---

## 🔄 **ATUALIZAR DEPOIS**

Qualquer mudança no código:

```bash
git add .
git commit -m "Atualização"
git push
```

Deploy automático! ✨

---

**Dúvidas? Consulte: GUIA_VERCEL_WEB.md** (guia completo com mais detalhes)
