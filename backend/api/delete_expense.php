<?php
require __DIR__ . '/cors.php';
require __DIR__ . '/check_session.php';
require __DIR__ . '/../private_config/db_connect.php';

$expense_id = $_GET['id'] ?? null;

if (!$expense_id || !is_numeric($expense_id)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid or missing ID"]);
    exit;
}

error_log("Received ID: " . $expense_id);

try {
    $conn = Database::get();
    $stmt = $conn->prepare("DELETE FROM expenses WHERE id = ?");
    $stmt->bind_param("i", $expense_id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Expense successfully deleted"]);
    } else {
        echo json_encode(["success" => false, "error" => "No expense found with the provided ID"]);
    }
} catch (Exception $e) {
    error_log("Server error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Server error', 'details' => $e->getMessage()]);
    exit;
}
