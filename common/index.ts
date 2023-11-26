import { readFileSync } from "fs";
import { EOL } from "os";

export function readFile(filename: string): string[] {
  try {
    var data = readFileSync(filename, "utf8");
    return data.split(EOL);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export function getTimeLogger(): (logMessage?: string) => void {
  const start = Date.now();
  return (logMessage?: string) => {
    const end = Date.now();
    const time = end - start;
    if (logMessage) {
      console.log(`${time}ms | ${logMessage} `);
    } else {
      console.log(`Time taken: ${time}ms`);
    }
  };
}
