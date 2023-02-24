import { ErrorsApplications } from "../../protocols";

export function duplicatedCredentialError(): ErrorsApplications {

  return {

    name: "credentialsAlreadyExists",
    message: "There is already an credentials with given title"

  };

}

export function notFoundCredential(): ErrorsApplications {

  return {

    name: "notFoundCredential",
    message: "Not Found a credential for this userId"

  };

}