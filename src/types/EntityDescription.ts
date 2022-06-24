import { EntityType } from "isaac-typescript-definitions";

export interface EntityDescription {
  type: EntityType;
  variant: int;
  subType: int;
}
