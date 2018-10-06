local SPCTimer = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- Variables
SPCTimer.sprites = {}

function SPCTimer:Display()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  local finishTime
  if baby.name == "Vomit Baby" then -- 341
    finishTime = SPCGlobals.run.vomitBabyTimer
  elseif baby.name == "Little Steven" then -- 526
    finishTime = SPCGlobals.run.littleStevenTimer
  end
  if finishTime == nil or finishTime == 0 then
    return
  end

  SPCTimer:LoadSprites()

  -- Find out how much time has passed since we got hit
  local remainingTime = finishTime - gameFrameCount
  remainingTime = remainingTime / 30 -- Convert frames to seconds
  local timeTable = SPCTimer:ConvertTimeToString(remainingTime)

  local digitLength = 7.25
  local hourAdjustment = 2
  local hourAdjustment2 = 0
  local startingX = 65
  local startingY = 79

  local posClock = Vector(startingX + 34, startingY + 45)
  SPCTimer.sprites.clock:RenderLayer(0, posClock)

  if timeTable[1] > 0 then
    -- The format is "#:##:##" instead of "##:##"
    hourAdjustment2 = 2
    startingX = startingX + digitLength + hourAdjustment
    local posHours = Vector(startingX - digitLength - hourAdjustment, startingY)
    SPCTimer.sprites.digit[5]:SetFrame("Default", tostring(timeTable[1]))
    SPCTimer.sprites.digit[5]:RenderLayer(0, posHours)

    local poscolon = Vector(startingX - digitLength + 7, startingY + 19)
    SPCTimer.sprites.colon[2]:RenderLayer(0, poscolon)
  end

  local posMinute1 = Vector(startingX, startingY)
  SPCTimer.sprites.digit[1]:SetFrame("Default", timeTable[2])
  SPCTimer.sprites.digit[1]:RenderLayer(0, posMinute1)

  local posMinute2 = Vector(startingX + digitLength, startingY)
  SPCTimer.sprites.digit[2]:SetFrame("Default", timeTable[3])
  SPCTimer.sprites.digit[2]:RenderLayer(0, posMinute2)

  local posColon1 = Vector(startingX + digitLength + 10, startingY + 19)
  SPCTimer.sprites.colon[1]:RenderLayer(0, posColon1)

  local posSecond1 = Vector(startingX + digitLength + 11, startingY)
  SPCTimer.sprites.digit[3]:SetFrame("Default", timeTable[4])
  SPCTimer.sprites.digit[3]:RenderLayer(0, posSecond1)

  local posSecond2 = Vector(startingX + digitLength + 11 + digitLength + 1 - hourAdjustment2, startingY)
  SPCTimer.sprites.digit[4]:SetFrame("Default", timeTable[5])
  SPCTimer.sprites.digit[4]:RenderLayer(0, posSecond2)

  local posTenths = Vector(startingX + digitLength + 11 + digitLength + 1 - hourAdjustment2 + digitLength,
                           startingY + 1)
  SPCTimer.sprites.digitMini:SetFrame("Default", timeTable[6])
  SPCTimer.sprites.digitMini:RenderLayer(0, posTenths)
end

function SPCTimer:LoadSprites()
  -- Load the sprites
  if SPCTimer.sprites.clock == nil then
    SPCTimer.sprites.clock = Sprite()
    SPCTimer.sprites.clock:Load("gfx/timer/clock.anm2", true)
    SPCTimer.sprites.clock:SetFrame("Default", 0)

    SPCTimer.sprites.colon = {}
    for i = 1, 2 do
      SPCTimer.sprites.colon[i] = Sprite()
      SPCTimer.sprites.colon[i]:Load("gfx/timer/colon.anm2", true)
      SPCTimer.sprites.colon[i]:SetFrame("Default", 0)
    end

    SPCTimer.sprites.digit = {}
    for i = 1, 5 do
      SPCTimer.sprites.digit[i] = Sprite()
      SPCTimer.sprites.digit[i]:Load("gfx/timer/timer.anm2", true)
      SPCTimer.sprites.digit[i]:SetFrame("Default", 0)
    end

    SPCTimer.sprites.digitMini = Sprite()
    SPCTimer.sprites.digitMini:Load("gfx/timer/timerMini.anm2", true)
    SPCTimer.sprites.digitMini:SetFrame("Default", 0)
  end
end

function SPCTimer:ConvertTimeToString(time)
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

return SPCTimer
