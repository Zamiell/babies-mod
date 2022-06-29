import {
  log,
  saveDataManagerSetGlobal,
  setLogFunctionsGlobal,
} from "isaacscript-common";
import { MAX_BABY_TYPE } from "./enums/RandomBabyType";
import g from "./globals";

function debugCode() {}

export function debugFunction(): void {
  log("Entering debug function.");

  saveDataManagerSetGlobal();
  setLogFunctionsGlobal();

  debugCode();

  log("Exiting debug function.");

  Isaac.ConsoleOutput("Executed debug function.");
}

export function setDebugBaby(params: string, restart: boolean): void {
  // Check to see if this is a valid baby number.
  let babyNum = tonumber(params);
  if (
    babyNum === undefined ||
    babyNum < 0 ||
    babyNum > (MAX_BABY_TYPE as int)
  ) {
    babyNum = undefined;
  }

  g.debugBabyNum = babyNum;
  Isaac.ConsoleOutput(`Set debug baby to be: ${babyNum}\n`);

  if (restart) {
    Isaac.ExecuteCommand("restart");
  }
}
