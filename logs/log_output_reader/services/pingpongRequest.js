const axios = require("axios");

const getPingPongData = async () => {
  const url = "http://pingponglogs-svc:2355";
  try {
    const response = await axios.get(`${url}/pings`);
    return {
      status: response.status,
      data: response.data.count,
    };
  } catch (error) {
    console.error("Error fetching pingpong data:", error.message);
    return {
      status: error.response?.status || 500,
      data: error.message,
    };
  }
};

module.exports = {
  getPingPongData,
};
