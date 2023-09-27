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
  override isValid(player: EntityPlayer): boolean {
    return (
      !onStage(
        LevelStage.BLUE_WOMB, // 9
        LevelStage.VOID, // 12
        LevelStage.HOME, // 13
      ) && !player.HasCollectible(CollectibleType.TELEPORT)
    );
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    useActiveItemTemp(player, CollectibleType.TELEPORT);
    return undefined;
  }
}
