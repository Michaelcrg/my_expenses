<?php

require_once __DIR__ . '/loadenv.php';
loadEnv();

$user_id = $_GET['user_id'] ?? null;
if (!$user_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing User ID']);
    exit;
}

$cookie = $_COOKIE['PHPSESSID'] ?? '';

if (!$cookie) {
    http_response_code(403);
    echo json_encode(['error' => 'Session cookie not found']);
    exit;
}

$baseEndpoint = getenv("VITE_API_GET_EXPENSES_URL");
$endpoint = $baseEndpoint . '?user_id=' . urlencode($user_id);

$ch = curl_init($endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
]);

curl_setopt($ch, CURLOPT_COOKIE, "PHPSESSID=" . $cookie);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($response === false || empty($response)) {
    error_log("cURL Error: " . $curlError);
    http_response_code(500);
    echo json_encode(['error' => 'Empty response or cURL error', 'details' => $curlError]);
    exit;
}

http_response_code($httpCode);
header('Content-Type: application/json');
echo $response;
