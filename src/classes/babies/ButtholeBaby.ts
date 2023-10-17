import {
  EntityType,
  GridEntityType,
  PoopEntityVariant,
  PoopGridEntityVariant,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  getEnumLength,
  getRandomArrayElement,
  getRandomEnumValue,
  getRandomInt,
  isBeforeGameFrame,
  newRNG,
  sfxManager,
  spawnGridEntityWithVariant,
  spawnWithSeed,
} from "isaacscript-common";
import { everyNSeconds, setInitialBabyRNG } from "../../utils";
import { Baby } from "../Baby";

const NUM_POOP_ENTITY_VARIANTS = getEnumLength(PoopEntityVariant);
if (NUM_POOP_ENTITY_VARIANTS !== 8) {
  error(
    "Babies Mod needs to be updated to handle the new poop entity variants.",
  );
}

const POOP_GRID_ENTITY_VARIANTS_NOT_IN_POOP_ENTITY_VARIANTS = [
  PoopGridEntityVariant.RED, // 1
  PoopGridEntityVariant.RAINBOW, // 4
  PoopGridEntityVariant.CHARMING, // 11
] as const;

const NUM_RED_POOP_INVULNERABILITY_GAME_FRAMES = 25;

const v = {
  run: {
    rng: newRNG(),
  },

  room: {
    invulnerabilityUntilGameFrame: null as int | null,
  },
};

/** Spawns a random poop every N seconds. */
export class ButtholeBaby extends Baby {
  v = v;

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    if (
      v.room.invulnerabilityUntilGameFrame !== null &&
      isBeforeGameFrame(v.room.invulnerabilityUntilGameFrame)
    ) {
      return false;
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    everyNSeconds(() => {
      spawnRandomPoop(player.Position, v.run.rng);
    }, num);
  }
}

/** We want each type of poop type to have an equal chance of spawning. */
function spawnRandomPoop(position: Vector, rng: RNG) {
  const numNormalEntityPoops = NUM_POOP_ENTITY_VARIANTS;
  const numGridEntityPoops =
    POOP_GRID_ENTITY_VARIANTS_NOT_IN_POOP_ENTITY_VARIANTS.length;
  const poopRoll = getRandomInt(
    1,
    numNormalEntityPoops + numGridEntityPoops,
    rng,
  );

  // Depending on the type of poop selected, we might need to spawn an entity or a grid entity.
  if (poopRoll <= numNormalEntityPoops) {
    const poopEntityVariant = getRandomEnumValue(PoopEntityVariant, rng);
    spawnWithSeed(EntityType.POOP, poopEntityVariant, 0, position, rng);
  } else {
    const poopGridEntityVariant = getRandomArrayElement(
      POOP_GRID_ENTITY_VARIANTS_NOT_IN_POOP_ENTITY_VARIANTS,
      rng,
    );

    // Red Poops will instantly damage the player, so we have to give them some invulnerability
    // frames.
    if (poopGridEntityVariant === PoopGridEntityVariant.RED) {
      const gameFrameCount = game.GetFrameCount();
      v.room.invulnerabilityUntilGameFrame =
        gameFrameCount + NUM_RED_POOP_INVULNERABILITY_GAME_FRAMES;
    }

    spawnGridEntityWithVariant(
      GridEntityType.POOP,
      poopGridEntityVariant,
      position,
      false,
    );
  }

  sfxManager.Play(SoundEffect.FART);
}
