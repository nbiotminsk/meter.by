# PowerShell скрипт для конвертации SVG favicon в PNG форматы
# Требует установленного Inkscape или ImageMagick

$svgPath = "images/favicon.svg"

# Проверка наличия SVG файла
if (-not (Test-Path $svgPath)) {
    Write-Error "Файл $svgPath не найден!"
    exit 1
}

Write-Host "Конвертация favicon из SVG в PNG форматы..." -ForegroundColor Green

# Проверка наличия Inkscape
$inkscape = Get-Command inkscape -ErrorAction SilentlyContinue

if ($inkscape) {
    Write-Host "Используется Inkscape для конвертации..." -ForegroundColor Cyan
    
    # Конвертация в разные размеры
    & inkscape $svgPath --export-type=png --export-filename=images/favicon-16x16.png -w 16 -h 16
    & inkscape $svgPath --export-type=png --export-filename=images/favicon-32x32.png -w 32 -h 32
    & inkscape $svgPath --export-type=png --export-filename=images/apple-touch-icon.png -w 180 -h 180
    
    Write-Host "✓ Конвертация завершена успешно!" -ForegroundColor Green
    exit 0
}

# Проверка наличия ImageMagick
$magick = Get-Command magick -ErrorAction SilentlyContinue

if ($magick) {
    Write-Host "Используется ImageMagick для конвертации..." -ForegroundColor Cyan
    
    # Конвертация в разные размеры
    & magick convert $svgPath -resize 16x16 images/favicon-16x16.png
    & magick convert $svgPath -resize 32x32 images/favicon-32x32.png
    & magick convert $svgPath -resize 180x180 images/apple-touch-icon.png
    
    # Создание ICO файла
    & magick convert $svgPath -define icon:auto-resize=16,32,48 favicon.ico
    
    Write-Host "✓ Конвертация завершена успешно!" -ForegroundColor Green
    exit 0
}

# Если ни одна программа не найдена
Write-Host ""
Write-Host "❌ Не найдены программы для конвертации SVG!" -ForegroundColor Red
Write-Host ""
Write-Host "Установите одну из программ:" -ForegroundColor Yellow
Write-Host "1. Inkscape: https://inkscape.org/release/" -ForegroundColor White
Write-Host "   winget install Inkscape.Inkscape" -ForegroundColor Gray
Write-Host ""
Write-Host "2. ImageMagick: https://imagemagick.org/script/download.php" -ForegroundColor White
Write-Host "   winget install ImageMagick.ImageMagick" -ForegroundColor Gray
Write-Host ""
Write-Host "Или используйте онлайн конвертер:" -ForegroundColor Yellow
Write-Host "   https://cloudconvert.com/svg-to-png" -ForegroundColor White
Write-Host ""

exit 1
