import g from "./globals";

export function updateCachedAPIFunctions(): void {
  // Update some cached API functions. If we don't do this on every frame, the game can crash.
  g.l = g.g.GetLevel();
  g.r = g.g.GetRoom();
  const player = Isaac.GetPlayer();
  if (player !== undefined) {
    g.p = player;
  }
  g.seeds = g.g.GetSeeds();
  g.itemPool = g.g.GetItemPool();
}

export function updateCachedPlayer(player: EntityPlayer): void {
  // Cache the player object so that we don't have to repeatedly call the `Isaac.GetPlayer` method.
  g.p = player;
}
