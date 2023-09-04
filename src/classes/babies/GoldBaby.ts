import type { EntityType } from "isaac-typescript-definitions";
import {
  BombSubType,
  BombVariant,
  ChestSubType,
  CoinSubType,
  GridEntityType,
  GridEntityXMLType,
  HeartSubType,
  KeySubType,
  ModCallback,
  PickupVariant,
  PillColor,
  PoopGridEntityVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  getGoldenTrinketType,
  isChest,
  isGoldenTrinketType,
  isHorsePill,
  isPoopGridEntityType,
  spawnBombWithSeed,
} from "isaacscript-common";
import { Baby } from "../Baby";

/**
 * Gold gear + gold pickups + gold poops + gold rooms.
 *
 * For pickup replacement, we do not use the `PRE_ENTITY_SPAWN` callback because that does not work
 * properly for random pickups that are part of the room layout (as demonstrated on seed 61RT H2V3
 * by walking down from the starting room).
 */
export class GoldBaby extends Baby {
  override onAdd(player: EntityPlayer): void {
    player.AddGoldenHearts(12);
    player.AddGoldenBomb();
    player.AddGoldenKey();
  }

  // 34
  @Callback(ModCallback.POST_PICKUP_INIT)
  postPickupInit(pickup: EntityPickup): void {
    if (isChest(pickup) && pickup.Variant !== PickupVariant.LOCKED_CHEST) {
      pickup.Morph(
        pickup.Type,
        PickupVariant.LOCKED_CHEST,
        ChestSubType.CLOSED,
        true,
        true,
      );
    }
  }

  // 71
  @Callback(ModCallback.PRE_ROOM_ENTITY_SPAWN)
  preRoomEntitySpawn(
    entityTypeOrGridEntityXMLType: EntityType | GridEntityXMLType,
    _variant: int,
    _subType: int,
    _gridIndex: int,
    _seed: Seed,
  ): [EntityType | GridEntityXMLType, int, int] | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (entityTypeOrGridEntityXMLType < 1000) {
      return undefined;
    }

    const gridEntityXMLType =
      entityTypeOrGridEntityXMLType as GridEntityXMLType;

    if (
      isPoopGridEntityType(gridEntityXMLType) &&
      gridEntityXMLType !== GridEntityXMLType.POOP_GOLDEN
    ) {
      return [GridEntityXMLType.POOP_GOLDEN, 0, 0];
    }

    return undefined;
  }

  // 10
  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_INIT_FILTER,
    PickupVariant.HEART,
  )
  postPickupInitHeart(pickup: EntityPickup): void {
    const heart = pickup as EntityPickupHeart;

    if (heart.SubType !== HeartSubType.GOLDEN) {
      heart.Morph(heart.Type, heart.Variant, HeartSubType.GOLDEN, true, true);
    }
  }

  // 20
  @CallbackCustom(ModCallbackCustom.POST_PICKUP_INIT_FILTER, PickupVariant.COIN)
  postPickupInitCoin(pickup: EntityPickup): void {
    const coin = pickup as EntityPickupCoin;

    if (coin.SubType !== CoinSubType.GOLDEN) {
      coin.Morph(coin.Type, coin.Variant, CoinSubType.GOLDEN, true, true);
    }
  }

  // 30
  @CallbackCustom(ModCallbackCustom.POST_PICKUP_INIT_FILTER, PickupVariant.KEY)
  postPickupInitKey(pickup: EntityPickup): void {
    const key = pickup as EntityPickupKey;

    if (key.SubType !== KeySubType.GOLDEN) {
      key.Morph(key.Type, key.Variant, KeySubType.GOLDEN, true, true);
    }
  }

  // 40
  @CallbackCustom(ModCallbackCustom.POST_PICKUP_INIT_FILTER, PickupVariant.BOMB)
  postPickupInitBomb(pickup: EntityPickup): void {
    const bomb = pickup as EntityPickupBomb;

    if (bomb.SubType !== BombSubType.GOLDEN) {
      bomb.Morph(bomb.Type, bomb.Variant, BombSubType.GOLDEN, true, true);
    }
  }

  // 70
  @CallbackCustom(ModCallbackCustom.POST_PICKUP_INIT_FILTER, PickupVariant.PILL)
  postPickupInitPill(pickup: EntityPickup): void {
    const pill = pickup as EntityPickupPill;
    const goldPillColor = isHorsePill(pill.SubType)
      ? PillColor.HORSE_GOLD
      : PillColor.GOLD;

    if (pill.SubType !== goldPillColor) {
      pill.Morph(pill.Type, pill.Variant, goldPillColor, true, true);
    }
  }

  // 350
  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_INIT_FILTER,
    PickupVariant.TRINKET,
  )
  postPickupInitTrinket(pickup: EntityPickup): void {
    const trinket = pickup as EntityPickupTrinket;

    if (!isGoldenTrinketType(trinket.SubType)) {
      const goldenTrinketType = getGoldenTrinketType(trinket.SubType);
      trinket.Morph(
        trinket.Type,
        trinket.Variant,
        goldenTrinketType,
        true,
        true,
      );
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_BOMB_INIT_FILTER, BombVariant.TROLL)
  postBombInitTroll(bomb: EntityBomb): void {
    if (bomb.Variant === BombVariant.TROLL) {
      bomb.Remove();
      spawnBombWithSeed(
        BombVariant.GOLDEN_TROLL,
        0,
        bomb.Position,
        bomb.InitSeed,
      );
    }
  }

  /**
   * We handle poops that are part of the room layout in the `PRE_ROOM_ENTITY_SPAWN` callback above.
   * However, we also want to handle poops from e.g. The Poop collectible and Larry Jr.
   */
  @CallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_UPDATE,
    GridEntityType.POOP,
  )
  postGridEntityUpdatePoop(gridEntity: GridEntity): void {
    const gridEntityPoop = gridEntity as GridEntityPoop;
    const gridEntityVariant = gridEntityPoop.GetVariant();

    if (gridEntityVariant !== PoopGridEntityVariant.GOLDEN) {
      gridEntity.SetVariant(PoopGridEntityVariant.GOLDEN);
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const room = game.GetRoom();
    room.TurnGold();
  }
}
