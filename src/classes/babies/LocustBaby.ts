import {
  ModCallback,
  TearFlag,
  TearVariant,
} from "isaac-typescript-definitions";
import { addFlag, Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Soy Milk + booger tears. */
export class LocustBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.ChangeVariant(TearVariant.BOOGER);
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.BOOGER);
  }
}
