class RegistrationForm {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            const registrationForm = document.getElementById('registrationForm');

            registrationForm.addEventListener('submit', (event) => {
                event.preventDefault();
                this.handleRegistration();
            });
        });
    }

    
    handleRegistration() {
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const repeatPassword = document.getElementById('repeat_password').value;

        const errors = [];

        if (!fullname || !email || !password || !repeatPassword) {
            errors.push("Minden mező kitöltése kötelező!");
        }

        if (!this.validateEmail(email)) {
            errors.push("Helytelen e-mail cím!");
        }

        if (password.length < 8) {
            errors.push("A jelszónak legalább 8 karakternek kell lenni!");
        }

        if (password !== repeatPassword) {
            errors.push("A jelszónak egyeznie kell!");
        }

        if (errors.length > 0) {
            this.displayErrors(errors);
            return;
        }

        
        fetch('../../backend/php/registration.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                fullname,
                email,
                password,
                repeat_password: repeatPassword,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.errors) {
                    
                    this.displayErrors(data.errors);
                } else {
                    
                    window.location.href = '../../backend/php/index.php';
                }
            })
            .catch(error => {
                console.error('Error during fetch:', error);
            });
    }


    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    displayErrors(errors) {
        const errorContainer = document.getElementById('errorContainer');
        errorContainer.innerHTML = '';

        errors.forEach(error => {
            const errorParagraph = document.createElement('p');
            errorParagraph.className = 'alert alert-danger';
            errorParagraph.textContent = error;
            errorContainer.appendChild(errorParagraph);
        });
    }
}

const registrationForm = new RegistrationForm();
