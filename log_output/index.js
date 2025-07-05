const text = Math.random().toString(32).substring(2, 20);

const generateRandomString = () => {
  const time = new Date().toISOString();
  console.log(time + ": " + text);
  setTimeout(() => {
    generateRandomString();
  }, 5000);
};

generateRandomString();
