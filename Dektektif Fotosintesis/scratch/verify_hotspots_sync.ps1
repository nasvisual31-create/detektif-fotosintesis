# Script to verify 3D Hotspot switching and synchronization in both Materi and Simulasi
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

$artifactDir = "C:\Users\User\.gemini\antigravity-ide\brain\2a9d9e3c-19ad-4b4c-9734-7aa8f565377a"
$port = 9224

# Start Chrome with remote debugging
$chromeProc = Start-Process -FilePath $chromePath -ArgumentList @(
    "--remote-debugging-port=$port",
    "--headless=new",
    "--disable-gpu",
    "--window-size=1280,800",
    "--user-data-dir=$env:TEMP\chrome_verify_hotspots_2"
) -PassThru

Start-Sleep -Seconds 2

try {
    # Get WebSocket debugger URL for the page target
    $targets = Invoke-RestMethod -Uri "http://localhost:$port/json"
    $pageTarget = $targets | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
    $wsUrl = $pageTarget.webSocketDebuggerUrl

    $ws = [System.Net.WebSockets.ClientWebSocket]::new()
    $cts = [System.Threading.CancellationTokenSource]::new()
    $ws.ConnectAsync([Uri]$wsUrl, $cts.Token).Wait()

    $msgId = 1
    function Send-CDP ($method, $params = @{}) {
        $script:msgId++
        $cmd = @{ id = $script:msgId; method = $method; params = $params } | ConvertTo-Json -Depth 10 -Compress
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($cmd)
        $segment = [ArraySegment[byte]]::new($bytes)
        $ws.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cts.Token).Wait()

        $buffer = [byte[]]::new(2097152) # 2MB buffer
        $recvSegment = [ArraySegment[byte]]::new($buffer)
        
        while ($true) {
            $mem = [System.IO.MemoryStream]::new()
            do {
                $res = $ws.ReceiveAsync($recvSegment, $cts.Token).Result
                $mem.Write($buffer, 0, $res.Count)
            } while (-not $res.EndOfMessage)
            
            $respJson = [System.Text.Encoding]::UTF8.GetString($mem.ToArray())
            $parsed = $respJson | ConvertFrom-Json
            if ($parsed.id -eq $script:msgId) {
                return $parsed
            }
        }
    }

    function Eval-JS ($expr) {
        $res = Send-CDP "Runtime.evaluate" @{ expression = $expr; returnByValue = $true }
        return $res.result.result.value
    }

    function Take-Screenshot ($filename) {
        $res = Send-CDP "Page.captureScreenshot" @{ format = "png" }
        if ($res.result -and $res.result.data) {
            $bytes = [Convert]::FromBase64String($res.result.data)
            [System.IO.File]::WriteAllBytes("$artifactDir\$filename", $bytes)
            Write-Host "Saved screenshot: $filename ($($bytes.Length) bytes)"
        } else {
            Write-Host "Failed to capture screenshot: $filename"
        }
    }

    Send-CDP "Page.enable" | Out-Null
    Send-CDP "Runtime.enable" | Out-Null

    # Open App
    Send-CDP "Page.navigate" @{ url = "http://localhost:8086/" } | Out-Null
    Start-Sleep -Seconds 3

    # Ensure student profile is set so navigation works smoothly
    Eval-JS "localStorage.setItem('sunflower_edu_state', JSON.stringify({ user: { name: 'Budi', class: '4A', avatar: '🌻' }, progress: { unlockedLevel: 8 } }));" | Out-Null

    # ----------------------------------------------------
    # TEST 1: MATERI 3D
    # ----------------------------------------------------
    Write-Host "`n=== TEST 1: MATERI 3D ==="
    Eval-JS "window.appRouter.navigate('/materi');" | Out-Null
    Start-Sleep -Seconds 2

    # Click tab Eksplorasi 3D & Tombol
    Eval-JS "const btn3D = document.querySelector('#tab-btn-3d'); if (btn3D) btn3D.click();" | Out-Null
    Start-Sleep -Seconds 3

    # Check plant hotspots
    $plantHotspotsMateri = Eval-JS "Array.from(document.querySelectorAll('.hotspot-tooltip-title')).map(e => e.textContent.trim())"
    Write-Host "1. Initial Plant Hotspots in Materi:" ($plantHotspotsMateri -join ", ")
    Take-Screenshot "materi_1_plant_hotspots.png"

    # Switch to Procedural Leaf (Sel Mesofil)
    Eval-JS "document.querySelector('#btn-toggle-procedural').click();" | Out-Null
    Start-Sleep -Seconds 2

    $cellHotspotsMateri = Eval-JS "Array.from(document.querySelectorAll('.hotspot-tooltip-title')).map(e => e.textContent.trim())"
    Write-Host "2. Mesophyll Hotspots in Materi:" ($cellHotspotsMateri -join ", ")
    Take-Screenshot "materi_2_cell_hotspots.png"

    # Switch back to Plant (Kembali ke Model Tanaman)
    Eval-JS "document.querySelector('#btn-toggle-procedural').click();" | Out-Null
    Start-Sleep -Seconds 2

    $returnedPlantMateri = Eval-JS "Array.from(document.querySelectorAll('.hotspot-tooltip-title')).map(e => e.textContent.trim())"
    Write-Host "3. Returned Plant Hotspots in Materi:" ($returnedPlantMateri -join ", ")
    Take-Screenshot "materi_3_returned_plant_hotspots.png"

    # ----------------------------------------------------
    # TEST 2: SIMULASI 3D
    # ----------------------------------------------------
    Write-Host "`n=== TEST 2: SIMULASI 3D ==="
    Eval-JS "window.appRouter.navigate('/simulasi');" | Out-Null
    Start-Sleep -Seconds 3

    # Check plant hotspots in Simulasi
    $plantHotspotsSim = Eval-JS "Array.from(document.querySelectorAll('.hotspot-tooltip-title')).map(e => e.textContent.trim())"
    Write-Host "1. Initial Plant Hotspots in Simulasi:" ($plantHotspotsSim -join ", ")
    Take-Screenshot "simulasi_1_plant_hotspots.png"

    # Switch to Sel Mesofil (#btn-view-mesofil)
    Eval-JS "document.querySelector('#btn-view-mesofil').click();" | Out-Null
    Start-Sleep -Seconds 2

    $cellHotspotsSim = Eval-JS "Array.from(document.querySelectorAll('.hotspot-tooltip-title')).map(e => e.textContent.trim())"
    Write-Host "2. Mesophyll Hotspots in Simulasi:" ($cellHotspotsSim -join ", ")
    Take-Screenshot "simulasi_2_cell_hotspots.png"

    # Switch back to Bunga Utuh (#btn-view-plant)
    Eval-JS "document.querySelector('#btn-view-plant').click();" | Out-Null
    Start-Sleep -Seconds 2

    $returnedPlantSim = Eval-JS "Array.from(document.querySelectorAll('.hotspot-tooltip-title')).map(e => e.textContent.trim())"
    Write-Host "3. Returned Plant Hotspots in Simulasi:" ($returnedPlantSim -join ", ")
    Take-Screenshot "simulasi_3_returned_plant_hotspots.png"

    # Test Hotspot click in plant mode in Simulasi
    Eval-JS "const pins = document.querySelectorAll('.hotspot-pin'); if (pins.length > 0) pins[0].click();" | Out-Null
    Start-Sleep -Seconds 1
    $expTitle = Eval-JS "document.querySelector('#exp-title') ? document.querySelector('#exp-title').innerText : ''"
    Write-Host "Hotspot click explanation title in Simulasi:" $expTitle
    Take-Screenshot "simulasi_4_hotspot_clicked_explanation.png"

    Write-Host "`n=== SUMMARY RESULTS ==="
    $materiOK = ($returnedPlantMateri -match "Bunga") -and ($returnedPlantMateri -notmatch "Kloroplas")
    $simulasiOK = ($returnedPlantSim -match "Bunga") -and ($returnedPlantSim -notmatch "Kloroplas")
    Write-Host "Materi Hotspots Return-to-Plant Successful:" $materiOK
    Write-Host "Simulasi Hotspots Return-to-Plant Successful:" $simulasiOK

} finally {
    if ($ws -and $ws.State -eq [System.Net.WebSockets.WebSocketState]::Open) {
        $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "Done", [System.Threading.CancellationToken]::None).Wait()
    }
    Stop-Process -Id $chromeProc.Id -Force -ErrorAction SilentlyContinue
}
