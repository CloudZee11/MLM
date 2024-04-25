class MessageHandler {
    constructor() {
        this.mailboxBody = document.querySelector('.mailbox-body');
    }

    fetchMessages() {
        fetch('../php/get_unread_messages.php')
            .then(response => response.json())
            .then(data => {
                this.clearMailbox();

                data.forEach(message => {
                    const newMessage = this.createMessageElement(message);
                    this.mailboxBody.appendChild(newMessage);
                });
            })
            .catch(error => {
                console.error('Hiba történt:', error);
            });
    }

    clearMailbox() {
        this.mailboxBody.innerHTML = '';
    }

    createMessageElement(message) {
        const newMessage = document.createElement('div');
        newMessage.classList.add('mailbox-message');

        newMessage.innerHTML = `
            <h4 class="message-subject">${message.subject}</h4>
            <p class="message-sender">Email: ${message.email}</p>
            <p class="message-sender">Név: ${message.sender}</p>
            <p class="message-content">Üzenet: ${message.message}</p>
            <p class="message-id" style="display: none;">Message ID: ${message.message_id}</p>
            <form class="response-form">
                <input type="hidden" name="recipient" value="${message.email}">
                <input type="hidden" name="message_id" value="${message.message_id}">
                <textarea name="response-message" placeholder="Válasz..." required rows="4" cols="50"></textarea>
                <div class="d-flex justify-content-between">
                    <button type="submit">Válasz küldése</button>
                    <button class="read-button">Olvasva</button>
                </div>
            </form>
        `;

        
        const responseForm = newMessage.querySelector('.response-form');
        responseForm.addEventListener('submit', event => {
            event.preventDefault();
            this.sendResponse(event.target);
        });

        
        const readButton = newMessage.querySelector('.read-button');
        readButton.addEventListener('click', event => {
            event.preventDefault();
            const messageId = message.message_id;
            this.markAsRead(messageId);
            readButton.classList.add('read');
        });

        
        if (message.is_read === 'yes') {
            readButton.classList.add('read');
        }

        return newMessage;
    }





    sendResponse(form, responseMessage) {
        const formData = new FormData(form);
        const recipient = formData.get('recipient');
        const subject = formData.get('subject');

        fetch('../php/send_response_email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                recipient: recipient,
                subject: subject,
                'response-message': responseMessage
            })
        })
            .then(response => {
                if (response.ok) {
                    console.log('Az e-mail sikeresen elküldve.');

                } else {
                    console.error('Hiba történt az e-mail küldésekor.');
                }
            })
            .catch(error => {
                console.error('Hiba történt:', error);
            });
    }


    markAsRead(messageId) {
        fetch('../php/get_unread_messages.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                message_id: messageId
            })
        })
            .then(response => {
                if (response.ok) {
                    console.log('Üzenet megjelölve olvasottként.');

                } else {
                    console.error('Hiba történt.');
                }
            })
            .catch(error => {
                console.error('Hiba történt:', error);
            });
    }

}

const messageHandler = new MessageHandler();


messageHandler.fetchMessages();
