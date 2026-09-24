$key = "rzp_live_TaBVwbfDRE5yH4"
$secret = "elqofWGqkxF6CfNzOZuxlmwM"
$pair = "${key}:${secret}"
$bytes = [System.Text.Encoding]::ASCII.GetBytes($pair)
$base64 = [System.Convert]::ToBase64String($bytes)
$headers = @{
    "Authorization" = "Basic $base64"
    "Content-Type" = "application/json"
}
$body = '{"amount": 900, "currency": "INR", "receipt": "rcpt_001"}'

try {
    $response = Invoke-RestMethod -Uri "https://api.razorpay.com/v1/orders" -Method POST -Headers $headers -Body $body
    Write-Host "RAZORPAY SERVER ORDER CREATED:"
    $response | ConvertTo-Json
} catch {
    Write-Host "RAZORPAY ERROR: $_"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host $reader.ReadToEnd()
    }
}
