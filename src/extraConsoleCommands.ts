import { debugFunction, setDebugBaby } from "./debugFunction";
import { g } from "./globals";
import { mod } from "./mod";

export function enableExtraConsoleCommandsBabiesMod(): void {
  mod.addConsoleCommand("baby", baby);
  mod.addConsoleCommand("baby2", baby2);
  mod.addConsoleCommand("babyDebug", babyDebug);
  mod.addConsoleCommand("babyRandom", babyRandom);
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

function babyRandom() {
  g.debugBabyNum = undefined;
  Isaac.ExecuteCommand("restart");
}
