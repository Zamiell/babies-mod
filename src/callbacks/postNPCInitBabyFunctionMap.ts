import { setRandomColor } from "../util";

export const postNPCInitBabyFunctionMap = new Map<
  int,
  (npc: EntityNPC) => void
>();

// Lil' Baby
postNPCInitBabyFunctionMap.set(36, (npc: EntityNPC) => {
  // Tiny enemies
  npc.Scale = 0.5;
});

// Big Baby
postNPCInitBabyFunctionMap.set(37, (npc: EntityNPC) => {
  // Everything is giant
  npc.Scale = 2;
});

// 404 Baby
postNPCInitBabyFunctionMap.set(463, (npc: EntityNPC) => {
  setRandomColor(npc);
});
