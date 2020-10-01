local PostNewLevel = {}

-- Includes
local g = require("babies_mod/globals")
local BabyRemove = require("babies_mod/babyremove")
local BabyCheckValid = require("babies_mod/babycheckvalid")
local BabyAdd = require("babies_mod/babyadd")
local PostNewRoom = require("babies_mod/postnewroom")

-- ModCallbacks.MC_POST_NEW_LEVEL (18)
function PostNewLevel:Main()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  Isaac.DebugString("MC_POST_NEW_LEVEL (BM)")

  -- Make sure the callbacks run in the right order
  -- (naturally, PostNewLevel gets called before the PostGameStarted callbacks)
  if gameFrameCount == 0 then
    return
  end

  PostNewLevel:NewLevel()
end

function PostNewLevel:NewLevel()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local stage = g.l:GetStage()
  local stageType = g.l:GetStageType()
  local challenge = Isaac.GetChallenge()

  Isaac.DebugString("MC_POST_NEW_LEVEL2 (BM)")

  -- Racing+ has a feature to remove duplicate rooms,
  -- so it may reseed the floor immediately upon reach it
  -- If so, then we don't want to do anything, since this isn't really a new level
  if (
    gameFrameCount ~= 0
    and gameFrameCount == g.run.currentFloorFrame
  ) then
    return
  end

  -- Set the new floor
  g.run.currentFloor = stage
  g.run.currentFloorType = stageType
  g.run.currentFloorFrame = gameFrameCount
  g.run.currentFloorRoomsEntered = 0
  g.run.trinketGone = false
  g.run.blindfoldedApplied = false
  g.run.showIntroFrame = gameFrameCount + 60 -- 2 seconds
  g.run.babyBool = false
  g.run.babyCounters = 0
  -- babyCountersRoom are reset in the MC_POST_NEW_ROOM callback
  g.run.babyFrame = 0
  -- babyTears are reset in the MC_POST_NEW_ROOM callback
  g.run.babyNPC = {
    type = 0,
    variant = 0,
    subType = 0,
  }
  g.run.babySprites = nil
  g.run.killedPoops = {}

  -- Racing+ removes all curses
  -- If we are in the R+7 Season 5 custom challenge,
  -- then all curses are disabled except for Curse of the Unknown
  -- Thus, we might naturally get this curse inside the challenge, so make sure it is disabled
  if challenge == Isaac.GetChallengeIdByName("R+7 (Season 5)") then
    g.l:RemoveCurse(LevelCurse.CURSE_OF_THE_UNKNOWN, false) -- 1 << 3
  end

  -- Set the new baby
  BabyRemove:Main()
  PostNewLevel:GetNewBaby()
  BabyAdd:Main()

  -- Call PostNewRoom manually (they get naturally called out of order)
  PostNewRoom:NewRoom()
end

function PostNewLevel:GetNewBaby()
  -- Local variables
  local seed = g.l:GetDungeonPlacementSeed()

  -- Don't get a new baby if we did not start the run as the Random Baby character
  if not g.run.enabled then
    g.run.babyType = 0
    return
  end

  -- It will become impossible to find a new baby if the list of past babies grows too large
  -- (when experimenting, it crashed upon reaching a size of 538,
  -- so reset it when it gets over 500 just in case)
  if #g.pastBabies > 500 then
    g.pastBabies = {}
  end

  -- Get a random co-op baby based on the seed of the floor
  -- (but reroll the baby if they have any overlapping items)
  local type
  local i = 0
  while true do
    i = i + 1
    seed = g:IncrementRNG(seed)
    math.randomseed(seed)
    type = math.random(1, #g.babies)

    -- Don't randomly choose a co-op baby if we are choosing a specific one for debugging purposes
    if g.debug ~= 0 then
      type = g.debug
      break
    end

    if BabyCheckValid:Main(type) then
      break
    end
  end

  -- Set the newly chosen baby type
  g.run.babyType = type

  -- Keep track of the babies that we choose so that we can avoid giving duplicates
  -- on the same run / multi-character custom challenge
  g.pastBabies[#g.pastBabies + 1] = type

  Isaac.DebugString(
    "Randomly chose co-op baby: " .. tostring(type) .. " - "
    .. g.babies[type].name .. " - " .. g.babies[type].description
  )
  Isaac.DebugString("Tries: " .. tostring(i) .. ", total past babies: " .. tostring(#g.pastBabies))
end

return PostNewLevel
