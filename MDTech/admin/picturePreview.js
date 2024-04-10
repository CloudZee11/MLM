class ImagePreviewer {
  constructor(inputId, previewDivId, previewId) {
    this.input = document.getElementById(inputId);
    this.previewDiv = document.getElementById(previewDivId);
    this.preview = document.getElementById(previewId);

    this.input.addEventListener('change', this.previewImage.bind(this));
  }

  previewImage() {
    if (this.input.files && this.input.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.preview.src = e.target.result;
      };

      reader.readAsDataURL(this.input.files[0]);

      // Ha van kiválasztott fájl, megjelenítjük a previewDiv-et
      this.previewDiv.style.display = 'block';
    } else {
      // Ha nincs kiválasztott fájl, elrejtjük a previewDiv-et
      this.previewDiv.style.display = 'none';
    }
  }
}

// Példa használat
const imagePreviewer = new ImagePreviewer('fileToUpload', 'previewDiv', 'preview');
