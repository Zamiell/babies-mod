import {
  isActionPressedOnAnyInput,
  SHOOTING_ACTIONS_SET,
} from "isaacscript-common";
import { RandomBabyType } from "../babies";
import g from "../globals";

export const inputActionBabyFunctionMap = new Map<
  int,
  (inputHook: InputHook, buttonAction: ButtonAction) => number | boolean | void
>();

// Masked Baby
inputActionBabyFunctionMap.set(
  115,
  (inputHook: InputHook, buttonAction: ButtonAction) => {
    if (
      // The shoot inputs can be on all 3 of the input hooks
      inputHook === InputHook.IS_ACTION_PRESSED &&
      SHOOTING_ACTIONS_SET.has(buttonAction)
    ) {
      // Can't shoot while moving
      // This ability does not interact well with charged items,
      // so don't do anything if the player has a charged item
      const player = Isaac.GetPlayer();
      if (player === undefined) {
        return undefined;
      }

      if (
        player.HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) || // 69
        player.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) || // 114
        player.HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) || // 118
        player.HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) || // 229
        player.HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE) || // 316
        player.HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) || // 395
        player.HasCollectible(CollectibleType.COLLECTIBLE_MAW_OF_THE_VOID) // 399
      ) {
        return undefined;
      }

      // Find out if we are moving
      const threshold = 0.75;
      if (
        player.Velocity.X > threshold ||
        player.Velocity.X < threshold * -1 ||
        player.Velocity.Y > threshold ||
        player.Velocity.Y < threshold * -1
      ) {
        return false;
      }
    }

    return undefined;
  },
);

// Piece A Baby
inputActionBabyFunctionMap.set(
  179,
  (_inputHook: InputHook, buttonAction: ButtonAction) => {
    // Can only move up + down + left + right
    if (
      buttonAction === ButtonAction.ACTION_LEFT && // 0
      (isActionPressedOnAnyInput(ButtonAction.ACTION_UP) || // 2
        isActionPressedOnAnyInput(ButtonAction.ACTION_DOWN)) // 3
    ) {
      return 0;
    }
    if (
      buttonAction === ButtonAction.ACTION_RIGHT && // 1
      (isActionPressedOnAnyInput(ButtonAction.ACTION_UP) || // 2
        isActionPressedOnAnyInput(ButtonAction.ACTION_DOWN)) // 3
    ) {
      return 0;
    }
    if (
      buttonAction === ButtonAction.ACTION_UP && // 2
      (isActionPressedOnAnyInput(ButtonAction.ACTION_LEFT) || // 0
        isActionPressedOnAnyInput(ButtonAction.ACTION_RIGHT)) // 1
    ) {
      return 0;
    }
    if (
      buttonAction === ButtonAction.ACTION_DOWN && // 3
      (isActionPressedOnAnyInput(ButtonAction.ACTION_LEFT) || // 0
        isActionPressedOnAnyInput(ButtonAction.ACTION_RIGHT)) // 1
    ) {
      return 0;
    }

    return undefined;
  },
);

// Imp Baby
inputActionBabyFunctionMap.set(
  386,
  (_inputHook: InputHook, buttonAction: ButtonAction) => {
    // Blender + flight + explosion immunity + blindfolded

    // The direction is stored in the "babyCounters" variable
    // It can have these values:
    // - ButtonAction.ACTION_SHOOTLEFT (4)
    // - ButtonAction.ACTION_SHOOTRIGHT (5)
    // - ButtonAction.ACTION_SHOOTUP (6)
    // - ButtonAction.ACTION_SHOOTDOWN (7)
    let direction = g.run.babyCounters;

    // We need to swap right and up
    if (direction === ButtonAction.ACTION_SHOOTRIGHT) {
      direction = ButtonAction.ACTION_SHOOTUP;
    } else if (direction === ButtonAction.ACTION_SHOOTUP) {
      direction = ButtonAction.ACTION_SHOOTRIGHT;
    }

    // Make the player face in this direction
    if (buttonAction === direction) {
      return 1;
    }

    return undefined;
  },
);

// Solomon's Baby A
inputActionBabyFunctionMap.set(
  RandomBabyType.SOLOMONS_BABY_A,
  (inputHook: InputHook, buttonAction: ButtonAction) => {
    // Can't shoot right
    if (
      inputHook === InputHook.IS_ACTION_PRESSED &&
      buttonAction === ButtonAction.ACTION_SHOOTRIGHT
    ) {
      return false;
    }

    return undefined;
  },
);

// Solomon's Baby B
inputActionBabyFunctionMap.set(
  RandomBabyType.SOLOMONS_BABY_B,
  (inputHook: InputHook, buttonAction: ButtonAction) => {
    // Can't shoot left
    if (
      inputHook === InputHook.IS_ACTION_PRESSED &&
      buttonAction === ButtonAction.ACTION_SHOOTLEFT
    ) {
      return false;
    }

    return undefined;
  },
);
