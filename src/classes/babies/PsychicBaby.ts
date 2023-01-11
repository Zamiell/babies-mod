import {
  CacheFlag,
  FamiliarVariant,
  ModCallback,
  RoomShape,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  GAME_FRAMES_PER_SECOND,
  getFamiliars,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with Abel; tears come from Abel; 2x damage. */
export class PsychicBaby extends Baby {
  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.DAMAGE)
  evaluateCacheDamage(player: EntityPlayer): void {
    player.Damage *= 2;
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const roomFrameCount = g.r.GetFrameCount();
    const roomShape = g.r.GetRoomShape();

    // Disable the mechanic after a while to avoid softlocks.
    const softlockThresholdFrame = 30 * GAME_FRAMES_PER_SECOND;
    if (roomFrameCount >= softlockThresholdFrame) {
      return;
    }

    // Disable the mechanic in any room that would grant 2 charges.
    if (roomShape >= RoomShape.SHAPE_2x2) {
      return;
    }

    // Starts with Abel; tears come from Abel Get Abel's position.
    const abels = getFamiliars(FamiliarVariant.ABEL);
    const abel = abels[0];
    if (abel !== undefined) {
      tear.Position = abel.Position;
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    // Disable the vanilla shooting behavior.
    const abels = getFamiliars(FamiliarVariant.ABEL);
    for (const abel of abels) {
      abel.FireCooldown = 1000000;
    }
  }
}
