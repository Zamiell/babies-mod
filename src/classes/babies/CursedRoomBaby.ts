import { LevelCurse } from "isaac-typescript-definitions";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with Holy Mantle + Curse of the Cursed. */
export class CursedRoomBaby extends Baby {
  override onAdd(): void {
    g.l.AddCurse(LevelCurse.CURSED, false);
  }

  override onRemove(): void {
    g.l.RemoveCurses(LevelCurse.CURSED);
  }
}
