<?php

ini_set('display_errors', 0); // Disable error reporting for production
error_reporting(E_ALL); // Still report all errors internally

header("Access-Control-Allow-Origin: http://localhost:5173"); // React app URL
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true"); // Allow credentials

// Include database connection
require_once 'db_connection.php';

header('Content-Type: application/json');

// Get JSON input from the request
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['task_id'], $data['status'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

$taskId = $data['task_id'];
$status = $data['status']; // "pending" or "completed"

// Validate status
$validStatuses = ['pending', 'completed'];
if (!in_array($status, $validStatuses)) {
    echo json_encode(['success' => false, 'message' => 'Invalid status value']);
    exit;
}

try {
    $query = $pdo->prepare("UPDATE tasks SET status = :status WHERE task_id = :task_id");
    $query->bindParam(':status', $status, PDO::PARAM_STR);
    $query->bindParam(':task_id', $taskId, PDO::PARAM_INT);
    $query->execute();

    if ($query->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Task status updated']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Task not found or no changes made']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
