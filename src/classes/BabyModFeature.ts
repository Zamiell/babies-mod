import { ModFeature } from "isaacscript-common";
import { g } from "../globals";

export class BabyModFeature extends ModFeature {
  override shouldCallbackMethodsFire = (): boolean => g.run.babyType !== null;
}
