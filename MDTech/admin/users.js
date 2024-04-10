class Users {
    constructor() {
        this.intervalId = null; 
    }

    
    updateRegisteredUsersCount() {
        fetch('../users.php')
            .then(response => response.json())
            .then(data => {
                const registeredUsersCountElement = document.getElementById('registeredUsersCount');
                registeredUsersCountElement.textContent = data.registeredUsersCount;
            })
            .catch(error => console.error('Error:', error));
    }

    
    startUpdating() {
        
        this.updateRegisteredUsersCount();
        
        
        this.intervalId = setInterval(() => {
            this.updateRegisteredUsersCount();
        }, 30000); // 30 másodperc
    }

   
    stopUpdating() {
        clearInterval(this.intervalId);
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const users = new Users();
    users.startUpdating();
});
