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
  newRNG,
  setSeed,
  sfxManager,
  spawnWithSeed,
} from "isaacscript-common";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

const NUM_POOP_ENTITY_VARIANTS = getEnumLength(PoopEntityVariant);
if (NUM_POOP_ENTITY_VARIANTS !== 8) {
  error(
    "Butthole Baby needs to be updated to handle the new poop entity variants.",
  );
}
const POOP_GRID_ENTITY_VARIANTS_NOT_IN_POOP_ENTITY_VARIANTS = [
  PoopGridEntityVariant.RED, // 1
  PoopGridEntityVariant.RAINBOW, // 4
  PoopGridEntityVariant.CHARMING, // 11
] as const;

const v = {
  run: {
    poopRNG: newRNG(),
  },

  room: {
    invulnerabilityUntilFrame: null as int | null,
  },
};

/** Spawns a random poop every N seconds. */
export class ButtholeBaby extends Baby {
  v = v;

  override onAdd(): void {
    const level = game.GetLevel();
    const seed = level.GetDungeonPlacementSeed();
    setSeed(v.run.poopRNG, seed);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    const gameFrameCount = game.GetFrameCount();

    if (
      v.room.invulnerabilityUntilFrame !== null &&
      gameFrameCount < v.room.invulnerabilityUntilFrame
    ) {
      return false;
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    everyNSeconds(() => {
      spawnRandomPoop(player);
    }, num);
  }
}

function spawnRandomPoop(player: EntityPlayer) {
  // We want each poop type to have an equal chance of spawning.
  const poopRoll = getRandomInt(
    1,
    NUM_POOP_ENTITY_VARIANTS +
      POOP_GRID_ENTITY_VARIANTS_NOT_IN_POOP_ENTITY_VARIANTS.length,
    v.run.poopRNG,
  );

  // Depending on the type of poop selected, we might need to spawn an entity or a grid entity.
  if (poopRoll <= NUM_POOP_ENTITY_VARIANTS) {
    const poopEntityVariant = getRandomEnumValue(
      PoopEntityVariant,
      v.run.poopRNG,
    );
    spawnWithSeed(
      EntityType.POOP,
      poopEntityVariant,
      0,
      player.Position,
      v.run.poopRNG,
    );
  } else {
    const poopGridEntityVariant = getRandomArrayElement(
      POOP_GRID_ENTITY_VARIANTS_NOT_IN_POOP_ENTITY_VARIANTS,
      v.run.poopRNG,
    );

    // Red Poops will instantly damage the player, so we have to give them some invulnerability
    // frames.
    if (poopGridEntityVariant === PoopGridEntityVariant.RED) {
      const gameFrameCount = game.GetFrameCount();
      v.room.invulnerabilityUntilFrame = gameFrameCount + 25;
    }

    Isaac.GridSpawn(
      GridEntityType.POOP,
      poopGridEntityVariant,
      player.Position,
    );
  }

  sfxManager.Play(SoundEffect.FART);
}
