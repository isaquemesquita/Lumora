# 🔄 Como Atualizar o Site (Deploy Automático)

## ✅ **SIM! Atualiza Automaticamente**

Toda vez que você enviar código para o GitHub, o Vercel detecta e faz deploy automático!

---

## 📝 **3 COMANDOS MÁGICOS**

Sempre que fizer mudanças no código:

```bash
git add .
git commit -m "Descrição da mudança"
git push
```

**Aguarde 2-3 minutos** → Site atualizado! ✨

---

## 🎯 **PASSO A PASSO DETALHADO**

### 1. Fazer mudanças no código
- Edite os arquivos que quiser
- Teste localmente (./iniciar.sh)

### 2. Verificar o que mudou
```bash
cd /home/izaque/Documentos/Lumora
git status
```

### 3. Adicionar mudanças
```bash
git add .
```

Ou adicionar arquivo específico:
```bash
git add app/page.tsx
```

### 4. Fazer commit
```bash
git commit -m "Mudei a cor do botão"
```

Dicas de mensagens:
- ✅ `"Adicionei animação no logo"`
- ✅ `"Corrigi bug no upload"`
- ✅ `"Atualizei cores do tema"`
- ❌ `"mudanças"` (muito genérico)

### 5. Enviar para GitHub
```bash
git push
```

### 6. Acompanhar deploy
- Vá em: https://vercel.com/dashboard
- Você verá o deploy acontecendo em tempo real
- Status: Building → Deploying → Ready ✅

---

## 📊 **MONITORAR DEPLOYS**

### No Vercel Dashboard:

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto "lumora"
3. Aba **"Deployments"**
4. Você verá:
   - ⏳ **Building**: Compilando código
   - 🚀 **Ready**: Deploy concluído
   - ❌ **Failed**: Erro (veja os logs)

---

## 🐛 **SE DER ERRO NO DEPLOY**

### Ver logs de erro:

1. Vercel Dashboard → Seu projeto
2. Clique no deploy que falhou
3. Veja os logs de erro
4. Corrija o erro no código local
5. Faça commit e push novamente

### Erros comuns:

1. **Erro de compilação TypeScript**
   - Verifique tipos no código
   - `npm run build` localmente para testar

2. **Módulo não encontrado**
   - Faltou instalar dependência
   - Adicione no package.json

3. **Variável de ambiente**
   - Verifique se configurou `NEXT_PUBLIC_API_URL`
   - Settings → Environment Variables no Vercel

---

## 🎨 **EXEMPLO DE ATUALIZAÇÃO COMPLETA**

```bash
# 1. Ir para o projeto
cd /home/izaque/Documentos/Lumora

# 2. Editar arquivo (exemplo)
# Você edita app/page.tsx no VS Code...

# 3. Testar localmente
./iniciar.sh
# Abra http://localhost:3000 e teste

# 4. Se estiver bom, fazer deploy
git add .
git commit -m "Atualizei o título da página"
git push

# 5. Aguardar 2-3 minutos
# Site atualizado em https://lumora-xyz.vercel.app
```

---

## 📱 **ATALHO RÁPIDO**

Crie um script de deploy rápido:

```bash
# Criar arquivo deploy.sh
echo '#!/bin/bash
git add .
echo "Digite a mensagem do commit:"
read mensagem
git commit -m "$mensagem"
git push
echo "✅ Deploy iniciado! Aguarde 2-3 minutos."' > deploy.sh

chmod +x deploy.sh
```

Depois é só:
```bash
./deploy.sh
```

---

## 🚀 **DEPLOY PREVIEW**

O Vercel cria um preview para CADA commit:
- **Production**: https://lumora-xyz.vercel.app (main branch)
- **Preview**: URL única para cada commit

Útil para testar antes de ir para produção!

---

## 🔄 **REVERTER MUDANÇAS**

Se algo der errado:

### No Vercel:
1. Deployments
2. Encontre o deploy antigo que funcionava
3. Clique nos 3 pontinhos → **"Promote to Production"**

### No Git:
```bash
# Ver histórico
git log --oneline

# Voltar para commit anterior
git revert HEAD
git push
```

---

## 💡 **DICAS IMPORTANTES**

1. ✅ **Sempre teste localmente antes** (`./iniciar.sh`)
2. ✅ **Commits pequenos e frequentes** (mais fácil de debugar)
3. ✅ **Mensagens descritivas** (você vai agradecer depois)
4. ✅ **Veja os logs** se der erro
5. ⚠️ **Não commite senhas/tokens** (use .env)

---

## 📊 **RESUMO**

| Ação | Comando | Tempo |
|------|---------|-------|
| Atualizar código local | (editar arquivos) | Variável |
| Testar localmente | `./iniciar.sh` | Instantâneo |
| Enviar pro GitHub | `git add . && git commit -m "msg" && git push` | 5 segundos |
| Deploy automático | (automático) | 2-3 minutos |
| Site atualizado | ✅ | Total: ~3-5 min |

---

**Agora você pode atualizar seu site sempre que quiser! 🎉**

Qualquer mudança → `git push` → Site atualizado!
