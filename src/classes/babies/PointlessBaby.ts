import {
  CardType,
  LevelStage,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  isQuestCollectible,
  onEffectiveStage,
  onFirstFloor,
  repeat,
  spawnCard,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Items are replaced with N cards. */
export class PointlessBaby extends Baby {
  /**
   * - Ban it on the first floor so that it does not conflict with resetting for a Treasure Room
   *   item.
   * - Ban it on the second floor so that it does not conflict with the first devil deal.
   */
  override isValid(): boolean {
    return !onFirstFloor() && !onEffectiveStage(LevelStage.BASEMENT_2);
  }

  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariant.COLLECTIBLE)
  postPickupInitCollectible(pickup: EntityPickup): void {
    const collectible = pickup as EntityPickupCollectible;
    const num = this.getAttribute("num");

    if (isQuestCollectible(collectible.SubType)) {
      return;
    }

    collectible.Remove();
    repeat(num, () => {
      // Spawn the cards at an offset so that they do not appear on top of each other.
      const offset = RandomVector().mul(0.01);
      const position = collectible.Position.add(offset);
      spawnCard(CardType.NULL, position);
    });
  }
}
