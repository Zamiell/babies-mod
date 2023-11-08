import type { NullItemID, PlayerType } from "isaac-typescript-definitions";

export function Init(mod: Mod): void;

export function AddPlayer(
  player: EntityPlayer,
  playerType: PlayerType,
  spritesheetPath: string,
  flightCostumeNullItemID?: NullItemID,
  flightSpritesheetPath?: string,
  additionalCostumeNullItemID?: NullItemID,
): void;

// ts-prune-ignore-next-line
export function RemoveAllPlayer(player: EntityPlayer): void;

// ts-prune-ignore-next-line
export function RemovePlayer(
  player: EntityPlayer,
  playerType: PlayerType,
): void;

export function UpdatePlayer(
  player: EntityPlayer,
  playerType: PlayerType,
  spritesheetPath?: string,
  flightCostumeNullItemID?: NullItemID,
  flightSpritesheetPath?: string,
  additionalCostumeNullItemID?: NullItemID,
): void;
