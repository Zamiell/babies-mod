import type { ModCallback } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModFeature, ReadonlyMap } from "isaacscript-common";
import { g } from "../globals";
import { isValidRandomBabyPlayer } from "../utils";

export class BabyModFeature extends ModFeature {
  override shouldCallbackMethodsFire = <T extends boolean>(
    vanilla: T,
    modCallback: T extends true ? ModCallback : ModCallbackCustom,
    ...callbackArgs: unknown[]
  ): boolean => {
    if (g.run.babyType !== null) {
      return false;
    }

    const shouldCallbackFireFunc = vanilla
      ? shouldCallbackFireVanilla
      : shouldCallbackFireCustom;
    return shouldCallbackFireFunc(modCallback, ...callbackArgs);
  };
}

function shouldCallbackFireVanilla(
  modCallbackNum: int,
  ...callbackArgs: unknown[]
): boolean {
  const modCallback = modCallbackNum as ModCallback;
  const validationFunc = MOD_CALLBACK_TO_VALIDATION_FUNC.get(modCallback);
  if (validationFunc === undefined) {
    return true;
  }

  return validationFunc(...callbackArgs);
}

const MOD_CALLBACK_TO_VALIDATION_FUNC = new ReadonlyMap<
  ModCallback,
  (...callbackArgs: unknown[]) => boolean
>([]);

function shouldCallbackFireCustom(
  modCallbackNum: int,
  ...callbackArgs: unknown[]
): boolean {
  const modCallbackCustom = modCallbackNum as ModCallbackCustom;

  const validationFunc =
    MOD_CALLBACK_CUSTOM_TO_VALIDATION_FUNC.get(modCallbackCustom);
  if (validationFunc === undefined) {
    return true;
  }

  return validationFunc(...callbackArgs);
}

const MOD_CALLBACK_CUSTOM_TO_VALIDATION_FUNC = new ReadonlyMap<
  ModCallbackCustom,
  (...callbackArgs: unknown[]) => boolean
>([
  [
    ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED,
    (...callbackArgs: unknown[]) => {
      const player = callbackArgs[0] as EntityPlayer;
      return isValidRandomBabyPlayer(player);
    },
  ],
]);
