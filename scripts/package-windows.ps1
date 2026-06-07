$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$releaseDir = Join-Path $root "release"
$appDir = Join-Path $releaseDir "OpenDeepL-app"
$appResourcesDir = Join-Path $appDir "resources\app"
$electronDist = Join-Path $root "node_modules\electron\dist"
$makensisCandidates = @(
  "C:\Program Files (x86)\NSIS\Bin\makensis.exe",
  "C:\Program Files (x86)\NSIS\makensis.exe",
  "C:\Program Files\NSIS\Bin\makensis.exe",
  "C:\Program Files\NSIS\makensis.exe"
)

$makensis = $makensisCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $makensis) {
  throw "NSIS makensis.exe was not found. Install NSIS first."
}

Remove-Item -LiteralPath $appDir -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $appResourcesDir | Out-Null

Copy-Item -Path (Join-Path $electronDist "*") -Destination $appDir -Recurse -Force
Rename-Item -LiteralPath (Join-Path $appDir "electron.exe") -NewName "OpenDeepL.exe"

Copy-Item -Path (Join-Path $root "dist") -Destination (Join-Path $appResourcesDir "dist") -Recurse -Force
Copy-Item -Path (Join-Path $root "electron") -Destination (Join-Path $appResourcesDir "electron") -Recurse -Force
Copy-Item -Path (Join-Path $root "package.json"), (Join-Path $root "package-lock.json") -Destination $appResourcesDir -Force

npm install --omit=dev --prefix $appResourcesDir

& $makensis (Join-Path $root "installer\OpenDeepL.nsi")
