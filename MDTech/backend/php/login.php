<?php
header('Content-Type: application/json');

class UserLogin
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
        session_start();
    }

    public function login($email, $password)
    {
        $errors = array();

        if (empty($email) || empty($password)) {
            $errors[] = "Minden mező kitöltése kötelező!";
        }

        if (count($errors) > 0) {
            echo json_encode(['error' => $errors]);
            return;
        } else {
            $stmt = mysqli_stmt_init($this->conn);
            $sql = "SELECT id, email, password FROM users WHERE email = ?";

            if (mysqli_stmt_prepare($stmt, $sql)) {
                mysqli_stmt_bind_param($stmt, "s", $email);
                mysqli_stmt_execute($stmt);
                $result = mysqli_stmt_get_result($stmt);
                $user = mysqli_fetch_array($result, MYSQLI_ASSOC);

                if ($user && password_verify($password, $user["password"])) {
                    $this->handleSuccessfulLogin($user["id"], $user["email"]);
                } else {
                    echo json_encode(['error' => 'Helytelen e-mail cím vagy jelszó!']);
                    exit();
                }
            } else {
                echo json_encode(['error' => 'Valami hiba történt a lekérdezés előkészítése során!']);
                exit();
            }
        }
    }

    private function handleSuccessfulLogin($userId, $email)
    {
        $_SESSION["user_id"] = $userId;
        $_SESSION["user_email"] = $email;

        echo json_encode(['success' => true, 'user_id' => $userId, 'user_email' => $email]);
        exit();
    }

}

try {
    $conn = require_once "database.php";
    $userLogin = new UserLogin($conn);

    if (isset($_POST["loginSubmit"])) {
        $email = $_POST["email"];
        $password = $_POST["password"];
        $userLogin->login($email, $password);
    } else {
        
        echo json_encode(['error' => 'Érvénytelen kérés a loginnál!']);
        exit();
    }
} catch (Exception $e) {
    die("Adatbázis kapcsolódási hiba: " . $e->getMessage());
}
