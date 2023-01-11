import { CollectibleType } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { g } from "../../globals";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** Destroying machines gives items. */
export class GappyBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_SLOT_DESTROYED)
  postSlotDestroyed(slot: EntitySlot): void {
    mod.spawnCollectible(CollectibleType.NULL, slot.Position, g.run.rng);
  }
}
