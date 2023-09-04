import { CardType, LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  onStage,
  useCardTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Teleport to starting room on hit. */
export class RottenMeatBaby extends Baby {
  /** Too punishing on Hush and Delirium. Teleports don't work in The Beast fight. */
  override isValid(): boolean {
    return !onStage(
      LevelStage.BLUE_WOMB, // 9
      LevelStage.THE_VOID, // 12
      LevelStage.HOME, // 13
    );
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    useCardTemp(player, CardType.FOOL);

    return undefined;
  }
}
