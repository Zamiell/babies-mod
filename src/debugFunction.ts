import { log, setLogFunctionsGlobal } from "isaacscript-common";
import { setDebugBabyType } from "./classes/features/babySelection/v";
import { MAX_BABY_TYPE } from "./constants";
import type { RandomBabyType } from "./enums/RandomBabyType";

/** Associated with the "babydebug" command. */
function debugCode() {
  // Add code here.
}

export function debugFunction(): void {
  setLogFunctionsGlobal();

  log("Entering debug function.");
  debugCode();
  log("Exiting debug function.");

  print("Executed debug function.");
}

export function setDebugBaby(params: string, restart: boolean): void {
  // Check to see if this is a valid baby number.
  let babyTypeNumber = tonumber(params);
  if (
    babyTypeNumber === undefined ||
    babyTypeNumber < 0 ||
    babyTypeNumber > (MAX_BABY_TYPE as int)
  ) {
    babyTypeNumber = undefined;
  }

  const babyType = babyTypeNumber as RandomBabyType | undefined;

  setDebugBabyType(babyType);
  print(`Set debug baby to be: ${babyTypeNumber}\n`);

  if (restart) {
    Isaac.ExecuteCommand("restart");
  }
}
