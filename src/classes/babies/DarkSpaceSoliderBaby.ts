import {
  CollectibleType,
  ModCallback,
  TearVariant,
} from "isaac-typescript-definitions";
import { Callback, hasCollectible } from "isaacscript-common";
import { Baby } from "../Baby";

const CHAOS_CARD_ANTI_SYNERGIES = [
  CollectibleType.IPECAC, // 149
  CollectibleType.C_SECTION, // 678
] as const;

const v = {
  run: {
    numTearsFired: 0,
  },
};

/** Chaos card tears (every Nth tear). */
export class DarkSpaceSoldierBaby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(player, ...CHAOS_CARD_ANTI_SYNERGIES);
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
