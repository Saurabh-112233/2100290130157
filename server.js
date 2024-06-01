const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 9876;

const WINDOW_SIZE = 10;
const THIRD_PARTY_API_URL = "http://20.244.56.144/test";//link not working. 
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

  const newNumbers = await fetchNumbers('prime');
 console.log(newNumbers)
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

// const express = require('express');
// const app = express();
// const port = 9876;

// const fetchNumbers = (type) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       let numList = [];
//       switch (type) {
//         case 'p':
//           numList = [2, 3, 5, 7, 11];
//           break;
//         case 'f':
//           numList = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
//           break;
//         case 'e':
//           numList = [2, 4, 6, 8, 10];
//           break;
//         case 'r':
//           numList = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
//           break;
//         default:
//           return reject(new Error('Invalid type'));
//       }
//       resolve(numList);
//     }, Math.floor(Math.random() * 500));
//   });
// };

// let numberStorage = [];
// const maxStorageSize = 10;

// app.get('/numbers/:type', async (req, res) => {
//   const type = req.params.type;

//   try {
//     const fetchedNumbers = await fetchNumbers(type);
//     const uniqueNumbers = fetchedNumbers.filter((num) => !numberStorage.includes(num));

//     numberStorage = [...numberStorage, ...uniqueNumbers];
//     numberStorage = Array.from(new Set(numberStorage));

//     if (numberStorage.length > maxStorageSize) {
//       numberStorage = numberStorage.slice(-maxStorageSize);
//     }

//     const average = numberStorage.reduce((sum, num) => sum + num, 0) / numberStorage.length;

//     const response = {
//       previousState: numberStorage.slice(0, numberStorage.length - uniqueNumbers.length),
//       currentState: numberStorage,
//       newNumbers: uniqueNumbers,
//       average,
//     };

//     res.json(response);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });