import {
  GridEntityType,
  ModCallback,
  PoopGridEntityVariant,
  SoundEffect,
} from "isaac-typescript-definitions";
import { Callback, game, getRandomInt, sfxManager } from "isaacscript-common";
import { g } from "../../globals";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Spawns a random poop every N seconds. */
export class ButtholeBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    everyNSeconds(() => {
      const poopVariant = getRandomInt(
        PoopGridEntityVariant.NORMAL,
        PoopGridEntityVariant.WHITE,
        g.run.rng,
      ) as PoopGridEntityVariant;

      if (
        poopVariant === PoopGridEntityVariant.RED ||
        poopVariant === PoopGridEntityVariant.CORN
      ) {
        // If the poop is this type, it will instantly damage the player, so give them some
        // invulnerability frames.
        g.run.invulnerabilityUntilFrame = gameFrameCount + 25;
      }

      Isaac.GridSpawn(GridEntityType.POOP, poopVariant, g.p.Position);

      sfxManager.Play(SoundEffect.FART);
    }, num);
  }
}
