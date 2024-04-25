class UserRoleChecker {
    constructor() {}

    checkUserRole() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "../check_user_role.php", true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(xhr.responseText);
                    } else {
                        reject(xhr.statusText);
                    }
                }
            };
            xhr.send();
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const userRoleChecker = new UserRoleChecker();
    userRoleChecker.checkUserRole()
        .then(userRole => {
            if (userRole === "admin") {
                
                document.getElementById("adminButtonContainer").style.display = "block";
            }
        })
        .catch(error => {
            console.error("Hiba történt a felhasználó szerepkörének ellenőrzése közben: " + error);
        });
});