class RoleManager {
    constructor() {
        this.userEmailInput = document.getElementById("userEmail");
        this.adminInfoDiv = document.getElementById("adminInfo");
        this.deletedAdminInfoDiv = document.getElementById("deletedAdminInfo");

       
        document.getElementById("addAdminButton").addEventListener("click", () => this.addAdmin());

        
        document.addEventListener("click", (event) => {
            if (event.target.classList.contains("remove-admin-btn")) {
                const userEmail = event.target.getAttribute("data-user-email");
                this.removeAdmin(userEmail);
            }
        });

        
        this.displayAdmins();
    }



    addAdmin() {
        const userEmail = this.userEmailInput.value.trim();

        
        fetch("../php/update_role.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "userEmail=" + encodeURIComponent(userEmail) + "&newRole=admin",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                
                alert(data.message);
               
                this.displayAdmins();
            })
            .catch(error => console.error("Error updating role:", error));
    }

    displayAdmins() {
        fetch("../php/admin_data.php")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                this.adminInfoDiv.innerHTML = "<h2>Aktív Adminok:</h2>";
                this.deletedAdminInfoDiv.innerHTML = "<h2>Törölt Adminok:</h2>";

                if (data.success) {
                   
                    if (data.admins.length > 0) {
                        data.admins.forEach(admin => {
                            const adminSince = admin.admin_since ? this.formatDate(new Date(admin.admin_since * 1000)) : "N/A";

                            this.adminInfoDiv.innerHTML += `
                                <p>${admin.full_name} (${admin.email}) - Hozzáadva: ${adminSince}</p>
                                <button class="remove-admin-btn" data-user-email="${admin.email}">Jog elvétele</button>
                                <hr>
                            `;
                        });
                    } else {
                        this.adminInfoDiv.innerHTML += "<p>Nincs aktív admin.</p>";
                    }

                    
                    if (data.deletedAdmins.length > 0) {
                        data.deletedAdmins.forEach(deletedAdmin => {
                            const deletedAt = deletedAdmin.deleted_at ? this.formatDate(new Date(deletedAdmin.deleted_at * 1000)) : "N/A";

                            this.deletedAdminInfoDiv.innerHTML += `
                                <p>${deletedAdmin.full_name} (${deletedAdmin.email}) - Törölve: ${deletedAt}</p>
                                <hr>
                            `;
                        });
                    } else {
                        this.deletedAdminInfoDiv.innerHTML += "<p>Nincs törölt admin.</p>";
                    }
                }
            })
            .catch(error => console.error("Hiba az adminok lekérdezésében:", error));
    }

    removeAdmin(userEmail) {
        
        fetch("../php/remove_admin.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "email=" + encodeURIComponent(userEmail),
        })
            .then(response => response.text())
            .then(message => {
                
                alert(message);
                
                this.displayAdmins();
            })
            .catch(error => console.error("Error removing admin:", error));
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = this.padZero(date.getMonth() + 1);
        const day = this.padZero(date.getDate());
        const hours = this.padZero(date.getHours());
        const minutes = this.padZero(date.getMinutes());
        const seconds = this.padZero(date.getSeconds());

        return `${year}.${month}.${day}  ${hours}:${minutes}:${seconds}`;
    }

    padZero(value) {
        return value < 10 ? "0" + value : value;
    }
}


const roleManager = new RoleManager();
