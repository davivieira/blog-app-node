class ResponseGenerator {

  constructor() {}

  createErrorMessage(httpCode, msgCode, res) {
    res.status(httpCode).json({
      msg: msgCode
    });
  }

  createSuccessMessage(responseBody, res) {
    res.json(responseBody);
  }
}

module.exports = new ResponseGenerator();