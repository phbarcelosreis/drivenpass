import { ErrorsApplications } from "../../protocols";

export function duplicatedNetworkError(): ErrorsApplications {

  return {

    name: "networkAlreadyExists",
    message: "There is already an network with given title"

  };

}

export function notFoundNetwork(): ErrorsApplications {

  return {

    name: "notFoundNetwork",
    message: "Not Found a network for this userId"

  };

}