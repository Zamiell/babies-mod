import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getHUDOffsetVector } from "isaacscript-common";
import { g } from "../../globals";
import { shouldShowRealHeartsUIForDevilDeal } from "../../utils";
import { Baby } from "../Baby";

/** +2 bombs + bombs are hearts. */
export class MohawkBaby extends Baby {
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const bombs = g.p.GetNumBombs();

    // Bombs are hearts
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
}
