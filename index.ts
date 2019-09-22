import Server from "./classes/server";
import userRoutes from "./routes/user";

const server = new Server();

server.app.use( '/user', userRoutes);

server.start();