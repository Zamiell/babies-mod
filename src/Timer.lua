local Timer = {}

-- Includes
local g = require("src/globals")

-- Variables
Timer.sprites = {}

function Timer:Display()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  local finishTime
  if baby.name == "Noose Baby" or -- 39
     baby.name == "Vomit Baby" or -- 341
     baby.name == "Scoreboard Baby" then -- 474

    finishTime = g.run.babyCounters
  end
  if finishTime == nil or finishTime == 0 then
    return
  end

  Timer:LoadSprites()

  -- Find out how much time has passed since we got hit
  local remainingTime = finishTime - gameFrameCount
  remainingTime = remainingTime / 30 -- Convert frames to seconds
  local timeTable = Timer:ConvertTimeToString(remainingTime)

  local digitLength = 7.25
  local hourAdjustment = 2
  local hourAdjustment2 = 0
  local startingX = 65
  local startingY = 79

  local posClock = Vector(startingX + 34, startingY + 45)
  Timer.sprites.clock:RenderLayer(0, posClock)

  if timeTable[1] > 0 then
    -- The format is "#:##:##" instead of "##:##"
    hourAdjustment2 = 2
    startingX = startingX + digitLength + hourAdjustment
    local posHours = Vector(startingX - digitLength - hourAdjustment, startingY)
    Timer.sprites.digit[5]:SetFrame("Default", tostring(timeTable[1]))
    Timer.sprites.digit[5]:RenderLayer(0, posHours)

    local poscolon = Vector(startingX - digitLength + 7, startingY + 19)
    Timer.sprites.colon[2]:RenderLayer(0, poscolon)
  end

  local posMinute1 = Vector(startingX, startingY)
  Timer.sprites.digit[1]:SetFrame("Default", timeTable[2])
  Timer.sprites.digit[1]:RenderLayer(0, posMinute1)

  local posMinute2 = Vector(startingX + digitLength, startingY)
  Timer.sprites.digit[2]:SetFrame("Default", timeTable[3])
  Timer.sprites.digit[2]:RenderLayer(0, posMinute2)

  local posColon1 = Vector(startingX + digitLength + 10, startingY + 19)
  Timer.sprites.colon[1]:RenderLayer(0, posColon1)

  local posSecond1 = Vector(startingX + digitLength + 11, startingY)
  Timer.sprites.digit[3]:SetFrame("Default", timeTable[4])
  Timer.sprites.digit[3]:RenderLayer(0, posSecond1)

  local posSecond2 = Vector(startingX + digitLength + 11 + digitLength + 1 - hourAdjustment2, startingY)
  Timer.sprites.digit[4]:SetFrame("Default", timeTable[5])
  Timer.sprites.digit[4]:RenderLayer(0, posSecond2)

  local posTenths = Vector(startingX + digitLength + 11 + digitLength + 1 - hourAdjustment2 + digitLength,
                           startingY + 1)
  Timer.sprites.digitMini:SetFrame("Default", timeTable[6])
  Timer.sprites.digitMini:RenderLayer(0, posTenths)
end

function Timer:LoadSprites()
  -- Load the sprites
  if Timer.sprites.clock == nil then
    Timer.sprites.clock = Sprite()
    Timer.sprites.clock:Load("gfx/timer/clock.anm2", true)
    Timer.sprites.clock:SetFrame("Default", 0)

    Timer.sprites.colon = {}
    for i = 1, 2 do
      Timer.sprites.colon[i] = Sprite()
      Timer.sprites.colon[i]:Load("gfx/timer/colon.anm2", true)
      Timer.sprites.colon[i]:SetFrame("Default", 0)
    end

    Timer.sprites.digit = {}
    for i = 1, 5 do
      Timer.sprites.digit[i] = Sprite()
      Timer.sprites.digit[i]:Load("gfx/timer/timer.anm2", true)
      Timer.sprites.digit[i]:SetFrame("Default", 0)
    end

    Timer.sprites.digitMini = Sprite()
    Timer.sprites.digitMini:Load("gfx/timer/timerMini.anm2", true)
    Timer.sprites.digitMini:SetFrame("Default", 0)
  end
end

function Timer:ConvertTimeToString(time)
  -- Calcuate the hours digit
  local hours = math.floor(time / 3600)

  -- Calcuate the minutes digits
  local minutes = math.floor(time / 60)
  if hours > 0 then
    minutes = minutes - hours * 60
  end
  if minutes < 10 then
    minutes = "0" .. tostring(minutes)
  else
    minutes = tostring(minutes)
  end
  local minute1 = string.sub(minutes, 1, 1) -- The first character
  local minute2 = string.sub(minutes, 2, 2) -- The second character

  -- Calcuate the seconds digits
  local seconds = math.floor(time % 60)
  if seconds < 10 then
    seconds = "0" .. tostring(seconds)
  else
    seconds = tostring(seconds)
  end
  local second1 = string.sub(seconds, 1, 1) -- The first character
  local second2 = string.sub(seconds, 2, 2) -- The second character

  -- Calculate the tenths digit
  local rawSeconds = time % 60 -- 0.000 to 59.999
  local decimals = rawSeconds - math.floor(rawSeconds)
  local tenths = math.floor(decimals * 10)

  return {
    hours,
    minute1,
    minute2,
    second1,
    second2,
    tenths,
  }
end

return Timer
