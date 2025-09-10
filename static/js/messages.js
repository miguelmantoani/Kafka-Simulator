async function loadMessages() {
    const response = await fetch("/messages/data");
    const data = await response.json();

    const list = document.getElementById("messages-list");
    list.innerHTML = "";

    data.forEach(msg => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `[${msg[0]} - P${msg[1]}] ${msg[2]} @ ${msg[3]}`;
        list.appendChild(li);
    });
}

setInterval(loadMessages, 2000);
loadMessages();
