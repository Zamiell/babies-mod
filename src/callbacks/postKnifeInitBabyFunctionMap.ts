import { EntityCollisionClass } from "isaac-typescript-definitions";
import { RandomBabyType } from "../enums/RandomBabyType";

export const postKnifeInitBabyFunctionMap = new Map<
  int,
  (knife: EntityKnife) => void
>();

// Brother Bobby
postKnifeInitBabyFunctionMap.set(
  RandomBabyType.BROTHER_BOBBY,
  (knife: EntityKnife) => {
    // Make the knife invisible.
    knife.EntityCollisionClass = EntityCollisionClass.NONE;
    knife.Visible = false;
  },
);
