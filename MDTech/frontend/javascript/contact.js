class ContactForm {
    constructor(formId, notificationId) {
        this.form = document.getElementById(formId);
        this.notification = document.getElementById(notificationId);
        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    handleSubmit(event) {
        event.preventDefault();

        
        const formData = new FormData(this.form);

        
        fetch('../../backend/php/contact.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            
            this.notification.innerHTML = '<div class="success-message">' + data.message + '</div>';
            this.notification.style.display = "block";

            
            setTimeout(() => {
                this.notification.style.display = "none";
            }, 3000);
        })
        .catch(error => {
            
            this.notification.innerHTML = '<div class="error-message">' + data.message + '</div>';
            this.notification.style.display = "block";

            
            setTimeout(() => {
                this.notification.style.display = "none";
            }, 3000);
        });
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const contactForm = new ContactForm('contact-form', 'notification');
});
