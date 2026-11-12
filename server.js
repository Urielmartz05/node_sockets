import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const usuarios = {};

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    socket.on("registrar", (nombre) => {
        usuarios[socket.id] = nombre?.trim() || "Anónimo";
        io.emit("usuarios", usuarios);
    });

    // Recibir mensajes
    socket.on("mensaje", (texto) => {
        console.log("Mensaje recibido:", texto);

        // Enviar mensaje a todos los clientes
        // io.emit("mensaje", texto);
        // NUEVO: enviar también el id de quien emite el mensaje
        io.emit("mensaje", { id: socket.id, texto });
    });

    // Detectar desconexión
    socket.on("disconnect", () => {
        console.log("Usuario desconectado:", socket.id);
        delete usuarios[socket.id];
        io.emit("usuarios", usuarios);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});
