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
  Isaac.ExecuteCommand("debug 6"); // Show hitspheres
  Isaac.ExecuteCommand("debug 7"); // Show damage values
}
