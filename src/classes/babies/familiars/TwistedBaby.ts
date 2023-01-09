import {
  ModCallback,
  TearFlag,
  TearVariant,
} from "isaac-typescript-definitions";
import { addFlag, Callback } from "isaacscript-common";
import { Baby } from "../../Baby";

/** Spore tears. */
export class TwistedBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.SPORE);
    tear.ChangeVariant(TearVariant.SPORE);
  }
}
