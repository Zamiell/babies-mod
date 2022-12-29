import { Globals } from "./types/Globals";

const g = new Globals();
export default g;

// Set a global variable so that other mods can access our scoped global variables.
declare let BabiesModGlobals: Globals;
BabiesModGlobals = g; // eslint-disable-line
