import * as postRender from "./postRender";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_USE_CARD, empress, Card.CARD_EMPRESS); // 4
  mod.AddCallback(ModCallbacks.MC_USE_CARD, hangedMan, Card.CARD_HANGED_MAN); // 5
}

// Card.CARD_EMPRESS (4)
function empress() {
  // Using an Empress card will give us the Whore of Babylon costume,
  // so we have to update the sprite
  postRender.setPlayerSprite();
}

// Card.CARD_HANGED_MAN (5)
function hangedMan() {
  // Using a Hanged Man card gives us flight, so we have to update the sprite
  postRender.setPlayerSprite();
}
