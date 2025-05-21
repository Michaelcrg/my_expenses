<?php

require_once __DIR__ . '/api/loadenv.php';
loadEnv();

define('MIGRATION_KEY', $_ENV['MIGRATION_KEY'] ?? '');

if (php_sapi_name() === 'cli') {
    $providedKey = $argv[1] ?? '';
} else {
    $providedKey = $_GET['key'] ?? '';
}

echo "Chiave ricevuta: " . $providedKey . "\n";

if ($providedKey !== MIGRATION_KEY) {
    http_response_code(403);
    exit("Accesso negato - Chiave non valida\n");
}

echo "Chiave corretta! Procedendo con la migrazione...\n";

require __DIR__ . '/private_config/db_connect.php';
echo "File di connessione incluso correttamente!\n";


try {
    $conn = Database::get();

    $createTableQuery = "CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        file VARCHAR(100) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    if (!$conn->query($createTableQuery)) {
        throw new Exception("Errore creazione tabella migrations: " . $conn->error);
    }

    $migrations = glob(__DIR__ . '/migrations/*.sql');
    if (empty($migrations)) {
        exit("Nessuna migrazione trovata");
    }

    natsort($migrations);

    foreach ($migrations as $file) {
        $filename = basename($file);

        $stmt = $conn->prepare("SELECT id FROM migrations WHERE file = ?");
        if (!$stmt) throw new Exception("Errore di preparazione SELECT: " . $conn->error);

        $stmt->bind_param("s", $filename);
        $stmt->execute();

        if ($stmt->get_result()->num_rows === 0) {
            $sql = file_get_contents($file);
            if ($conn->multi_query($sql)) {
                while ($conn->more_results()) {
                    $conn->next_result();
                    if ($result = $conn->store_result()) {
                        $result->free();
                    }
                }

                $insert = $conn->prepare("INSERT INTO migrations (file) VALUES (?)");
                if (!$insert) throw new Exception("Errore preparazione INSERT: " . $conn->error);

                $insert->bind_param("s", $filename);
                if (!$insert->execute()) {
                    throw new Exception("Errore INSERT: " . $insert->error);
                }

                echo "✅ $filename eseguito\n";
            } else {
                throw new Exception("❌ Errore in $filename: " . $conn->error);
            }
        }
    }

    echo "Migrazioni completate con successo!\n";
} catch (Exception $e) {
    if (isset($conn)) $conn->rollback();
    error_log("MIGRATION ERROR: " . $e->getMessage());
    exit($e->getMessage());
} finally {
    if (isset($conn)) $conn->close();
}
