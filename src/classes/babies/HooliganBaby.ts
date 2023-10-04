import {
  EntityFlag,
  EntityType,
  SwingerVariant,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  DISTANCE_OF_GRID_TILE,
  ModCallbackCustom,
  ReadonlySet,
  game,
  spawn,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Doubling certain entities leads to bugs. */
const BUGGY_ENTITY_TYPES_SET = new ReadonlySet<EntityType>([
  EntityType.SHOPKEEPER, // 17
  EntityType.FIREPLACE, // 33
  EntityType.GRIMACE, // 42
  EntityType.POKY, // 44
  EntityType.ETERNAL_FLY, // 96
  EntityType.CONSTANT_STONE_SHOOTER, // 202
  EntityType.BRIMSTONE_HEAD, // 203
  EntityType.WALL_HUGGER, // 218
  EntityType.GAPING_MAW, // 235
  EntityType.BROKEN_GAPING_MAW, // 236
  EntityType.SWARM, // 281
  EntityType.PITFALL, // 291
]);

/** Doubling certain entity + variant combinations leads to bugs. */
const BUGGY_ENTITY_TYPE_VARIANT_SET = new ReadonlySet<string>([
  `${EntityType.SWINGER}.${SwingerVariant.SWINGER_HEAD}`, // 216.1
  `${EntityType.SWINGER}.${SwingerVariant.SWINGER_NECK}`, // 216.10
]);

const v = {
  room: {
    duplicatedNPCs: new Set<PtrHash>(),
  },
};

/** Double enemies. */
export class HooliganBaby extends Baby {
  v = v;

  /**
   * We duplicate enemies in the `POST_NPC_INIT_LATE` callback instead of the `POST_NPC_INIT`
   * callback so that we have time to add their hashes to the set.
   */
  // 27
  @CallbackCustom(ModCallbackCustom.POST_NPC_INIT_LATE)
  postNPCInitLate(npc: EntityNPC): void {
    if (this.shouldDuplicateNPC(npc)) {
      this.duplicateNPC(npc);
    }
  }

  shouldDuplicateNPC(npc: EntityNPC): boolean {
    const ptrHash = GetPtrHash(npc);
    const entityTypeVariant = `${npc.Type}.${npc.Variant}`;

    return (
      !v.room.duplicatedNPCs.has(ptrHash) &&
      !npc.IsBoss() &&
      !npc.HasEntityFlags(EntityFlag.FRIENDLY) &&
      !BUGGY_ENTITY_TYPES_SET.has(npc.Type) &&
      !BUGGY_ENTITY_TYPE_VARIANT_SET.has(entityTypeVariant)
    );
  }

  duplicateNPC(npc: EntityNPC): void {
    const room = game.GetRoom();
    const player = Isaac.GetPlayer();

    const position = room.FindFreePickupSpawnPosition(npc.Position, 1, true);
    if (position.Distance(player.Position) >= DISTANCE_OF_GRID_TILE) {
      const newNPC = spawn(
        npc.Type,
        npc.Variant,
        npc.SubType,
        position,
        npc.Velocity,
        npc,
        npc.InitSeed,
      );
      const ptrHash = GetPtrHash(newNPC);
      v.room.duplicatedNPCs.add(ptrHash);
    }
  }

  /** Fix the bug where an enemy can sometimes spawn next to where the player spawns. */
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    const room = game.GetRoom();
    const roomFrameCount = room.GetFrameCount();

    if (roomFrameCount === 0) {
      return false;
    }

    return undefined;
  }
}
