import {
  ModCallback,
  TearFlag,
  TearVariant,
} from "isaac-typescript-definitions";
import { addFlag, Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Confusion tears. */
export class MagBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  private postFireTear(tear: EntityTear): void {
    tear.ChangeVariant(TearVariant.METALLIC);
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.CONFUSION);
  }
}
