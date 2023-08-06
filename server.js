import express from "express";
import colors from "colors";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { readFileSync, writeFileSync } from "fs";

// Init express.
const app = express();
const __dirname = path.resolve();

// Init httpServer.
const httpServer = createServer(app);

// Init socketIO.
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Connection is successful.".bgGreen.black);

  // Get previousData.
  const preData = JSON.parse(
    readFileSync(path.join(__dirname, "db/db.json")).toString()
  );

  io.sockets.emit("output", preData);

  socket.on("chat", ({ name, photo, message }) => {
    // Get previousData.
    const preData = JSON.parse(
      readFileSync(path.join(__dirname, "db/db.json")).toString()
    );
    preData.push({ name, photo, message });

    // Now saveData to jsonDb.
    writeFileSync(path.join(__dirname, "db/db.json"), JSON.stringify(preData));

    io.sockets.emit("output", preData);
  });

  socket.on("disconnect", () => {
    console.log("Disconnection is successful.".bgRed.black);
  });
});

// Connect Client.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Listen Server.
httpServer.listen(5050, () => {
  console.log(`Server is running on PORT 5050`.bgBlue.black);
});
