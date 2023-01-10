import {
  CallbackCustom,
  GAME_FRAMES_PER_SECOND,
  getNPCs,
  ModCallbackCustom,
} from "isaacscript-common";
import { Baby } from "../Baby";

const FREEZE_SECONDS = 5;

/** All enemies get frozen on hit. */
export class MufflerscarfBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    for (const npc of getNPCs()) {
      if (npc.IsVulnerableEnemy()) {
        const freezeFrames = FREEZE_SECONDS * GAME_FRAMES_PER_SECOND;
        npc.AddFreeze(EntityRef(player), freezeFrames);
      }
    }

    return undefined;
  }
}
