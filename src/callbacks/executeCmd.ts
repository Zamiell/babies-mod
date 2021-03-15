import g from "../globals";

export function main(cmd: string, params: string): void {
  switch (cmd) {
    // "baby #" will restart as the specified baby
    // "baby2 #" will just set the next baby as the specified one
    case "baby":
    case "baby2": {
      // Check to see if this is a valid baby number
      let babyNum = tonumber(params);
      if (babyNum === undefined) {
        babyNum = 0;
      } else if (babyNum < 0 || babyNum > g.babies.length) {
        babyNum = 0;
      }

      // Manually set the next baby
      g.debugBabyNum = babyNum;
      Isaac.ConsoleOutput(`Set baby to be: ${babyNum}\n`);

      // Automatically restart the game
      if (cmd === "baby" && params !== "0") {
        Isaac.ExecuteCommand("restart");
      }

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
