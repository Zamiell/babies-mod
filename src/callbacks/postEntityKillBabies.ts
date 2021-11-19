import g from "../globals";
import { getCurrentBaby, getRoomIndex } from "../util";

const functionMap = new Map<int, (npc: EntityNPC) => void>();
export default functionMap;

// Black Baby
functionMap.set(27, (_npc: EntityNPC) => {
  // We don't want to clear the room too fast after an enemy dies
  g.run.room.clearDelayFrame = g.g.GetFrameCount() + 1;
});

// Brown Baby
functionMap.set(38, (npc: EntityNPC) => {
  // Spawns a poop per enemy killed
  Isaac.GridSpawn(
    GridEntityType.GRID_POOP,
    PoopGridEntityVariant.NORMAL,
    npc.Position,
    false,
  );
});

// Whore Baby
functionMap.set(43, (npc: EntityNPC) => {
  const roomIndex = getRoomIndex();

  // All enemies explode
  // We cannot explode enemies in the PostEntityKill callback due to a crash having to do with black
  // hearts
  // So, mark to explode in the PostUpdate callback
  g.run.room.NPCs.push({
    roomIndex,
    position: npc.Position,
  });
});

// Zombie Baby
functionMap.set(61, (npc: EntityNPC) => {
  if (
    !npc.IsBoss() &&
    npc.Type !== EntityType.ENTITY_MOVABLE_TNT &&
    !npc.HasEntityFlags(EntityFlag.FLAG_FRIENDLY)
  ) {
    const friend = g.g.Spawn(
      npc.Type,
      npc.Variant,
      npc.Position,
      Vector.Zero,
      undefined,
      npc.SubType,
      npc.InitSeed,
    );
    friend.AddEntityFlags(EntityFlag.FLAG_CHARM); // 1 << 8
    friend.AddEntityFlags(EntityFlag.FLAG_FRIENDLY); // 1 << 29
    friend.AddEntityFlags(EntityFlag.FLAG_PERSISTENT); // 1 << 37

    // Fade the entity so that it is easier to see everything
    // (this is also reapplied on every frame because enemies can be unfaded occasionally)
    const color = friend.GetColor();
    const fadeAmount = 0.25;
    const newColor = Color(
      color.R,
      color.G,
      color.B,
      fadeAmount,
      color.RO,
      color.GO,
      color.BO,
    );
    friend.SetColor(newColor, 0, 0, true, true);
  }
});

// Nerd Baby
functionMap.set(90, (_npc: EntityNPC) => {
  // We don't want to clear the room too fast after an enemy dies
  g.run.room.clearDelayFrame = g.g.GetFrameCount() + 1;
});

// Turd Baby
functionMap.set(92, (npc: EntityNPC) => {
  g.g.Fart(npc.Position, 80, npc, 1, 0);
});

// Love Eye Baby
functionMap.set(249, (npc: EntityNPC) => {
  if (g.run.babyBool) {
    return;
  }
  g.run.babyBool = true;

  // Store the killed enemy
  g.run.babyNPC = {
    type: npc.Type,
    variant: npc.Variant,
    subType: npc.SubType,
  };

  // Respawn all of the existing enemies in the room
  for (const entity2 of Isaac.GetRoomEntities()) {
    const npc2 = entity2.ToNPC();
    if (npc2 !== undefined && npc2.Index !== npc.Index) {
      // Don't respawn the entity that just died
      g.g.Spawn(
        npc.Type,
        npc.Variant,
        npc2.Position,
        npc2.Velocity,
        undefined,
        npc.SubType,
        npc2.InitSeed,
      );
      npc2.Remove();
    }
  }
});

// Killer Baby
functionMap.set(291, (_npc: EntityNPC) => {
  g.run.babyCounters += 1;
  g.p.AddCacheFlags(CacheFlag.CACHE_DAMAGE);
  g.p.EvaluateItems();
});

// Dino Baby
functionMap.set(376, (_npc: EntityNPC) => {
  // Don't bother giving another egg if we already have a bunch
  const brains = Isaac.FindByType(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.BOBS_BRAIN,
  );
  if (brains.length >= 6) {
    return;
  }

  // Spawn a new Bob's Brain familiar that we will re-skin to look like an egg
  const brain = Isaac.Spawn(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.BOBS_BRAIN,
    0,
    g.p.Position,
    Vector.Zero,
    undefined,
  );
  const brainSprite = brain.GetSprite();
  brainSprite.Load("gfx/003.059_bobs brain2.anm2", true);
  brainSprite.Play("Idle", true);
});

// Blue Wrestler Baby
functionMap.set(388, (npc: EntityNPC) => {
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
  }

  // Enemies spawn projectiles upon death
  // Mark to fire some tears one frame at a time
  g.run.room.tears.push({
    frame: 0,
    position: npc.Position,
    velocity: Vector.Zero,
    num: baby.num,
  });
});

// Toast Baby
functionMap.set(390, (npc: EntityNPC) => {
  // Enemies leave a Red Candle fire upon death
  Isaac.Spawn(
    EntityType.ENTITY_EFFECT,
    EffectVariant.HOT_BOMB_FIRE,
    0,
    npc.Position,
    Vector.Zero,
    undefined,
  );
});

// Buttface Baby
functionMap.set(451, (npc: EntityNPC) => {
  Isaac.GridSpawn(
    GridEntityType.GRID_POOP,
    PoopGridEntityVariant.BLACK,
    npc.Position,
    false,
  );
});

// Funny Baby
functionMap.set(491, (npc: EntityNPC) => {
  Isaac.Spawn(
    EntityType.ENTITY_BOMB,
    BombVariant.BOMB_SUPERTROLL,
    0,
    npc.Position,
    Vector.Zero,
    undefined,
  );
});

// Rainbow Baby
functionMap.set(530, (npc: EntityNPC) => {
  g.g.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_CHEST,
    npc.Position,
    Vector.Zero,
    undefined,
    0,
    npc.InitSeed,
  );
});
