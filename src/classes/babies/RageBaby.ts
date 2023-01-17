import { Baby } from "../Baby";

/** Starts with Sad Bombs + golden bomb + blindfolded. */
export class RageBaby extends Baby {
  override onAdd(player: EntityPlayer): void {
    player.AddGoldenBomb();
  }
}
