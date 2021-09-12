class CustomErrorHandler extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static alreadyExist(message) {
    return new CustomErrorHandler(409, message);
  }

  static wrongCredentials(message = "email or password is wrong!!") {
    return new CustomErrorHandler(401, message);
  }

  static unAuthorizedAccess(message = "Unauthorized") {
    return new CustomErrorHandler(401, message);
  }

  static notFound(message = "Not Found") {
    return new CustomErrorHandler(404, message);
  }
}
export default CustomErrorHandler;
