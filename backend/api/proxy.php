<?php
require_once __DIR__ . '/loadenv.php';
loadEnv();

$allowedHosts = ['localhost', '127.0.0.1', '::1', 'myexpenses.altervista.org'];

$originHeader = $_SERVER['HTTP_ORIGIN'] ?? '';
$originHost = '';

if (!empty($originHeader)) {
    $originHost = parse_url($originHeader, PHP_URL_HOST);
} else {
    // fallback: prendi solo hostname da HTTP_HOST senza porta
    $originHost = explode(':', $_SERVER['HTTP_HOST'] ?? '')[0];
}

$originHost = trim($originHost);


if (!in_array($originHost, $allowedHosts, true)) {
    error_log("Access denied from: '" . $originHost . "'");
    http_response_code(403);
    echo json_encode(["error" => "Access denied."]);
    exit;
}

// Leggi input JSON e validalo
$data = json_decode(file_get_contents("php://input"));
if ($data === null || !isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing or malformed data"]);
    exit;
}

$baseEndpoint = trim(getenv("VITE_API_LOGIN_URL"));
if (empty($baseEndpoint)) {
    error_log("VITE_API_LOGIN_URL non impostata o vuota");
    http_response_code(500);
    echo json_encode(['error' => 'VITE_API_LOGIN_URL not set']);
    exit;
}
if (!filter_var($baseEndpoint, FILTER_VALIDATE_URL)) {
    error_log("Invalid URL API: $baseEndpoint");
    http_response_code(500);
    echo json_encode(['error' => 'Invalid URL API']);
    exit;
}

// Configura cURL per includere header nella risposta
$ch = curl_init($baseEndpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);  // IMPORTANTE: leggere header + body
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
]);

$response = curl_exec($ch);

if ($response === false) {
    $curlError = curl_error($ch);
    error_log("Errore cURL: $curlError");
    http_response_code(500);
    echo json_encode(['error' => "Error on remote API call: $curlError"]);
    curl_close($ch);
    exit;
}

$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

// Separa header e body
$headers = substr($response, 0, $header_size);
$body = substr($response, $header_size);

curl_close($ch);

// Gestione cookie PHPSESSID se presente negli header
if (preg_match('/Set-Cookie:\s*PHPSESSID=([^;]+)/i', $headers, $matches)) {
    $phpsessid = $matches[1];
    setcookie('PHPSESSID', $phpsessid, [
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

// Debug: controlla che il body sia JSON valido
if (json_decode($body) === null && json_last_error() !== JSON_ERROR_NONE) {
    error_log("Invalid API respone JSON:" . $body);
    http_response_code(500);
    echo json_encode(['error' => 'Invalid JSON response from API']);
    exit;
}

http_response_code($http_code);
header('Content-Type: application/json');
echo $body;
