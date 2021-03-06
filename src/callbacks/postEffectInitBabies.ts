import g from "../globals";
import { setRandomColor } from "../misc";

const functionMap = new Map<int, (effect: EntityEffect) => void>();
export default functionMap;

// Blue Baby
functionMap.set(30, (effect: EntityEffect) => {
  // Get rid of the poof effect that occurs when a Sprinkler is summoned
  if (effect.Variant === EffectVariant.POOF01 && g.run.babyBool) {
    g.run.babyBool = false;
    effect.Remove();
  }
});

// Fang Demon Baby
functionMap.set(281, (effect: EntityEffect) => {
  // By default, the Marked target spawns at the center of the room,
  // and we want it to be spawned at the player instead
  // If we change the position here, it won't work, so make the effect invisible in the meantime
  if (effect.Variant === EffectVariant.TARGET) {
    effect.Visible = false;
  }
});

// 404 Baby
functionMap.set(463, (effect: EntityEffect) => {
  setRandomColor(effect);
});
