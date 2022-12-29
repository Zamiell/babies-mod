import { Globals } from "./types/Globals";

export const g = new Globals();

// Set a global variable so that other mods can access our scoped global variables.
declare let BabiesModGlobals: Globals;
BabiesModGlobals = g; // eslint-disable-line
