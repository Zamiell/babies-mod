import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, copyColor } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Slice tears. */
export class SlicerBaby extends Baby {
  /** Ipecac causes the tears to explode instantly, which causes unavoidable damage. */
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.IPECAC);
  }

  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const num = this.getAttribute("num");

    const sprite = tear.GetSprite();
    const opacity = 1 - tear.FrameCount / num;
    const faded = copyColor(sprite.Color);
    faded.A = opacity;
    sprite.Color = faded;

    if (tear.FrameCount > num) {
      tear.Remove();
    }
  }

  /** Make the Soy Milk tears do extra damage. */
  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.CollisionDamage = g.p.Damage * 3;
  }
}
