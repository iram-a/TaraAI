import fetch from "node-fetch";
import fs from "fs";

const questions = JSON.parse(
  fs.readFileSync("./eval/questions.json", "utf-8")
);

// IMPORTANT: this is your Mastra server
const BASE_URL = "http://localhost:4111/api";

let passed = 0;

for (const item of questions) {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: item.question
      })
    });

    const data = await res.json();

    console.log("\nQ:", item.question);
    console.log("A:", data);

    passed++;
  } catch (err) {
    console.log("ERROR:", item.question);
  }
}

console.log("\nDONE. Questions tested:", passed);