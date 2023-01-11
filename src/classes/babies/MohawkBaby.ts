import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  getHUDOffsetVector,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { newSprite } from "../../sprite";
import { shouldShowRealHeartsUIForDevilDeal } from "../../utils";
import { Baby } from "../Baby";

/** +2 bombs + bombs are hearts. */
export class MohawkBaby extends Baby {
  override onAdd(player: EntityPlayer): void {
    player.AddBombs(2);

    g.run.babySprite = newSprite("gfx/custom-health/bomb.anm2");
  }

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const bombs = g.p.GetNumBombs();

    if (bombs === 0) {
      g.p.Kill();
    }
  }

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    if (g.run.babySprite === null) {
      return;
    }

    const bombs = g.p.GetNumBombs();

    if (!shouldShowRealHeartsUIForDevilDeal()) {
      // Draw the bomb count next to the hearts.
      const HUDOffsetVector = getHUDOffsetVector();
      const x = 65 + HUDOffsetVector.X;
      const y = 12;
      const position = Vector(x, y);
      g.run.babySprite.RenderLayer(0, position);
      const text = `x${bombs}`;
      Isaac.RenderText(text, x + 5, y, 2, 2, 2, 2);
    }
  }

  // 11
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (g.run.dealingExtraDamage) {
      return undefined;
    }

    g.run.dealingExtraDamage = true;
    useActiveItemTemp(player, CollectibleType.DULL_RAZOR);
    g.run.dealingExtraDamage = false;
    player.AddBombs(-1);
    return false;
  }
}
