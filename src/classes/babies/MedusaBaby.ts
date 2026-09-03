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

  if (bombs === 0 && coins > 0) {
    player.AddCoins(-1);
    player.AddBombs(1);
  }
}

function convertCoinsToKeys(player: EntityPlayer) {
  const coins = player.GetNumCoins();
  const keys = player.GetNumKeys();

  if (keys === 0 && coins > 0) {
    player.AddCoins(-1);
    player.AddKeys(1);
  }
}
