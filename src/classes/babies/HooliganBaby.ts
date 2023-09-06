import {
  EntityType,
  GeminiVariant,
  LevelStage,
  SwingerVariant,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  DISTANCE_OF_GRID_TILE,
  ModCallbackCustom,
  ReadonlySet,
  game,
  onStage,
  onStageOrLower,
  spawn,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Doubling certain enemies leads to bugs. */
const BUGGY_ENTITY_TYPES_SET = new ReadonlySet<EntityType>([
  EntityType.SHOPKEEPER, // 17
  EntityType.CHUB, // 28
  EntityType.FIREPLACE, // 33
  EntityType.GRIMACE, // 42
  EntityType.POKY, // 44
  EntityType.MOM, // 45
  EntityType.MOMS_HEART, // 78
  EntityType.ETERNAL_FLY, // 96
  EntityType.ISAAC, // 102
  EntityType.CONSTANT_STONE_SHOOTER, // 202
  EntityType.BRIMSTONE_HEAD, // 203
  EntityType.WALL_HUGGER, // 218
  EntityType.GAPING_MAW, // 235
  EntityType.BROKEN_GAPING_MAW, // 236
  EntityType.SWARM, // 281
  EntityType.PITFALL, // 291
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
   * - Mom cannot be doubled, so don't give this baby on stage 6.
   * - It Lives cannot be doubled, so don't give this baby on stage 8.
   * - Furthermore, double enemies would be too hard on the final stages.
   */
  override isValid(): boolean {
    return !onStage(LevelStage.DEPTHS_2) && onStageOrLower(LevelStage.WOMB_1);
  }

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

    return !(
      v.room.duplicatedNPCs.has(ptrHash) ||
      BUGGY_ENTITY_TYPES_SET.has(npc.Type) ||
      (npc.Type === EntityType.GEMINI && // 79
        npc.Variant >= (GeminiVariant.GEMINI_BABY as int)) ||
      (npc.Type === EntityType.SWINGER && // 216
        npc.Variant !== (SwingerVariant.SWINGER as int))
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
