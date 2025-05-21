<?php
require __DIR__ . '/check_session.php';
require __DIR__ . '/cors.php';
require __DIR__ . '/../private_config/db_connect.php';

try {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    $conn = Database::get();
    if (!$conn) {
        throw new Exception("Database connection error");
    }

    $stmt = $conn->prepare("SELECT * FROM categorie");
    if (!$stmt) {
        throw new Exception("Query preparation error: " . $conn->error);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $categories = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($categories);
    } else {
        echo json_encode([]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
}
