import Joi from "joi";

export const networkSchema = Joi.object({

    networkTitle: Joi.string().min(3).required(), 
    title: Joi.string().min(4).required(), 
    password: Joi.string().min(3).required()

});