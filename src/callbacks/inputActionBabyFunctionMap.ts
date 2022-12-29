import {
  ButtonAction,
  CollectibleType,
  InputHook,
} from "isaac-typescript-definitions";
import {
  isActionPressed,
  isShootAction,
  playerHasCollectible,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import g from "../globals";

const COLLECTIBLE_TYPES_THAT_GRANT_CHARGE_SHOTS = [
  CollectibleType.CHOCOLATE_MILK, // 69
  CollectibleType.MOMS_KNIFE, // 114
  CollectibleType.BRIMSTONE, // 118
  CollectibleType.MONSTROS_LUNG, // 229
  CollectibleType.CURSED_EYE, // 316
  CollectibleType.TECH_X, // 395
  CollectibleType.MAW_OF_THE_VOID, // 399
] as const;

const BUTTON_ACTIONS_LEFT_RIGHT = [ButtonAction.LEFT, ButtonAction.RIGHT];
const BUTTON_ACTIONS_UP_DOWN = [ButtonAction.UP, ButtonAction.DOWN];

const PIECE_A_ILLEGAL_INPUTS: ReadonlyMap<
  ButtonAction,
  readonly ButtonAction[]
> = new Map([
  [ButtonAction.LEFT, BUTTON_ACTIONS_UP_DOWN], // 0
  [ButtonAction.RIGHT, BUTTON_ACTIONS_UP_DOWN], // 1
  [ButtonAction.UP, BUTTON_ACTIONS_LEFT_RIGHT], // 2
  [ButtonAction.DOWN, BUTTON_ACTIONS_LEFT_RIGHT], // 3
]);

export const inputActionBabyFunctionMap = new Map<
  RandomBabyType,
  (
    entity: Entity | undefined,
    inputHook: InputHook,
    buttonAction: ButtonAction,
  ) => number | boolean | undefined
>();

// 115
inputActionBabyFunctionMap.set(
  RandomBabyType.MASKED,
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
      playerHasCollectible(player, ...COLLECTIBLE_TYPES_THAT_GRANT_CHARGE_SHOTS)
    ) {
      return undefined;
    }

    const amMoving = player.Velocity.Length() > 0.75;
    return amMoving ? false : undefined;
  },
);

// 179
inputActionBabyFunctionMap.set(
  RandomBabyType.PIECE_A,
  (
    entity: Entity | undefined,
    _inputHook: InputHook,
    buttonAction: ButtonAction,
  ) => {
    if (entity === undefined) {
      return;
    }

    const player = entity.ToPlayer();
    if (player === undefined) {
      return;
    }

    // Can only move up + down + left + right.
    const illegalInputs = PIECE_A_ILLEGAL_INPUTS.get(buttonAction);
    if (illegalInputs === undefined) {
      return undefined;
    }

    const pressingIllegalInput = isActionPressed(
      player.ControllerIndex,
      ...illegalInputs,
    );
    return pressingIllegalInput ? 0 : undefined;
  },
);

// 386
inputActionBabyFunctionMap.set(
  RandomBabyType.IMP,
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

// 531
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

// 532
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
