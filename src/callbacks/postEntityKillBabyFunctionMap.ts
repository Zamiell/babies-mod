import {
  CacheFlag,
  EntityFlag,
  EntityType,
  FamiliarVariant,
} from "isaac-typescript-definitions";
import {
  copyColor,
  countEntities,
  game,
  getNPCs,
  spawn,
  spawnFamiliar,
  spawnWithSeed,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";

export const postEntityKillBabyFunctionMap = new Map<
  RandomBabyType,
  (npc: EntityNPC) => void
>();

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
  g.run.babyCounters++;
  g.p.AddCacheFlags(CacheFlag.DAMAGE);
  g.p.EvaluateItems();
});

// 376
postEntityKillBabyFunctionMap.set(RandomBabyType.DINO, (_npc: EntityNPC) => {
  // Don't bother giving another egg if we already have a bunch.
  const numBrains = countEntities(
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
