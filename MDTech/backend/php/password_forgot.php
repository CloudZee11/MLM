<?php
class PasswordReset
{
  private $conn;

  function __construct($servername, $username, $password, $dbname)
  {
    $this->conn = new mysqli($servername, $username, $password, $dbname);
    if ($this->conn->connect_error) {
      die("Nem sikerült kapcsolódni az adatbázishoz: " . $this->conn->connect_error);
    }
  }

  function resetPassword($email, $full_name, $new_password)
  {
    $sql = "SELECT * FROM users WHERE email='$email' AND full_name='$full_name'";
    $result = $this->conn->query($sql);

    if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      $user_id = $row['id'];

      $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

      $update_sql = "UPDATE users SET password='$hashed_password' WHERE id=$user_id";
      if ($this->conn->query($update_sql) === TRUE) {
        return "success";
      } else {
        return "error";
      }
    } else {
      return "not_found";
    }
  }

  function checkMatch($email, $full_name)
  {
    $sql = "SELECT * FROM users WHERE email='$email' AND full_name='$full_name'";
    $result = $this->conn->query($sql);
    if ($result->num_rows > 0) {
      return "ok";
    } else {
      return "not_found";
    }
  }

  function __destruct()
  {
    $this->conn->close();
  }
}
