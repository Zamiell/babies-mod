import { EntityCollisionClass } from "isaac-typescript-definitions";
import { RandomBabyType } from "../enums/RandomBabyType";

export const postKnifeInitBabyFunctionMap = new Map<
  RandomBabyType,
  (knife: EntityKnife) => void
>();

// 561
postKnifeInitBabyFunctionMap.set(
  RandomBabyType.BROTHER_BOBBY,
  (knife: EntityKnife) => {
    // Make the knife invisible.
    knife.EntityCollisionClass = EntityCollisionClass.NONE;
    knife.Visible = false;
  },
);
