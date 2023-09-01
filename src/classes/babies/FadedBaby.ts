import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  onStage,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Random teleport on hit. */
export class FadedBaby extends Baby {
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
    useActiveItemTemp(player, CollectibleType.TELEPORT);

    return undefined;
  }
}
