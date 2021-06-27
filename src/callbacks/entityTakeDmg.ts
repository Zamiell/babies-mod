import { getCurrentBaby } from "../misc";
import * as entityTakeDmgEntity from "./entityTakeDmgEntity";
import * as entityTakeDmgPlayer from "./entityTakeDmgPlayer";

export function main(
  entity: Entity,
  damageAmount: float,
  damageFlags: int,
  damageSource: EntityRef,
  damageCountdownFrames: int,
): boolean | void {
  const [, , valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  const player = entity.ToPlayer();
  if (player !== null) {
    return entityTakeDmgPlayer.main(
      player,
      damageAmount,
      damageFlags,
      damageSource,
      damageCountdownFrames,
    );
  }

  return entityTakeDmgEntity.main(
    entity,
    damageAmount,
    damageFlags,
    damageSource,
    damageCountdownFrames,
  );
}
