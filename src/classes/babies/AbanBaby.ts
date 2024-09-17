import {
  CoinSubType,
  CollectibleType,
  EntityCollisionClass,
  ModCallback,
  PickupVariant,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  GAME_FRAMES_PER_SECOND,
  ModCallbackCustom,
  getRandomInt,
  repeat,
  sfxManager,
  spawnCoin,
} from "isaacscript-common";
import { postNewRoomReorderedNoHealthUI } from "../../utils";
import { Baby } from "../Baby";

const v = {
  room: {
    fadingCoinPtrHashes: new Set<PtrHash>(),
  },
};

/** Sonic the Hedgehog health. */
export class AbanBaby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    const coins = player.GetNumCoins();
    return coins > 0 && !player.HasCollectible(CollectibleType.BLOOD_OATH);
  }

  // 35
  @Callback(ModCallback.POST_PICKUP_UPDATE, PickupVariant.COIN)
  postPickupUpdateCoin(pickup: EntityPickup): void {
    const ptrHash = GetPtrHash(pickup);
    if (!v.room.fadingCoinPtrHashes.has(ptrHash)) {
      return;
    }

    const player = Isaac.GetPlayer();
    const sprite = pickup.GetSprite();
    const collected = sprite.IsPlaying("Collect");

    // Don't mess with coins anymore after we have picked them up.
    if (collected) {
      return;
    }

    if (pickup.FrameCount <= 2 * GAME_FRAMES_PER_SECOND) {
      // Make it impossible for the player to pick up this pickup.
      if (pickup.EntityCollisionClass !== EntityCollisionClass.NONE) {
        pickup.EntityCollisionClass = EntityCollisionClass.NONE;
      }

      // Make it bounce off the player if they get too close.
      if (player.Position.Distance(pickup.Position) <= 25) {
        const x = pickup.Position.X - player.Position.X;
        const y = pickup.Position.Y - player.Position.Y;
        pickup.Velocity = Vector(x / 2, y / 2);
      }

      // Play the custom "Blink" animation.
      if (!sprite.IsPlaying("Blink")) {
        sprite.Play("Blink", true);
      }
    } else {
      // The coin has been spawned for a while, so set the collision back to normal.
      pickup.EntityCollisionClass = EntityCollisionClass.ALL;

      // Stop the custom "Blink" animation.
      if (!sprite.IsPlaying("Idle")) {
        sprite.Play("Idle", true);
      }
    }
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const coins = player.GetNumCoins();

    if (coins === 0) {
      player.Kill();
      return undefined;
    }

    player.AddCoins(-999);
    repeat(coins, () => {
      this.spawnFadingCoinExplodingFromPlayer(player);
    });
    sfxManager.Play(SoundEffect.GOLD_HEART);

    return undefined;
  }

  spawnFadingCoinExplodingFromPlayer(player: EntityPlayer): void {
    const randomPosition = Isaac.GetRandomPosition();
    let velocity = player.Position.sub(randomPosition);
    velocity = velocity.Normalized();
    const multiplier = getRandomInt(4, 20, undefined);
    velocity = velocity.mul(multiplier);
    const coin = spawnCoin(
      CoinSubType.PENNY,
      player.Position,
      velocity,
      player,
    );

    // Make it fade away.
    coin.Timeout = 160; // 5.3 seconds

    // We also want it to bounce off the player immediately upon spawning, so we need to track it.
    const ptrHash = GetPtrHash(coin);
    v.room.fadingCoinPtrHashes.add(ptrHash);
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    postNewRoomReorderedNoHealthUI();
  }
}
