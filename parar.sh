#!/bin/bash

echo "🛑 Parando Lumora..."

# Parar backend Python
pkill -f "python backend.py"
echo "✅ Backend Python parado"

# Parar Next.js
pkill -f "next dev"
echo "✅ Frontend Next.js parado"

echo ""
echo "👋 Todos os servidores foram encerrados!"
