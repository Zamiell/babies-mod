import {
  GridEntityType,
  PoopGridEntityVariant,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  getRandomInt,
  sfxManager,
} from "isaacscript-common";
import { g } from "../../globals";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

const v = {
  room: {
    invulnerabilityUntilFrame: null as int | null,
  },
};

/** Spawns a random poop every N seconds. */
export class ButtholeBaby extends Baby {
  v = v;

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
        v.room.invulnerabilityUntilFrame = gameFrameCount + 25;
      }

      Isaac.GridSpawn(GridEntityType.POOP, poopVariant, player.Position);

      sfxManager.Play(SoundEffect.FART);
    }, num);
  }
}
