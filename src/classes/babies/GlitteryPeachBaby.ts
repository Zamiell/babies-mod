import { CardType, LevelStage } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom, onStage } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Teleports to the boss room after N hits. */
export class GlitteryPeachBaby extends Baby {
  /** Remove floors with no Boss Rooms. */
  override isValid(): boolean {
    return !onStage(LevelStage.HOME);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const numHits = this.getAttribute("requireNumHits");

    if (g.run.babyBool) {
      return;
    }

    g.run.babyCounters++;
    if (g.run.babyCounters === numHits) {
      // We only do the ability once per floor.
      g.run.babyBool = true;
      player.UseCard(CardType.EMPEROR);
    }

    return undefined;
  }
}
