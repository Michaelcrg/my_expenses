<?php

require __DIR__ . '/cors.php';
require __DIR__ . '/../private_config/db_connect.php';

error_log("Session ID in login.php: " . session_id());

$input = json_decode(file_get_contents('php://input'), true);

if (!is_array($input) || empty($input['email']) || empty($input['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing or malformed data']);
    exit;
}

$email = $input['email'];
$password = $input['password'];

try {
    $conn = Database::get();
    $stmt = $conn->prepare('SELECT id, password, firstName, lastName FROM users WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['firstName'] = $user['firstName'];
        $_SESSION['lastName'] = $user['lastName'];

        echo json_encode([
            'status' => 'success',
            'user_id' => $user['id'],
            'firstName' => $user['firstName'],
            'lastName' => $user['lastName'],
            'email' => $email,
        ]);
        exit;
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        exit;
    }
} catch (Exception $e) {
    error_log('Login error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
    exit;
}
