import {
  CollectibleType,
  LevelStage,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  hasCollectible,
  onEffectiveStage,
  onStageWithNaturalDevilRoom,
  removeCollectibleFromItemTracker,
  sfxManager,
} from "isaacscript-common";
import { Baby } from "../Baby";

const GRANTED_COLLECTIBLE_TYPES = [
  CollectibleType.GOAT_HEAD, // 215
  CollectibleType.DUALITY, // 498
] as const;

const v = {
  run: {
    numHits: 0,
  },
};

/** Guaranteed Devil Room + Angel Room after N hits. */
export class GoatBaby extends Baby {
  v = v;

  /**
   * Only valid for floors with Devil Rooms. Also, we are guaranteed a Devil Room on Basement 2, so
   * we don't want to have it there either.
   */
  override isValid(player: EntityPlayer): boolean {
    return (
      !hasCollectible(player, ...GRANTED_COLLECTIBLE_TYPES) &&
      onStageWithNaturalDevilRoom() &&
      !onEffectiveStage(LevelStage.BASEMENT_2)
    );
  }

  override onRemove(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    if (v.run.numHits >= num) {
      for (const collectibleType of GRANTED_COLLECTIBLE_TYPES) {
        player.RemoveCollectible(collectibleType);
      }
    }
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmg(player: EntityPlayer): boolean | undefined {
    const num = this.getAttribute("num");

    v.run.numHits++;
    if (v.run.numHits === num) {
      sfxManager.Play(SoundEffect.SATAN_GROW);

      for (const collectibleType of GRANTED_COLLECTIBLE_TYPES) {
        player.AddCollectible(collectibleType);
        removeCollectibleFromItemTracker(collectibleType);
      }
    }

    return undefined;
  }
}
