import { CollectibleType, RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  levelHasRoomType,
  newRNG,
  repeat,
} from "isaacscript-common";
import { mod } from "../../mod";
import { setInitialBabyRNG } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** Improved Super Secret Rooms. */
export class ButterflyBaby extends Baby {
  v = v;

  override isValid(): boolean {
    return levelHasRoomType(RoomType.SUPER_SECRET);
  }

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @CallbackCustom(
    ModCallbackCustom.POST_NEW_ROOM_REORDERED,
    RoomType.SUPER_SECRET,
  )
  postNewRoomReordered(): void {
    const room = game.GetRoom();
    const isFirstVisit = room.IsFirstVisit();
    const center = room.GetCenterPos();
    const num = this.getAttribute("num");

    if (!isFirstVisit) {
      return;
    }

    repeat(num, () => {
      const position = room.FindFreePickupSpawnPosition(center, 1, true);
      mod.spawnCollectible(CollectibleType.NULL, position, v.run.rng);
    });
  }
}
