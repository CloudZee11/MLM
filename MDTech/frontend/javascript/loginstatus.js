class LoginManager {
    async checkLoginStatus() {
        try {
            const response = await fetch('../../backend/php/check_login.php');
            const data = await response.json();

            if (data.isLoggedIn) {
                this.handleLogin();
                await this.checkUserRole();
            } else {
                this.handleLogout();
            }

            return data.isLoggedIn;
        } catch (error) {
            console.error('Hiba az állapot ellenőrzése közben:', error);
            return false;
        }
    }

    async checkUserRole() {
        try {
            const adminResponse = await fetch('../../backend/php/check_user_role.php');
            const adminData = await adminResponse.json();
            if (adminData.userRole === "admin") {
                this.showAdminButton(); 
            } else {
                this.hideAdminButton(); 
            }
        } catch (error) {
            console.error('Hiba az admin szerepkör ellenőrzése közben:', error);
        }
    }

    showAdminButton() {
        document.getElementById('adminButtonContainer').style.display = 'block';
    }

    hideAdminButton() {
        document.getElementById('adminButtonContainer').style.display = 'none';
    }

    handleLogin() {
        document.getElementById('loginButtonContainer').style.display = 'none';
        document.getElementById('loggedInMenu').style.display = 'block';
    }

    handleLogout() {
        document.getElementById('loginButtonContainer').style.display = 'block';
        document.getElementById('loggedInMenu').style.display = 'none';
    }

    async login() {
        await this.checkLoginStatus();
    }
}


window.addEventListener('DOMContentLoaded', () => {
    const loginManager = new LoginManager();
    loginManager.checkLoginStatus();
});
