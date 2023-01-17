import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getPlayerFromEntity } from "isaacscript-common";
import { RandomBabyType } from "../../enums/RandomBabyType";
import { mod } from "../../mod";
import { BabyDescription } from "../../types/BabyDescription";
import { Baby } from "../Baby";

/** Double tears. */
export class MernBaby extends Baby {
  v = {
    run: {
      numFiredTears: 0,
    },
  };

  constructor(babyType: RandomBabyType, baby: BabyDescription) {
    super(babyType, baby);
    this.saveDataManager(this);
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    this.v.run.numFiredTears++;
    if (this.v.run.numFiredTears >= 2) {
      this.v.run.numFiredTears = 0;

      mod.runNextGameFrame(() => {
        player.FireTear(tear.Position, tear.Velocity, false, true, false);
      }, true);
    }
  }
}
