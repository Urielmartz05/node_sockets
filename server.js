import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("Usuario conectado", socket.id);

    socket.on("mensaje", (texto) => {
        io.emit("mensaje", texto);
    });

    socket.on("disconnect", () => {
        console.log("Usuario desconectado", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Servidor activo en http://localhost:3000");
});