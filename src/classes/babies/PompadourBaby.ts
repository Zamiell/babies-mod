import {
  ModCallback,
  TearFlag,
  TearVariant,
} from "isaac-typescript-definitions";
import { Callback, addFlag } from "isaacscript-common";
import { Baby } from "../Baby";

/** Shrink tears. */
export class PompadourBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.ChangeVariant(TearVariant.GODS_FLESH);
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.GODS_FLESH);
  }
}
