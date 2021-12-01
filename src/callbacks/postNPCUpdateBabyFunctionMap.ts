import g from "../globals";

export const postNPCUpdateBabyFunctionMap = new Map<
  int,
  (npc: EntityNPC) => void
>();

// Zombie Baby
postNPCUpdateBabyFunctionMap.set(61, (npc: EntityNPC) => {
  // Brings back enemies from the dead
  // Reapply the fade on every frame because enemies can be unfaded occasionally
  if (npc.HasEntityFlags(EntityFlag.FLAG_FRIENDLY)) {
    const color = npc.GetColor();
    const fadeAmount = 0.25;
    const newColor = Color(color.R, color.G, color.B, fadeAmount);
    // (for some reason, in this callback, RO, GO, and BO will be float values,
    // but the Color constructor only wants integers,
    // so manually use 0 for these 3 values instead of the existing ones)
    npc.SetColor(newColor, 0, 0, true, true);
  }
});

// Hooligan Baby
postNPCUpdateBabyFunctionMap.set(514, (npc: EntityNPC) => {
  const data = npc.GetData();

  // Double enemies
  // (if we do this in the PostNPCInit callback, some positions are not yet initialized,
  // so we do it here instead)
  if (
    npc.FrameCount !== 0 ||
    data.duplicated !== undefined ||
    // Doubling certain enemies leads to bugs
    npc.Type === EntityType.ENTITY_SHOPKEEPER || // 17
    npc.Type === EntityType.ENTITY_CHUB || // 28
    npc.Type === EntityType.ENTITY_FIREPLACE || // 33
    npc.Type === EntityType.ENTITY_STONEHEAD || // 42
    npc.Type === EntityType.ENTITY_POKY || // 44
    npc.Type === EntityType.ENTITY_MOM || // 45
    npc.Type === EntityType.ENTITY_MOMS_HEART || // 78
    (npc.Type === EntityType.ENTITY_GEMINI && npc.Variant >= 10) || // 79
    npc.Type === EntityType.ENTITY_ETERNALFLY || // 96
    npc.Type === EntityType.ENTITY_ISAAC || // 102
    npc.Type === EntityType.ENTITY_CONSTANT_STONE_SHOOTER || // 202
    npc.Type === EntityType.ENTITY_BRIMSTONE_HEAD || // 203
    (npc.Type === EntityType.ENTITY_SWINGER && npc.Variant > 0) || // 216
    npc.Type === EntityType.ENTITY_WALL_HUGGER || // 218
    npc.Type === EntityType.ENTITY_GAPING_MAW || // 235
    npc.Type === EntityType.ENTITY_BROKEN_GAPING_MAW || // 236
    npc.Type === EntityType.ENTITY_SWARM || // 281
    npc.Type === EntityType.ENTITY_PITFALL // 291
  ) {
    return;
  }

  if (!g.run.babyBool) {
    g.run.babyBool = true;
    const position = g.r.FindFreePickupSpawnPosition(npc.Position, 1, true);
    if (position.Distance(g.p.Position) > 40) {
      const newNPC = g.g.Spawn(
        npc.Type,
        npc.Variant,
        position,
        npc.Velocity,
        npc,
        npc.SubType,
        npc.InitSeed,
      );
      newNPC.GetData().duplicated = true;
    }
    g.run.babyBool = false;
  }
});
