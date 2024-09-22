const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Add this line
const app = express();
const port = 4000;

// Use CORS middleware
app.use(cors()); // Add this line

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Helper function to extract numbers and alphabets
const extractData = (dataArray) => {
  let numbers = [];
  let alphabets = [];

  dataArray.forEach((item) => {
    if (!isNaN(item)) {
      numbers.push(item);
    } else if (/^[a-zA-Z]$/.test(item)) {
      alphabets.push(item);
    }
  });

  return { numbers, alphabets };
};

// Helper function to find the highest lowercase alphabet
const getHighestLowercase = (alphabets) => {
  const lowercaseAlphabets = alphabets.filter(
    (char) => char >= "a" && char <= "z"
  );
  return lowercaseAlphabets.length > 0 ? [lowercaseAlphabets.sort().pop()] : [];
};

// POST Endpoint: Accepts JSON and Base64 file string
app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;

  // Example user details
  const user_id = "john_doe_17091999";
  const email = "john@xyz.com";
  const roll_number = "ABCD123";

  // Extract numbers and alphabets
  const { numbers, alphabets } = extractData(data);
  const highestLowercaseAlphabet = getHighestLowercase(alphabets);

  // File handling (for simplicity, checking if file_b64 is provided and valid)
  let file_valid = false;
  let file_mime_type = null;
  let file_size_kb = 0;

  if (file_b64) {
    try {
      const buffer = Buffer.from(file_b64, "base64");
      file_size_kb = (buffer.length / 1024).toFixed(2);
      file_valid = true;
      file_mime_type = "application/octet-stream"; // You can add logic to detect actual MIME type
    } catch (error) {
      file_valid = false;
    }
  }

  // Prepare the response
  const response = {
    is_success: true,
    user_id,
    email,
    roll_number,
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet,
    file_valid,
    file_mime_type,
    file_size_kb,
  };

  res.json(response);
});

// GET Endpoint: Returns operation_code
app.get("/bfhl", (req, res) => {
  const operation_code = 1; // Random operation code
  res.json({
    operation_code,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
