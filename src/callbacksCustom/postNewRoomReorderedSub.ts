import { LevelCurse, MinibossID, RoomType } from "isaac-typescript-definitions";
import { inMinibossRoomOf, inRoomType } from "isaacscript-common";
import { g } from "../globals";

/** This is used for several babies. */
export function postNewRoomReorderedNoHealthUI(): void {
  const inRoomWithDevilDeals = inRoomType(
    RoomType.DEVIL,
    RoomType.BLACK_MARKET,
  );
  const inKrampusRoom = inMinibossRoomOf(MinibossID.KRAMPUS);

  // Get rid of the health UI by using Curse of the Unknown (but not in Devil Rooms or Black
  // Markets).
  if (inRoomWithDevilDeals || !inKrampusRoom) {
    g.l.RemoveCurses(LevelCurse.UNKNOWN);
  } else {
    g.l.AddCurse(LevelCurse.UNKNOWN, false);
  }
}
