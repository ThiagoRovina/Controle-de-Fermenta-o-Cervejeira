param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('dev', 'build', 'preview')]
    [string]$Command,

    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$ViteArgs
)

$ErrorActionPreference = 'Stop'

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$viteEntry = Join-Path $projectRoot 'node_modules\vite\bin\vite.js'

if ($projectRoot -notlike '*#*') {
    & node $viteEntry $Command @ViteArgs
    exit $LASTEXITCODE
}

if ($Command -eq 'build') {
    $tempRoot = Join-Path $env:TEMP 'fermentatrack-frontend-build'

    if (Test-Path $tempRoot) {
        Remove-Item -LiteralPath $tempRoot -Recurse -Force
    }

    New-Item -ItemType Directory -Path $tempRoot | Out-Null

    $files = @(
        'index.html',
        'package.json',
        'package-lock.json',
        'postcss.config.js',
        'tailwind.config.js',
        'tsconfig.json',
        'tsconfig.app.json',
        'tsconfig.node.json',
        'vite.config.ts'
    )

    foreach ($file in $files) {
        Copy-Item -LiteralPath (Join-Path $projectRoot $file) -Destination (Join-Path $tempRoot $file) -Force
    }

    Copy-Item -LiteralPath (Join-Path $projectRoot 'src') -Destination (Join-Path $tempRoot 'src') -Recurse -Force
    Copy-Item -LiteralPath (Join-Path $projectRoot 'public') -Destination (Join-Path $tempRoot 'public') -Recurse -Force
    cmd /c "mklink /J `"$tempRoot\node_modules`" `"$projectRoot\node_modules`"" | Out-Null

    Push-Location $tempRoot
    try {
        & node '.\node_modules\vite\bin\vite.js' build @ViteArgs
        $exitCode = $LASTEXITCODE

        if ($exitCode -eq 0) {
            $projectDist = Join-Path $projectRoot 'dist'
            if (Test-Path $projectDist) {
                Remove-Item -LiteralPath $projectDist -Recurse -Force
            }
            Copy-Item -LiteralPath (Join-Path $tempRoot 'dist') -Destination $projectDist -Recurse -Force
        }
    }
    finally {
        Pop-Location
    }

    exit $exitCode
}

$driveLetters = @('V', 'W', 'X', 'Y', 'Z')
$mappedDrive = $null

foreach ($letter in $driveLetters) {
    $drive = "${letter}:"

    if (-not (Test-Path "$drive\")) {
        cmd /c "subst $drive `"$projectRoot`"" | Out-Null

        if ($LASTEXITCODE -eq 0 -and (Test-Path "$drive\")) {
            $mappedDrive = $drive
            break
        }
    }
}

if ($null -eq $mappedDrive) {
    throw 'Nao foi possivel criar uma unidade temporaria para executar o Vite sem o caractere # no caminho.'
}

try {
    Push-Location "$mappedDrive\"
    & node '.\node_modules\vite\bin\vite.js' $Command @ViteArgs
    $exitCode = $LASTEXITCODE
}
finally {
    Pop-Location
    cmd /c "subst $mappedDrive /D" | Out-Null
}

exit $exitCode
