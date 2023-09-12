import { KeySubType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  getRandomEnumValue,
  spawnKeyWithSeed,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a random key on room clear. */
export class ToothBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED, true)
  postRoomClearChangedTrue(): boolean | undefined {
    const room = game.GetRoom();
    const roomSeed = room.GetSpawnSeed();
    const player = Isaac.GetPlayer();
    const randomKeySubType = getRandomEnumValue(KeySubType, roomSeed, [
      KeySubType.NULL,
    ]);
    spawnKeyWithSeed(randomKeySubType, player.Position, roomSeed);

    return undefined;
  }
}
