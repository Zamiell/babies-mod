local SPCPostGameStarted  = {}

-- Includes
local SPCGlobals      = require("src/spcglobals")
local SPCPostNewLevel = require("src/spcpostnewlevel")

-- ModCallbacks.MC_POST_GAME_STARTED (15)
function SPCPostGameStarted:Main(saveState)
  -- Don't do anything if this is not a new run
  if saveState then
    return
  end

  -- Local variables
  local game = Game()
  local seeds = game:GetSeeds()
  local itemPool = game:GetItemPool()
  local challenge = Isaac.GetChallenge()

  Isaac.DebugString("MC_POST_GAME_STARTED (SPC)")

  -- Reset variables
  SPCGlobals:InitRun()

  -- Also reset the list of past babies that have been chosen
  -- (but don't do this if we are in the middle of a multi-character custom challenge)
  local resetPastBabies = true
  if (challenge == Isaac.GetChallengeIdByName("R+7 (Season 5 Beta)") or
      challenge == Isaac.GetChallengeIdByName("R+7 (Season 5)")) and
     RacingPlusSpeedrun ~= nil and
     RacingPlusSpeedrun.charNum >= 2 then

    resetPastBabies = false
  end
  if resetPastBabies then
    SPCGlobals.pastBabies = {}
  end

  -- Easter Eggs from babies are normally removed upon going to the next floor
  -- We also have to check to see if they reset the game while on a baby with a custom Easter Egg effect
  for i = 1, #SPCGlobals.babies do
    local baby = SPCGlobals.babies[i]
    if baby.seed ~= nil then
      if seeds:HasSeedEffect(baby.seed) then
        seeds:RemoveSeedEffect(baby.seed)
      end
    end
  end

  -- Remove some items from pools
  itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_GUILLOTINE) -- 206
  -- (this item will not properly display and there is no good way to fix it)
  itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_CLICKER) -- 482
  -- (there is no way to know which character that you Clicker to, so just remove this item)

  -- Call PostNewLevel manually (they get naturally called out of order)
  SPCPostNewLevel:NewLevel()
end

return SPCPostGameStarted
