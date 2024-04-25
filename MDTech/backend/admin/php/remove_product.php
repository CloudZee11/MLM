<?php
// Kapcsolódás az adatbázishoz
$servername = "localhost";
$username = "root";
$password = "";
$database = "mdtech";

$conn = new mysqli($servername, $username, $password, $database);

// Ellenőrzés a kapcsolat sikerességére
if ($conn->connect_error) {
    die("Sikertelen kapcsolódás az adatbázishoz: " . $conn->connect_error);
}

// Ellenőrzés az 'id' mező érkezésére POST kérésben
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['id'])) {
    // Ellenőrzés, hogy az 'id' egy érvényes egész szám-e
    $product_id = $_POST['id'];
    if (!is_numeric($product_id)) {
        die("Hibás termék azonosító. Az azonosítónak egész számnak kell lennie.");
    }

    // Ellenőrzés, hogy a termék létezik-e az adatbázisban
    $check_sql = "SELECT id FROM airconditioners WHERE id = $product_id";
    $result = $conn->query($check_sql);
    if ($result->num_rows == 0) {
        die("A megadott azonosítójú termék nem található az adatbázisban.");
    }

    // Biztonságos SQL parancs előkészítése és futtatása
    $stmt = $conn->prepare("DELETE FROM airconditioners WHERE id = ?");
    if (!$stmt) {
        die("Hiba a SQL parancs előkészítése során: " . $conn->error);
    }
    
    $stmt->bind_param("i", $product_id);
    if (!$stmt->execute()) {
        // Ha valami hiba történt a törlés során
        die("Hiba a termék eltávolításakor: " . $stmt->error);
    }

    // Ha sikeresen töröltük a terméket
    $response = array("success" => true, "message" => "Termék sikeresen eltávolítva.");
    echo json_encode($response);
    
    $stmt->close();
} else {
    // Ha nem érkezett megfelelő kérés az 'id' mezővel
    $response = array("success" => false, "message" => "Hibás kérés. Az 'id' mező hiányzik vagy nem érvényes.");
    echo json_encode($response);
}

// Kapcsolat bezárása
$conn->close();
