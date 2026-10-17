$bytes = [System.IO.File]::ReadAllBytes('assets/models/bunga_matahari.glb')
$jsonLen = [System.BitConverter]::ToUInt32($bytes, 12)
$jsonBytes = New-Object byte[] $jsonLen
[System.Array]::Copy($bytes, 20, $jsonBytes, 0, $jsonLen)
$jsonStr = [System.Text.Encoding]::UTF8.GetString($jsonBytes)
$glb = ConvertFrom-Json $jsonStr

Write-Output "MATERIALS:"
foreach ($m in $glb.materials) {
    Write-Output "MAT: $($m.name) - baseColor: $($m.pbrMetallicRoughness.baseColorFactor -join ',')"
}

Write-Output "LEAF NODES & MESHES:"
foreach ($n in $glb.nodes) {
    if ($n.name -like '*LEAF*') {
        $meshIdx = $n.mesh
        $matIdx = if ($meshIdx -ne $null) { $glb.meshes[$meshIdx].primitives[0].material } else { 'none' }
        Write-Output "NODE: $($n.name) | Mesh: $meshIdx | Mat: $matIdx"
    }
}
