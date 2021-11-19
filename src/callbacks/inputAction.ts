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
