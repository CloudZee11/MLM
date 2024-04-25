class FinancialStats {
    constructor() {
        this.updateInterval = 12000;
        this.updateFinancialData();
        setInterval(() => this.updateFinancialData(), this.updateInterval);
    }

    updateFinancialData() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var responseText = xhr.responseText;
                responseText = responseText.replace(/"/g, '');
                var grossIncome = parseFloat(responseText);
               
                if (!isNaN(grossIncome)) {
                   
                    var formattedGrossIncome = grossIncome.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, " ").replace('.', ' ');
                    document.getElementById("grossIncome").innerText = formattedGrossIncome + " Ft";
                } else {
                    document.getElementById("grossIncome").innerText = "Nem sikerült betölteni az adatokat";
                }
            }
        };
        xhr.open("GET", "../php/get_gross.php", true);
        xhr.send();
    }
}

const financialStats = new FinancialStats();
