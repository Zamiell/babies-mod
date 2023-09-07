import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  DISTANCE_OF_GRID_TILE,
  ModCallbackCustom,
  game,
  isGridEntityBreakableByExplosion,
  isGridEntityBroken,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

const KAMIKAZE_DISTANCE_THRESHOLD = DISTANCE_OF_GRID_TILE - 4;

const v = {
  room: {
    kamikazeCooldownUntilFrame: null as int | null,
    temporarilyInvulnerable: false,
  },
};

/** Breakable obstacles explode on touch. */
export class ExplodingBaby extends Baby {
  v = v;

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();

    // Check to see if we need to reset the cooldown (after we used the Kamikaze effect upon
    // touching an obstacle).
    if (
      v.room.kamikazeCooldownUntilFrame !== null &&
      gameFrameCount >= v.room.kamikazeCooldownUntilFrame
    ) {
      v.room.kamikazeCooldownUntilFrame = null;
    }
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    if (v.room.temporarilyInvulnerable) {
      return false;
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_GRID_ENTITY_UPDATE)
  postGridEntityUpdate(gridEntity: GridEntity): void {
    if (v.room.kamikazeCooldownUntilFrame !== null) {
      return;
    }

    // Only trigger Kamikaze for grid entities that we are close enough to.
    const player = Isaac.GetPlayer();
    if (
      player.Position.Distance(gridEntity.Position) >
      KAMIKAZE_DISTANCE_THRESHOLD
    ) {
      return;
    }

    if (!isGridEntityBreakableByExplosion(gridEntity)) {
      return;
    }

    if (!isGridEntityBroken(gridEntity)) {
      return;
    }

    const gameFrameCount = game.GetFrameCount();

    v.room.temporarilyInvulnerable = true;
    useActiveItemTemp(player, CollectibleType.KAMIKAZE);
    v.room.temporarilyInvulnerable = false;

    v.room.kamikazeCooldownUntilFrame = gameFrameCount + 10;
  }
}
