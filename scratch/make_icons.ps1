Add-Type -AssemblyName System.Drawing

function Generate-SunflowerIcon {
    param(
        [int]$size,
        [string]$outPath
    )

    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Background: Rounded rectangle / circular mask in fresh emerald green
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 34, 197, 94))
    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $g.FillRectangle($bgBrush, $rect)

    $center = [float]($size / 2.0)
    $scale = [float]($size / 512.0)

    # Draw Green Leaves at the bottom
    $leafBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 21, 128, 61))
    $g.FillEllipse($leafBrush, [int]($center - 130 * $scale), [int]($center + 30 * $scale), [int](130 * $scale), [int](80 * $scale))
    $g.FillEllipse($leafBrush, [int]($center), [int]($center + 30 * $scale), [int](130 * $scale), [int](80 * $scale))

    # Draw 16 Sunflower Petals (Golden Yellow)
    $petalBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 250, 204, 21))
    $petalBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 234, 179, 8), [math]::Max(2, [int](3 * $scale)))
    
    $numPetals = 16
    for ($i = 0; $i -lt $numPetals; $i++) {
        $state = $g.Save()
        $g.TranslateTransform($center, $center)
        $g.RotateTransform([float]($i * (360.0 / $numPetals)))
        
        $pWidth = [float](46 * $scale)
        $pHeight = [float](130 * $scale)
        $pY = [float](-150 * $scale)
        $g.FillEllipse($petalBrush, [float](-$pWidth / 2.0), $pY, $pWidth, $pHeight)
        $g.DrawEllipse($petalBorder, [float](-$pWidth / 2.0), $pY, $pWidth, $pHeight)
        $g.Restore($state)
    }

    # Center Brown Disk
    $diskRadius = [float](88 * $scale)
    $diskBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 120, 53, 15))
    $g.FillEllipse($diskBrush, [float]($center - $diskRadius), [float]($center - $diskRadius), [float]($diskRadius * 2), [float]($diskRadius * 2))

    # Inner Disk Texture
    $seedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 180, 83, 9))
    $innerRadius = [float](58 * $scale)
    $g.FillEllipse($seedBrush, [float]($center - $innerRadius), [float]($center - $innerRadius), [float]($innerRadius * 2), [float]($innerRadius * 2))

    # Cheerful Smile Arc
    $smilePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 254, 240, 138), [math]::Max(3, [int](4 * $scale)))
    $smilePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $smilePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawArc($smilePen, [float]($center - 25 * $scale), [float]($center - 15 * $scale), [float](50 * $scale), [float](40 * $scale), [float]25, [float]130)

    # Eyes
    $eyeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 254, 240, 138))
    $g.FillEllipse($eyeBrush, [float]($center - 24 * $scale), [float]($center - 22 * $scale), [float](12 * $scale), [float](15 * $scale))
    $g.FillEllipse($eyeBrush, [float]($center + 12 * $scale), [float]($center - 22 * $scale), [float](12 * $scale), [float](15 * $scale))

    # Save PNG
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Successfully generated $outPath"
}

Generate-SunflowerIcon -size 192 -outPath "c:\Users\User\.gemini\antigravity-ide\scratch\leaf-interaction\assets\icon-192.png"
Generate-SunflowerIcon -size 512 -outPath "c:\Users\User\.gemini\antigravity-ide\scratch\leaf-interaction\assets\icon-512.png"
