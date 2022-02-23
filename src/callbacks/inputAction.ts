import { getCurrentBaby } from "../utils";
import { inputActionBabyFunctionMap } from "./inputActionBabyFunctionMap";

export function main(
  entity: Entity | undefined,
  inputHook: InputHook,
  buttonAction: ButtonAction,
): number | boolean | void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  const inputActionBabyFunction = inputActionBabyFunctionMap.get(babyType);
  if (inputActionBabyFunction !== undefined) {
    return inputActionBabyFunction(entity, inputHook, buttonAction);
  }

  return undefined;
}
