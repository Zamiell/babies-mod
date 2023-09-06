import {
  CollectibleType,
  ModCallback,
  TearVariant,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    numTearsFired: 0,
  },
};

/** Chaos card tears (every Nth tear). */
export class DarkSpaceSoldierBaby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.IPECAC);
  }

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const num = this.getAttribute("num");

    v.run.numTearsFired++;
    if (v.run.numTearsFired === num) {
      v.run.numTearsFired = 0;
      tear.ChangeVariant(TearVariant.CHAOS_CARD);
    }
  }
}
