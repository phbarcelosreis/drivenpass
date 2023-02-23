import { ErrorsApplications } from "../../protocols.js";

export function existsEmailError(): ErrorsApplications {

  return {

    name: "EmailAlreadyExists",
    message: "There is already an user with given email"

  };

}

export function notFoundError(): ErrorsApplications {

  return {

    name: "UsersNotFound",
    message: "This user is not found!"

  };

}