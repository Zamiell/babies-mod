import { executeCmdFunctionMap } from "./executeCmdFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_EXECUTE_CMD, main);
}

function main(cmd: string, params: string) {
  const executeCmdFunction = executeCmdFunctionMap.get(cmd);
  if (executeCmdFunction !== undefined) {
    executeCmdFunction(params);
  }
}
