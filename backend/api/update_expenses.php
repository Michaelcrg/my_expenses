<?php

require __DIR__ . '/cors.php';
require __DIR__ . '/../private_config/db_connect.php';
require __DIR__ . '/check_session.php';

try {
    $conn = Database::get();

    $inputData = json_decode(file_get_contents('php://input'), true);
    $user_id = $inputData['user_id'] ?? null;

    if (!$user_id) {
        throw new Exception("Missing user ID or user not authenticated.");
    }

    $id = $inputData['id'] ?? null;
    $data = $inputData['data'] ?? null;
    $descrizione = $inputData['descrizione'] ?? null;
    $importo = $inputData['importo'] ?? null;
    $categoria = $inputData['categoria'] ?? null;

    if (!$id || !$data || !$descrizione || !$importo || !$categoria) {
        throw new Exception("Please fill in all fields.");
    }

    $stmt = $conn->prepare("
        UPDATE expenses 
        SET data = ?, descrizione = ?, importo = ?, categoria = ? 
        WHERE id = ? AND user_id = ?
    ");

    if (!$stmt) {
        throw new Exception("Error preparing query: " . $conn->error);
    }

    $importo = floatval($importo);
    $categoria = intval($categoria);
    $id = intval($id);
    $user_id = intval($user_id);

    $stmt->bind_param("ssdsii", $data, $descrizione, $importo, $categoria, $id, $user_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Expense updated successfully']);
    } else {
        throw new Exception("Error updating expense: " . $stmt->error);
    }

    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error', 'details' => $e->getMessage()]);
}
