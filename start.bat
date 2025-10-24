@echo off
REM Script de inicialização do Lumora para Windows

echo ========================================
echo 🛡️ LUMORA v3.3 - Detector Avançado de IA
echo ========================================
echo.

REM Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado. Instale Python 3.8+
    pause
    exit /b 1
)

echo ✅ Python encontrado
echo.

REM Instalar dependências
echo 📥 Instalando dependências...
pip install -q -r requirements.txt

if errorlevel 1 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)

echo.
echo ✅ Dependências instaladas!
echo.
echo 🚀 Iniciando backend Python...
echo    Backend disponível em: http://localhost:5000
echo.
echo 📖 Próximo passo:
echo    Abra o arquivo lumora.html no navegador
echo.
echo ⌨️  Pressione Ctrl+C para parar
echo ========================================
echo.

REM Iniciar backend
python backend.py
