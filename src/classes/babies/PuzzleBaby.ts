import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getEffectiveStage,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** D6 effect on hit. */
export class PuzzleBaby extends Baby {
  /** There are no items on the Cathedral. */
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage !== LevelStage.SHEOL_CATHEDRAL;
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    useActiveItemTemp(player, CollectibleType.D6);

    return undefined;
  }
}
