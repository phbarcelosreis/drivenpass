import Joi from "joi";

export const credentialsSchema = Joi.object({

    title: Joi.string().min(3).required(), 
    url: Joi.string().min(4).required(), 
    username: Joi.string().min(3).required(), 
    password: Joi.string().min(3).required()

});