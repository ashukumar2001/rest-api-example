import Joi from "joi";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
const registerController = {
  register(req, res, next) {
    // Request Validation
    const registerValidationSchema = Joi.object({
      name: Joi.string().min(4).max(16).required(),
      email_id: Joi.string().email().required(),
      age: Joi.number().required(),
      password: Joi.string()
        .pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/
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
      const existingUser = true;
      if (existingUser) {
        return next(CustomErrorHandler.alreadyExist("Email already exists"));
      }
    } catch (error) {
      return next(error);
    }
    res.send({
      message: "Registration Successfull!",
    });
  },
};
export default registerController;
