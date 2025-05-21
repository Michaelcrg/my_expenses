<?php
header('Content-Type: text/plain');
require __DIR__ . '/private_config/db_connect.php';

try {
    $conn = Database::get();
    echo "✅ Connesso al DB!\n";
    echo "Host info: " . $conn->host_info . "\n";


    $result = $conn->query("SELECT 1+1 AS test");
    echo "Risultato query: " . $result->fetch_assoc()['test'];
} catch (Exception $e) {
    echo "❌ ERRORE: " . $e->getMessage();
}
