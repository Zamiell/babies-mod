// Different actions occur on different inputHooks and this is not documented
// Thus, each action's particular inputHook must be determined through trial and error
// Also note that we can't use cached API functions in this callback or else the game will crash

import * as misc from "../misc";
import inputActionBabyFunctions from "./inputActionBabies";

export function main(
  _entityPlayer: EntityPlayer,
  inputHook: InputHook,
  buttonAction: ButtonAction,
): number | boolean | null {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return null;
  }

  const babyFunc = inputActionBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    return babyFunc(inputHook, buttonAction);
  }

  return null;
}
