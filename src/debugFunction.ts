import {
  asNumber,
  getMapPartialMatch,
  log,
  setLogFunctionsGlobal,
} from "isaacscript-common";
import { setDebugBabyType } from "./classes/features/babySelection/v";
import { MAX_BABY_TYPE } from "./constants";
import type { RandomBabyType } from "./enums/RandomBabyType";
import { BABIES } from "./objects/babies";

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

const BABY_NAMES_MAP: ReadonlyMap<string, RandomBabyType> = (() => {
  const babyNamesMap = new Map<string, RandomBabyType>();

  for (const [babyTypeString, baby] of Object.entries(BABIES)) {
    const babyType = babyTypeString as unknown as RandomBabyType;
    babyNamesMap.set(baby.name, babyType);
  }

  return babyNamesMap;
})();

export function setDebugBaby(params: string, restart: boolean): void {
  // Check to see if this is a valid baby number or baby name.
  let babyType: RandomBabyType | undefined;

  if (params !== "") {
    const babyTypeNumber = tonumber(params);
    if (babyTypeNumber === undefined) {
      // They provided a string argument.
      const match = getMapPartialMatch(params, BABY_NAMES_MAP);
      if (match === undefined) {
        print(`Failed to find a baby matching: ${params}`);
        return;
      }
      babyType = match[1];
    } else if (
      babyTypeNumber >= 0
      || babyTypeNumber <= asNumber(MAX_BABY_TYPE)
    ) {
      // They provided a (valid) number argument.
      babyType = babyTypeNumber as RandomBabyType;
    }
  }

  setDebugBabyType(babyType);
  if (babyType === undefined) {
    print("Cleared debug baby.");
  } else {
    const baby = BABIES[babyType];
    print(`Set debug baby to be: ${baby.name} (#${babyType})`);
  }

  if (restart) {
    Isaac.ExecuteCommand("restart");
  }
}
