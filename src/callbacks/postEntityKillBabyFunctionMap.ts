import {
  BombVariant,
  CacheFlag,
  EffectVariant,
  EntityFlag,
  EntityType,
  FamiliarVariant,
  GridEntityType,
  PickupVariant,
  PoopGridEntityVariant,
} from "isaac-typescript-definitions";
import {
  copyColor,
  game,
  getNPCs,
  getRoomListIndex,
  spawn,
  spawnBomb,
  spawnEffect,
  spawnFamiliar,
  spawnPickupWithSeed,
  spawnWithSeed,
  VectorZero,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import g from "../globals";
import { getCurrentBabyDescription } from "../utils";

export const postEntityKillBabyFunctionMap = new Map<
  RandomBabyType,
  (npc: EntityNPC) => void
>();

// 38
postEntityKillBabyFunctionMap.set(RandomBabyType.BROWN, (npc: EntityNPC) => {
  // Spawns a poop per enemy killed.
  Isaac.GridSpawn(
    GridEntityType.POOP,
    PoopGridEntityVariant.NORMAL,
    npc.Position,
  );
});

// 43
postEntityKillBabyFunctionMap.set(RandomBabyType.WHORE, (npc: EntityNPC) => {
  const roomListIndex = getRoomListIndex();

  // All enemies explode. We cannot explode enemies in the PostEntityKill callback due to a crash
  // having to do with black hearts. So, mark to explode in the PostUpdate callback.
  g.run.babyExplosions.push({
    roomListIndex,
    position: npc.Position,
  });
});

// 61
postEntityKillBabyFunctionMap.set(RandomBabyType.ZOMBIE, (npc: EntityNPC) => {
  if (
    !npc.IsBoss() &&
    npc.Type !== EntityType.MOVABLE_TNT &&
    !npc.HasEntityFlags(EntityFlag.FRIENDLY)
  ) {
    const friend = spawnWithSeed(
      npc.Type,
      npc.Variant,
      npc.SubType,
      npc.Position,
      npc.InitSeed,
    );
    friend.AddEntityFlags(EntityFlag.CHARM); // 1 << 8
    friend.AddEntityFlags(EntityFlag.FRIENDLY); // 1 << 29
    friend.AddEntityFlags(EntityFlag.PERSISTENT); // 1 << 37

    // Fade the entity so that it is easier to see everything. (This is also reapplied on every
    // frame because enemies can be unfaded occasionally.)
    const fadeAmount = 0.25;
    const color = friend.GetColor();
    const newColor = copyColor(color);
    newColor.A = fadeAmount;
    friend.SetColor(newColor, 0, 0, true, true);
  }
});

// 92
postEntityKillBabyFunctionMap.set(RandomBabyType.TURD, (npc: EntityNPC) => {
  game.Fart(npc.Position, 80, npc, 1, 0);
});

// 249
postEntityKillBabyFunctionMap.set(RandomBabyType.LOVE_EYE, (npc: EntityNPC) => {
  if (g.run.babyBool) {
    return;
  }
  g.run.babyBool = true;

  // Store the killed enemy.
  g.run.babyNPC = {
    entityType: npc.Type,
    variant: npc.Variant,
    subType: npc.SubType,
  };

  // Respawn all of the existing enemies in the room.
  for (const npc2 of getNPCs()) {
    // Don't respawn the entity that just died.
    if (npc2.Index !== npc.Index) {
      spawn(
        npc.Type,
        npc.Variant,
        npc.SubType,
        npc2.Position,
        npc2.Velocity,
        undefined,
        npc2.InitSeed,
      );
      npc2.Remove();
    }
  }
});

// 291
postEntityKillBabyFunctionMap.set(RandomBabyType.KILLER, (_npc: EntityNPC) => {
  g.run.babyCounters += 1;
  g.p.AddCacheFlags(CacheFlag.DAMAGE);
  g.p.EvaluateItems();
});

// 376
postEntityKillBabyFunctionMap.set(RandomBabyType.DINO, (_npc: EntityNPC) => {
  // Don't bother giving another egg if we already have a bunch.
  const numBrains = Isaac.CountEntities(
    undefined,
    EntityType.FAMILIAR,
    FamiliarVariant.BOBS_BRAIN,
  );
  if (numBrains >= 6) {
    return;
  }

  // Spawn a new Bob's Brain familiar that we will re-skin to look like an egg.
  const brain = spawnFamiliar(FamiliarVariant.BOBS_BRAIN, 0, g.p.Position);

  const sprite = brain.GetSprite();
  sprite.Load("gfx/003.059_bobs brain_custom.anm2", true);
  sprite.Play("Idle", true);
});

// 388
postEntityKillBabyFunctionMap.set(
  RandomBabyType.BLUE_WRESTLER,
  (npc: EntityNPC) => {
    const baby = getCurrentBabyDescription();
    if (baby.num === undefined) {
      error(`The "num" attribute was not defined for: ${baby.name}`);
    }

    // Enemies spawn projectiles upon death. Mark to fire some tears one frame at a time.
    g.run.room.tears.push({
      frame: 0,
      position: npc.Position,
      velocity: VectorZero,
      num: baby.num,
    });
  },
);

// 390
postEntityKillBabyFunctionMap.set(RandomBabyType.TOAST, (npc: EntityNPC) => {
  // Enemies leave a Red Candle fire upon death.
  spawnEffect(EffectVariant.HOT_BOMB_FIRE, 0, npc.Position);
});

// 451
postEntityKillBabyFunctionMap.set(RandomBabyType.BUTTFACE, (npc: EntityNPC) => {
  Isaac.GridSpawn(
    GridEntityType.POOP,
    PoopGridEntityVariant.BLACK,
    npc.Position,
  );
});

// 491
postEntityKillBabyFunctionMap.set(RandomBabyType.FUNNY, (npc: EntityNPC) => {
  spawnBomb(BombVariant.TROLL, 0, npc.Position);
});

// 567
postEntityKillBabyFunctionMap.set(RandomBabyType.RAINBOW, (npc: EntityNPC) => {
  spawnPickupWithSeed(PickupVariant.CHEST, 0, npc.Position, npc.InitSeed);
});
