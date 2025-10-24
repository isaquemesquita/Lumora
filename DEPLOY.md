# 🚀 Como Colocar o Lumora no Ar

## 📝 Checklist Geral

- [ ] Comprar domínio
- [ ] Criar conta no GitHub
- [ ] Subir código para GitHub
- [ ] Deploy do Frontend (Vercel)
- [ ] Deploy do Backend (Railway)
- [ ] Configurar domínio
- [ ] Testar site online

---

## 1️⃣ **COMPRAR DOMÍNIO**

### Onde comprar (escolha 1):
- **Registro.br** (recomendado para .com.br): https://registro.br
- **Hostinger**: https://hostinger.com.br
- **GoDaddy**: https://godaddy.com

### Custo:
- **.com.br**: R$ 40/ano
- **.com**: R$ 50-80/ano

### Dica:
Escolha um nome curto e fácil de lembrar!
Exemplos: `lumora.com.br`, `detectorai.com.br`

---

## 2️⃣ **CRIAR CONTA NO GITHUB** (GRÁTIS)

1. Acesse: https://github.com
2. Clique em "Sign up"
3. Crie sua conta (use um email válido)

---

## 3️⃣ **SUBIR CÓDIGO PARA GITHUB**

### No terminal, na pasta do projeto:

```bash
cd /home/izaque/Documentos/Lumora

# Inicializar Git (se ainda não foi)
git init

# Criar arquivo .gitignore
echo "node_modules/
.next/
venv/
*.log
.env.local
__pycache__/" > .gitignore

# Adicionar todos os arquivos
git add .

# Fazer primeiro commit
git commit -m "Deploy inicial do Lumora"

# Criar repositório no GitHub primeiro (via site)
# Depois conectar:
git remote add origin https://github.com/SEU_USUARIO/lumora.git
git branch -M main
git push -u origin main
```

**IMPORTANTE**: Antes do último comando, você precisa criar o repositório no GitHub (botão "New repository").

---

## 4️⃣ **DEPLOY DO FRONTEND (Vercel) - GRÁTIS**

### Passo a passo:

1. Acesse: https://vercel.com
2. Clique em "Sign up" e faça login com GitHub
3. Clique em "New Project"
4. Selecione seu repositório "lumora"
5. Configure:
   - **Framework Preset**: Next.js (detecta automaticamente)
   - **Root Directory**: deixe vazio (ou `/`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. Em **Environment Variables**, adicione:
   ```
   NEXT_PUBLIC_API_URL=https://SEU-BACKEND.railway.app
   ```
   (você vai pegar esse link no passo 5)

7. Clique em "Deploy"

### Resultado:
Seu site estará em: `https://lumora-seu-usuario.vercel.app`

---

## 5️⃣ **DEPLOY DO BACKEND (Railway) - GRÁTIS/BARATO**

### Passo a passo:

1. Acesse: https://railway.app
2. Clique em "Login" e faça login com GitHub
3. Clique em "New Project" → "Deploy from GitHub repo"
4. Selecione seu repositório "lumora"
5. Railway detectará Python automaticamente

6. **IMPORTANTE**: Criar arquivo `railway.json` no projeto:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python backend.py",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

7. Adicionar `Procfile`:
```
web: python backend.py
```

8. Railway vai gerar uma URL tipo: `https://lumora-production.up.railway.app`

9. Copie essa URL e volte no Vercel (passo 4) para adicionar nas variáveis de ambiente

### Custo Railway:
- **Grátis**: 500 horas/mês ($0/mês)
- **Hobby**: $5/mês (ilimitado)

---

## 6️⃣ **CONFIGURAR DOMÍNIO**

### No Vercel (Frontend):

1. Vá em seu projeto no Vercel
2. Clique em "Settings" → "Domains"
3. Adicione seu domínio: `lumora.com.br`
4. Vercel vai te dar instruções de DNS

### No seu provedor de domínio (Registro.br, etc):

Adicione os seguintes registros DNS:

**Tipo A:**
```
Nome: @
Valor: 76.76.21.21
```

**Tipo CNAME:**
```
Nome: www
Valor: cname.vercel-dns.com
```

### Para o Backend (opcional):

Se quiser um subdomínio tipo `api.lumora.com.br`:

**Tipo CNAME:**
```
Nome: api
Valor: lumora-production.up.railway.app
```

Depois, no Railway, adicione o domínio customizado nas configurações.

### Tempo de propagação:
DNS pode levar de 10 minutos a 48 horas para funcionar globalmente.

---

## 7️⃣ **TESTAR**

Após tudo configurado:

1. Acesse: `https://lumora.com.br` (ou seu domínio)
2. Teste o upload de imagem
3. Verifique se a análise funciona
4. Teste em diferentes dispositivos

---

## 💰 **RESUMO DE CUSTOS**

### Opção Econômica (Recomendada):
- Domínio: R$ 40-60/ano
- Vercel (Frontend): **GRÁTIS** ✨
- Railway (Backend): **GRÁTIS** (ou $5/mês se precisar mais)
- **TOTAL**: ~R$ 40-60/ano (só o domínio!)

### Opção VPS:
- Domínio: R$ 40-60/ano
- VPS (Contabo/DigitalOcean): R$ 25-50/mês
- **TOTAL**: R$ 340-660/ano

---

## 🔒 **SEGURANÇA**

### Antes de fazer deploy:

1. **NUNCA** commite senhas ou chaves secretas
2. Use variáveis de ambiente para dados sensíveis
3. Adicione `.env` ao `.gitignore`
4. Configure CORS no backend corretamente
5. Use HTTPS sempre (Vercel e Railway fazem isso automaticamente)

---

## 📞 **PRECISA DE AJUDA?**

Se encontrar dificuldades em algum passo, me avise que te ajudo!

---

## 🎯 **PRÓXIMOS PASSOS APÓS DEPLOY**

- [ ] Configurar Google Analytics (opcional)
- [ ] Adicionar meta tags para SEO
- [ ] Criar logo/favicon personalizado
- [ ] Compartilhar nas redes sociais!

---

**Boa sorte com o deploy! 🚀**
