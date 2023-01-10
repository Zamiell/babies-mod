import { EntityFlag, EntityType } from "isaac-typescript-definitions";
import { spawn } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";

export const postNPCUpdateBabyFunctionMap = new Map<
  RandomBabyType,
  (npc: EntityNPC) => void
>();

// 61
postNPCUpdateBabyFunctionMap.set(RandomBabyType.ZOMBIE, (npc: EntityNPC) => {
  // Brings back enemies from the dead Reapply the fade on every frame because enemies can be
  // unfaded occasionally.
  if (npc.HasEntityFlags(EntityFlag.FRIENDLY)) {
    const color = npc.GetColor();
    const fadeAmount = 0.25;
    const newColor = Color(color.R, color.G, color.B, fadeAmount);
    // (For some reason, in this callback, RO, GO, and BO will be float values, but the Color
    // constructor only wants integers, so manually use 0 for these 3 values instead of the existing
    // ones.)
    npc.SetColor(newColor, 0, 0, true, true);
  }
});

// 514
postNPCUpdateBabyFunctionMap.set(RandomBabyType.HOOLIGAN, (npc: EntityNPC) => {
  const data = npc.GetData();

  // Double enemies. (If we do this in the PostNPCInit callback, some positions are not yet
  // initialized, so we do it here instead.)
  if (
    npc.FrameCount !== 0 ||
    data["duplicated"] !== undefined ||
    // Doubling certain enemies leads to bugs.
    npc.Type === EntityType.SHOPKEEPER || // 17
    npc.Type === EntityType.CHUB || // 28
    npc.Type === EntityType.FIREPLACE || // 33
    npc.Type === EntityType.GRIMACE || // 42
    npc.Type === EntityType.POKY || // 44
    npc.Type === EntityType.MOM || // 45
    npc.Type === EntityType.MOMS_HEART || // 78
    (npc.Type === EntityType.GEMINI && npc.Variant >= 10) || // 79
    npc.Type === EntityType.ETERNAL_FLY || // 96
    npc.Type === EntityType.ISAAC || // 102
    npc.Type === EntityType.CONSTANT_STONE_SHOOTER || // 202
    npc.Type === EntityType.BRIMSTONE_HEAD || // 203
    (npc.Type === EntityType.SWINGER && npc.Variant > 0) || // 216
    npc.Type === EntityType.WALL_HUGGER || // 218
    npc.Type === EntityType.GAPING_MAW || // 235
    npc.Type === EntityType.BROKEN_GAPING_MAW || // 236
    npc.Type === EntityType.SWARM || // 281
    npc.Type === EntityType.PITFALL // 291
  ) {
    return;
  }

  if (!g.run.babyBool) {
    g.run.babyBool = true;
    const position = g.r.FindFreePickupSpawnPosition(npc.Position, 1, true);
    if (position.Distance(g.p.Position) > 40) {
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
      newData["duplicated"] = true;
    }
    g.run.babyBool = false;
  }
});
