const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 9876;

const WINDOW_SIZE = 10;
const THIRD_PARTY_API_URL = "http://20.244.56.144/test/primes";//link not working. 
const TIMEOUT = 500;

let window = [];

const fetchNumbers = async (numberId) => {
  try {
    const response = await axios.get(`${THIRD_PARTY_API_URL}/${numberId}`, {
      timeout: TIMEOUT,
    });
    return response.data.numbers || [];
  } catch (error) {
    return [];
  }
};

const updateWindow = (newNumbers) => {
  const prevState = [...window];

  newNumbers.forEach((num) => {
    if (!window.includes(num)) {
      if (window.length >= WINDOW_SIZE) {
        window.shift(); 
      }
      window.push(num);
    }
  });

  return prevState;
};

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return sum / numbers.length;
};

app.get("/numbers/:numberId", async (req, res) => {
  const { numberId } = req.params;

  if (!["p", "f", "e", "r"].includes(numberId)) {
    return res.status(400).json({ error: "Invalid number ID" });
  }

  const startTime = Date.now();

  const newNumbers = await fetchNumbers(numberId);

  const prevState = updateWindow(newNumbers);
  const currState = [...window];

  const avg = calculateAverage(currState);

  const responseTime = Date.now() - startTime;
  if (responseTime > TIMEOUT) {
    return res.status(500).json({ error: "Request timed out" });
  }

  res.json({
    windowPrevState: prevState,
    windowCurrState: currState,
    numbers: newNumbers,
    avg: avg.toFixed(2),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
