let count = -1;

const pingpongCounter = () => {
  count++;
  return count;
};

module.exports = {
  pingpongCounter,
};
