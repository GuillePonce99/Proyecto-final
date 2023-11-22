
//chat
const socket = io()
const chatBox = document.getElementById("chat-box");
const userName = document.getElementById("user-title").textContent
const btnAvatar = document.getElementById("btn-avatar")
const inputImage = document.getElementById("input-image")
const btnSend = document.getElementById("btn-send")

/*
Swal.fire({
    title: 'Bienvenido',
    input: 'text',
    text: 'Ingrese un nombre',
    confirmButtonText: 'OK',
    allowOutsideClick: false,
    inputValidator: (value) => {
        if (!value) {
            return "Ingrese un nombre para continuar"
        }
    }
}).then((result) => {
    if (result.value) {
        user = result.value;
        socket.emit("new-user", { user: user, id: socket.id })
    }
})
*/

chatBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit("message", {
                user: userName,
                message: chatBox.value,
            })
            chatBox.value = ""
        }
    }

})

btnSend.addEventListener("click", () => {
    socket.emit("message", {
        user: userName,
        message: chatBox.value,
    })
    chatBox.value = ""
})


/*
socket.on("user-dom", (data) => {
    userTitle.innerHTML = `${data}`
})
*/

socket.on("message_logs", (data) => {
    let hora = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    let chat = document.getElementById("chat")
    let message = ""
    data.forEach((e) => {
        ;
        let classChat = ""
        let classAvatar = ""
        if (e.user === userName) {
            classChat = "user-message"
            classAvatar = "user-avatar"
        } else {
            classChat = "contact-message"
            classAvatar = "contact-avatar"
        }
        message +=
            `
            <div class="message ${classChat}">
                <div class="${classAvatar}"></div>
                <div class="message-content">
                    <div class="message-user">${e.user} </div>
                    <p class="message-text">${e.message}</p>
                    <div class="message-time">${hora}</div>
                </div>
            </div>
            `;

    })
    chat.innerHTML = message
    scrollToBottom();
})

function scrollToBottom() {
    const chatContainer = document.getElementById('chat');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}







