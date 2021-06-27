// Different actions occur on different inputHooks and this is not documented
// Thus, each action's particular inputHook must be determined through trial and error
// Also note that we can't use cached API functions in this callback or else the game will crash

import { getCurrentBaby } from "../misc";
import inputActionBabyFunctions from "./inputActionBabies";

export function main(
  _entityPlayer: EntityPlayer,
  inputHook: InputHook,
  buttonAction: ButtonAction,
): number | boolean | void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  const babyFunc = inputActionBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    return babyFunc(inputHook, buttonAction);
  }

  return undefined;
}
