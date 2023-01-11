import { CollectibleType, RoomType } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom, repeat } from "isaacscript-common";
import { g } from "../../globals";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** Improved Super Secret Rooms. */
export class ButterflyBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const roomType = g.r.GetType();
    const isFirstVisit = g.r.IsFirstVisit();
    const center = g.r.GetCenterPos();
    const num = this.getAttribute("num");

    if (roomType !== RoomType.SUPER_SECRET || !isFirstVisit) {
      return;
    }

    repeat(num, () => {
      const position = g.r.FindFreePickupSpawnPosition(center, 1, true);
      mod.spawnCollectible(CollectibleType.NULL, position, g.run.rng);
    });
  }
}
