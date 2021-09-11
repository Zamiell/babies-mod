import { ZERO_VECTOR } from "../constants";
import g from "../globals";

const functionMap = new Map<int, (familiar: EntityFamiliar) => void>();
export default functionMap;

// Blue Baby
functionMap.set(30, (familiar: EntityFamiliar) => {
  // Making the Sprinkler invisible
  // (setting "familiar.Visible = false" does not work, so blank out the sprite)
  if (familiar.Variant === FamiliarVariant.SPRINKLER) {
    familiar.GetSprite().Load("gfx/003.120_sprinkler2.anm2", true);
  }
});

// Sucky Baby
functionMap.set(47, (familiar: EntityFamiliar) => {
  // Make the Succubus invisible
  // (setting "familiar.Visible = false" does not work because it will also make the aura invisible)
  if (familiar.Variant === FamiliarVariant.SUCCUBUS) {
    const sprite = familiar.GetSprite();
    sprite.Load("gfx/003.096_succubus2.anm2", true);
    sprite.Play("IdleDown", true);
  }
});

// Crow Baby
functionMap.set(117, (familiar: EntityFamiliar) => {
  if (familiar.Variant === FamiliarVariant.DEAD_BIRD && !g.run.babyBool) {
    // Spawn 5 bird familiars instead of 4
    g.run.babyBool = true;
    for (let i = 0; i < 4; i++) {
      Isaac.Spawn(
        EntityType.ENTITY_FAMILIAR,
        FamiliarVariant.DEAD_BIRD,
        0,
        g.p.Position,
        ZERO_VECTOR,
        undefined,
      );
    }
    g.run.babyBool = false;
  }
});

// Black Eye Baby
functionMap.set(164, (familiar: EntityFamiliar) => {
  if (familiar.Variant === FamiliarVariant.LEPROSY && g.run.babyCounters < 3) {
    // We use the "babyCounters" variable to track how Leprocy familiars are in the room
    g.run.babyCounters += 1;
  }
});

// Graven Baby
functionMap.set(453, (familiar: EntityFamiliar) => {
  // Bumbo needs 25 coins to reach the max level
  if (familiar.Variant === FamiliarVariant.BUMBO) {
    familiar.Coins = 25;
  }
});
