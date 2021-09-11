import { setRandomColor } from "../misc";

const functionMap = new Map<int, (npc: EntityNPC) => void>();
export default functionMap;

// Lil' Baby
functionMap.set(36, (npc: EntityNPC) => {
  // Tiny enemies
  npc.Scale = 0.5;
});

// Big Baby
functionMap.set(37, (npc: EntityNPC) => {
  // Everything is giant
  npc.Scale = 2;
});

// 404 Baby
functionMap.set(463, (npc: EntityNPC) => {
  setRandomColor(npc);
});
