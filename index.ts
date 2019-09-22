import Server from "./classes/server";
import userRoutes from "./routes/user";
import mongoose from "mongoose";

const server = new Server();

// Routes
server.app.use( '/user', userRoutes);

// DB
mongoose.connect( 'mongodb://localhost:27017/photogram',
                  {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
                  err => {
                    if ( err ) throw err;

                    console.log(`Database running on port: 27017`);
                  });

// Express
server.start();