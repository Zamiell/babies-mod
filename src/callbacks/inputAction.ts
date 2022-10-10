import {
  ButtonAction,
  InputHook,
  ModCallback,
} from "isaac-typescript-definitions";
import { mod } from "../mod";
import { getCurrentBaby } from "../utils";
import { inputActionBabyFunctionMap } from "./inputActionBabyFunctionMap";

export function init(): void {
  mod.AddCallback(ModCallback.INPUT_ACTION, main);
}

function main(
  entity: Entity | undefined,
  inputHook: InputHook,
  buttonAction: ButtonAction,
): number | boolean | undefined {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const inputActionBabyFunction = inputActionBabyFunctionMap.get(babyType);
  if (inputActionBabyFunction !== undefined) {
    return inputActionBabyFunction(entity, inputHook, buttonAction);
  }

  return undefined;
}
