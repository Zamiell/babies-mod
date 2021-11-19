import { executeCmdFunctionMap } from "./executeCmdFunctionMap";

export function main(cmd: string, params: string): void {
  const executeCmdFunction = executeCmdFunctionMap.get(cmd);
  if (executeCmdFunction !== undefined) {
    executeCmdFunction(params);
  }
}
