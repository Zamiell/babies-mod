import { debugFunction } from "../debugFunction";
import g from "../globals";

export function main(cmd: string, params: string): void {
  switch (cmd) {
    // "baby #" will restart as the specified baby
    case "baby": {
      // Check to see if this is a valid baby number
      let babyNum: number | null | undefined = tonumber(params);
      if (babyNum === undefined || babyNum < 0 || babyNum >= g.babies.length) {
        babyNum = null;
      }

      g.debugBabyNum = babyNum;
      Isaac.ConsoleOutput(`Set debug baby to be: ${babyNum}\n`);

      if (babyNum !== null) {
        Isaac.ExecuteCommand("restart");
      }

      break;
    }

    case "babydebug": {
      debugFunction();
      break;
    }

    case "disable": {
      g.debugBabyNum = null;
      Isaac.ExecuteCommand("restart");

      break;
    }

    default: {
      break;
    }
  }
}
