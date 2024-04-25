function PasswordReset() {
    this.form = document.getElementById("passwordResetForm");
    this.submitButton = document.getElementById("reset-btn");
    this.submitButton.addEventListener("click", this.handleSubmit.bind(this));
}


PasswordReset.prototype.handleSubmit = function(event) {
    event.preventDefault();

    var email = document.getElementById("email").value;
    var full_name = document.getElementById("full_name").value;

   
    if (!isValidEmail(email)) {
        alert("Kérlek, add meg egy érvényes e-mail címet!");
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../../backend/php/password_forgot.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = xhr.responseText;
            if (response === "ok") {
                this.addNewPasswordField();
            } else {
                alert(response);
            }
        }
    }.bind(this);

    var params = "email=" + email + "&full_name=" + full_name;
    xhr.send(params);
}


function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


PasswordReset.prototype.addNewPasswordField = function() {
    var newPasswordInput = document.createElement("input");
    newPasswordInput.setAttribute("type", "password");
    newPasswordInput.setAttribute("class", "form-control");
    newPasswordInput.setAttribute("id", "new_password");
    newPasswordInput.setAttribute("name", "new_password");
    newPasswordInput.setAttribute("placeholder", "Új jelszó");
    newPasswordInput.setAttribute("required", "true");

    this.form.insertBefore(newPasswordInput, this.submitButton);

    var feedback = document.createElement("div");
    feedback.textContent = "Írd be az új jelszót.";
    feedback.style.color = "green";
    this.form.insertBefore(feedback, this.submitButton);
}

var passwordReset = new PasswordReset();
