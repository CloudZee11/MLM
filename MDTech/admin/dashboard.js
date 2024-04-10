class Dashboard {
    constructor() {
        this.unreadMessagesContainer = document.getElementById('unreadMessagesContainer');
        this.loadUnreadMessages();
        setInterval(this.loadUnreadMessages.bind(this), 30000); // Automatikus frissítés 30 másodpercenként
    }

    loadUnreadMessages() {
        fetch('get_unread_messages.php')
        .then(response => response.json())
        .then(data => {
            this.unreadMessagesContainer.innerHTML = ''; // Üresítjük a tartalmat, mielőtt frissítenénk

            if (data.length === 0) {
                this.unreadMessagesContainer.innerHTML = '<p>Nincsenek olvasatlan üzenetek.</p>';
                return;
            }

            data.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.innerHTML = `
                    <p><strong>Feladó:</strong> ${message.sender}</p>
                    <p><strong>Tárgy:</strong> ${message.subject}</p>
                    <p><strong>Üzenet:</strong> ${message.content}</p>
                `;
                this.unreadMessagesContainer.appendChild(messageElement);
            });
        })
        .catch(error => console.error('Hiba történt:', error));
    }
}

document.addEventListener('DOMContentLoaded', function () {
    new Dashboard();
});
