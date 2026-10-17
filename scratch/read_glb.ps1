$bytes = [System.IO.File]::ReadAllBytes('assets/models/bunga_matahari.glb')
$jsonLen = [System.BitConverter]::ToUInt32($bytes, 12)
$jsonBytes = New-Object byte[] $jsonLen
[System.Array]::Copy($bytes, 20, $jsonBytes, 0, $jsonLen)
$jsonStr = [System.Text.Encoding]::UTF8.GetString($jsonBytes)
$glb = ConvertFrom-Json $jsonStr
Write-Output "TOTAL NODES: $($glb.nodes.Count)"
foreach ($n in $glb.nodes) {
    if ($n.mesh -ne $null) {
        Write-Output "MESH NODE: $($n.name)"
    } else {
        Write-Output "GROUP NODE: $($n.name)"
    }
}
