import { NullItemID, PlayerType } from "isaac-typescript-definitions";

export function Init(mod: Mod): void;

export function AddPlayer(
  player: EntityPlayer,
  playerType: PlayerType,
  spritesheetPath: string,
  flightCostumeNullItemID?: NullItemID,
  flightSpritesheetPath?: string,
  additionalCostumeNullItemID?: NullItemID,
): void;

export function UpdatePlayer(
  player: EntityPlayer,
  playerType: PlayerType,
  spritesheetPath?: string,
  flightCostumeNullItemID?: NullItemID,
  flightSpritesheetPath?: string,
  additionalCostumeNullItemID?: NullItemID,
): void;
