Add-Type -AssemblyName System.Drawing

$logoPath = 'C:\Users\Subhadeep\.gemini\antigravity\scratch\jago-mobile-app\public\logo.jpg'
$img = [System.Drawing.Image]::FromFile($logoPath)

function Save-Resized($sourceImg, $destPath, $width, $height) {
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($sourceImg, 0, 0, $width, $height)
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

$base = 'C:\Users\Subhadeep\.gemini\antigravity\scratch\jago-mobile-app'

Save-Resized $img "$base\public\logo.png" 512 512
Save-Resized $img "$base\public\icon-192.png" 192 192
Save-Resized $img "$base\public\icon-512.png" 512 512
Save-Resized $img "$base\public\favicon.png" 64 64
Save-Resized $img "$base\src\assets\jago-logo.png" 512 512

# Android mipmaps
Save-Resized $img "$base\android\app\src\main\res\mipmap-mdpi\ic_launcher.png" 48 48
Save-Resized $img "$base\android\app\src\main\res\mipmap-mdpi\ic_launcher_round.png" 48 48
Save-Resized $img "$base\android\app\src\main\res\mipmap-hdpi\ic_launcher.png" 72 72
Save-Resized $img "$base\android\app\src\main\res\mipmap-hdpi\ic_launcher_round.png" 72 72
Save-Resized $img "$base\android\app\src\main\res\mipmap-xhdpi\ic_launcher.png" 96 96
Save-Resized $img "$base\android\app\src\main\res\mipmap-xhdpi\ic_launcher_round.png" 96 96
Save-Resized $img "$base\android\app\src\main\res\mipmap-xxhdpi\ic_launcher.png" 144 144
Save-Resized $img "$base\android\app\src\main\res\mipmap-xxhdpi\ic_launcher_round.png" 144 144
Save-Resized $img "$base\android\app\src\main\res\mipmap-xxxhdpi\ic_launcher.png" 192 192
Save-Resized $img "$base\android\app\src\main\res\mipmap-xxxhdpi\ic_launcher_round.png" 192 192

# Splash
Save-Resized $img "$base\android\app\src\main\res\drawable\splash.png" 480 800

$img.Dispose()
Write-Host "All icons and splash generated with official JAGO logo!"
