<?php

// Enable CORS
header("Access-Control-Allow-Origin: *"); // Allow all origins, or replace '*' with 'http://localhost:5173' for a more secure setup
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

ini_set('session.cookie_domain', 'localhost'); // If you're working on localhost
session_start();
$_SESSION['user_id'] = $user_id;  // Set session variable

// Include database connection
include('db_connection.php');

header('Content-Type: application/json'); // Ensure the response is in JSON format

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $username = htmlspecialchars(filter_input(INPUT_POST, "username", FILTER_SANITIZE_SPECIAL_CHARS));
    $password = htmlspecialchars(filter_input(INPUT_POST, "password", FILTER_SANITIZE_SPECIAL_CHARS));

    // Validate password
    if (
        strlen($password) < 10 || !preg_match('/[A-Z]/', $password)
        || !preg_match('/[0-9]/', $password)
        || !preg_match('/[\W_]/', $password)
    ) {
        // Send validation error
        echo json_encode(["status" => "error", "message" => "Password must be at least 10 characters long, contain an uppercase letter, a number, and a special character."]);
        exit;
    }

    // Hash the password before storing it
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Check if the username already exists
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = :username");
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        $user_exists = $stmt->fetchColumn();

        if ($user_exists) {
            // Send error response for existing username
            echo json_encode(["status" => "error", "message" => "Username already taken."]);
        } else {
            // Prepare the SQL query to insert the new user
            $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (:username, :password)");

            // Bind the values to the placeholders
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':password', $hashed_password);

            // Execute the query
            $stmt->execute();

            // Send success response
            echo json_encode(["status" => "success", "message" => "Account created successfully!"]);
        }
    } catch (PDOException $e) {
        // Send error response for database issues
        echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
    }
}
