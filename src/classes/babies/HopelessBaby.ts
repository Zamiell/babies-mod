import {
  CollectibleType,
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  getHUDOffsetVector,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { shouldShowRealHeartsUIForDevilDeal } from "../../utils";
import { Baby } from "../Baby";

/** +2 keys + keys are hearts. */
export class HopelessBaby extends Baby {
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const keys = g.p.GetNumKeys();

    // Keys are hearts
    if (keys === 0) {
      g.p.Kill();
    }
  }

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    if (g.run.babySprite === null) {
      return;
    }

    const keys = g.p.GetNumKeys();

    if (!shouldShowRealHeartsUIForDevilDeal()) {
      // Draw the key count next to the hearts.
      const HUDOffsetVector = getHUDOffsetVector();
      const x = 65 + HUDOffsetVector.X;
      const y = 12;
      const position = Vector(x, y);
      g.run.babySprite.RenderLayer(0, position);
      const text = `x${keys}`;
      Isaac.RenderText(text, x + 5, y, 2, 2, 2, 2);
    }
  }

  // 11
  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.PLAYER)
  entityTakeDmgPlayer(
    entity: Entity,
    _amount: float,
    _damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    const player = entity.ToPlayer();
    if (player === undefined) {
      return undefined;
    }

    if (g.run.babyBool) {
      return undefined;
    }

    g.run.babyBool = true;
    useActiveItemTemp(player, CollectibleType.DULL_RAZOR);
    g.run.babyBool = false;
    player.AddKeys(-1);
    return false;
  }
}