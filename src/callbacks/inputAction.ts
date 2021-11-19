// Different actions occur on different inputHooks and this is not documented
// Thus, each action's particular inputHook must be determined through trial and error
// Also note that we can't use cached API functions in this callback or else the game will crash

import { getCurrentBaby } from "../util";
import { inputActionBabyFunctionMap } from "./inputActionBabyFunctionMap";

export function main(
  _entity: Entity | undefined,
  inputHook: InputHook,
  buttonAction: ButtonAction,
): number | boolean | void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  const inputActionBabyFunction = inputActionBabyFunctionMap.get(babyType);
  if (inputActionBabyFunction !== undefined) {
    return inputActionBabyFunction(inputHook, buttonAction);
  }

  return undefined;
}
