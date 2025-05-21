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
if (!$data || !isset($data['user_id']) || !isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data.']);
    exit;
}
$baseEndpoint = getenv("VITE_API_UPDATE_EXPENSES_URL");
$endpoint = $baseEndpoint;


$ch = curl_init();
curl_setopt($ch, CURLOPT_COOKIE, "PHPSESSID=" . $cookie);
curl_setopt_array($ch, [
    CURLOPT_URL => $endpoint,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",

    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_TIMEOUT => 30,
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    error_log("Errore cURL: " . curl_error($ch));
    http_response_code(500);
    echo json_encode(['error' => 'cURL error', 'details' => curl_error($ch)]);
    curl_close($ch);
    exit;
}

curl_close($ch);
http_response_code($http_code);
echo $response;
