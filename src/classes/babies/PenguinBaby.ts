import type { DamageFlag } from "isaac-typescript-definitions";
import {
  BloodPuppyVariant,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  VectorZero,
  findFreePosition,
  spawnNPC,
} from "isaacscript-common";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

/** Starts with friendly Blood Puppy. */
export class PenguinBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const player = Isaac.GetPlayer();
    const position = findFreePosition(player.Position);

    const bloodPuppy = spawnNPC(
      EntityType.BLOOD_PUPPY,
      BloodPuppyVariant.LARGE,
      0,
      position,
      VectorZero,
      player,
    );

    // We have to set the `Parent` property or else the NPC will immediately be killed.
    bloodPuppy.Parent = player;
  }

  /** Make the player immune from the Blood Puppy. */
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(
    _player: EntityPlayer,
    _amount: float,
    _damageFlags: BitFlags<DamageFlag>,
    source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    if (source.Type === EntityType.BLOOD_PUPPY) {
      return false;
    }

    return undefined;
  }

  /** Make the Blood Puppy immune from the player. */
  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.BLOOD_PUPPY)
  entityTakeDmgBloodPuppy(
    _entity: Entity,
    _amount: float,
    _damageFlags: BitFlags<DamageFlag>,
    source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    if (source.Entity === undefined) {
      return;
    }

    const player = getBabyPlayerFromEntity(source.Entity);
    if (player === undefined) {
      return;
    }

    return false;
  }
}
