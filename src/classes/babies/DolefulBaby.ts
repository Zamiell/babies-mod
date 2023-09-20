import {
  ModCallback,
  TearFlag,
  TearVariant,
} from "isaac-typescript-definitions";
import { Callback, addFlag, hasCollectible } from "isaacscript-common";
import { Baby } from "../Baby";
import { BOOGER_TEAR_ANTI_SYNERGIES } from "./GreenBaby";

/** Starts with Soy Milk + booger tears. */
export class DolefulBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(player, ...BOOGER_TEAR_ANTI_SYNERGIES);
  }

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.ChangeVariant(TearVariant.BOOGER);
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.BOOGER);
  }
}
