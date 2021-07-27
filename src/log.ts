import g from "./globals";

export default function log(msg: string): void {
  Isaac.DebugString(msg);
}

export function debugLog(callbackName: string, begin: boolean): void {
  if (!g.debugLogging) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();
  const isaacFrameCount = Isaac.GetFrameCount();
  const verb = begin ? "begin" : "end";

  log(
    `${callbackName} ${verb} (game frame ${gameFrameCount}) (isaac frame ${isaacFrameCount})`,
  );
}
