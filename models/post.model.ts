import { Schema, Document, model } from "mongoose";

const postSchema = new Schema({
  created: {
    type: Date,
  },
  message: {
    type: String,
  },
  images: [{
    type: String,
  }],
  coords: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [ true, 'La relación con el tipo "User" es necesaria'],
  }
});

// Seteamos la fecha antes de insertar el documento en la base de datos
postSchema.pre<IPost>('save', function(next) {
  this.created = new Date();
  next();
});

interface IPost extends Document {
  created: Date;
  message: string;
  images: string[];
  coords: string;
  user: string;
}

export const Post = model<IPost>('Post', postSchema);
