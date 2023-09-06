import type { DamageFlag } from "isaac-typescript-definitions";
import {
  CollectibleType,
  ModCallback,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  findFreePosition,
  inRoomType,
  isRoomInsideGrid,
  isSelfDamage,
} from "isaacscript-common";
import { mod } from "../../mod";
import { Baby } from "../Baby";

const v = {
  level: {
    playerTookDamage: false,
  },
};

/** Extra item after boss if no damage taken on floor. */
export class GoblinBaby extends Baby {
  v = v;

  // 70
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    if (v.level.playerTookDamage) {
      return;
    }

    if (!inRoomType(RoomType.BOSS)) {
      return;
    }

    // Do nothing in the reverse Emperor card room.
    if (!isRoomInsideGrid()) {
      return;
    }

    const player = Isaac.GetPlayer();
    const position = findFreePosition(player.Position);
    mod.spawnCollectible(CollectibleType.NULL, position);

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(
    _player: EntityPlayer,
    _amount: float,
    damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    if (isSelfDamage(damageFlags)) {
      return undefined;
    }

    v.level.playerTookDamage = true;
    return undefined;
  }
}
