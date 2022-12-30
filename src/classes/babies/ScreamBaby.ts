import {
  CollectibleType,
  ModCallback,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  game,
  sfxManager,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Shoop tears. */
export class ScreamBaby extends Baby {
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const activeCharge = g.p.GetActiveCharge();
    const batteryCharge = g.p.GetBatteryCharge();

    // - We store the main charge in the "babyCounters" variable.
    // - We store the Battery charge in the "babyNPC.type" variable.
    if (
      g.run.babyFrame !== 0 &&
      gameFrameCount <= g.run.babyFrame + 1 &&
      (activeCharge !== g.run.babyCounters ||
        batteryCharge !== (g.run.babyNPC.entityType as int))
    ) {
      g.p.SetActiveCharge(
        g.run.babyCounters + (g.run.babyNPC.entityType as int),
      );
      sfxManager.Stop(SoundEffect.BATTERY_CHARGE);
      sfxManager.Stop(SoundEffect.BEEP);
    }
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.Remove();
    useActiveItemTemp(g.p, CollectibleType.SHOOP_DA_WHOOP);
  }
}
