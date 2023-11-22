
export default (io) => {
    let messages = []
    io.on("connection", async (socket) => {
        console.log("nueva conexion");

        // CHAT //

        socket.on("message", (data) => {
            messages.push(data)
            io.emit("message_logs", messages)
        })

    })
}