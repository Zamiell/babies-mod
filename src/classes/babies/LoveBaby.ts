import { HeartSubType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  VectorZero,
  game,
  getRandomEnumValue,
  spawnHeart,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a random heart on room clear. */
export class LoveBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED, true)
  postRoomClearChangedTrue(): boolean | undefined {
    const room = game.GetRoom();
    const roomSeed = room.GetSpawnSeed();
    const player = Isaac.GetPlayer();
    const randomHeartSubType = getRandomEnumValue(HeartSubType, roomSeed, [
      HeartSubType.NULL,
    ]);

    spawnHeart(
      randomHeartSubType,
      player.Position,
      VectorZero,
      player,
      roomSeed,
    );

    return undefined;
  }
}
