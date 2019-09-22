import { Router, Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import Token from "../lib/token";

const userRoutes = Router();

// Login
userRoutes.post( '/login', (req: Request, res: Response) => {
  const body = req.body;

  User.findOne({ email: body.email }, (err, user) => {
    if (err) throw err;

    if (!user) return res.json({ ok: false, message: 'Usuario / Contraseña no son correctos'});

    if (user.comparePassword(body.password)) {
      const token = Token.getJwtToken({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      });

      res.json({
        ok: true,
        token,
      })
    } else {
      res.json({
        ok: false,
        message: 'Usuario / Contraseña no son correctos',
      })
    }
  });
});

// Create user
userRoutes.post( '/', (req: Request, res: Response) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    avatar: req.body.avatar
  };

  User.create(user)
    .then( newUser => {
      const token = Token.getJwtToken({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar
      });

      res.json({
        ok: true,
        user: newUser,
        token,
      });
    })
    .catch( err => {
      res.json({
        ok: false,
        err,
      });
    });


});

export default userRoutes;