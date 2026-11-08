@echo off
echo ========================================
echo Subiendo cambios a GitHub automaticamente...
echo ========================================

git add .

set /p mensaje="Escribe un mensaje corto para tus cambios: "
git commit -m "%mensaje%"

git push origin main

echo ========================================
echo ¡Listo! Cambios subidos con exito.
echo ========================================
pause