import { debugFunction, setDebugBaby } from "./debugFunction";
import { mod } from "./mod";

export function enableExtraConsoleCommandsBabiesMod(): void {
  mod.addConsoleCommand("baby", baby);
  mod.addConsoleCommand("baby2", baby2);
  mod.addConsoleCommand("babyDebug", babyDebug);
}

/** "baby #" will restart as the specified baby. */
function baby(params: string) {
  setDebugBaby(params, true);
}

/** "baby2 #" will lock in the specified baby but will not restart the current run. */
function baby2(params: string) {
  setDebugBaby(params, false);
}

function babyDebug() {
  debugFunction();
}
