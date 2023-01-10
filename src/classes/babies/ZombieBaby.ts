import { removeAllFriendlyEntities } from "../../utils";
import { Baby } from "../Baby";

/** Brings back enemies from the dead. */
export class ZombieBaby extends Baby {
  override onRemove(): void {
    removeAllFriendlyEntities();
  }
}
