import {
  ButtonAction,
  InputHook,
  ModCallback,
} from "isaac-typescript-definitions";
import { getCurrentBaby } from "../utils";
import { inputActionBabyFunctionMap } from "./inputActionBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.INPUT_ACTION, main);
}

function main(
  entity: Entity | undefined,
  inputHook: InputHook,
  buttonAction: ButtonAction,
): number | boolean | undefined {
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
