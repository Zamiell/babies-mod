import {
  log,
  saveDataManagerSetGlobal,
  setLogFunctionsGlobal,
} from "isaacscript-common";
import { BABIES } from "./babies";
import g from "./globals";
import { NullItemIDCustom } from "./types/enums";

export function debugCode() {
  const player = Isaac.GetPlayer();
  player.AddNullCostume(NullItemIDCustom.BABY_FLYING);
}

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
  if (babyNum === undefined || babyNum < 0 || babyNum >= BABIES.length) {
    babyNum = null;
  }

  g.debugBabyNum = babyNum;
  Isaac.ConsoleOutput(`Set debug baby to be: ${babyNum}\n`);

  if (restart) {
    Isaac.ExecuteCommand("restart");
  }
}
