type ErrorCode = 500 | 400 | 401 | 403 | 404;

export default class Error {
  readonly message: string;

  readonly statusCode: number;

  readonly status: string;

  static codeToStatus(code: ErrorCode): string {
    switch (code) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not Found';
      default:
        return 'Internal Server Error';
    }
  }

  constructor(message: string, code: ErrorCode) {
    this.message = message;
    this.statusCode = code;
    this.status = Error.codeToStatus(code);
  }
}
