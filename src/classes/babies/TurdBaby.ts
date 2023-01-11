import { ModCallback } from "isaac-typescript-definitions";
import { Callback, game } from "isaacscript-common";
import { Baby } from "../Baby";

const FART_RADIUS = 80;

/** Enemies fart on death. */
export class TurdBaby extends Baby {
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    game.Fart(entity.Position, FART_RADIUS, entity);
  }
}
