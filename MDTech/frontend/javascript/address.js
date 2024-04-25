class Addresses {
    constructor() {
        this.cityInput = document.getElementById("city");
        this.streetInput = document.getElementById("address");
        this.floorInput = document.getElementById("floor");
        this.postal_codeInput = document.getElementById("postal_code");
        this.saveButton = document.getElementById("save-shipping-address-btn");
        this.deleteButton = document.getElementById("delete-shipping-address-btn");
        document.getElementById("shipping-summary").addEventListener("click", this.handleButtonClick.bind(this));

        this.saveButton.addEventListener("click", this.saveShippingAddress.bind(this));

        this.checkSavedAddress();
    }

    checkSavedAddress() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "../../backend/php/check_address.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.hasAddress) {
                    document.getElementById("shipping-form").style.display = "none";
                    document.getElementById("shipping-summary").style.display = "block";
                    this.displayShippingDetails(response.addresses);
                    this.attachSelectAddressListeners();
                } else {
                    document.getElementById("shipping-form").style.display = "block";
                    document.getElementById("shipping-summary").style.display = "none";
                }
            }
        };

        xhr.send();
    }

    displayShippingDetails(addresses) {
        const detailsDiv = document.getElementById("shipping-details");
        detailsDiv.innerHTML = "";

        addresses.forEach(address => {
            const addressDiv = document.createElement("div");
            addressDiv.innerHTML = `
                <hr>
                <h6><strong>Település:</strong> ${address.city}</h6>
                <h6><strong>Utca, házszám:</strong> ${address.address}</h6>
                <h6><strong>Emelet, ajtó:</strong> ${address.floor}</h6>
                <h6><strong>Irányítószám:</strong> ${address.postal_code}</h6>
                <br>
            `;

            const selectIndicator = document.createElement("button");
            selectIndicator.textContent = "Kiválaszt";
            selectIndicator.classList.add("select-indicator");
            selectIndicator.dataset.addressId = address.id;
            selectIndicator.addEventListener("click", (event) => this.handleSelectButtonClick(event, address.id));
            addressDiv.appendChild(selectIndicator);

            const deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-sm btn-outline-danger delete-shipping-address-btn";
            deleteButton.textContent = "Törlés";
            deleteButton.dataset.addressId = address.id;
            deleteButton.addEventListener("click", (event) => this.deleteShippingAddress(event, address.id));
            addressDiv.appendChild(deleteButton);

            addressDiv.innerHTML += `<hr><br>`;
            detailsDiv.appendChild(addressDiv);
        });
    }

    attachSelectAddressListeners() {
        const selectButtons = document.querySelectorAll(".select-indicator");
        selectButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                
                document.querySelectorAll(".select-indicator").forEach(btn => btn.classList.remove("selected"));
                
                button.classList.add("selected");
                this.handleSelectButtonClick(event, button.dataset.addressId);
            });
        });
    }

    saveShippingAddress(event) {
        event.preventDefault();
        const city = this.cityInput.value;
        const address = this.streetInput.value;
        const floor = this.floorInput.value;
        const postal_code = this.postal_codeInput.value;

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "../../backend/php/address.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onload = () => {
            if (xhr.status === 200) {
                this.checkSavedAddress();
            }
        };

        xhr.send(`city=${city}&address=${address}&floor=${floor}&postal_code=${postal_code}`);
    }

    deleteShippingAddress(event, addressId) {
        event.preventDefault();
        console.log("cím törölve")
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "../../backend/php/delete_shipping_address.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onload = () => {
            if (xhr.status === 200) {
                this.checkSavedAddress();
            }
        };

        xhr.send(`addressId=${addressId}`);
    }

    newButtonAddress(event) {
        event.preventDefault();
        document.getElementById("shipping-form").style.display = "block";
        document.getElementById("shipping-summary").style.display = "none";
    }

    handleButtonClick(event) {
        if (event.target.classList.contains("new-shipping-address-btn")) {
            this.newButtonAddress(event);
        } else if (event.target.classList.contains("delete-shipping-address-btn")) {
            const addressId = event.target.dataset.addressId;
            this.deleteShippingAddress(event, addressId);
        }
    }

    handleSelectButtonClick(event, addressId) {
        console.log('Kiválasztott kosár ID:', addressId);
    }
}

document.getElementById('postal_code').addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');

    if (this.value.length > 4) {
        this.value = this.value.slice(0, 4);
    }
});

new Addresses();
