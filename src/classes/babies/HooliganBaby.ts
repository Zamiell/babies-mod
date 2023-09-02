import {
  EntityType,
  GeminiVariant,
  LevelStage,
  ModCallback,
  SwingerVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  ReadonlySet,
  game,
  onStage,
  onStageOrLower,
  spawn,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

const DATA_KEY = "BabiesModDuplicated";

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

/** Double enemies. */
export class HooliganBaby extends Baby {
  /**
   * - Mom cannot be doubled, so don't give this baby on stage 6.
   * - It Lives cannot be doubled, so don't give this baby on stage 8.
   * - Furthermore, double enemies would be too hard on the final stages.
   */
  override isValid(): boolean {
    return !onStage(LevelStage.DEPTHS_2) && onStageOrLower(LevelStage.WOMB_1);
  }

  // 0
  @Callback(ModCallback.POST_NPC_UPDATE)
  postNPCUpdate(npc: EntityNPC): void {
    const room = game.GetRoom();
    const player = Isaac.GetPlayer();
    const data = npc.GetData();

    // We need to do this in the `POST_NPC_UPDATE` callback instead of the `POST_NPC_INIT` callback
    // since we use data to detect duplicated enemies.
    if (
      npc.FrameCount !== 0 ||
      data[DATA_KEY] !== undefined ||
      BUGGY_ENTITY_TYPES_SET.has(npc.Type) ||
      (npc.Type === EntityType.GEMINI &&
        npc.Variant >= (GeminiVariant.GEMINI_BABY as int)) || // 79
      (npc.Type === EntityType.SWINGER &&
        npc.Variant !== (SwingerVariant.SWINGER as int)) // 216
    ) {
      return;
    }

    if (!g.run.babyBool) {
      g.run.babyBool = true;
      const position = room.FindFreePickupSpawnPosition(npc.Position, 1, true);
      if (position.Distance(player.Position) > 40) {
        const newNPC = spawn(
          npc.Type,
          npc.Variant,
          npc.SubType,
          position,
          npc.Velocity,
          npc,
          npc.InitSeed,
        );
        const newData = newNPC.GetData();
        newData[DATA_KEY] = true;
      }
      g.run.babyBool = false;
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
