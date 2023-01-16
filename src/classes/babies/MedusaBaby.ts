import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Coins refill bombs and keys when depleted. */
export class MedusaBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    convertCoinsToBombs(player);
    convertCoinsToKeys(player);
  }
}

function convertCoinsToBombs(player: EntityPlayer) {
  const coins = player.GetNumCoins();
  const bombs = player.GetNumBombs();

  if (coins > 0 && bombs === 0) {
    player.AddCoins(-1);
    player.AddBombs(1);
  }
}

function convertCoinsToKeys(player: EntityPlayer) {
  const coins = player.GetNumCoins();
  const keys = player.GetNumKeys();

  if (coins > 0 && keys === 0) {
    player.AddCoins(-1);
    player.AddKeys(1);
  }
}
