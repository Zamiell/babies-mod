import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  room: {
    numHits: 0,
  },
};

/** Glowing Hourglass effect on Nth hit (per room). */
export class SnailBaby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    // Blood Oath will stab them on the first room and send them to the previous floor.
    return !player.HasCollectible(CollectibleType.BLOOD_OATH);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const num = this.getAttribute("num");

    v.room.numHits++;
    if (v.room.numHits >= num) {
      v.room.numHits = 0;
      useActiveItemTemp(player, CollectibleType.GLOWING_HOUR_GLASS);
    }

    return undefined;
  }
}
