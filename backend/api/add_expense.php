<?php

require __DIR__ . '/cors.php';
require __DIR__ . '/../private_config/db_connect.php';
require __DIR__ . '/check_session.php';
try {

    $data = json_decode(file_get_contents("php://input"), true);

    $user_id = $data['user_id'] ?? null;

    if (!$user_id) {
        throw new Exception("User ID mancante nella richiesta");
    }

    $conn = Database::get();
    if (!$conn) {
        throw new Exception("Errore nella connessione al database");
    }

    if (!isset($data['categoria'], $data['data'], $data['descrizione'], $data['importo'])) {
        throw new Exception("Dati mancanti nella richiesta");
    }


    $stmt = $conn->prepare("INSERT INTO expenses (user_id, categoria, data, descrizione, importo) VALUES (?, ?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Errore nella preparazione della query: " . $conn->error);
    }


    $bind_result = $stmt->bind_param(
        "isssd",  // Tipo dei dati: intero, stringa, stringa, stringa, decimale
        $user_id,
        $data['categoria'],
        $data['data'],
        $data['descrizione'],
        $data['importo']
    );

    if (!$bind_result) {
        throw new Exception("Errore nel bind_param: " . $stmt->error);
    }


    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Spesa inserita con successo',
            'insert_id' => $stmt->insert_id
        ]);
    } else {
        throw new Exception("Errore nell'inserimento nel database");
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Errore database',
        'details' => $e->getMessage()
    ]);
}
