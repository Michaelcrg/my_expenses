<?php

require __DIR__ . '/check_session.php';
require __DIR__ . '/cors.php';
require __DIR__ . '/../private_config/db_connect.php';

$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
if (!$user_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing user ID']);
    exit;
}

try {
    $conn = Database::get();
    if (!$conn) throw new Exception('Database connection failed');

    $stmt = $conn->prepare(
        'SELECT e.id, e.descrizione, e.importo, e.data, c.nome AS categoria
         FROM expenses e
         LEFT JOIN categorie c ON e.categoria = c.id
         WHERE e.user_id = ?
         ORDER BY e.data DESC'
    );
    if (!$stmt) throw new Exception('Prepare failed: ' . $conn->error);

    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if (!$result) throw new Exception('get_result failed: ' . $stmt->error);

    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $rows]);
} catch (Exception $e) {
    error_log('get_expenses error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Server error', 'details' => $e->getMessage()]);
    exit;
}
