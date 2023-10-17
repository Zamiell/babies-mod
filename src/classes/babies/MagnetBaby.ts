import {
  LevelStage,
  ModCallback,
  TearFlag,
  TearVariant,
} from "isaac-typescript-definitions";
import { Callback, addFlag, onStage } from "isaacscript-common";
import { Baby } from "../Baby";

/** Magnetizing tears. */
export class MagnetBaby extends Baby {
  override isValid(): boolean {
    return (
      // Magnetizing tears cause Blue Baby and eternal flies to attract each other, resulting in
      // Blue Baby flying at very high speed around the room, causing unavoidable damage.
      !onStage(LevelStage.DARK_ROOM_CHEST, LevelStage.BLUE_WOMB)
    );
  }

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.ChangeVariant(TearVariant.METALLIC);
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.MAGNETIZE);
  }
}
