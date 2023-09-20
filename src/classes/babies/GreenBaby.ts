import {
  CollectibleType,
  ModCallback,
  TearFlag,
  TearVariant,
} from "isaac-typescript-definitions";
import { Callback, addFlag, hasCollectible } from "isaacscript-common";
import { Baby } from "../Baby";

export const BOOGER_TEAR_ANTI_SYNERGIES = [
  CollectibleType.TRISAGION,
  CollectibleType.DEAD_EYE,
] as const;

/** Booger tears. */
export class GreenBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(player, ...BOOGER_TEAR_ANTI_SYNERGIES);
  }

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.ChangeVariant(TearVariant.BOOGER);
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.BOOGER);
  }
}
