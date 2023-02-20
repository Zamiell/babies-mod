import { game, repeat } from "isaacscript-common";
import { RandomBabyType } from "./enums/RandomBabyType";
import { g } from "./globals";
import { newSprite } from "./sprite";
import { getCurrentBaby } from "./utilsBaby";

const sprites = {
  clock: Sprite(),
  colons: [] as Sprite[], // colon between minutes & seconds, colon between hours & minutes
  digits: [] as Sprite[], // minute1, minute2, second1, second2, hour
  digitMini: Sprite(),
};

export function display(): void {
  const gameFrameCount = game.GetFrameCount();
  const currentBaby = getCurrentBaby();
  if (currentBaby === undefined) {
    return;
  }
  const { babyType } = currentBaby;

  let finishTime: int | undefined;
  if (
    babyType === RandomBabyType.NOOSE || // 39
    babyType === RandomBabyType.VOMIT || // 341
    babyType === RandomBabyType.SCOREBOARD // 474
  ) {
    finishTime = g.run.babyCounters;
  }
  if (finishTime === undefined || finishTime === 0) {
    return;
  }

  // Assume that if there are no elements in the digits array, then no sprites are loaded.
  if (sprites.digits.length === 0) {
    loadSprites();
  }

  // Find out how much time has passed since we got hit.
  const remainingFrames = finishTime - gameFrameCount;
  const remainingSeconds = remainingFrames / 30;
  const { hours, minute1, minute2, second1, second2, tenths } =
    convertSecondsToTimerValues(remainingSeconds);

  const digitLength = 7.25;
  const hourAdjustment = 2;
  let hourAdjustment2 = 0;
  let startingX = 65;
  const startingY = 79;

  const posClock = Vector(startingX + 34, startingY + 45);
  sprites.clock.Render(posClock);

  if (hours > 0) {
    // The format of the time will be "#.##.##" (instead of "##.##", which is the default).
    hourAdjustment2 = 2;
    startingX += digitLength + hourAdjustment;
    const posHours = Vector(
      startingX - digitLength - hourAdjustment,
      startingY,
    );
    const hoursDigitSprite = sprites.digits[4];
    if (hoursDigitSprite !== undefined) {
      hoursDigitSprite.SetFrame("Default", hours);
      hoursDigitSprite.Render(posHours);
    }

    const posColon = Vector(startingX - digitLength + 7, startingY + 19);
    const colonHoursSprite = sprites.colons[1];
    if (colonHoursSprite !== undefined) {
      colonHoursSprite.Render(posColon);
    }
  }

  const posMinute1 = Vector(startingX, startingY);
  const minute1Sprite = sprites.digits[0];
  if (minute1Sprite !== undefined) {
    minute1Sprite.SetFrame("Default", minute1);
    minute1Sprite.Render(posMinute1);
  }

  const posMinute2 = Vector(startingX + digitLength, startingY);
  const minute2Sprite = sprites.digits[1];
  if (minute2Sprite !== undefined) {
    minute2Sprite.SetFrame("Default", minute2);
    minute2Sprite.Render(posMinute2);
  }

  const posColon1 = Vector(startingX + digitLength + 10, startingY + 19);
  const colonMinutesSprite = sprites.colons[0];
  if (colonMinutesSprite !== undefined) {
    colonMinutesSprite.Render(posColon1);
  }

  const posSecond1 = Vector(startingX + digitLength + 11, startingY);
  const second1Sprite = sprites.digits[2];
  if (second1Sprite !== undefined) {
    second1Sprite.SetFrame("Default", second1);
    second1Sprite.Render(posSecond1);
  }

  const posSecond2 = Vector(
    startingX + digitLength + 11 + digitLength + 1 - hourAdjustment2,
    startingY,
  );
  const second2Sprite = sprites.digits[3];
  if (second2Sprite !== undefined) {
    second2Sprite.SetFrame("Default", second2);
    second2Sprite.Render(posSecond2);
  }

  const posTenths = Vector(
    startingX +
      digitLength +
      11 +
      digitLength +
      1 -
      hourAdjustment2 +
      digitLength,
    startingY + 1,
  );
  sprites.digitMini.SetFrame("Default", tenths);
  sprites.digitMini.Render(posTenths);
}

function loadSprites() {
  sprites.clock = newSprite("gfx/timer/clock.anm2");

  repeat(2, () => {
    const colonSprite = newSprite("gfx/timer/colon.anm2");
    sprites.colons.push(colonSprite);
  });

  repeat(5, () => {
    const digitSprite = newSprite("gfx/timer/timer.anm2");
    sprites.digits.push(digitSprite);
  });

  sprites.digitMini = newSprite("gfx/timer/timerMini.anm2");
}

function convertSecondsToTimerValues(totalSeconds: int): {
  hours: int;
  minute1: int;
  minute2: int;
  second1: int;
  second2: int;
  tenths: int;
} {
  // Calculate the hours digit.
  const hours = math.floor(totalSeconds / 3600);

  // Calculate the minutes digits.
  let minutes = math.floor(totalSeconds / 60);
  if (hours > 0) {
    minutes -= hours * 60;
  }
  const minutesStringUnpadded = minutes.toString();
  const minutesString = minutesStringUnpadded.padStart(2, "0");

  // The first character.
  const minute1String = minutesString[0] ?? "0";
  const minute1 = tonumber(minute1String);
  if (minute1 === undefined) {
    error("Failed to parse the first minute of the timer.");
  }

  // The second character.
  const minute2String = minutesString[1] ?? "0";
  const minute2 = tonumber(minute2String);
  if (minute2 === undefined) {
    error("Failed to parse the second minute of the timer.");
  }

  // Calculate the seconds digits.
  const seconds = math.floor(totalSeconds % 60);
  const secondsStringUnpadded = seconds.toString();
  const secondsString = secondsStringUnpadded.padStart(2, "0");

  // The first character.
  const second1String = secondsString[0] ?? "0";
  const second1 = tonumber(second1String);
  if (second1 === undefined) {
    error("Failed to parse the first second of the timer.");
  }

  // The second character.
  const second2String = secondsString[1] ?? "0";
  const second2 = tonumber(second2String);
  if (second2 === undefined) {
    error("Failed to parse the second second of the timer.");
  }

  // Calculate the tenths digit.
  const rawSeconds = totalSeconds % 60; // 0.000 to 59.999
  const decimals = rawSeconds - math.floor(rawSeconds);
  const tenths = math.floor(decimals * 10);

  return { hours, minute1, minute2, second1, second2, tenths };
}
