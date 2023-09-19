import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, repeat } from "isaacscript-common";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

const v = {
  room: {
    tearPtrHashes: new Set<PtrHash>(),
  },
};

/** X splitting tears. */
export class SpeakerBaby extends Baby {
  v = v;

  /** Certain collectibles make the baby too dangerous. */
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.IPECAC);
  }

  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    const ptrHash = GetPtrHash(tear);
    if (v.room.tearPtrHashes.has(ptrHash)) {
      return;
    }

    if (tear.FrameCount >= 20) {
      tear.Remove();
      spawnXTears(player, tear);
    }
  }
}

function spawnXTears(player: EntityPlayer, tear: EntityTear) {
  let rotation = 45;
  repeat(4, () => {
    rotation += 90;
    const rotatedVelocity = tear.Velocity.Rotated(rotation);
    const xTear = player.FireTear(
      player.Position,
      rotatedVelocity,
      false,
      true,
      false,
    );
    xTear.Position = tear.Position;
    xTear.Height = tear.Height;

    const ptrHash = GetPtrHash(xTear);
    v.room.tearPtrHashes.add(ptrHash);
  });
}
