import { User } from "../models/index.js";
import { CustomErrorHandler } from "../services/index.js";

const userController = {
  async me(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.user._id }).select(
        "-password -updatedAt -__v"
      );
      if (!user) {
        return next(CustomErrorHandler.notFound("User Not Found"));
      }
      res.send(user);
    } catch (error) {
      return next(error);
    }
  },
};

export default userController;
