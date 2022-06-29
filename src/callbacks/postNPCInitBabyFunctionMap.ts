import { setEntityRandomColor } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";

export const postNPCInitBabyFunctionMap = new Map<
  RandomBabyType,
  (npc: EntityNPC) => void
>();

// 36
postNPCInitBabyFunctionMap.set(RandomBabyType.LIL, (npc: EntityNPC) => {
  // Everything is giant
  npc.Scale = 0.5;
});

// 37
postNPCInitBabyFunctionMap.set(RandomBabyType.BIG, (npc: EntityNPC) => {
  // Everything is giant
  npc.Scale = 2;
});

// 42
postNPCInitBabyFunctionMap.set(RandomBabyType.COLORFUL, (npc: EntityNPC) => {
  setEntityRandomColor(npc);
});
