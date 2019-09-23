import Server from "./lib/server";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import userRoutes from "./routes/user";
import postRoutes from "./routes/post";

const server = new Server();

// body-parser
server.app.use( bodyParser.urlencoded({ extended: true }));
server.app.use( bodyParser.json() );

// Routes
server.app.use( '/user', userRoutes);
server.app.use( '/posts', postRoutes);

// DB
mongoose.connect( 'mongodb://localhost:27017/photogram',
                  {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
                  err => {
                    if ( err ) throw err;

                    console.log(`Database running on port: 27017`);
                  });

// Express
server.start();