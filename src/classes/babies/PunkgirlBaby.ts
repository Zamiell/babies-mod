import { CoinSubType, RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  getRandomEnumValue,
  levelHasRoomType,
  spawnCoinWithSeed,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a random coin on room clear. */
export class PunkgirlBaby extends Baby {
  override isValid(): boolean {
    return levelHasRoomType(RoomType.SHOP);
  }

  @CallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED, true)
  postRoomClearChangedTrue(): void {
    const room = game.GetRoom();
    const roomSeed = room.GetSpawnSeed();
    const player = Isaac.GetPlayer();
    const randomCoinSubType = getRandomEnumValue(CoinSubType, roomSeed, [
      CoinSubType.NULL,
    ]);
    spawnCoinWithSeed(randomCoinSubType, player.Position, roomSeed);
  }
}
