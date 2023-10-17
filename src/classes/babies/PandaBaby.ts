import type { CollectibleType } from "isaac-typescript-definitions";
import {
  GridEntityType,
  ModCallback,
  PoopGridEntityVariant,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  sfxManager,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { Baby } from "../Baby";

/** Starts with The Holy Poop. */
export class PandaBaby extends Baby {
  @Callback(ModCallback.POST_USE_ITEM, CollectibleTypeCustom.HOLY_POOP)
  preUseItemHolyPoop(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    spawnGridEntityWithVariant(
      GridEntityType.POOP,
      PoopGridEntityVariant.WHITE,
      player.Position,
      false,
    );
    sfxManager.Play(SoundEffect.FART);

    return true;
  }
}
