import { BombSubType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  getRandomEnumValue,
  spawnBombPickupWithSeed,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a random bomb on room clear. */
export class FishmanBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED, true)
  postRoomClearChangedTrue(): boolean | undefined {
    const room = game.GetRoom();
    const roomSeed = room.GetSpawnSeed();
    const player = Isaac.GetPlayer();
    const randomBombSubType = getRandomEnumValue(BombSubType, roomSeed, [
      BombSubType.NULL,
    ]);
    spawnBombPickupWithSeed(randomBombSubType, player.Position, roomSeed);

    return undefined;
  }
}
