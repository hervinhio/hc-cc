const checkArrayArg = (arg, message) => {
  if (!arg || arg?.length === 0) throw new Error(message);
};

module.exports = checkArrayArg;
