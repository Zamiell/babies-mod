import { CollectibleType, SlotVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  isSlotMachine,
  spawnCollectible,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Destroying machines gives items. */
export class GappyBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_SLOT_DESTROYED)
  postSlotDestroyed(slot: EntitySlot): void {
    if (!isSlotMachine(slot)) {
      return;
    }

    // We blacklist Donation Machines since `isaacscript-common` thinks that they are destroyed when
    // they are removed by Racing+.
    if (slot.Variant === SlotVariant.DONATION_MACHINE) {
      return;
    }

    spawnCollectible(CollectibleType.NULL, slot.Position, slot.InitSeed);
  }
}
