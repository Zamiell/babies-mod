import {
  CollectibleType,
  EntityType,
  FamiliarVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  countEntities,
  removeAllMatchingEntities,
  spawnFamiliar,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Gains a explosive egg per enemy killed. */
export class DinoBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.BOBS_BRAIN);
  }

  /** Remove any leftover eggs. */
  override onRemove(): void {
    removeAllMatchingEntities(EntityType.FAMILIAR, FamiliarVariant.BOBS_BRAIN);
  }

  // 8
  @Callback(ModCallback.POST_FAMILIAR_UPDATE, FamiliarVariant.BOBS_BRAIN)
  postFamiliarUpdateBobsBrain(familiar: EntityFamiliar): void {
    // Bob's Brain familiars have a sub-type of 1 after they explode.
    if (familiar.SubType === 1) {
      familiar.Remove();
    }
  }

  // 68
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(): void {
    // Don't bother giving another egg if we already have a bunch.
    const numBrains = countEntities(
      EntityType.FAMILIAR,
      FamiliarVariant.BOBS_BRAIN,
    );
    if (numBrains >= 6) {
      return;
    }

    // Spawn a new Bob's Brain familiar that we will re-skin to look like an egg.
    const player = Isaac.GetPlayer();
    const brain = spawnFamiliar(FamiliarVariant.BOBS_BRAIN, 0, player.Position);

    const sprite = brain.GetSprite();
    sprite.Load("gfx/003.059_bobs brain_custom.anm2", true);
    sprite.Play("Idle", true);
  }
}
