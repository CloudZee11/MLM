<?php

$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "mdtech"; 


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Kapcsolódási hiba: " . $conn->connect_error);
}


session_start();
if (!isset($_SESSION['user_id'])) {
    die("Hiba: A felhasználói azonosító nem található a session-ben.");
}
$user_id = $_SESSION['user_id'];


$sql = "SELECT * FROM shipping_addresses WHERE user_id = ? AND deleted = 'no'";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();


$response = array();


if ($result->num_rows > 0) {
    $addresses = array(); 

   
    while ($row = $result->fetch_assoc()) {
        $addresses[] = $row;
    }

    $response['hasAddress'] = true;
    $response['addresses'] = $addresses;
} else {
    $response['hasAddress'] = false;
}


echo json_encode($response);


$stmt->close();
$conn->close();
