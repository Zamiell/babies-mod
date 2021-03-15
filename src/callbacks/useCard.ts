import * as postRender from "./postRender";

// Card.CARD_EMPRESS (4)
export function empress(): void {
  // Using an Empress card will give us the Whore of Babylon costume,
  // so we have to update the sprite
  postRender.setPlayerSprite();
}

// Card.CARD_HANGED_MAN (5)
export function hangedMan(): void {
  // Using a Hanged Man card gives us flight, so we have to update the sprite
  postRender.setPlayerSprite();
}
