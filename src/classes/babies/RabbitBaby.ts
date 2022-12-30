import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with How to Jump; must jump often. */
export class RabbitBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    g.p.AddCacheFlags(CacheFlag.SPEED);
    g.p.EvaluateItems();
  }
}
