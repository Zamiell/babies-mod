import {
  CacheFlag,
  FamiliarVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  getFamiliars,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    numLeprosyChunks: 0,
    numLeprosyChunksBroken: 0,
  },
};

/** Starts with Leprosy, +N damage on Leprosy breaking. */
export class BlackEyeBaby extends Baby {
  v = v;

  // 7
  @Callback(ModCallback.POST_FAMILIAR_INIT, FamiliarVariant.LEPROSY)
  postFamiliarInitLeprosy(): void {
    if (v.run.numLeprosyChunks < 3) {
      v.run.numLeprosyChunks++;
    }
  }

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.DAMAGE)
  evaluateCacheDamage(player: EntityPlayer): void {
    const num = this.getAttribute("num");
    player.Damage += v.run.numLeprosyChunksBroken * num;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    // We use the "babyCounters" variable to track how many Leprocy familiars are in the room.
    const leprocyChunks = getFamiliars(FamiliarVariant.LEPROSY);
    if (leprocyChunks.length < v.run.numLeprosyChunks) {
      v.run.numLeprosyChunks--;
      v.run.numLeprosyChunksBroken++;
      player.AddCacheFlags(CacheFlag.DAMAGE);
      player.EvaluateItems();
    }
  }
}
