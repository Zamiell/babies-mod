import { CollectibleType, FamiliarVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  removeAllFamiliars,
  spawnFamiliar,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Giant cell effect on room clear. */
export class HiveKingBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.GIANT_CELL);
  }

  override onRemove(): void {
    removeAllFamiliars(FamiliarVariant.MINISAAC);
  }

  @CallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED, true)
  postRoomClearChangedTrue(): void {
    const player = Isaac.GetPlayer();
    spawnFamiliar(FamiliarVariant.MINISAAC, 0, player.Position);
  }
}
