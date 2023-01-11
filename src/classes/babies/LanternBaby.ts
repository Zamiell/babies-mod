import {
  CollectibleType,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Godhead aura + flight + blindfolded. */
export class LanternBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.TRISAGION);
  }

  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    // Emulate having a Godhead aura.
    if (tear.Parent !== undefined && tear.Parent.Type === EntityType.PLAYER) {
      tear.Position = g.p.Position.add(Vector(0, 10));

      // Clear the sprite for the Ludo tear.
      const sprite = tear.GetSprite();
      sprite.Reset();
    }
  }
}
