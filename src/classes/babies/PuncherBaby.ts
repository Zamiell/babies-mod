import { BombVariant, EntityType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  doesEntityExist,
  findFreePosition,
  game,
  spawnBomb,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a Golden Troll Bomb in every room. */
export class PuncherBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (doesEntityExist(EntityType.BOMB, BombVariant.GOLDEN_TROLL)) {
      return;
    }

    const room = game.GetRoom();
    const centerPos = room.GetCenterPos();
    const position = findFreePosition(centerPos, true);
    spawnBomb(BombVariant.GOLDEN_TROLL, 0, position);
  }
}
