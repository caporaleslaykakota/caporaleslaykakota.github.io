@echo off
echo ========================================
echo Bajando cambios a GitHub automaticamente...
echo ========================================

git fetch origin
git reset --hard origin/main
git clean -fd

echo ========================================
echo ¡Listo! Cambios bajados con exito.
echo ========================================
pause