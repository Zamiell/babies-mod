import { CollectibleType, SoundEffect } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  isFirstPlayer,
  ModCallbackCustom,
  removeCollectibleFromItemTracker,
  sfxManager,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Guaranteed Devil Room + Angel Room after N hits. */
export class GoatBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmg(player: EntityPlayer): boolean | undefined {
    if (!isFirstPlayer(player)) {
      return undefined;
    }

    const numHits = this.getAttribute("requireNumHits");

    g.run.babyCounters++;
    if (g.run.babyCounters >= numHits && !g.run.babyBool) {
      g.run.babyBool = true;
      sfxManager.Play(SoundEffect.SATAN_GROW);
      player.AddCollectible(CollectibleType.GOAT_HEAD);
      removeCollectibleFromItemTracker(CollectibleType.GOAT_HEAD);
      player.AddCollectible(CollectibleType.DUALITY);
      removeCollectibleFromItemTracker(CollectibleType.DUALITY);
    }

    return undefined;
  }
}
