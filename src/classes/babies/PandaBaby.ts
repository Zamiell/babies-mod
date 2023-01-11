import {
  CollectibleType,
  GridEntityType,
  ModCallback,
  PoopGridEntityVariant,
  SoundEffect,
} from "isaac-typescript-definitions";
import { Callback, sfxManager } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with The Poop (improved). */
export class PandaBaby extends Baby {
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.POOP)
  preUseItemPoop(): boolean | undefined {
    // Spawn White Poop next to the player.
    Isaac.GridSpawn(
      GridEntityType.POOP,
      PoopGridEntityVariant.WHITE,
      g.p.Position,
    );

    sfxManager.Play(SoundEffect.FART);

    // Cancel the original effect.
    return true;
  }
}
