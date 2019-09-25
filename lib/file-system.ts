import path from "path";
import fs from "fs";

import { FileUpload } from "../interfaces/file-upload";
import uniqid from "uniqid";

export default class FileSystem {
  constructor() {};

  saveTmpImage(file: FileUpload, userId: string) {
    return new Promise((resolve, reject) => {
      const path = this.createUserDir(userId);
      const fileName = this.generateFileName(file.name);

      file.mv(`${ path }/${ fileName }`, (err: any) => {
        err ? reject(err) : resolve();
      });
    })
  }

  private createUserDir(userId: string) {
    const userPath = path.resolve(__dirname, '../uploads', userId);
    const userPathTmp = userPath + '/tmp';

    if (!fs.existsSync(userPath)) {
      fs.mkdirSync(userPath);
      fs.mkdirSync(userPathTmp);
    }

    return userPathTmp;
  }

  private generateFileName(originalName: string) {
    const extension = originalName.split('.').pop();
    const uniqName = uniqid();

    return `${uniqName}.${extension}`;
  }

  moveTmptoPost(userId: string) {
    const userPathTmp = path.resolve(__dirname, '../uploads', userId, 'tmp');
    const userPathPosts = path.resolve(__dirname, '../uploads', userId, 'posts');

    if (!fs.existsSync(userPathTmp)) return [];

    if (!fs.existsSync(userPathPosts)) fs.mkdirSync(userPathPosts);

    const imagesTmp = this.getImagesFromTmp(userId);

    imagesTmp.forEach(image => {
      fs.renameSync(`${userPathTmp}/${image}`, `${userPathPosts}/${image}`);
    });

    return imagesTmp;
  }

  private getImagesFromTmp(userId: string) {
    const userPathTmp = path.resolve(__dirname, '../uploads', userId, 'tmp');

    return fs.readdirSync(userPathTmp) || [];
  }
}