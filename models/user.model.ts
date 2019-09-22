import { Schema, model, Document } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: [ true, 'El nombre es necesario'],
  },
  avatar: {
    type: String,
    default: 'default-avatar.png',
  },
  email: {
    type: String,
    unique: true,
    required: [ true , 'El email es necesario' ],
  },
  password: {
    type: String,
    required: [ true , 'La contraseña es necesaria' ],
  }
});

interface IUser extends Document {
  name: string,
  email: string,
  password: string,
  avatar: string,
}

export const User = model<IUser>( 'User', userSchema );
