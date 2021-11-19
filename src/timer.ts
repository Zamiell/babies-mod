import g from "./globals";
import { getCurrentBaby } from "./util";

// Variables
const sprites = {
  clock: Sprite(),
  colons: [] as Sprite[], // colon between minutes & seconds, colon between hours & minutes
  digits: [] as Sprite[], // minute1, minute2, second1, second2, hour
  digitMini: Sprite(),
};

export function display(): void {
  const gameFrameCount = g.g.GetFrameCount();
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  let finishTime: int | undefined;
  if (
    baby.name === "Noose Baby" || // 39
    baby.name === "Vomit Baby" || // 341
    baby.name === "Scoreboard Baby" // 474
  ) {
    finishTime = g.run.babyCounters;
  }
  if (finishTime === undefined || finishTime === 0) {
    return;
  }

  // Assume that if there are no elements in the digits array, then no sprites are loaded
  if (sprites.digits.length === 0) {
    loadSprites();
  }

  // Find out how much time has passed since we got hit
  const remainingFrames = finishTime - gameFrameCount;
  const remainingSeconds = remainingFrames / 30;
  const [hours, minute1, minute2, second1, second2, tenths] =
    convertSecondsToStrings(remainingSeconds);

  const digitLength = 7.25;
  const hourAdjustment = 2;
  let hourAdjustment2 = 0;
  let startingX = 65;
  const startingY = 79;

  const posClock = Vector(startingX + 34, startingY + 45);
  sprites.clock.RenderLayer(0, posClock);

  if (hours > 0) {
    // The format of the time will be "#.##.##" (instead of "##.##", which is the default)
    hourAdjustment2 = 2;
    startingX += digitLength + hourAdjustment;
    const posHours = Vector(
      startingX - digitLength - hourAdjustment,
      startingY,
    );
    const hoursDigitSprite = sprites.digits[4];
    hoursDigitSprite.SetFrame("Default", hours);
    hoursDigitSprite.RenderLayer(0, posHours);

    const posColon = Vector(startingX - digitLength + 7, startingY + 19);
    const colonHoursSprite = sprites.colons[1];
    colonHoursSprite.RenderLayer(0, posColon);
  }

  const posMinute1 = Vector(startingX, startingY);
  const minute1Sprite = sprites.digits[0];
  minute1Sprite.SetFrame("Default", minute1);
  minute1Sprite.RenderLayer(0, posMinute1);

  const posMinute2 = Vector(startingX + digitLength, startingY);
  const minute2Sprite = sprites.digits[1];
  minute2Sprite.SetFrame("Default", minute2);
  minute2Sprite.RenderLayer(0, posMinute2);

  const posColon1 = Vector(startingX + digitLength + 10, startingY + 19);
  const colonMinutesSprite = sprites.colons[0];
  colonMinutesSprite.RenderLayer(0, posColon1);

  const posSecond1 = Vector(startingX + digitLength + 11, startingY);
  const second1Sprite = sprites.digits[2];
  second1Sprite.SetFrame("Default", second1);
  second1Sprite.RenderLayer(0, posSecond1);

  const posSecond2 = Vector(
    startingX + digitLength + 11 + digitLength + 1 - hourAdjustment2,
    startingY,
  );
  const second2Sprite = sprites.digits[3];
  second2Sprite.SetFrame("Default", second2);
  second2Sprite.RenderLayer(0, posSecond2);

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
  sprites.digitMini.RenderLayer(0, posTenths);
}

function loadSprites() {
  // The sprites have not been loaded yet, so load them
  sprites.clock = Sprite();
  sprites.clock.Load("gfx/timer/clock.anm2", true);
  sprites.clock.SetFrame("Default", 0);

  for (let i = 0; i < 2; i++) {
    const colonSprite = Sprite();
    colonSprite.Load("gfx/timer/colon.anm2", true);
    colonSprite.SetFrame("Default", 0);
    sprites.colons.push(colonSprite);
  }

  for (let i = 0; i < 5; i++) {
    const digitSprite = Sprite();
    digitSprite.Load("gfx/timer/timer.anm2", true);
    digitSprite.SetFrame("Default", 0);
    sprites.digits.push(digitSprite);
  }

  sprites.digitMini = Sprite();
  sprites.digitMini.Load("gfx/timer/timerMini.anm2", true);
  sprites.digitMini.SetFrame("Default", 0);
}

function convertSecondsToStrings(totalSeconds: int) {
  // Calculate the hours digit
  const hours = math.floor(totalSeconds / 3600);

  // Calculate the minutes digits
  let minutes = math.floor(totalSeconds / 60);
  if (hours > 0) {
    minutes -= hours * 60;
  }
  let minutesString: string;
  if (minutes < 10) {
    minutesString = `0${minutes}`;
  } else {
    minutesString = minutes.toString();
  }

  // The first character
  const minute1String = string.sub(minutesString, 1, 1);
  const minute1 = parseInt(minute1String, 10);

  // The second character
  const minute2String = string.sub(minutesString, 2, 2);
  const minute2 = parseInt(minute2String, 10);

  // Calculate the seconds digits
  const seconds = math.floor(totalSeconds % 60);
  let secondsString: string;
  if (seconds < 10) {
    secondsString = `0${seconds}`;
  } else {
    secondsString = seconds.toString();
  }

  // The first character
  const second1String = string.sub(secondsString, 1, 1);
  const second1 = parseInt(second1String, 10);

  // The second character
  const second2String = string.sub(secondsString, 2, 2);
  const second2 = parseInt(second2String, 10);

  // Calculate the tenths digit
  const rawSeconds = totalSeconds % 60; // 0.000 to 59.999
  const decimals = rawSeconds - math.floor(rawSeconds);
  const tenths = math.floor(decimals * 10);

  return [hours, minute1, minute2, second1, second2, tenths];
}
