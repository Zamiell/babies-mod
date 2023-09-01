import { CardType, LevelStage } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom, onStage } from "isaacscript-common";
import { Baby } from "../Baby";

/** Teleport to starting room on hit. */
export class RottenMeatBaby extends Baby {
  /** Too punishing on Hush and Delirium. Teleports don't work in The Beast fight. */
  override isValid(): boolean {
    return (
      !onStage(LevelStage.HOME) &&
      !onStage(LevelStage.BLUE_WOMB) &&
      !onStage(LevelStage.THE_VOID)
    );
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    player.UseCard(CardType.FOOL);

    return undefined;
  }
}
