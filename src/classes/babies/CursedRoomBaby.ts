import { LevelCurse } from "isaac-typescript-definitions";
import { game } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Holy Mantle + Curse of the Cursed. */
export class CursedRoomBaby extends Baby {
  override onAdd(): void {
    const level = game.GetLevel();
    level.AddCurse(LevelCurse.CURSED, false);
  }

  override onRemove(): void {
    const level = game.GetLevel();
    level.RemoveCurses(LevelCurse.CURSED);
  }
}
