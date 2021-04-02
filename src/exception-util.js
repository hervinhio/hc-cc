const logAndRethrow = (exception, message) => {
  console.error(exception);
  throw new Error(`${message} | error is: ${exception}`);
};

module.exports = logAndRethrow;
