import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  onRepentanceStage,
  onStage,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spindown Dice effect on hit. */
export class LostBlackBaby extends Baby {
  override isValid(): boolean {
    // Spindown Dice can be used on Knife Piece 1 to break the game.
    return !(onStage(LevelStage.BASEMENT_2) && onRepentanceStage());
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    useActiveItemTemp(player, CollectibleType.SPINDOWN_DICE);
    return undefined;
  }
}
