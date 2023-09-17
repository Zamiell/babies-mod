import { Direction, ModCallback, TearFlag } from "isaac-typescript-definitions";
import { Callback, addFlag, directionToVector } from "isaacscript-common";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

const v = {
  room: {
    tearsPtrHashes: new Set<PtrHash>(),
  },
};

/** Orbiting tears. */
export class EightBallBaby extends Baby {
  v = v;

  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    if (!v.room.tearsPtrHashes.has(ptrHash)) {
      return;
    }

    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    const num = this.getAttribute("num");

    // The tear starts directly above the player.
    const positionModifier = directionToVector(Direction.UP).mul(num);
    const degrees = tear.FrameCount * 8; // Tears rotate 4 degrees per frame.
    const positionModifierRotated = positionModifier.Rotated(degrees);
    tear.Position = player.Position.add(positionModifierRotated);

    // We want the tear to be moving perpendicular to the line between the player and the tear.
    tear.Velocity = Vector(num / 4, 0);
    tear.Velocity = tear.Velocity.Rotated(degrees);

    // Keep it in the air for a while.
    if (tear.FrameCount < 150) {
      tear.FallingSpeed = 0;
    }
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const num = this.getAttribute("num");

    // We need to have spectral for this ability to work properly.
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.SPECTRAL);

    // Start with the tears directly above the player and moving towards the right.
    tear.Position = directionToVector(Direction.UP).mul(num);
    tear.Velocity = Vector(num / 4, 0);
    tear.FallingSpeed = 0;

    const ptrHash = GetPtrHash(tear);
    v.room.tearsPtrHashes.add(ptrHash);
  }
}
