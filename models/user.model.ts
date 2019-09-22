import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

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

userSchema.method('comparePassword', function(password: string = ''): boolean {
  return bcrypt.compareSync( password, this.password );
});

interface IUser extends Document {
  name: string,
  email: string,
  password: string,
  avatar: string,

  comparePassword( password: string ): boolean;
}

export const User = model<IUser>( 'User', userSchema );
