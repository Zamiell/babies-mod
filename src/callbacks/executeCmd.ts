import { ModCallback } from "isaac-typescript-definitions";
import { debugFunction, setDebugBaby } from "../debugFunction";
import { g } from "../globals";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.EXECUTE_CMD, main);
}

function main(cmd: string, params: string) {
  const executeCmdFunction = executeCmdFunctionMap.get(cmd);
  if (executeCmdFunction !== undefined) {
    executeCmdFunction(params);
  }
}

const executeCmdFunctionMap = new Map<string, (params: string) => void>();

// "baby #" will restart as the specified baby.
executeCmdFunctionMap.set("baby", (params: string) => {
  setDebugBaby(params, true);
});

// "baby2" will lock in the specified baby but will not restart the current run.
executeCmdFunctionMap.set("baby2", (params: string) => {
  setDebugBaby(params, false);
});

executeCmdFunctionMap.set("babydebug", (_params: string) => {
  debugFunction();
});

executeCmdFunctionMap.set("disable", (_params: string) => {
  g.debugBabyNum = undefined;
  Isaac.ExecuteCommand("restart");
});
