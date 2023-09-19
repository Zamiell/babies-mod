import { CollectibleType, EntityFlag } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  getNPCs,
  removeEntities,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Friend Finder effect on room clear. */
export class N2600Baby extends Baby {
  override onRemove(): void {
    const npcs = getNPCs();
    const friendlyNPCs = npcs.filter((npc) =>
      npc.HasEntityFlags(EntityFlag.FRIENDLY),
    );
    removeEntities(friendlyNPCs);
  }

  @CallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED, true)
  postRoomClearChangedTrue(): boolean | undefined {
    const player = Isaac.GetPlayer();
    useActiveItemTemp(player, CollectibleType.FRIEND_FINDER);
    return undefined;
  }
}
