#!/bin/bash
# Script de inicialização do Lumora

echo "🛡️ LUMORA v3.3 - Detector Avançado de IA"
echo "========================================"
echo ""

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale Python 3.8+"
    exit 1
fi

echo "✅ Python encontrado: $(python3 --version)"
echo ""

# Verificar/Instalar dependências
if [ ! -d "venv" ]; then
    echo "📦 Criando ambiente virtual..."
    python3 -m venv venv
fi

echo "🔄 Ativando ambiente virtual..."
source venv/bin/activate

echo "📥 Instalando/Atualizando dependências..."
pip install -q -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo ""
echo "✅ Dependências instaladas com sucesso!"
echo ""
echo "🚀 Iniciando backend Python..."
echo "   Backend estará disponível em: http://localhost:5000"
echo ""
echo "📖 Próximo passo:"
echo "   Abra o arquivo lumora.html no seu navegador"
echo ""
echo "⌨️  Pressione Ctrl+C para parar o servidor"
echo "=========================================="
echo ""

# Iniciar backend
python3 backend.py
