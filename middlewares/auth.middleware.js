import { CustomErrorHandler } from "../services/index.js";
import { Tokens } from "../services/index.js";
const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(CustomErrorHandler.unAuthorizedAccess());
  }
  const token = authHeader.split(" ")[1];
  // token validation
  try {
    const { _id, role } = Tokens.verify(token);
    req.user = {
      _id,
      role,
    };
    next();
  } catch (error) {
    return next(CustomErrorHandler.unAuthorizedAccess());
  }
};
export default auth;
