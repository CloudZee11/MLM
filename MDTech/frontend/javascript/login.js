class LoginForm {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            const loginForm = document.getElementById('loginForm');

            loginForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                this.login(email, password);
            });
        });
    }

    login(email, password) {
        fetch('../../backend/php/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                loginSubmit: 'submit',
                email,
                password,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            this.handleLoginResponse(data);
        })
        .catch(error => {
            console.error('Error during login:', error);
            this.displayError('Hiba történt a belépés során.');
        });
    }

    handleLoginResponse(response) {
        if (response.success) {
            console.log('Successful login!');
            window.location.href = '../../backend/php/index.php';
        } else {
            console.error('Login error:', response.error);
            this.displayError(response.error || 'Hiba történt a belépés során.');
        }
    }

    displayError(errorMessage) {
        const errorContainer = document.getElementById('errorContainer');
        errorContainer.innerHTML = `<p class="alert alert-danger">${errorMessage}</p>`;
    }
}

const loginForm = new LoginForm();
