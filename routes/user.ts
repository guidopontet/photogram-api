import { Router, Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import Token from "../lib/token";
import { validateToken } from "../middlewares/auth";

const userRoutes = Router();

// Login user
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

// Update user
userRoutes.post( '/update', validateToken, (req: any, res: Response) => {
  const user = {
    name: req.body.name || req.user.name,
    email: req.body.email || req.user.email,
    avatar: req.body.avatar || req.user.avatar,
  };

  User.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userUpdated) => {
    if (err) throw err;

    if (!userUpdated) return res.json({ ok: false, message: 'No existe un usuario con ese ID'});

    const token = Token.getJwtToken({
      _id: userUpdated._id,
      name: userUpdated.name,
      email: userUpdated.email,
      avatar: userUpdated.avatar,
    });

    res.json({
      ok: true,
      user: userUpdated,
      token,
    })
  });
});

export default userRoutes;