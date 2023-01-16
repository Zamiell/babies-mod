import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Dataminer effect on room enter. */
export class TwotoneBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const player = Isaac.GetPlayer();
    useActiveItemTemp(player, CollectibleType.DATAMINER);
  }
}
