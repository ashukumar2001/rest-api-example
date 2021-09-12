import Joi from "joi";
import bcrypt from "bcrypt";
import { CustomErrorHandler, Tokens } from "../services/index.js";
import { RefreshToken, User } from "../models/index.js";
import { JWT_REFRESH_SECRET } from "../config/index.js";

const registerController = {
  async register(req, res, next) {
    // Request Validation
    const registerValidationSchema = Joi.object({
      name: Joi.string().min(4).max(16).required(),
      email: Joi.string().email().required(),
      age: Joi.number().required(),
      password: Joi.string()
        .pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
        )
        .required(),
      confirm_password: Joi.string().required().valid(Joi.ref("password")),
    });

    const { error } = registerValidationSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    // checking if user already exists
    try {
      const existingUser = await User.exists({ email: req.body.email });
      if (existingUser) {
        return next(CustomErrorHandler.alreadyExist("Email already exists"));
      }
    } catch (error) {
      return next(error);
    }

    const { name, email, age, password } = req.body;
    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      age,
      password: hashedPassword,
    });

    let access_token;
    let refresh_token;
    try {
      const result = await user.save();
      access_token = Tokens.sign({
        id: result._id,
        role: result.role,
      });
      refresh_token = Tokens.sign(
        {
          _id: result._id,
          role: result.role,
        },
        "86400s",
        JWT_REFRESH_SECRET
      );

      // Storing refresh token to database
      await RefreshToken.create({ token: refresh_token });
    } catch (err) {
      return next(err);
    }

    res.send({
      message: "Registration Successfull!",
      access_token,
      refresh_token,
    });
  },
};
export default registerController;
