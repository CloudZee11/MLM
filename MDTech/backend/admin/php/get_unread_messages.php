<?php

$servername = "localhost";
$username = "root";
$password = ""; 
$database = "mdtech"; 

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["message_id"])) {
    
    $stmt = $conn->prepare("UPDATE messages SET is_read = 'yes' WHERE message_id = ?");
    $stmt->bind_param("i", $message_id);

    
    $message_id = $_POST["message_id"];

    
    if ($stmt->execute()) {
        echo "Message marked as read successfully.";
    } else {
        echo "Error updating message: " . $conn->error;
    }

    
    $stmt->close();
}


$sql = "SELECT * FROM messages";
$result = $conn->query($sql);

$messages = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }
}

echo json_encode($messages);

$conn->close();
