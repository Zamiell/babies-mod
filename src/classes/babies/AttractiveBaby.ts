import { removeAllFriendlyEntities } from "../../utils";
import { Baby } from "../Baby";

/** All enemies are permanently charmed. */
export class AttractiveBaby extends Baby {
  override onRemove(): void {
    removeAllFriendlyEntities();
  }
}
