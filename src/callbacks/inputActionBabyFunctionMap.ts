import {
  ButtonAction,
  CollectibleType,
  InputHook,
} from "isaac-typescript-definitions";
import { isActionPressedOnAnyInput, isShootAction } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import g from "../globals";

export const inputActionBabyFunctionMap = new Map<
  int,
  (
    entity: Entity | undefined,
    inputHook: InputHook,
    buttonAction: ButtonAction,
  ) => number | boolean | undefined
>();

// Masked Baby
inputActionBabyFunctionMap.set(
  115,
  (
    entity: Entity | undefined,
    inputHook: InputHook,
    buttonAction: ButtonAction,
  ) => {
    if (entity === undefined) {
      return undefined;
    }

    const player = entity.ToPlayer();
    if (player === undefined) {
      return undefined;
    }

    if (inputHook !== InputHook.IS_ACTION_PRESSED) {
      return undefined;
    }

    if (!isShootAction(buttonAction)) {
      return undefined;
    }

    // Can't shoot while moving. This ability does not interact well with charged items, so don't do
    // anything if the player has a charged item.
    if (
      player.HasCollectible(CollectibleType.CHOCOLATE_MILK) || // 69
      player.HasCollectible(CollectibleType.MOMS_KNIFE) || // 114
      player.HasCollectible(CollectibleType.BRIMSTONE) || // 118
      player.HasCollectible(CollectibleType.MONSTROS_LUNG) || // 229
      player.HasCollectible(CollectibleType.CURSED_EYE) || // 316
      player.HasCollectible(CollectibleType.TECH_X) || // 395
      player.HasCollectible(CollectibleType.MAW_OF_THE_VOID) // 399
    ) {
      return undefined;
    }

    const amMoving = player.Velocity.Length() > 0.75;
    return amMoving ? false : undefined;
  },
);

// Piece A Baby
inputActionBabyFunctionMap.set(
  179,
  (
    _entity: Entity | undefined,
    _inputHook: InputHook,
    buttonAction: ButtonAction,
  ) => {
    // Can only move up + down + left + right.
    if (
      buttonAction === ButtonAction.LEFT && // 0
      (isActionPressedOnAnyInput(ButtonAction.UP) || // 2
        isActionPressedOnAnyInput(ButtonAction.DOWN)) // 3
    ) {
      return 0;
    }
    if (
      buttonAction === ButtonAction.RIGHT && // 1
      (isActionPressedOnAnyInput(ButtonAction.UP) || // 2
        isActionPressedOnAnyInput(ButtonAction.DOWN)) // 3
    ) {
      return 0;
    }
    if (
      buttonAction === ButtonAction.UP && // 2
      (isActionPressedOnAnyInput(ButtonAction.LEFT) || // 0
        isActionPressedOnAnyInput(ButtonAction.RIGHT)) // 1
    ) {
      return 0;
    }
    if (
      buttonAction === ButtonAction.DOWN && // 3
      (isActionPressedOnAnyInput(ButtonAction.LEFT) || // 0
        isActionPressedOnAnyInput(ButtonAction.RIGHT)) // 1
    ) {
      return 0;
    }

    return undefined;
  },
);

// Imp Baby
inputActionBabyFunctionMap.set(
  386,
  (
    _entity: Entity | undefined,
    _inputHook: InputHook,
    buttonAction: ButtonAction,
  ) => {
    // Blender + flight + explosion immunity + blindfolded.

    // The direction is stored in the "babyCounters" variable It can have these values:
    // - ButtonAction.SHOOT_LEFT (4)
    // - ButtonAction.SHOOT_RIGHT (5)
    // - ButtonAction.SHOOT_UP (6)
    // - ButtonAction.SHOOT_DOWN (7)
    let direction = g.run.babyCounters as ButtonAction;

    // We need to swap right and up.
    if (direction === ButtonAction.SHOOT_RIGHT) {
      direction = ButtonAction.SHOOT_UP;
    } else if (direction === ButtonAction.SHOOT_UP) {
      direction = ButtonAction.SHOOT_RIGHT;
    }

    // Make the player face in this direction.
    if (buttonAction === direction) {
      return 1;
    }

    return undefined;
  },
);

// Solomon's Baby A
inputActionBabyFunctionMap.set(
  RandomBabyType.SOLOMONS_A,
  (
    _entity: Entity | undefined,
    inputHook: InputHook,
    buttonAction: ButtonAction,
  ) => {
    // Can't shoot right
    if (
      inputHook === InputHook.IS_ACTION_PRESSED &&
      buttonAction === ButtonAction.SHOOT_RIGHT
    ) {
      return false;
    }

    return undefined;
  },
);

// Solomon's Baby B
inputActionBabyFunctionMap.set(
  RandomBabyType.SOLOMONS_B,
  (
    _entity: Entity | undefined,
    inputHook: InputHook,
    buttonAction: ButtonAction,
  ) => {
    // Can't shoot left
    if (
      inputHook === InputHook.IS_ACTION_PRESSED &&
      buttonAction === ButtonAction.SHOOT_LEFT
    ) {
      return false;
    }

    return undefined;
  },
);
