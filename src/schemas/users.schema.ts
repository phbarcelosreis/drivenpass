import Joi from "joi";

export const userSchema = Joi.object({

    email: Joi.string().min(4).email().required(),
    password: Joi.string().min(10).required()

});