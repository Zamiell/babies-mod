import {
  EntityFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  ReadonlySet,
  addFlag,
  getEntities,
  setEntityOpacity,
  spawnWithSeed,
} from "isaacscript-common";
import { removeAllFriendlyEntities } from "../../utils";
import { Baby } from "../Baby";

const FRIEND_ENTITY_FLAGS = addFlag(
  EntityFlag.CHARM, // 1 << 8
  EntityFlag.FRIENDLY, // 1 << 29
  EntityFlag.PERSISTENT, // 1 << 37
);

const FADE_AMOUNT = 0.25;

const EXCEPTION_ENTITY_TYPES = new ReadonlySet<EntityType>([
  EntityType.MOVABLE_TNT,
]);

/** Brings back enemies from the dead. */
export class ZombieBaby extends Baby {
  override onRemove(): void {
    removeAllFriendlyEntities();
  }

  /** We reapply the fade on every frame because enemies can be unfaded occasionally. */
  // 0
  @Callback(ModCallback.POST_NPC_UPDATE)
  postNPCUpdate(npc: EntityNPC): void {
    if (npc.HasEntityFlags(EntityFlag.FRIENDLY)) {
      setEntityOpacity(npc, FADE_AMOUNT);
    }
  }

  /** This does not work properly if done in the `POST_PROJECTILE_INIT` callback. */
  // 44
  @Callback(ModCallback.POST_PROJECTILE_UPDATE)
  postProjectileUpdate(projectile: EntityProjectile): void {
    if (
      projectile.Parent !== undefined &&
      projectile.Parent.HasEntityFlags(EntityFlag.FRIENDLY)
    ) {
      setEntityOpacity(projectile, FADE_AMOUNT);
    }
  }

  /**
   * We need to also fade the Brimstone lasers from friendly Vis.
   *
   * This does not work properly if done in the `POST_LASER_INIT` callback.
   *
   * The laser will look bugged, since it will first appear at full opacity, but there is not an
   * elegant workaround for this, so keep it the way it is for now.
   */
  // 48
  @Callback(ModCallback.POST_LASER_UPDATE)
  postLaserUpdate(laser: EntityLaser): void {
    if (
      laser.Parent !== undefined &&
      laser.Parent.HasEntityFlags(EntityFlag.FRIENDLY)
    ) {
      setEntityOpacity(laser, FADE_AMOUNT);
    }
  }

  // 68
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    if (
      !entity.IsBoss() &&
      !entity.HasEntityFlags(EntityFlag.FRIENDLY) &&
      !EXCEPTION_ENTITY_TYPES.has(entity.Type)
    ) {
      const friend = spawnWithSeed(
        entity.Type,
        entity.Variant,
        entity.SubType,
        entity.Position,
        entity.InitSeed,
      );
      friend.AddEntityFlags(FRIEND_ENTITY_FLAGS);

      // Fade the entity so that it is easier to see everything. (This is also reapplied on every
      // frame because enemies can be unfaded occasionally.)
      setEntityOpacity(friend, FADE_AMOUNT);
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const player = Isaac.GetPlayer();

    for (const entity of getEntities()) {
      if (entity.HasEntityFlags(EntityFlag.FRIENDLY)) {
        if (entity.Type === EntityType.BOIL) {
          // Delete Boils, because they are supposed to be rooted to the spot and will look very
          // buggy if they are moved.
          entity.Remove();
        } else {
          // Teleport all friendly entities to where the player is.
          entity.Position = player.Position;
        }
      }
    }
  }
}
