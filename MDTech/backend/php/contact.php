<?php
session_start();

class Message
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function saveMessage($name, $email, $subject, $message, $sender_id)
    {
        $stmt = $this->pdo->prepare("INSERT INTO messages (sender, email, subject, message, sender_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $email, $subject, $message, $sender_id]);

        return $stmt ? true : false;
    }

}


$host = 'localhost';
$db = 'mdtech';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int) $e->getCode());
}


$messageObj = new Message($pdo);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
   
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    
    $sender_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;

    
    $messageSaved = $messageObj->saveMessage($name, $email, $subject, $message, $sender_id);



    if ($messageSaved) {
        $response_array['message'] = "Az üzenet sikeresen elküldve.";
    } else {
        $response_array['message'] = "Hiba történt az üzenet mentése során.";
    }
    
    
    header('Content-Type: application/json');
    echo json_encode($response_array);
}