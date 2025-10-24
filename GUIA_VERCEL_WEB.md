# 🌐 Deploy no Vercel via Web - Passo a Passo

## 📋 REQUISITOS

- Conta no GitHub (grátis)
- Conta no Vercel (grátis)
- Navegador (Chrome, Firefox, etc)

---

## PASSO 1: CRIAR CONTA NO GITHUB

1. Acesse: **https://github.com**
2. Clique em **"Sign up"** (canto superior direito)
3. Preencha:
   - Email
   - Senha
   - Username (escolha um nome de usuário)
4. Verifique seu email
5. **Pronto!** Conta criada ✅

---

## PASSO 2: CRIAR REPOSITÓRIO NO GITHUB

### Via Web Interface:

1. Faça login no GitHub
2. Clique no **"+"** (canto superior direito)
3. Selecione **"New repository"**
4. Preencha:
   - **Repository name**: `lumora`
   - **Description**: "Detector de IA com Next.js e Python"
   - Selecione: **Public** (ou Private se preferir)
   - **NÃO** marque "Add a README"
5. Clique em **"Create repository"**

### Você verá uma tela com comandos. ANOTE o link que aparece:
```
https://github.com/SEU_USUARIO/lumora.git
```

---

## PASSO 3: SUBIR CÓDIGO PARA O GITHUB

### Via Terminal (Mais Simples):

Abra o terminal na pasta do projeto e cole esses comandos (UM DE CADA VEZ):

```bash
cd /home/izaque/Documentos/Lumora

# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Deploy inicial do Lumora"

# Adicionar repositório remoto (SUBSTITUA SEU_USUARIO pelo seu username)
git remote add origin https://github.com/SEU_USUARIO/lumora.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

**IMPORTANTE**: Na hora do `git push`, vai pedir:
- **Username**: seu usuário do GitHub
- **Password**: use um **Personal Access Token** (não a senha!)

### Como criar Personal Access Token:

1. No GitHub, clique na sua foto (canto superior direito)
2. **Settings** → **Developer settings** (rodapé esquerdo)
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token** → **Generate new token (classic)**
5. Preencha:
   - **Note**: "Lumora Deploy"
   - **Expiration**: 90 days (ou No expiration)
   - Marque: **repo** (todos os checkboxes)
6. Clique em **"Generate token"**
7. **COPIE O TOKEN** (só mostra uma vez!)
8. Use esse token como "password" no `git push`

---

## PASSO 4: DEPLOY NO VERCEL (FINALMENTE!)

### 4.1 Criar conta:

1. Acesse: **https://vercel.com**
2. Clique em **"Sign Up"**
3. Escolha: **"Continue with GitHub"**
4. Autorize o Vercel a acessar seu GitHub
5. **Pronto!** Conta criada ✅

### 4.2 Fazer Deploy:

1. No Vercel, clique em **"Add New..."** → **"Project"**
2. Você verá uma lista dos seus repositórios do GitHub
3. Encontre **"lumora"** e clique em **"Import"**

4. **Configure o projeto**:
   
   **Framework Preset**: Next.js (detecta automaticamente)
   
   **Root Directory**: `./` (deixe como está)
   
   **Build Command**: `npm run build` (já vem preenchido)
   
   **Output Directory**: `.next` (já vem preenchido)
   
   **Install Command**: `npm install` (já vem preenchido)

5. **Environment Variables** (IMPORTANTE!):
   
   Clique em **"Environment Variables"** e adicione:
   
   ```
   Key: NEXT_PUBLIC_API_URL
   Value: http://localhost:5000
   ```
   
   (Depois você muda quando o backend estiver no ar)

6. Clique em **"Deploy"**

7. **AGUARDE** (2-3 minutos)

8. **PRONTO!** 🎉
   
   Você verá uma tela de celebração com um link tipo:
   ```
   https://lumora-abc123xyz.vercel.app
   ```

### 4.3 Ver seu site:

Clique no link gerado! Seu site está no ar! 🚀

---

## PASSO 5: BACKEND (RAILWAY)

Como o backend precisa rodar separado, você vai fazer parecido:

### 5.1 Railway:

1. Acesse: **https://railway.app**
2. Clique em **"Login"** → **"Login with GitHub"**
3. Autorize o Railway
4. Clique em **"New Project"**
5. Selecione **"Deploy from GitHub repo"**
6. Escolha **"lumora"**
7. Railway detecta Python automaticamente
8. Clique em **"Deploy Now"**
9. Aguarde 2-3 minutos
10. Clique no projeto → **"Settings"** → Copie o link **"Public URL"**
    
    Será algo como:
    ```
    https://lumora-production.up.railway.app
    ```

### 5.2 Atualizar Vercel com URL do Backend:

1. Volte no Vercel
2. Vá no seu projeto **"lumora"**
3. Clique em **"Settings"**
4. **Environment Variables**
5. Encontre `NEXT_PUBLIC_API_URL`
6. Clique em **"Edit"**
7. Mude para: `https://lumora-production.up.railway.app` (sua URL do Railway)
8. Clique em **"Save"**
9. Volte em **"Deployments"**
10. Clique nos 3 pontinhos do último deploy → **"Redeploy"**

