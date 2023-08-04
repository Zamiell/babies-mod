import {
  ChestSubType,
  CollectibleType,
  ModCallback,
  PickupVariant,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  isChest,
  spawnPickup,
} from "isaacscript-common";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** All chests are Mimics + all chests have items. */
export class SpikeBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasTrinket(TrinketType.LEFT_HAND);
  }

  /**
   * Replace all chests with Mimics. This does not work in the `POST_PICKUP_SELECTION` callback
   * because the chest will not initialize properly for some reason.
   */
  // 34
  @Callback(ModCallback.POST_PICKUP_INIT)
  postPickupInit(pickup: EntityPickup): void {
    if (isChest(pickup) && pickup.Variant !== PickupVariant.MIMIC_CHEST) {
      pickup.Remove();
      spawnPickup(
        PickupVariant.MIMIC_CHEST,
        0,
        pickup.Position,
        pickup.Velocity,
        pickup.Parent,
        pickup.InitSeed,
      );
    }
  }

  /** Replace the contents of the Spiked Chests with collectibles. */
  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_UPDATE_FILTER,
    PickupVariant.SPIKED_CHEST,
    ChestSubType.OPENED,
  )
  postPickupUpdateSpikedChestOpen(pickup: EntityPickup): void {
    pickup.Remove();
    mod.spawnCollectible(
      CollectibleType.NULL,
      pickup.Position,
      pickup.InitSeed,
    );
  }
}
