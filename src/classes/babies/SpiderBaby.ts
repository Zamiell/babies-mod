import {
  CollectibleType,
  EntityType,
  FamiliarVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, removeAllMatchingEntities } from "isaacscript-common";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    numTearsFired: 0,
  },
};

/** Shoots a Blue Spider every Nth tear. */
export class SpiderBaby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    // C Section reduces the tear rate for no additional tears unlike Monstro's lung. So the custom
    // effect with C Section is a straight-up downgrade.
    return !player.HasCollectible(CollectibleType.C_SECTION);
  }

  override onRemove(): void {
    removeAllMatchingEntities(EntityType.FAMILIAR, FamiliarVariant.BLUE_SPIDER);
  }

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const num = this.getAttribute("num");

    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    v.run.numTearsFired++;
    if (v.run.numTearsFired === num) {
      v.run.numTearsFired = 0;

      player.ThrowBlueSpider(player.Position, player.Position);
      tear.Remove();
    }
  }
}
