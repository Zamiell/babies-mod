import { Baby } from "../Baby";

/** Starts with Rocket in a Jar + infinite bombs + blindfolded. */
export class BulletBaby extends Baby {
  override onAdd(player: EntityPlayer): void {
    player.AddGoldenBomb();
  }
}
