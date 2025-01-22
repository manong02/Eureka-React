<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); // React app URL
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true"); // Allow credentials
ini_set('session.cookie_domain', 'localhost'); // If you're working on localhost

ini_set('session.cookie_domain', 'localhost'); // Ensures cookies are valid for localhost
session_start();

// Debugging session
error_log("Session user_id: " . (isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 'Not set'));

error_reporting(0); // Disable error reporting for production
ini_set('display_errors', 0); // Disable displaying errors

ob_clean(); // Clean any previous output buffers
header('Content-Type: application/json'); // Set content type to JSON

include('db_connection.php');



// Handle preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); // Respond with status 200 for OPTIONS request
    exit();
}

// Check if the user is logged in
if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit();
}

$user_id = $_SESSION['user_id']; // After user successfully logs in


// get form data

$data = json_decode(file_get_contents('php://input'), true);

$title = $data['title'];
$description = $data['description'];
$subject_id = $data['subjectId'];
$due_date = $data['dueDate'];


try {
    // Prepare the INSERT query using PDO
    $stmt = $pdo->prepare("INSERT INTO tasks (title, description, subject_id, due_date, user_id) 
                           VALUES (:title, :description, :subject_id, :due_date, :user_id)");

    // Bind the values to the placeholders
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':subject_id', $subject_id);
    $stmt->bindParam(':due_date', $due_date);
    $stmt->bindParam(':user_id', $user_id);

    // Execute the statement
    $stmt->execute();

    // Return success response
    echo json_encode(['success' => true, 'message' => 'New task created successfully!']);
} catch (PDOException $e) {
    // Handle errors and display a message
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
