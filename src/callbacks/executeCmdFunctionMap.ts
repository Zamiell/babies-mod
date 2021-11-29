import { printConsole } from "isaacscript-common";
import { debugFunction, setDebugBaby } from "../debugFunction";
import g from "../globals";
import * as costumeProtector from "../lib/character_costume_protector";

export const executeCmdFunctionMap = new Map<
  string,
  (params: string) => void
>();

// "baby #" will restart as the specified baby
executeCmdFunctionMap.set("baby", (params: string) => {
  setDebugBaby(params, true);
});

// "baby2" will lock in the specified baby but will not restart the current run
executeCmdFunctionMap.set("baby2", (params: string) => {
  setDebugBaby(params, false);
});

executeCmdFunctionMap.set("babydebug", (_params: string) => {
  debugFunction();
});

executeCmdFunctionMap.set("costume", (_params: string) => {
  const player = Isaac.GetPlayer();
  costumeProtector.stopNewRoomCostumes(player);
  printConsole("Cleared costumes.");
});

executeCmdFunctionMap.set("disable", (_params: string) => {
  g.debugBabyNum = null;
  Isaac.ExecuteCommand("restart");
});
