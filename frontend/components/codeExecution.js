// codeExecution.js
import axios from "axios";

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
const RAPIDAPI_KEY = "Your API Here"; // You'll need to get this from RapidAPI

// Language IDs for Judge0
const LANGUAGE_IDS = {
  javascript: 63, // Node.js
  python: 71, // Python 3
  java: 62, // Java
  cpp: 54, // C++
};

async function executeCode(code, language) {
  try {
    // Create submission
    const submission = await axios.post(
      `${JUDGE0_API_URL}/submissions`,
      {
        source_code: code,
        language_id: LANGUAGE_IDS[language],
        stdin: "",
      },
      {
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": RAPIDAPI_KEY,
        },
      }
    );

    // Get submission token
    const token = submission.data.token;

    // Wait for result (with timeout)
    let result;
    let attempts = 0;
    while (attempts < 10) {
      result = await axios.get(`${JUDGE0_API_URL}/submissions/${token}`, {
        headers: {
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": RAPIDAPI_KEY,
        },
      });

      if (result.data.status.id > 2) {
        // Status 1-2 means still processing
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }

    // Process result
    const output = {
      stdout: result.data.stdout || "",
      stderr: result.data.stderr || "",
      error: result.data.compile_output || "",
      statusId: result.data.status.id,
    };

    return {
      success: output.statusId === 3, // 3 means Accepted
      output: output.stdout || output.stderr || output.error || "No output",
    };
  } catch (error) {
    console.error("Code execution error:", error);
    return {
      success: false,
      output: "Error executing code. Please try again.",
    };
  }
}

export { executeCode };
