#!/bin/bash

echo "🚀 Iniciando Lumora..."
echo ""

# Criar arquivo .env.local se não existir
if [ ! -f .env.local ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
    echo "✅ Arquivo .env.local criado"
fi

# Iniciar backend em background
echo "🐍 Iniciando backend Python..."
venv/bin/python backend.py > backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend rodando (PID: $BACKEND_PID)"

# Aguardar 2 segundos para o backend iniciar
sleep 2

# Iniciar frontend
echo "⚛️  Iniciando frontend Next.js..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Lumora está rodando!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo ""
echo "Pressione Ctrl+C para parar os servidores"
echo ""

npm run dev

# Quando o frontend parar (Ctrl+C), matar o backend também
kill $BACKEND_PID 2>/dev/null
echo ""
echo "👋 Servidores encerrados!"
