import {
  GridEntityType,
  PoopGridEntityVariant,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  getRandomInt,
  ModCallbackCustom,
  sfxManager,
} from "isaacscript-common";
import { g } from "../../globals";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Spawns a random poop every N seconds. */
export class ButtholeBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
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

      Isaac.GridSpawn(GridEntityType.POOP, poopVariant, player.Position);

      sfxManager.Play(SoundEffect.FART);
    }, num);
  }
}
