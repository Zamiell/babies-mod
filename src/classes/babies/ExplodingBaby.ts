import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  DISTANCE_OF_GRID_TILE,
  ModCallbackCustom,
  game,
  isGridEntityBreakableByExplosion,
  isGridEntityBroken,
  onOrAfterGameFrame,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

const KAMIKAZE_DISTANCE_THRESHOLD = DISTANCE_OF_GRID_TILE - 4;
const KAMIKAZE_DELAY_GAME_FRAMES = 10;

const v = {
  room: {
    kamikazeCooldownUntilGameFrame: null as int | null,
    temporarilyInvulnerable: false,
  },
};

/** Breakable obstacles explode on touch. */
export class ExplodingBaby extends Baby {
  v = v;

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    // Check to see if we need to reset the cooldown (after we used the Kamikaze effect upon
    // touching an obstacle).
    if (onOrAfterGameFrame(v.room.kamikazeCooldownUntilGameFrame)) {
      v.room.kamikazeCooldownUntilGameFrame = null;
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
    if (v.room.kamikazeCooldownUntilGameFrame !== null) {
      return;
    }

    if (!isGridEntityBreakableByExplosion(gridEntity)) {
      return;
    }

    if (isGridEntityBroken(gridEntity)) {
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

    const gameFrameCount = game.GetFrameCount();

    v.room.temporarilyInvulnerable = true;
    useActiveItemTemp(player, CollectibleType.KAMIKAZE);
    v.room.temporarilyInvulnerable = false;

    v.room.kamikazeCooldownUntilGameFrame =
      gameFrameCount + KAMIKAZE_DELAY_GAME_FRAMES;
  }
}
