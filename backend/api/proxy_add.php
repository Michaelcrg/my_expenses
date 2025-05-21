<?php

require_once __DIR__ . '/loadenv.php';
loadEnv();

$cookie = $_COOKIE['PHPSESSID'] ?? '';

if (!$cookie) {
    http_response_code(403);
    echo json_encode(['error' => 'Session cookie not found']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$expense_id = $data['id'] ?? null;

$baseEndpoint = getenv("VITE_API_ADD_EXPENSES_URL");

$ch = curl_init();
curl_setopt($ch, CURLOPT_COOKIE, "PHPSESSID=" . $cookie);
curl_setopt_array($ch, [
    CURLOPT_URL => $baseEndpoint,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_FOLLOWLOCATION => true,
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$redirect_url = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);

http_response_code($http_code);

echo $response;

curl_close($ch);
