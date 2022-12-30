import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** 3x damage + 3x tear rate when at 1 heart or less. */
export class HeroBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    if (g.run.babyBool) {
      g.run.babyBool = false;
      g.p.AddCacheFlags(CacheFlag.DAMAGE); // 1
      g.p.AddCacheFlags(CacheFlag.FIRE_DELAY); // 2
      g.p.EvaluateItems();
    }
  }
}
