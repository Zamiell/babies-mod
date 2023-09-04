import type { DoorState } from "isaac-typescript-definitions";
import {
  CardType,
  CollectibleType,
  RoomType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  closeDoorFast,
  game,
  getDoors,
  levelHasRoomType,
  repeat,
  useCardTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** Create red doors on hit + improved Ultra Secret Rooms. */
export class BloodiedBaby extends Baby {
  override isValid(): boolean {
    return levelHasRoomType(RoomType.ULTRA_SECRET);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const room = game.GetRoom();
    const roomClear = room.IsClear();

    /** Indexed by target room index. */
    const doorStateMap = new Map<int, DoorState>();

    for (const door of getDoors()) {
      doorStateMap.set(door.TargetRoomIndex, door.State);
    }

    useCardTemp(player, CardType.SOUL_CAIN);

    if (roomClear) {
      return;
    }

    // Soul of Cain will open all of the doors, but we only want to open the doors to the red rooms.
    for (const door of getDoors()) {
      const oldState = doorStateMap.get(door.TargetRoomIndex);
      if (oldState === undefined) {
        continue;
      }

      if (oldState !== door.State) {
        closeDoorFast(door);
      }
    }

    return undefined;
  }

  @CallbackCustom(
    ModCallbackCustom.POST_NEW_ROOM_REORDERED,
    RoomType.ULTRA_SECRET,
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
      mod.spawnCollectible(CollectibleType.NULL, position, g.run.rng);
    });
  }
}
