import Joi from "joi";
import { User, RefreshToken } from "../models/index.js";
import bcrypt from "bcrypt";
import { Tokens, CustomErrorHandler } from "../services/index.js";
import { JWT_REFRESH_SECRET } from "../config/index.js";
const loginController = {
  async login(req, res, next) {
    // Request Validation
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/
        )
        .required(),
    });

    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // Password validation for existing user
      const isCorrectPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isCorrectPassword) {
        return next(
          CustomErrorHandler.wrongCredentials("Incorrect Password!!")
        );
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

      // Storing refresh token to database
      await RefreshToken.create({ token: refresh_token });
      res.send({
        access_token,
        refresh_token,
      });
    } catch (error) {
      return next(error);
    }
  },
  async logout(req, res, next) {
    // Logout Action

    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      await RefreshToken.deleteOne({ token: req.body.refresh_token });
    } catch (error) {
      return next(error);
    }

    res.send({
      message: "Logout successful!",
    });
  },
};
export default loginController;
