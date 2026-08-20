Add-Type -AssemblyName System.Drawing
$sourcePath = (Resolve-Path '.\images\favicon.png').Path
$outputPath = Join-Path (Split-Path $sourcePath) 'favicon-ready.png'
$source = [System.Drawing.Bitmap]::new($sourcePath)
$minX = $source.Width
$minY = $source.Height
$maxX = -1
$maxY = -1
for ($y = 0; $y -lt $source.Height; $y++) {
  for ($x = 0; $x -lt $source.Width; $x++) {
    $color = $source.GetPixel($x, $y)
    $isWhite = $color.R -gt 170 -and $color.G -gt 170 -and $color.B -gt 170
    $isRed = $color.R -gt 120 -and $color.R -gt ($color.G * 1.25) -and $color.R -gt ($color.B * 1.1)
    if ($isWhite -or $isRed) {
      $minX = [Math]::Min($minX, $x)
      $minY = [Math]::Min($minY, $y)
      $maxX = [Math]::Max($maxX, $x)
      $maxY = [Math]::Max($maxY, $y)
    }
  }
}
$padding = 12
$cropLeft = [Math]::Max(0, $minX - $padding)
$cropTop = [Math]::Max(0, $minY - $padding)
$cropRight = [Math]::Min($source.Width - 1, $maxX + $padding)
$cropBottom = [Math]::Min($source.Height - 1, $maxY + $padding)
$cropWidth = $cropRight - $cropLeft + 1
$cropHeight = $cropBottom - $cropTop + 1
$size = [Math]::Max($cropWidth, $cropHeight)
$canvas = [System.Drawing.Bitmap]::new($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$graphics.Clear([System.Drawing.Color]::Transparent)
$offsetX = [int](($size - $cropWidth) / 2)
$offsetY = [int](($size - $cropHeight) / 2)
for ($y = 0; $y -lt $cropHeight; $y++) {
  for ($x = 0; $x -lt $cropWidth; $x++) {
    $color = $source.GetPixel($cropLeft + $x, $cropTop + $y)
    $isWhite = $color.R -gt 170 -and $color.G -gt 170 -and $color.B -gt 170
    $isRed = $color.R -gt 120 -and $color.R -gt ($color.G * 1.25) -and $color.R -gt ($color.B * 1.1)
    if ($isWhite -or $isRed) {
      $canvas.SetPixel($offsetX + $x, $offsetY + $y, [System.Drawing.Color]::FromArgb(255, $color.R, $color.G, $color.B))
    }
  }
}
$canvas.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$canvas.Dispose()
$source.Dispose()
Write-Output "created=$outputPath crop=${cropWidth}x${cropHeight} canvas=${size}x${size}"
