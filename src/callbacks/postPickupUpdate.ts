// Note: This callback only fires on frame 1 and onwards

import g from "../globals";
import * as misc from "../misc";
import pickupTouchedFunctions from "../pickupTouchedFunctions";
import { CollectibleTypeCustom } from "../types/enums";
import postPickupUpdateBabyFunctions from "./postPickupUpdateBabies";

export function main(pickup: EntityPickup): void {
  // Local variables
  const data = pickup.GetData();
  const sprite = pickup.GetSprite();
  const [babyType, baby, valid] = misc.getCurrentBaby();
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
    misc.spawnRandomPickup(pickup.Position, pickup.Velocity, true);
    pickup.Remove();
    return;
  }

  // Keep track of pickups that are touched
  if (sprite.IsPlaying("Collect") && data.touched === undefined) {
    data.touched = true;
    Isaac.DebugString(
      `Touched pickup. ${pickup.Type}.${pickup.Variant}.${pickup.SubType} (BM)`,
    );

    const babyFunc = pickupTouchedFunctions.get(babyType);
    if (babyFunc !== undefined) {
      babyFunc();
    }
  }

  const babyFunc = postPickupUpdateBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(pickup);
  }
}
