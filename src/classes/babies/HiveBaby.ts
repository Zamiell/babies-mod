import { EntityType, FamiliarVariant } from "isaac-typescript-definitions";
import {
  MAX_NUM_FAMILIARS,
  removeAllMatchingEntities,
  repeat,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

const HALF_MAX_FAMILIARS = MAX_NUM_FAMILIARS / 2;

/** Starts with Hive Mind + max Blue Flies + max Blue Spiders. */
export class HiveBaby extends Baby {
  override onAdd(): void {
    g.p.AddBlueFlies(HALF_MAX_FAMILIARS, g.p.Position, undefined);
    repeat(HALF_MAX_FAMILIARS, () => {
      g.p.AddBlueSpider(g.p.Position);
    });
  }

  override onRemove(): void {
    removeAllMatchingEntities(EntityType.FAMILIAR, FamiliarVariant.BLUE_FLY);
    removeAllMatchingEntities(EntityType.FAMILIAR, FamiliarVariant.BLUE_SPIDER);
  }
}
