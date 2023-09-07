import { ModCallback } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModFeature, ReadonlyMap } from "isaacscript-common";
import { isValidRandomBabyPlayer } from "../utils";
import { getBabyType } from "./features/babySelection/v";

/**
 * The base class that each feature class in this mod extends from. This sets up the callback class
 * methods to only be fired if a baby is active.
 *
 * Most of the code in this class is copied from the `Baby` class, since its functionality is
 * similar.
 */
export abstract class BabyModFeature extends ModFeature {
  override shouldCallbackMethodsFire = <T extends boolean>(
    vanilla: T,
    modCallback: T extends true ? ModCallback : ModCallbackCustom,
    ...callbackArgs: unknown[]
  ): boolean => {
    if (getBabyType() === undefined) {
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
>([
  [
    ModCallback.EVALUATE_CACHE,
    (...callbackArgs: unknown[]) => {
      const player = callbackArgs[0] as EntityPlayer;
      return isValidRandomBabyPlayer(player);
    },
  ],
]);

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
