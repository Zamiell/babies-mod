import {
  EntityCollisionClass,
  PickupVariant,
} from "isaac-typescript-definitions";
import { repeat } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";

export const postPickupUpdateBabyFunctionMap = new Map<
  RandomBabyType,
  (pickup: EntityPickup) => void
>();

// 131
postPickupUpdateBabyFunctionMap.set(
  RandomBabyType.BUGEYED,
  (pickup: EntityPickup) => {
    // Change pickups into Blue Spiders. (This cannot be in the PostPickupInit callback since the
    // pickups do not have position there.)
    if (
      pickup.FrameCount === 1 && // Frame 0 does not work
      pickup.Variant !== PickupVariant.COLLECTIBLE && // 100
      pickup.Variant !== PickupVariant.SHOP_ITEM && // 150
      pickup.Variant !== PickupVariant.BIG_CHEST && // 340
      pickup.Variant !== PickupVariant.TROPHY && // 370
      pickup.Variant !== PickupVariant.BED && // 380
      pickup.Price === 0 // We don't want it to affect shop items
    ) {
      pickup.Remove();

      repeat(3, (i) => {
        // We want to space out the spiders so that you can see each individual one.
        const position = Vector(
          pickup.Position.X + 15 * i,
          pickup.Position.Y + 15 * i,
        );
        g.p.ThrowBlueSpider(position, g.p.Position);
      });
    }
  },
);

// 140
postPickupUpdateBabyFunctionMap.set(
  RandomBabyType.NO_ARMS,
  (pickup: EntityPickup) => {
    if (
      pickup.Variant !== PickupVariant.COLLECTIBLE && // 100
      pickup.Variant !== PickupVariant.SHOP_ITEM && // 150
      pickup.Variant !== PickupVariant.BIG_CHEST && // 340
      pickup.Variant !== PickupVariant.TROPHY && // 370
      pickup.Variant !== PickupVariant.BED // 380
    ) {
      // Make it impossible for the player to pick up this pickup.
      if (pickup.EntityCollisionClass !== EntityCollisionClass.NONE) {
        pickup.EntityCollisionClass = EntityCollisionClass.NONE;
      }

      // Make it bounce off the player if they get too close.
      if (g.p.Position.Distance(pickup.Position) <= 25) {
        const x = pickup.Position.X - g.p.Position.X;
        const y = pickup.Position.Y - g.p.Position.Y;
        pickup.Velocity = Vector(x / 2, y / 2);
      }
    }
  },
);

// 154
postPickupUpdateBabyFunctionMap.set(
  RandomBabyType.RICTUS,
  (pickup: EntityPickup) => {
    if (
      pickup.Variant !== PickupVariant.COLLECTIBLE && // 100
      pickup.Variant !== PickupVariant.SHOP_ITEM && // 150
      pickup.Variant !== PickupVariant.BIG_CHEST && // 340
      pickup.Variant !== PickupVariant.TROPHY && // 370
      pickup.Variant !== PickupVariant.BED && // 380
      pickup.Price === 0 && // We don't want it to affect shop items
      pickup.Position.Distance(g.p.Position) <= 80
    ) {
      // Scared pickups
      let velocity = pickup.Position.sub(g.p.Position);
      velocity = velocity.Normalized();
      velocity = velocity.mul(8);
      pickup.Velocity = velocity;
    }
  },
);
