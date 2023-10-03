import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  onStage,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Eternal D6 effect on hit. */
export class LostWhiteBaby extends Baby {
  /** There are no collectibles on Sheol/Cathedral. */
  override isValid(): boolean {
    return !onStage(LevelStage.SHEOL_CATHEDRAL);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    useActiveItemTemp(player, CollectibleType.ETERNAL_D6);
    return undefined;
  }
}
