import {
  log,
  saveDataManagerSetGlobal,
  setLogFunctionsGlobal,
} from "isaacscript-common";

export function debugFunction(): void {
  log("Entering debug function.");

  saveDataManagerSetGlobal();
  setLogFunctionsGlobal();

  debugCode();

  log("Exiting debug function.");

  Isaac.ConsoleOutput("Executed debug function.");
}

export function debugCode() {}
