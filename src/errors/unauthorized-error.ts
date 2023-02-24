import { ErrorsApplications } from "protocols";

export function unauthorizedError(): ErrorsApplications {

  return {

    name: "UnauthorizedError",
    message: "You must be signed in to continue"

  };
  
}