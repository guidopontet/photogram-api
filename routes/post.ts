import { Router, Request, Response } from "express";
import { validateToken } from "../middlewares/auth";
import { Post } from "../models/post.model";
import { FileUpload } from "../interfaces/file-upload";
import FileSystem from "../lib/file-system";

const postRoutes = Router();
const fileSystem = new FileSystem();

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

  body.images = fileSystem.moveTmptoPost(req.user._id);

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

// Upload files
postRoutes.post('/upload', validateToken, async (req: any, res: Response) => {
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      message: 'No se subió ningún archivo',
    });
  }

  const file: FileUpload = req.files.image;

  if (!file) {
    return res.status(400).json({
      ok: false,
      message: 'Error al subir archivo',
    });
  }

  if (!file.mimetype.includes('image')) {
    return res.status(400).json({
      ok: false,
      message: 'Solamente pueden subirse imágenes',
    });
  }

  await fileSystem.saveTmpImage(file, req.user._id);

  res.json({
    ok: true,
    file: file.mimetype,
  })
});

// Get image
postRoutes.get('/images/:userid/:image', validateToken, async (req: any, res: Response) => {
  const userId = req.params.userid;
  const image = req.params.image;

  const imagePath = fileSystem.getImagePath(userId, image);

  res.sendFile(imagePath);
});

export default postRoutes;