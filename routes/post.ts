import { Router, Request, Response } from "express";
import { validateToken } from "../middlewares/auth";
import { Post } from "../models/post.model";

const postRoutes = Router();

// Get posts
postRoutes.get('/', async (req: any, res: Response) => {
  let page = Number(req.query.page) || 1;
  let skip = (page - 1) * 10;

  const posts = await Post.find()
                          .sort({_id: -1})
                          .skip(skip)
                          .limit(10)
                          .populate('user', '-password')
                          .exec();

  res.json({
    ok: true,
    page,
    posts
  });
});

// Create post
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