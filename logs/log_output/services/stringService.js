const generateRandomString = () => {
  const text = Math.random().toString(32).substring(2, 20);
  const time = new Date().toISOString();
  return `${time}: ${text}`;
};

module.exports = {
  generateRandomString,
};
