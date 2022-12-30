import { BombVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, spawnBomb } from "isaacscript-common";
import { g } from "../../globals";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Spawns a Mega Troll Bomb every N seconds. */
export class BluePigBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const num = this.getAttribute("num");

    everyNSeconds(() => {
      spawnBomb(BombVariant.MEGA_TROLL, 0, g.p.Position);
    }, num);
  }
}
