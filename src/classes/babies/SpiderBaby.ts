import {
  EntityType,
  FamiliarVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, removeAllMatchingEntities } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Shoots a Blue Spider every Nth tear. */
export class SpiderBaby extends Baby {
  public override onRemove(): void {
    removeAllMatchingEntities(EntityType.FAMILIAR, FamiliarVariant.BLUE_SPIDER);
  }

  @Callback(ModCallback.POST_FIRE_TEAR)
  private postFireTear(tear: EntityTear) {
    const num = this.getAttribute("num");

    g.run.babyCounters++;
    if (g.run.babyCounters === num) {
      g.run.babyCounters = 0;

      g.p.ThrowBlueSpider(g.p.Position, g.p.Position);
      tear.Remove();
    }
  }
}
