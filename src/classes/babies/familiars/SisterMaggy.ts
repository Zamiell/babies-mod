import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { mod } from "../../../mod";
import { Baby } from "../../Baby";

const v = {
  room: {
    numHits: 0,
  },
};

/** Loses last item on Nth hit (per room). */
export class SisterMaggy extends Baby {
  v = v;

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const num = this.getAttribute("num");

    v.room.numHits++;
    if (v.room.numHits === num) {
      // Take away a collectible.
      const collectibleType = mod.getPlayerLastPassiveCollectible(player);
      if (collectibleType !== undefined) {
        player.RemoveCollectible(collectibleType);
        player.AnimateSad();
      }
    }

    return undefined;
  }
}
