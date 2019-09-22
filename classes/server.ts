import express from "express";

export default class Server {
  public app: express.Application;
  public port = 3000;

  constructor() {
    this.app = express();
  }

  start() {
    this.app.listen( this.port, () => {
      console.log(`Server listening connection on port: ${this.port}`);
    });
  }
}