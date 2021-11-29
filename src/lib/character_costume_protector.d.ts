export function AddPlayer(
  playerType: PlayerType | int,
  spritesheetPath: string,
  flightCostumeNullID?: NullItemID | int,
): void;

export function UpdatePlayer(
  player: EntityPlayer,
  playerType: PlayerType | int,
  shouldUpdateWhitelist: boolean,
  spritesheetPath?: string,
  flightCostumeNullID?: NullItemID | int,
  flightSpritesheetPath?: string,
  costumeExtra?: NullItemID | int,
): void;

export function init(mod: Mod): void;
export function initPlayerCostume(player: EntityPlayer): void;

/**
 * Use this to force a costume update and make the player return to a state without any costumes.
 */
export function stopNewRoomCostumes(player: EntityPlayer): void;