**PRONTO! Site 100% funcional no ar!** 🎉

---

## PASSO 6: DOMÍNIO PRÓPRIO (OPCIONAL)

### 6.1 Comprar domínio:

1. Acesse: **https://registro.br** (para .com.br)
2. Busque um nome disponível
3. Compre (~R$ 40/ano)

### 6.2 Configurar no Vercel:

1. No Vercel, vá no seu projeto
2. **Settings** → **Domains**
3. Clique em **"Add"**
4. Digite seu domínio: `seusite.com.br`
5. Clique em **"Add"**
6. Vercel vai mostrar configurações de DNS

### 6.3 Configurar DNS:

1. Vá no painel do Registro.br
2. Acesse **"DNS"** → **"Editar Zona"**
3. Adicione os registros que o Vercel mostrou:
   
   **Tipo A**:
   ```
   Nome: @
   Conteúdo: 76.76.21.21
   ```
   
   **Tipo CNAME**:
   ```
   Nome: www
   Conteúdo: cname.vercel-dns.com
   ```

4. Salve
5. Aguarde 10min - 48h (propagação DNS)

**PRONTO! Seu domínio vai apontar para seu site!** 🎉

---

## 🔄 ATUALIZAÇÕES FUTURAS

### Como atualizar o site depois:

1. Faça as mudanças no código local
2. No terminal:
   ```bash
   cd /home/izaque/Documentos/Lumora
   git add .
   git commit -m "Atualização X"
   git push
   ```
3. Vercel detecta automaticamente e faz deploy!
4. **2-3 minutos** e está atualizado! ✨

---

## 📱 RESUMO FINAL

### O que você terá:

- ✅ Site no ar: `https://lumora-xyz.vercel.app`
- ✅ Backend funcionando: `https://lumora-production.railway.app`
- ✅ HTTPS automático (seguro)
- ✅ Deploy automático via GitHub
- ✅ Grátis! (só domínio se quiser)

### Custo:

- GitHub: **GRÁTIS**
- Vercel: **GRÁTIS**
- Railway: **GRÁTIS** (500h/mês) ou $5/mês
- Domínio: **R$ 40-60/ano** (opcional)

**TOTAL: R$ 0-60/ano** 🎉

---

## ❓ PROBLEMAS COMUNS

### "Permission denied" no git push:
- Use Personal Access Token, não a senha do GitHub

### "Failed to compile" no Vercel:
- Verifique se todos os pacotes estão no package.json
- Veja os logs de erro no Vercel

### Backend não conecta:
- Verifique se colocou a URL correta do Railway no Vercel
- Veja se o backend está rodando no Railway

### Site não carrega:
- Aguarde alguns minutos após deploy
- Limpe cache do navegador (Ctrl+Shift+R)

---

**Dúvidas? Me chame!** 😊
