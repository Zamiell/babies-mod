import {
  EntityType,
  FamiliarVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  getPlayerFromEntity,
  removeAllMatchingEntities,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Shoots a Blue Spider every Nth tear. */
export class SpiderBaby extends Baby {
  override onRemove(): void {
    removeAllMatchingEntities(EntityType.FAMILIAR, FamiliarVariant.BLUE_SPIDER);
  }

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const num = this.getAttribute("num");

    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    g.run.babyCounters++;
    if (g.run.babyCounters === num) {
      g.run.babyCounters = 0;

      player.ThrowBlueSpider(player.Position, player.Position);
      tear.Remove();
    }
  }
}
