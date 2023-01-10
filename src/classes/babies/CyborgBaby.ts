import { Baby } from "../Baby";

/** Sees numerical damage values. */
export class CyborgBaby extends Baby {
  override onAdd(): void {
    Isaac.ExecuteCommand("debug 7");
  }

  override onRemove(): void {
    Isaac.ExecuteCommand("debug 7");
  }
}
