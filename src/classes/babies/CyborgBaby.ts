import { DebugCommand } from "isaac-typescript-definitions";
import { Baby } from "../Baby";

/** Sees numerical damage values and hitboxes. */
export class CyborgBaby extends Baby {
  override onAdd(): void {
    toggleDebugOptions();
  }

  override onRemove(): void {
    toggleDebugOptions();
  }
}

function toggleDebugOptions() {
  Isaac.ExecuteCommand(`debug ${DebugCommand.SHOW_HITSPHERES}`); // 6
  Isaac.ExecuteCommand(`debug ${DebugCommand.SHOW_DAMAGE_VALUES}`); // 7
}
