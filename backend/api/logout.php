<?php
require __DIR__ . '/cors.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

session_start();
session_unset();
session_destroy();
setcookie(session_name(), '', time() - 42000, '/');
http_response_code(200);
echo json_encode(['status' => 'logout_success']);
