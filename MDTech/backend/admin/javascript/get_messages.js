class UnreadMessages {
    constructor(url) {
        this.url = url;
    }

   
    display() {
        const xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                document.getElementById("unreadMessagesContainer").innerHTML = xhttp.responseText;
            }
        };

        xhttp.open("GET", this.url, true);
        xhttp.send();
    }

    
    startAutoRefresh(interval) {
        setInterval(() => {
            this.display();
        }, interval);
    }
}


const unreadMessages = new UnreadMessages("../php/get_message.php");


unreadMessages.display();


unreadMessages.startAutoRefresh(10000);
