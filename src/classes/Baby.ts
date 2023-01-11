import { ModCallback } from "isaac-typescript-definitions";
import {
  isFirstPlayer,
  ModCallbackCustom,
  ModFeature,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { mod } from "../mod";
import { BabyDescription } from "../types/BabyDescription";

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

  constructor(babyType: RandomBabyType, babyDescription: BabyDescription) {
    super(mod);

    this.babyType = babyType;
    this.babyDescription = babyDescription;
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

const MOD_CALLBACK_TO_VALIDATION_FUNC = new Map<
  ModCallback,
  (...callbackArgs: unknown[]) => boolean
>();

// 62
MOD_CALLBACK_TO_VALIDATION_FUNC.set(
  ModCallback.PRE_GET_COLLECTIBLE,
  () => !g.run.gettingCollectible,
);

// 68
MOD_CALLBACK_TO_VALIDATION_FUNC.set(
  ModCallback.POST_ENTITY_KILL,
  (...callbackArgs: unknown[]) => {
    const entity = callbackArgs[0] as Entity;
    const npc = entity.ToNPC();
    return npc !== undefined && npc.IsVulnerableEnemy();
  },
);

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

const MOD_CALLBACK_CUSTOM_TO_VALIDATION_FUNC = new Map<
  ModCallbackCustom,
  (...callbackArgs: unknown[]) => boolean
>();

MOD_CALLBACK_CUSTOM_TO_VALIDATION_FUNC.set(
  ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER,
  (...callbackArgs: unknown[]) => {
    const player = callbackArgs[0] as EntityPlayer;
    return isFirstPlayer(player);
  },
);

MOD_CALLBACK_CUSTOM_TO_VALIDATION_FUNC.set(
  ModCallbackCustom.INPUT_ACTION_PLAYER,
  (...callbackArgs: unknown[]) => {
    const player = callbackArgs[0] as EntityPlayer;
    return isFirstPlayer(player);
  },
);

MOD_CALLBACK_CUSTOM_TO_VALIDATION_FUNC.set(
  ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED,
  (...callbackArgs: unknown[]) => {
    const player = callbackArgs[0] as EntityPlayer;
    return isFirstPlayer(player);
  },
);
