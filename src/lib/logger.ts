const isDev = process.env.NODE_ENV === "development";

const colors = {
  info: "#4caf50",
  success: "#4caf50",
  warn: "#ff9800",
  error: "#f44336",
  timestamp: "#888",
  labelText: "#fff",
};

const labelStyle = (bg: string) =>
  `padding: 2px 8px; border-radius: 4px; font-weight: bold; background: ${bg}; color: ${colors.labelText};`;

function timestamp() {
  return new Date().toISOString();
}

function formatMessage(level: string, color: string, ...args: unknown[]) {
  if (!isDev) return;

  console.log(
    `%c${level} %c[${timestamp()}]%c`,
    labelStyle(color),
    `color: ${colors.timestamp}; font-weight: normal;`,
    "",
    ...args
  );
}

export const logger = {
  info: (...args: unknown[]) => formatMessage("ℹ INFO", colors.info, ...args),
  success: (...args: unknown[]) => formatMessage("✅ SUCCESS", colors.success, ...args),
  warn: (...args: unknown[]) => formatMessage("⚠ WARN", colors.warn, ...args),
  error: (...args: unknown[]) => formatMessage("❌ ERROR", colors.error, ...args),
};
