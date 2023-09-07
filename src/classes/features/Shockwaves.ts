import {
  DamageFlag,
  EffectVariant,
  EntityPartition,
  ModCallback,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  DISTANCE_OF_GRID_TILE,
  VectorZero,
  game,
  sfxManager,
  spawnEffect,
} from "isaacscript-common";
import { BabyModFeature } from "../BabyModFeature";

interface ShockwaveDescription {
  gameFrameSpawned: int;
  position: Vector;
  velocity: Vector;
}

const v = {
  room: {
    shockwaves: [] as ShockwaveDescription[],
  },
};

export class Shockwaves extends BabyModFeature {
  v = v;

  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const room = game.GetRoom();
    const player = Isaac.GetPlayer();

    for (let i = v.room.shockwaves.length - 1; i >= 0; i--) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const shockwave = v.room.shockwaves[i]!;

      if ((gameFrameCount - shockwave.gameFrameSpawned) % 2 === 0) {
        this.spawnShockwave(shockwave.position, player);
        shockwave.position = shockwave.position.add(shockwave.velocity);
      }

      // Stop if it gets to a wall.
      if (!room.IsPositionInRoom(shockwave.position, 0)) {
        v.room.shockwaves.splice(i, 1);
      }
    }
  }

  spawnShockwave(position: Vector, player: EntityPlayer): void {
    const room = game.GetRoom();

    const explosion = spawnEffect(
      EffectVariant.ROCK_EXPLOSION,
      0,
      position,
      VectorZero,
      player,
    );

    // If the sound effect plays at full volume, it starts to get annoying.
    const volume = 0.5;
    sfxManager.Play(SoundEffect.ROCK_CRUMBLE, volume);

    // Destroy grid entities, if present.
    const index = room.GetGridIndex(position);
    room.DestroyGrid(index, true);

    // Make it deal damage to NPCs.
    const entities = Isaac.FindInRadius(
      position,
      DISTANCE_OF_GRID_TILE,
      EntityPartition.ENEMY,
    );
    for (const entity of entities) {
      const damageAmount = player.Damage * 1.5;
      entity.TakeDamage(
        damageAmount,
        DamageFlag.EXPLOSION,
        EntityRef(explosion),
        2,
      );
    }
  }
}

/** This function is only called from certain babies. */
export function startShockwaveLine(position: Vector, velocity: Vector): void {
  const gameFrameCount = game.GetFrameCount();

  v.room.shockwaves.push({
    gameFrameSpawned: gameFrameCount,
    position,
    velocity,
  });
}
