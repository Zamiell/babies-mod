import { ReadonlyMap } from "isaacscript-common";
import type { Baby } from "../classes/Baby";
import type { RandomBabyType } from "../enums/RandomBabyType";

/** This is filled in `main.ts`. */
export const BABY_CLASS_MAP = new ReadonlyMap<RandomBabyType, Baby>();
