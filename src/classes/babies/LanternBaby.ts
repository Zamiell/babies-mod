import {
  CollectibleType,
  EntityCollisionClass,
  EntityGridCollisionClass,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, hasCollectible } from "isaacscript-common";
import {
  BLINDFOLDED_ANTI_SYNERGY_COLLECTIBLE_TYPES,
  MULTI_SHOT_COLLECTIBLE_TYPES,
} from "../../constantsCollectibleTypes";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

/** Godhead aura + flight + blindfolded. */
export class LanternBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(
      player,
      ...BLINDFOLDED_ANTI_SYNERGY_COLLECTIBLE_TYPES,
      // Trisagion makes the aura disappear.
      CollectibleType.TRISAGION,
      // Multi shot items make multiple auras which can hurt player's eyes.
      ...MULTI_SHOT_COLLECTIBLE_TYPES,
    );
  }

  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    // Emulate having a Godhead aura.
    tear.Position = player.Position.add(Vector(0, 10));

    // Clear the sprite for the Ludo tear to make it invisible.
    const sprite = tear.GetSprite();
    sprite.Reset();

    // We also want the tear to be intangible.
    tear.EntityCollisionClass = EntityCollisionClass.NONE;
    tear.GridCollisionClass = EntityGridCollisionClass.NONE;
  }
}
