import { Router, Request, Response } from "express";
import { validateToken } from "../middlewares/auth";
import { Post } from "../models/post.model";

const postRoutes = Router();

// Crear post
postRoutes.post('/', validateToken, (req: any, res: Response) => {
  const body = req.body;
  body.user = req.user._id;

  Post.create(body)
    .then(async newPost => {
      await newPost.populate('user', '-password').execPopulate();

      res.json({
        ok: true,
        post: newPost,
      });
    })
    .catch(err => {
      res.json({
        ok: false,
        err,
      })
    });
});

export default postRoutes;