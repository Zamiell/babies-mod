import { LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  isFirstPlayer,
  ModCallbackCustom,
  onRepentanceStage,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Invulnerability */
export class ZeroBaby extends Baby {
  /** -0- Baby cannot open the door to Mausoleum (since it requires health to be sacrificed). */
  override isValid(): boolean {
    return !onStageWithSpikedSecretExit();
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (!isFirstPlayer(player)) {
      return undefined;
    }

    return false;
  }
}

function onStageWithSpikedSecretExit() {
  const level = game.GetLevel();
  const stage = level.GetStage();
  const repentanceStage = onRepentanceStage();

  return stage === LevelStage.DEPTHS_1 && !repentanceStage;
}
