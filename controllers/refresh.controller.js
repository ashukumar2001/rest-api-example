import Joi from "joi";
import { JWT_REFRESH_SECRET } from "../config/index.js";
import { RefreshToken, User } from "../models/index.js";
import { CustomErrorHandler, Tokens } from "../services/index.js";
const refreshController = {
  async refresh(req, res, next) {
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    // Validating refresh token
    let refresh_t;
    try {
      refresh_t = await RefreshToken.findOne({
        token: req.body.refresh_token,
      });
      if (!refresh_t) {
        return next(
          CustomErrorHandler.unAuthorizedAccess("Invalid refresh token.")
        );
      }

      let userId;
      try {
        const { _id } = Tokens.verify(refresh_t.token, JWT_REFRESH_SECRET);
        userId = _id;
      } catch (error) {
        return next(
          CustomErrorHandler.unAuthorizedAccess("Invalid refresh token.")
        );
      }

      const user = await User.findOne({ _id: userId });
      if (!user) {
        return next(CustomErrorHandler.unAuthorizedAccess("No user found."));
      }

      const access_token = Tokens.sign({ _id: user._id, role: user.role });
      const refresh_token = Tokens.sign(
        {
          _id: user._id,
          role: user.role,
        },
        "86400s",
        JWT_REFRESH_SECRET
      );

      // Deleting previous refresh token from database
      await RefreshToken.deleteOne({ token: req.body.refresh_token });
      // Storing new refresh token to database
      await RefreshToken.create({ token: refresh_token });
      res.send({
        access_token,
        refresh_token: refresh_t.token,
      });
    } catch (error) {
      return next(error);
    }
  },
};
export default refreshController;
