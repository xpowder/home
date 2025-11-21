import fs from "fs";

const envPath = ".env";
const examplePath = ".env_example";

if (!fs.existsSync(envPath)) {
  console.error(".env file not found!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");

function getDummyValue(key) {
  const upperKey = key.toUpperCase();

  if (upperKey.includes("URL") || upperKey.includes("ENDPOINT")) {
    return "https://example.com";
  }
  if (upperKey.includes("KEY") || upperKey.includes("TOKEN") || upperKey.includes("SECRET")) {
    return "your-secret-key";
  }
  if (upperKey.includes("ID")) {
    return "your-id";
  }
  if (upperKey.includes("PORT")) {
    return "3000";
  }
  if (upperKey.includes("EMAIL")) {
    return "example@mail.com";
  }
  if (upperKey.includes("PASSWORD")) {
    return "your-password";
  }

  return "VALUE_HERE";
}

const exampleContent = envContent
  .split("\n")
  .map((line) => {
    const trimmed = line.trim();

    // Keep comment lines as-is
    if (trimmed.startsWith("#")) return line;

    // Skip completely empty lines
    if (trimmed === "") return "";

    // Handle env variable lines
    const [key] = line.split("=");

    if (!key || key.trim() === "") return ""; // skip invalid lines

    const value = getDummyValue(key.trim());
    return `${key.trim()}=${value}`;
  })
  .join("\n");

fs.writeFileSync(examplePath, exampleContent);
console.log(`.env_example created at ${examplePath}`);
