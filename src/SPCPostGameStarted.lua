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

  Isaac.DebugString("MC_POST_GAME_STARTED (SPC)")

  -- Reset variables
  SPCGlobals:InitRun()

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

  -- Call PostNewLevel manually (they get naturally called out of order)
  SPCPostNewLevel:NewLevel()
end

return SPCPostGameStarted
