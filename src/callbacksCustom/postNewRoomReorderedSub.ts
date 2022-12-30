import { LevelCurse } from "isaac-typescript-definitions";
import { g } from "../globals";
import { shouldShowRealHeartsUIForDevilDeal } from "../utils";

/** This is used for several babies. */
export function postNewRoomReorderedNoHealthUI(): void {
  // Get rid of the health UI by using Curse of the Unknown (but not in Devil Rooms or Black
  // Markets).
  if (shouldShowRealHeartsUIForDevilDeal()) {
    g.l.RemoveCurses(LevelCurse.UNKNOWN);
  } else {
    g.l.AddCurse(LevelCurse.UNKNOWN, false);
  }
}
