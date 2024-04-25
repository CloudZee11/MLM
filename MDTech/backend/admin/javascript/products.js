class ProductFormHandler {
    constructor() {
        this.initializeEventHandlers();
    }

    initializeEventHandlers() {
        
        document.getElementById('formData').addEventListener('submit', (event) => {
            event.preventDefault();
    
            this.submitForm(event);
        });
    
        
        document.getElementById('fileToUpload').addEventListener('change', () => {
            this.previewImage();
        });
    }
    

    showMessage(message) {
        var messageContainer = document.getElementById('messageContainer');
        messageContainer.innerText = message;
        messageContainer.style.display = 'block';
        messageContainer.style.backgroundColor = 'green';
        messageContainer.style.textAlign = 'center';
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000);
    }

    submitForm(event) {
        event.preventDefault();
        var fileInput = document.getElementById('fileToUpload');
        var formData = new FormData(document.getElementById('formData'));

        
        if (fileInput.files.length > 0) {
            formData.append('fileToUpload', fileInput.files[0]);
        }

        fetch('../php/products.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);

                if (data.success) {
                    var previewDiv = document.getElementById('previewDiv');
                    var previewImage = document.getElementById('preview');
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        previewImage.src = e.target.result;
                    };

                    
                    if (fileInput.files.length > 0) {
                        reader.readAsDataURL(fileInput.files[0]);
                        previewDiv.style.display = 'block';
                    }

                    this.showMessage('Termék sikeresen feltöltve!');
                } else {
                    console.error('Hiba történt a kép feltöltésekor:', data.message);
                    alert('Hiba történt a kép feltöltésekor: ' + data.message);
                }
            })
            .catch(error => console.error('Hiba történt a kép feltöltésekor:', error));
    }

    previewImage() {
        var fileInput = document.getElementById('fileToUpload');
        var previewDiv = document.getElementById('previewDiv');
        var previewImage = document.getElementById('preview');

        if (fileInput.files && fileInput.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                previewImage.src = e.target.result;
            };

            reader.readAsDataURL(fileInput.files[0]);
            previewDiv.style.display = 'block';
        } else {
            previewImage.src = '';
            previewDiv.style.display = 'none';
        }
    }
}

var productFormHandler = new ProductFormHandler();
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fileToUpload').addEventListener('change', () => {
        productFormHandler.previewImage();
    });
});
