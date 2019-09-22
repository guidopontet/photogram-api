import jwt from "jsonwebtoken";

export default class Token {
  private static seed: string = 'photogram-2019-crassoft';
  private static expiration: string = '30d';

  static getJwtToken(payload: any): string {
    return jwt.sign({ user: payload }, this.seed, { expiresIn: this.expiration });
  }

  static validateToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.seed, (err, decoded) => {
        return err ? reject() : resolve(decoded);
      });
    });
  }
}