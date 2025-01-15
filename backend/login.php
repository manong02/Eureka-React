<?php

// Enable CORS
header("Access-Control-Allow-Origin: *"); // Allow all origins, or replace '*' with 'http://localhost:5173' for a more secure setup
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
session_start();

// include database connection
include('db_connection.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // get form data
    $username = htmlspecialchars(filter_input(INPUT_POST, "username", FILTER_SANITIZE_SPECIAL_CHARS));
    $password = htmlspecialchars(filter_input(INPUT_POST, "password", FILTER_SANITIZE_SPECIAL_CHARS));

    // check if fields are empty
    if (empty($username) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "Both fields are required"]);
        exit;
    }

    try {
        // Prepare the SQL query to get the user's data from the database
        $stmt = $pdo->prepare("SELECT password, user_id FROM users WHERE username = :username");

        // Bind the username to the query
        $stmt->bindParam(':username', $username);

        // Execute the query
        $stmt->execute();

        // Check if the user exists
        if ($stmt->rowCount() > 0) {
            // Fetch the stored hashed password and user_id
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $stored_password = $row["password"];
            $user_id = $row["user_id"]; // Storing user_id

            // Verify the password
            if (password_verify($password, $stored_password)) {
                // Store the user id in the session
                $_SESSION['user_id'] = $user_id;



                // Return success response
                echo json_encode(["status" => "success", "message" => "Logged in successfully"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Invalid password"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "No user found with that username"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
    }
}
