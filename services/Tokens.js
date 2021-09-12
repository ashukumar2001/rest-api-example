import { JWT_SECRET } from "../config/index.js";
import jwt from "jsonwebtoken";
class Tokens {
  static sign(payload, expiry = "60s", secret = JWT_SECRET) {
    // Generating token
    return jwt.sign(payload, secret, {
      expiresIn: expiry,
    });
  }

  static verify(token, secret = JWT_SECRET) {
    return jwt.verify(token, secret);
  }
}
export default Tokens;
