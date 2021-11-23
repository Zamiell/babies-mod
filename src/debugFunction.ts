import {
  log,
  saveDataManagerSetGlobal,
  setLogFunctionsGlobal,
} from "isaacscript-common";
import g from "./globals";

export function debugCode() {}

export function debugFunction() {
  log("Entering debug function.");

  saveDataManagerSetGlobal();
  setLogFunctionsGlobal();

  debugCode();

  log("Exiting debug function.");

  Isaac.ConsoleOutput("Executed debug function.");
}

export function setDebugBaby(params: string, restart: boolean) {
  // Check to see if this is a valid baby number
  let babyNum: number | null | undefined = tonumber(params);
  if (babyNum === undefined || babyNum < 0 || babyNum >= g.babies.length) {
    babyNum = null;
  }

  g.debugBabyNum = babyNum;
  Isaac.ConsoleOutput(`Set debug baby to be: ${babyNum}\n`);

  if (restart) {
    Isaac.ExecuteCommand("restart");
  }
}
