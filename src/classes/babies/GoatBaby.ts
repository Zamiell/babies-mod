import {
  CollectibleType,
  LevelStage,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getEffectiveStage,
  hasCollectible,
  ModCallbackCustom,
  onStageWithNaturalDevilRoom,
  removeCollectibleFromItemTracker,
  sfxManager,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

const GRANTED_COLLECTIBLE_TYPES = [
  CollectibleType.GOAT_HEAD, // 215
  CollectibleType.DUALITY, // 498
] as const;

/** Guaranteed Devil Room + Angel Room after N hits. */
export class GoatBaby extends Baby {
  /**
   * Only valid for floors with Devil Rooms. Also, we are guaranteed a Devil Room on Basement 2, so
   * we don't want to have it there either.
   */
  override isValid(player: EntityPlayer): boolean {
    const effectiveStage = getEffectiveStage();

    return (
      !hasCollectible(player, ...GRANTED_COLLECTIBLE_TYPES) &&
      onStageWithNaturalDevilRoom() &&
      effectiveStage !== LevelStage.BASEMENT_2
    );
  }

  override onRemove(player: EntityPlayer): void {
    for (const collectibleType of GRANTED_COLLECTIBLE_TYPES) {
      player.RemoveCollectible(collectibleType);
    }
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmg(player: EntityPlayer): boolean | undefined {
    const numHits = this.getAttribute("requireNumHits");

    g.run.babyCounters++;
    if (g.run.babyCounters >= numHits && !g.run.babyBool) {
      g.run.babyBool = true;
      sfxManager.Play(SoundEffect.SATAN_GROW);

      for (const collectibleType of GRANTED_COLLECTIBLE_TYPES) {
        player.AddCollectible(collectibleType);
        removeCollectibleFromItemTracker(collectibleType);
      }
    }

    return undefined;
  }
}
