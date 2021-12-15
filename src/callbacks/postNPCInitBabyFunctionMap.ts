import { setEntityRandomColor } from "isaacscript-common";

export const postNPCInitBabyFunctionMap = new Map<
  int,
  (npc: EntityNPC) => void
>();

// Lil' Baby
postNPCInitBabyFunctionMap.set(36, (npc: EntityNPC) => {
  // Everything is giant
  npc.Scale = 0.5;
});

// Big Baby
postNPCInitBabyFunctionMap.set(37, (npc: EntityNPC) => {
  // Everything is giant
  npc.Scale = 2;
});

// Colorful Baby
postNPCInitBabyFunctionMap.set(42, (npc: EntityNPC) => {
  setEntityRandomColor(npc);
});
