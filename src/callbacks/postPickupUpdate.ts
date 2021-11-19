import { log } from "isaacscript-common";
import g from "../globals";
import { pickupTouchedBabyFunctionMap } from "../pickupTouchedBabyFunctionMap";
import { CollectibleTypeCustom } from "../types/enums";
import { getCurrentBaby, spawnRandomPickup } from "../util";
import { postPickupUpdateBabyFunctionMap } from "./postPickupUpdateBabyFunctionMap";

export function main(pickup: EntityPickup): void {
  const data = pickup.GetData();
  const sprite = pickup.GetSprite();
  const [babyType, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // All baby effects should ignore the Checkpoint
  if (
    pickup.Variant === PickupVariant.PICKUP_COLLECTIBLE &&
    pickup.SubType === CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT
  ) {
    return;
  }

  // If the player is on a trinket baby, then they will not be able to take any dropped trinkets
  // (unless they have Mom's Purse or Belly Button)
  // So, if this is the case, replace any trinkets that drop with a random pickup
  // (this cannot be in the PostPickupInit callback, because the position is not initialized yet)
  if (
    baby.trinket !== undefined &&
    pickup.Variant === PickupVariant.PICKUP_TRINKET &&
    pickup.SubType !== baby.trinket && // We don't want to replace a dropped trinket
    pickup.FrameCount === 1 && // Frame 0 does not work
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_PURSE) && // 139
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_BELLY_BUTTON) // 458
  ) {
    spawnRandomPickup(pickup.Position, pickup.Velocity, true);
    pickup.Remove();
    return;
  }

  // Keep track of pickups that are touched
  if (sprite.IsPlaying("Collect") && data.touched === undefined) {
    data.touched = true;
    log(
      `Touched pickup: ${pickup.Type}.${pickup.Variant}.${pickup.SubType} (BM)`,
    );

    const pickupTouchedBabyFunction =
      pickupTouchedBabyFunctionMap.get(babyType);
    if (pickupTouchedBabyFunction !== undefined) {
      pickupTouchedBabyFunction();
    }
  }

  const postPickupUpdateBabyFunction =
    postPickupUpdateBabyFunctionMap.get(babyType);
  if (postPickupUpdateBabyFunction !== undefined) {
    postPickupUpdateBabyFunction(pickup);
  }
}
