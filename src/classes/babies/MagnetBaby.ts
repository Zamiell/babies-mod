import {
  ModCallback,
  TearFlag,
  TearVariant,
} from "isaac-typescript-definitions";
import { addFlag, Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Magnetizing tears. */
export class MagnetBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.ChangeVariant(TearVariant.METALLIC);
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.MAGNETIZE);
  }
}
