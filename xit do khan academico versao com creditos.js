const newWindow = window.open(location.href, "targetWindow", "width=200,height=300,resizable=no");

newWindow.onload = function() {
    // Definindo o originalParse dentro do onload, após a janela ser carregada
    let originalParse = newWindow.JSON.parse;

    newWindow.JSON.parse = function(json, reviver) {
        let parsed = originalParse(json, reviver);
        try {
            const itemData = JSON.parse(parsed.data.assessmentItem.item.itemData);
            if (itemData.question.content.includes("[[")) {
                itemData.question.content = "[[☃ radio 3]]";
                itemData.question.widgets = {
                    "radio 3": {
                        alignment: "default",
                        graded: true,
                        options: {
                            choices: [
                                { content: "Correct answer", correct: true },
                                { content: "Incorrect answer", correct: false }
                            ],
                            deselectEnabled: false
                        },
                        type: "radio"
                    }
                };
                parsed.data.assessmentItem.item.itemData = JSON.stringify(itemData);
            }
        } catch (err) {
            console.error("Failed to parse JSON", err);
        }
        return parsed;
    };

    // Função de recarregar a página na nova janela
    newWindow.location.softReload = () => {
        const pageContent = newWindow.document.getElementsByTagName("html")[0].outerHTML;
        newWindow.document.open();
        newWindow.document.write(pageContent);
        newWindow.document.close();
    };

    // Adicionando os créditos na nova janela após o conteúdo ser carregado
    const creditDiv = newWindow.document.createElement("div");
    creditDiv.style.position = "fixed";
    creditDiv.style.bottom = "100px"; 
    creditDiv.style.right = "10px";
    creditDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    creditDiv.style.color = "white";
    creditDiv.style.padding = "5px 10px";
    creditDiv.style.borderRadius = "5px";
    creditDiv.style.zIndex = "1000"; // Garante que ficará por cima de outros elementos
    creditDiv.innerHTML = "Developed by Ryan Gomes ";

    // Verificando se o body está disponível antes de adicionar os créditos
    if (newWindow.document.body) {
        newWindow.document.body.appendChild(creditDiv);
    } else {
        // Se o body ainda não estiver disponível, aguardar até que ele esteja pronto
        newWindow.document.addEventListener('DOMContentLoaded', function() {
            newWindow.document.body.appendChild(creditDiv);
        });
    }
};
