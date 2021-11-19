import g from "../globals";

export const postFamiliarInitBabyFunctionMap = new Map<
  int,
  (familiar: EntityFamiliar) => void
>();

// Blue Baby
postFamiliarInitBabyFunctionMap.set(30, (familiar: EntityFamiliar) => {
  // Making the Sprinkler invisible
  // (setting "familiar.Visible = false" does not work, so blank out the sprite)
  if (familiar.Variant === FamiliarVariant.SPRINKLER) {
    const sprite = familiar.GetSprite();
    sprite.Load("gfx/003.120_sprinkler2.anm2", true);
  }
});

// Sucky Baby
postFamiliarInitBabyFunctionMap.set(47, (familiar: EntityFamiliar) => {
  // Make the Succubus invisible
  // (setting "familiar.Visible = false" does not work because it will also make the aura invisible)
  if (familiar.Variant === FamiliarVariant.SUCCUBUS) {
    const sprite = familiar.GetSprite();
    sprite.Load("gfx/003.096_succubus2.anm2", true);
    sprite.Play("IdleDown", true);
  }
});

// Crow Baby
postFamiliarInitBabyFunctionMap.set(117, (familiar: EntityFamiliar) => {
  if (familiar.Variant === FamiliarVariant.DEAD_BIRD && !g.run.babyBool) {
    // Spawn 5 bird familiars instead of 1
    g.run.babyBool = true;
    for (let i = 0; i < 4; i++) {
      Isaac.Spawn(
        EntityType.ENTITY_FAMILIAR,
        FamiliarVariant.DEAD_BIRD,
        0,
        g.p.Position,
        Vector.Zero,
        undefined,
      );
    }
    g.run.babyBool = false;
  }
});

// Black Eye Baby
postFamiliarInitBabyFunctionMap.set(164, (familiar: EntityFamiliar) => {
  if (familiar.Variant === FamiliarVariant.LEPROSY && g.run.babyCounters < 3) {
    // We use the "babyCounters" variable to track how Leprocy familiars are in the room
    g.run.babyCounters += 1;
  }
});

// Graven Baby
postFamiliarInitBabyFunctionMap.set(453, (familiar: EntityFamiliar) => {
  // Bumbo needs 25 coins to reach the max level
  if (familiar.Variant === FamiliarVariant.BUMBO) {
    familiar.Coins = 25;
  }
});
