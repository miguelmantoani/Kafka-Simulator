document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("messageForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const topic = document.getElementById("topic").value;
        const partition = document.getElementById("partition").value;
        const message = document.getElementById("message").value;

        const response = await fetch("/publish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic, partition, message })
        });

        if (response.ok) {
            alert("Mensagem enviada com sucesso!");
            form.reset();
        } else {
            alert("Erro ao enviar mensagem!");
        }
    });
});
