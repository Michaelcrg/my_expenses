<?php
require_once __DIR__ . '/loadenv.php';
loadEnv();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$cookie = $_COOKIE['PHPSESSID'] ?? '';
if (!$cookie) {
    http_response_code(403);
    echo json_encode(['error' => 'Session cookie not found']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$expense_id = $data['id'] ?? null;

if (!$expense_id) {
    http_response_code(400);
    echo json_encode(["error" => "Missing expense ID in request body"]);
    exit;
}

$baseEndpoint = getenv("VITE_API_DELETE_EXPENSES_URL");
$endpoint = $baseEndpoint . '?id=' . urlencode($expense_id);

$ch = curl_init();
curl_setopt($ch, CURLOPT_COOKIE, "PHPSESSID=" . $cookie);
curl_setopt($ch, CURLOPT_URL, $endpoint);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt_array($ch, [
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_TIMEOUT => 30
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    error_log("cURL Error: " . curl_error($ch));
    http_response_code(500);
    echo json_encode(['error' => 'cURL Error']);
    curl_close($ch);
    exit;
}

curl_close($ch);
http_response_code($http_code);
echo $response;
