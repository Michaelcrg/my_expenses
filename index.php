<?php
require_once __DIR__ . '/backend/api/cors.php';

require __DIR__ . '/backend/private_config/db_connect.php';
$db = Database::get();


if (file_exists(__DIR__ . '/index.html')) {
    include __DIR__ . '/index.html';
} else {
    echo "Esegui 'npm run build' in frontend/";
}
