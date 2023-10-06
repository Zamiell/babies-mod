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
  ModCallbackCustom,
  game,
  getFamiliars,
  onOrAfterRoomFrame,
} from "isaacscript-common";
import { Baby } from "../Baby";

const SOFTLOCK_THRESHOLD_GAME_FRAME = 30 * GAME_FRAMES_PER_SECOND;

/** Starts with Abel; tears come from Abel; 2x damage (but not in big rooms). */
export class PsychicBaby extends Baby {
  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.DAMAGE)
  evaluateCacheDamage(player: EntityPlayer): void {
    player.Damage *= 2;
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const room = game.GetRoom();
    const roomShape = room.GetRoomShape();

    // Disable the mechanic after a while to avoid softlocks.
    if (onOrAfterRoomFrame(SOFTLOCK_THRESHOLD_GAME_FRAME)) {
      return;
    }

    // Disable the mechanic in big rooms:
    // https://clips.twitch.tv/ExquisiteLuckyStarlingBlargNaut--cC5k8Eemix8fHgt
    if (roomShape >= RoomShape.SHAPE_1x2) {
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
      abel.FireCooldown = 1_000_000;
    }
  }
}
