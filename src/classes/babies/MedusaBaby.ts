import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Coins refill bombs and keys when depleted. */
export class MedusaBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    convertCoinsToBombs();
    convertCoinsToKeys();
  }
}

function convertCoinsToBombs() {
  const coins = g.p.GetNumCoins();
  const bombs = g.p.GetNumBombs();

  if (coins > 0 && bombs === 0) {
    g.p.AddCoins(-1);
    g.p.AddBombs(1);
  }
}

function convertCoinsToKeys() {
  const coins = g.p.GetNumCoins();
  const keys = g.p.GetNumKeys();

  if (coins > 0 && keys === 0) {
    g.p.AddCoins(-1);
    g.p.AddKeys(1);
  }
}
