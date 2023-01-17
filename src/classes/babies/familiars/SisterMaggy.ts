import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { RandomBabyType } from "../../../enums/RandomBabyType";
import { mod } from "../../../mod";
import { BabyDescription } from "../../../types/BabyDescription";
import { Baby } from "../../Baby";

/** Loses last item on Nth hit (per room). */
export class SisterMaggy extends Baby {
  v = {
    room: {
      numHits: 0,
    },
  };

  constructor(babyType: RandomBabyType, baby: BabyDescription) {
    super(babyType, baby);
    this.saveDataManager(this.v);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const num = this.getAttribute("num");

    this.v.room.numHits++;
    if (this.v.room.numHits === num) {
      // Take away an item.
      const collectibleType = mod.getPlayerLastPassiveCollectible(player);
      if (collectibleType !== undefined) {
        player.RemoveCollectible(collectibleType);
        player.AnimateSad();
      }
    }

    return undefined;
  }
}
