<?php
session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
    'cookie_secure' => false,
]);

require_once __DIR__ . '/loadenv.php';
loadEnv();

header('Content-Type: text/plain; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? null;

$allowedOriginsRaw = $_ENV['ALLOWED_ORIGINS'] ?? '';
$allowed_origins = array_map(function ($o) {
    return rtrim(trim($o), '/');
}, explode(',', $allowedOriginsRaw));

if ($origin !== null) {
    $origin = rtrim(trim($origin), '/');

    if (!in_array($origin, $allowed_origins, true)) {
        http_response_code(403);
        echo "✘ Forbidden: unauthorized origin\n";
        exit;
    }

    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-API-KEY");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
