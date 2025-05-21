<?php
require_once __DIR__ . '/loadenv.php';
loadEnv();

$cookie = $_COOKIE['PHPSESSID'] ?? '';

if (!$cookie) {
    http_response_code(403);
    echo json_encode(['error' => 'Session cookie not found']);
    exit;
}

$baseEndpoint = getenv("VITE_API_GET_CATEGORIES_URL");

$ch = curl_init($baseEndpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FAILONERROR, false);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_MAXREDIRS, 5);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_COOKIE, "PHPSESSID=" . $cookie);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($response === false || $httpCode >= 400) {
    error_log("Proxy Error: HTTP $httpCode, curl_error: $error");
    http_response_code(502);
    echo json_encode(['error' => 'Gateway error', 'details' => "HTTP $httpCode"]);
    exit;
}

$json = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log("Proxy Error: non-JSON response: " . substr($response, 0, 200));
    http_response_code(502);
    echo json_encode(['error' => 'Invalid response from remote server']);
    exit;
}

echo json_encode($json);
