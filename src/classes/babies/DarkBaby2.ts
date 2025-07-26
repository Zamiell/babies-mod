import {
  EntityType,
  ModCallback,
  PoopEntityVariant,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  game,
  sfxManager,
  spawnGiantPoop,
  spawnWithSeed,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with E. Coli (improved). */
export class DarkBaby2 extends Baby {
  @Callback(ModCallback.PRE_PLAYER_COLLISION)
  prePlayerCollision(
    player: EntityPlayer,
    collider: Entity,
    _low: boolean,
  ): boolean | undefined {
    const npc = collider.ToNPC();
    if (
      npc === undefined
      || !npc.Exists()
      || !npc.IsVulnerableEnemy()
      || npc.IsDead()
      || npc.IsBoss()
    ) {
      return undefined;
    }

    npc.Remove();

    const room = game.GetRoom();
    const gridIndex = room.GetGridIndex(collider.Position);
    const success = spawnGiantPoop(gridIndex);
    if (success) {
      sfxManager.Play(SoundEffect.FART);
      return undefined;
    }

    // There was not room for the giant poop. Spawn a normal poop as a backup.
    spawnWithSeed(
      EntityType.POOP,
      PoopEntityVariant.NORMAL,
      0,
      player.Position,
      npc.InitSeed,
    );

    return undefined;
  }
}
