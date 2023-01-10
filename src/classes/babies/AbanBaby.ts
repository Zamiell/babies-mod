import {
  CoinSubType,
  EntityCollisionClass,
  ModCallback,
  PickupVariant,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  GAME_FRAMES_PER_SECOND,
  getRandomInt,
  isFirstPlayer,
  ModCallbackCustom,
  repeat,
  sfxManager,
  spawnCoin,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

const DATA_KEY = "BabiesModRecovery";

/** +2 coins + Sonic-style health. */
export class AbanBaby extends Baby {
  // 11
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (!isFirstPlayer(player)) {
      return undefined;
    }

    const coins = player.GetNumCoins();

    if (coins === 0) {
      player.Kill();
      return;
    }

    player.AddCoins(-999);
    repeat(coins, () => {
      spawnFadingCoinExplodingFromPlayer(player);
    });
    sfxManager.Play(SoundEffect.GOLD_HEART);

    return undefined;
  }

  // 35
  @Callback(ModCallback.POST_PICKUP_UPDATE, PickupVariant.COIN)
  postPickupUpdateCoin(pickup: EntityPickup): void {
    const sprite = pickup.GetSprite();
    const collected = sprite.IsPlaying("Collect");
    const data = pickup.GetData();

    if (
      collected || // Don't mess with coins anymore after we have picked them up.
      data[DATA_KEY] === undefined // We only want to target manually spawned coins.
    ) {
      return;
    }

    if (pickup.FrameCount <= 2 * GAME_FRAMES_PER_SECOND) {
      // Make it impossible for the player to pick up this pickup.
      if (pickup.EntityCollisionClass !== EntityCollisionClass.NONE) {
        pickup.EntityCollisionClass = EntityCollisionClass.NONE;
      }

      // Make it bounce off the player if they get too close.
      if (g.p.Position.Distance(pickup.Position) <= 25) {
        const x = pickup.Position.X - g.p.Position.X;
        const y = pickup.Position.Y - g.p.Position.Y;
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
}

function spawnFadingCoinExplodingFromPlayer(player: EntityPlayer) {
  const randomPosition = Isaac.GetRandomPosition();
  let velocity = player.Position.sub(randomPosition);
  velocity = velocity.Normalized();
  const multiplier = getRandomInt(4, 20);
  velocity = velocity.mul(multiplier);
  const coin = spawnCoin(CoinSubType.PENNY, player.Position, velocity, player);

  // Make it fade away.
  coin.Timeout = 160; // 5.3 seconds

  // We also want it to bounce off the player immediately upon spawning.
  const data = coin.GetData();
  data[DATA_KEY] = true;
}
