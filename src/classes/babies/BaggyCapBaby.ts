import { LevelStage, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  game,
  getDoors,
  getEffectiveStage,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Cannot bomb through rooms. */
export class BaggyCapBaby extends Baby {
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage !== LevelStage.DARK_ROOM_CHEST;
  }

  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const room = game.GetRoom();
    const roomClear = room.IsClear();

    if (roomClear) {
      return;
    }

    for (const door of getDoors()) {
      if (door.IsOpen()) {
        door.Close(true);
      }
    }
  }
}
