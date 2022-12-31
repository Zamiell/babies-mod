import {
  CollectibleType,
  DamageFlag,
  EntityType,
  ModCallback,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  removeCollectibleFromItemTracker,
  sfxManager,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Guaranteed Devil Room + Angel Room after N hits. */
export class GoatBaby extends Baby {
  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.PLAYER)
  entityTakeDmg(
    entity: Entity,
    _amount: float,
    _damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    const player = entity.ToPlayer();
    if (player === undefined) {
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
