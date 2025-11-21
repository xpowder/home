import "dotenv/config";

import fs from "fs";
import fetch from "node-fetch";
import path from "path";

const LOCALES = ["fr", "ar"];
const BASE_LANG = "en";
const MESSAGES_DIR = path.join(process.cwd(), "messages");

const REQUEST_DELAY_MS = 300; // delay between API requests

const DEEPL_API_KEY = process.env.NEXT_PUBLIC_DEEPL_API_KEY;

const API_URL = "https://api-free.deepl.com/v2/translate";

async function translateText(text, targetLang) {
  if (!DEEPL_API_KEY) {
    throw new Error("❌ Missing DEEPL_API_KEY in environment variables.");
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        text,
        source_lang: BASE_LANG.toUpperCase(),
        target_lang: targetLang.toUpperCase(),
      }),
    });

    const data = await response.json();

    if (data?.translations?.[0]?.text) {
      return data.translations[0].text;
    } else {
      console.warn("⚠️ No translation result:", data);
      return text;
    }
  } catch (error) {
    console.error("⚠️ Translation error:", error);
    return text;
  }
}

// Recursively get all nested keys in dot notation
function deepKeys(obj, prefix = "") {
  return Object.keys(obj).flatMap((key) => {
    const pathKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      return deepKeys(obj[key], pathKey);
    }
    return pathKey;
  });
}

// Get nested value by path
function getNested(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

// Set nested value by path
function setNested(obj, path, value) {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const nested = keys.reduce((acc, key) => (acc[key] ??= {}), obj);
  nested[lastKey] = value;
}

// Sleep utility
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Main function
async function main() {
  const enPath = path.join(MESSAGES_DIR, `${BASE_LANG}.json`);
  if (!fs.existsSync(enPath)) {
    console.error(`❌ Base language file not found: ${enPath}`);
    return;
  }

  const enData = JSON.parse(fs.readFileSync(enPath, "utf8"));
  const allKeys = deepKeys(enData);

  for (const lang of LOCALES) {
    const filePath = path.join(MESSAGES_DIR, `${lang}.json`);
    const data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf8")) : {};

    let translatedCount = 0;

    for (const key of allKeys) {
      const baseValue = getNested(enData, key);
      const targetValue = getNested(data, key);

      if (typeof baseValue !== "string") continue; // only strings
      if (targetValue !== undefined) continue; // skip existing

      const translated = await translateText(baseValue, lang);
      setNested(data, key, translated);
      translatedCount++;
      console.log(`🈂️  [${lang}] ${key} → ${translated}`);

      await sleep(REQUEST_DELAY_MS); // avoid overloading free API
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    console.log(`✅ ${lang}.json updated (${translatedCount} new keys)`);
  }
}

// Run
main().catch((err) => console.error(err));
