import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  onStage,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** D6 effect on hit. */
export class PuzzleBaby extends Baby {
  /** There are no collectibles on the Sheol/Cathedral. */
  override isValid(): boolean {
    return !onStage(LevelStage.SHEOL_CATHEDRAL);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    useActiveItemTemp(player, CollectibleType.D6);

    return undefined;
  }
}
