import {
  CollectibleType,
  ModCallback,
  TearFlag,
  TearVariant,
} from "isaac-typescript-definitions";
import { Callback, addFlag } from "isaacscript-common";
import { Baby } from "../Baby";

/** Booger tears. */
export class GreenBaby extends Baby {
  /** Certain collectibles do not work with the baby effect. */
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.TRISAGION);
  }

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.ChangeVariant(TearVariant.BOOGER);
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.BOOGER);
  }
}
