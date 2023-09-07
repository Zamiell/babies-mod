import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

/** Godhead aura + flight + blindfolded. */
export class LanternBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.TRISAGION);
  }

  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    // Emulate having a Godhead aura.
    tear.Position = player.Position.add(Vector(0, 10));

    // Clear the sprite for the Ludo tear.
    const sprite = tear.GetSprite();
    sprite.Reset();
  }
}
