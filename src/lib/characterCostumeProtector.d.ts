import { NullItemID, PlayerType } from "isaac-typescript-definitions";

export function Init(mod: Mod): void;

export function AddPlayer(
  player: EntityPlayer,
  playerType: PlayerType | int,
  spritesheetPath: string,
  flightCostumeNullItemID?: NullItemID | int,
  flightSpritesheetPath?: string,
  additionalCostumeNullItemID?: NullItemID | int,
): void;

export function UpdatePlayer(
  player: EntityPlayer,
  playerType: PlayerType | int,
  spritesheetPath?: string,
  flightCostumeNullItemID?: NullItemID | int,
  flightSpritesheetPath?: string,
  additionalCostumeNullItemID?: NullItemID | int,
): void;
