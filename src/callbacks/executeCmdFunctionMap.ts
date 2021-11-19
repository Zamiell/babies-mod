import { debugFunction } from "../debugFunction";
import g from "../globals";

export const executeCmdFunctionMap = new Map<
  string,
  (params: string) => void
>();

// "baby #" will restart as the specified baby
executeCmdFunctionMap.set("baby", (params: string) => {
  // Check to see if this is a valid baby number
  let babyNum: number | null | undefined = tonumber(params);
  if (babyNum === undefined || babyNum < 0 || babyNum >= g.babies.length) {
    babyNum = null;
  }

  g.debugBabyNum = babyNum;
  Isaac.ConsoleOutput(`Set debug baby to be: ${babyNum}\n`);

  if (babyNum !== null) {
    Isaac.ExecuteCommand("restart");
  }
});

executeCmdFunctionMap.set("babydebug", (_params: string) => {
  debugFunction();
});

executeCmdFunctionMap.set("disable", (_params: string) => {
  g.debugBabyNum = null;
  Isaac.ExecuteCommand("restart");
});
