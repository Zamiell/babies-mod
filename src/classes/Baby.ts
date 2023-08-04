import { ModCallback } from "isaac-typescript-definitions";
import type { SaveData } from "isaacscript-common";
import {
  game,
  getPlayerFromEntity,
  getTSTLClassName,
  ModCallbackCustom,
  ModFeature,
  ReadonlyMap,
} from "isaacscript-common";
import type { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { mod } from "../mod";
import type { BabyDescription } from "../types/BabyDescription";
import { isValidRandomBabyPlayer } from "../utils";

/**
 * The base class that each baby class extends from. This sets up the callback class methods to only
 * be fired if the relevant baby is active.
 */
export class Baby extends ModFeature {
  babyType: RandomBabyType;
  babyDescription: BabyDescription;

  override shouldCallbackMethodsFire = <T extends boolean>(
    vanilla: T,
    modCallback: T extends true ? ModCallback : ModCallbackCustom,
    ...callbackArgs: unknown[]
  ): boolean => {
    if (g.run.babyType !== this.babyType) {
      return false;
    }

    const shouldCallbackFireFunc = vanilla
      ? shouldCallbackFireVanilla
      : shouldCallbackFireCustom;
    return shouldCallbackFireFunc(modCallback, ...callbackArgs);
  };

  constructor(babyType: RandomBabyType, baby: BabyDescription) {
    super(mod, false);

    this.babyType = babyType;
    this.babyDescription = baby;
  }

  getAttribute<T extends keyof BabyDescription>(
    attributeName: T,
  ): NonNullable<BabyDescription[T]> {
    const attribute = this.babyDescription[attributeName];
    if (attribute === undefined) {
      error(
        `Failed to get the "${attributeName}" attribute for "${this.babyDescription.name}" since it was undefined.`,
      );
    }

    return attribute as NonNullable<BabyDescription[T]>;
  }

  /** Called from "babyCheckValid.ts". */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isValid(player: EntityPlayer): boolean {
    return true;
  }

  /** Called from "babyAdd.ts". */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAdd(player: EntityPlayer): void {}

  /** Called from "babyRemove.ts". */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRemove(player: EntityPlayer, oldBabyCounters: int): void {}

  /**
   * Helper method to register class variables with the save data manager. (This cannot be done in
   * the parent class constructor because they do not have access to the child properties.)
   */
  saveDataManager(babyClassWithV: { v: SaveData }): void {
    const className = getTSTLClassName(this);
    if (className === undefined) {
      error(
        "Failed to get the class name of the class while registering the save data manager.",
      );
    }

    mod.saveDataManager(
      className,
      babyClassWithV.v,
      () => g.run.babyType === this.babyType,
    );
  }
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
  // 3
  [
    ModCallback.POST_USE_ITEM,
    (...callbackArgs: unknown[]) => {
      const player = callbackArgs[2] as EntityPlayer;
      return isValidRandomBabyPlayer(player);
    },
  ],

  // 5
  [
    ModCallback.POST_USE_CARD,
    (...callbackArgs: unknown[]) => {
      const player = callbackArgs[1] as EntityPlayer;
      return isValidRandomBabyPlayer(player);
    },
  ],

  // 8
  [
    ModCallback.EVALUATE_CACHE,
    (...callbackArgs: unknown[]) => {
      const player = callbackArgs[0] as EntityPlayer;
      return isValidRandomBabyPlayer(player);
    },
  ],

  // 10
  [
    ModCallback.POST_USE_PILL,
    (...callbackArgs: unknown[]) => {
      const player = callbackArgs[1] as EntityPlayer;
      return isValidRandomBabyPlayer(player);
    },
  ],

  // 23
  [
    ModCallback.PRE_USE_ITEM,
    (...callbackArgs: unknown[]) => {
      const player = callbackArgs[2] as EntityPlayer;
      return isValidRandomBabyPlayer(player);
    },
  ],

  // 42
  [
    ModCallback.PRE_TEAR_COLLISION,
    (...callbackArgs: unknown[]) => {
      const tear = callbackArgs[0] as EntityTear;
      const player = getPlayerFromEntity(tear);
      if (player === undefined) {
        return false;
      }

      return isValidRandomBabyPlayer(player);
    },
  ],

  // 61
  [
    ModCallback.POST_FIRE_TEAR,
    (...callbackArgs: unknown[]) => {
      const tear = callbackArgs[0] as EntityTear;
      const player = getPlayerFromEntity(tear);
      if (player === undefined) {
        return false;
      }

      return isValidRandomBabyPlayer(player);
    },
  ],

  // 62
  [ModCallback.PRE_GET_COLLECTIBLE, () => !g.run.gettingCollectible],

  // 68
  [
    ModCallback.POST_ENTITY_KILL,
    (...callbackArgs: unknown[]) => {
      const entity = callbackArgs[0] as Entity;
      const npc = entity.ToNPC();
      return npc !== undefined;
    },
  ],

  // 71
  [
    ModCallback.PRE_ROOM_ENTITY_SPAWN,
    () => {
      // We only care about replacing things when the room is first loading.
      const room = game.GetRoom();
      const roomFrameCount = room.GetFrameCount();
      return roomFrameCount === -1;
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
    ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER,
    (...callbackArgs: unknown[]) => {
      const player = callbackArgs[0] as EntityPlayer;
      return isValidRandomBabyPlayer(player);
    },
  ],

  [
    ModCallbackCustom.INPUT_ACTION_PLAYER,
    (...callbackArgs: unknown[]) => {
      const player = callbackArgs[0] as EntityPlayer;
      return isValidRandomBabyPlayer(player);
    },
  ],

  [
    ModCallbackCustom.POST_BOMB_EXPLODED,
    (...callbackArgs: unknown[]) => {
      const bomb = callbackArgs[0] as EntityBomb;
      const player = getPlayerFromEntity(bomb);
      if (player === undefined) {
        return false;
      }

      return isValidRandomBabyPlayer(player);
    },
  ],

  [
    ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED,
    (...callbackArgs: unknown[]) => {
      const player = callbackArgs[0] as EntityPlayer;
      return isValidRandomBabyPlayer(player);
    },
  ],

  [
    ModCallbackCustom.POST_PICKUP_COLLECT,
    (...callbackArgs: unknown[]) => {
      const player = callbackArgs[1] as EntityPlayer;
      return isValidRandomBabyPlayer(player);
    },
  ],
]);
