let ioInstance = null;

function setupSocket(server) {
    const { Server } = require("socket.io");
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // Or your frontend URL
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    const session = require('../models/session'); // import session module
    const sessionMiddleware = session.sessionMiddleware;

  // Wrap session middleware for Socket.IO
    io.use((socket, next) => {
        sessionMiddleware(socket.request, {}, next);
    });

    io.on("connection", (socket) => {
        console.log("New client connected");

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });

    ioInstance = io; // Save instance for reuse
}

function getIO() {
    if (!ioInstance) {
        throw new Error("Socket.io not initialized. Call setupSocket(server) first.");
    }
    return ioInstance;
}

module.exports = { setupSocket, getIO };
