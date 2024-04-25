<?php
class ProductHandler
{
    private $conn;

    public function __construct($host, $user, $password, $dbName)
    {
        try {
            $this->conn = new mysqli($host, $user, $password, $dbName);
        } catch (Exception $e) {
            die(json_encode(array('success' => false, 'message' => 'Sikertelen kapcsolódás az adatbázishoz: ' . $e->getMessage())));
        }
    }

    public function addProduct($productName, $brand, $consumption, $type, $price, $color, $description, $features, $imageFullPath)
    {

        $featuresText = implode(", ", $features);

        $sql = "INSERT INTO airconditioners (name, brand, consumption, type, price, color, description, features, image, shown, featured) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'off', 'off')";

        $stmt = $this->conn->prepare($sql);

        if ($stmt) {
            $stmt->bind_param("ssssdssss", $productName, $brand, $consumption, $type, $price, $color, $description, $featuresText, $imageFullPath);

            if ($stmt->execute()) {
                echo json_encode(array('success' => true, 'message' => 'Termék sikeresen hozzáadva az adatbázishoz.'));
            } else {
                echo json_encode(array('success' => false, 'message' => 'Hiba a termék hozzáadásakor: ' . $stmt->error));
            }

            $stmt->close();
        } else {
            echo json_encode(array('success' => false, 'message' => 'Hiba a lekérdezésben: ' . $this->conn->error));
        }
    }

    public function closeConnection()
    {
        $this->conn->close();
    }
}

$productName = $_POST['productName'] ?? '';
$brand = $_POST['brand'] ?? '';
$consumption = $_POST['consumption'] ?? '';
$type = $_POST['type'] ?? '';
$price = $_POST['price'] ?? '';
$color = $_POST['color'] ?? '';
$description = $_POST['description'] ?? '';
$features = $_POST['features'] ?? array();


if (count($features) < 4) {
    die(json_encode(array('success' => false, 'message' => 'Legalább 4 tulajdonságot adj meg.')));
}


$allowedFileTypes = array('jpg', 'jpeg', 'png');

if (isset($_FILES['fileToUpload']['name']) && !empty($_FILES['fileToUpload']['name'])) {
    $imageFileName = $_FILES['fileToUpload']['name'];


    $pathInfo = pathinfo($imageFileName);
    $extension = $pathInfo['extension'];


    if (!in_array(strtolower($extension), $allowedFileTypes)) {
        die(json_encode(array('success' => false, 'message' => 'Nem megfelelő fájlformátum. Engedélyezett típusok: jpg, jpeg, png')));
    }


    if ($_FILES['fileToUpload']['size'] > 5 * 1024 * 1024) {
        die(json_encode(array('success' => false, 'message' => 'A fájl mérete túl nagy. Maximum méret: 5 MB')));
    }

    
    $uploadDir = "../../../user/images/";

    
    $imageFileName = $_FILES['fileToUpload']['name'];

    
    $imagePathInDb = "../user/images/" . $imageFileName;

    
    $imageFullPath = $uploadDir . basename($imageFileName);


    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }


    if (!move_uploaded_file($_FILES['fileToUpload']['tmp_name'], $imageFullPath)) {
        die(json_encode(array('success' => false, 'message' => 'Hiba a kép feltöltésekor. A fájl nem mozgatható a célmappába.')));
    }
} else {

    die(json_encode(array('success' => false, 'message' => 'Hiba a fájlnév beolvasásakor.')));
}


$productHandler = new ProductHandler("localhost", "root", "", "mdtech");
$productHandler->addProduct($productName, $brand, $consumption, $type, $price, $color, $description, $features, $imagePathInDb);
$productHandler->closeConnection();
