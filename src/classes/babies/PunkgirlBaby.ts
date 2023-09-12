import { CoinSubType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  getRandomEnumValue,
  spawnCoinWithSeed,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a random coin on room clear. */
export class PunkgirlBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED, true)
  postRoomClearChangedTrue(): boolean | undefined {
    const room = game.GetRoom();
    const roomSeed = room.GetSpawnSeed();
    const player = Isaac.GetPlayer();
    const randomCoinSubType = getRandomEnumValue(CoinSubType, roomSeed, [
      CoinSubType.NULL,
    ]);
    spawnCoinWithSeed(randomCoinSubType, player.Position, roomSeed);

    return undefined;
  }
}
