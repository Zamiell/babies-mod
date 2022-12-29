import {
  EntityType,
  LevelStage,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, game, onRepentanceStage } from "isaacscript-common";
import { Baby } from "../Baby";

/** Invulnerability */
export class ZeroBaby extends Baby {
  /** -0- Baby cannot open the door to Mausoleum (since it requires health to be sacrificed). */
  override isValid(): boolean {
    return !onStageWithSpikedSecretExit();
  }

  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    return false;
  }
}

function onStageWithSpikedSecretExit() {
  const level = game.GetLevel();
  const stage = level.GetStage();
  const repentanceStage = onRepentanceStage();

  return stage === LevelStage.DEPTHS_1 && !repentanceStage;
}
