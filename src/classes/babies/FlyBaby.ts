import {
  ModCallback,
  TearFlag,
  TearVariant,
} from "isaac-typescript-definitions";
import { addFlag, Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Mass splitting tears. */
export class FlyBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.ChangeVariant(TearVariant.GODS_FLESH);

    tear.TearFlags = addFlag(
      tear.TearFlags,
      TearFlag.PIERCING, // 1 << 1
      TearFlag.SPLIT, // 1 << 6
      TearFlag.WIGGLE, // 1 << 10
      TearFlag.PULSE, // 1 << 25
      TearFlag.BONE, // 1 << 49
    );
  }
}
