local PostLaserInit = {}

-- Note: Position, SpawnerType, SpawnerVariant, and MaxDistance are not initialized yet in this
-- callback

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_POST_LASER_INIT (47)
function PostLaserInit:Main(laser)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  local babyFunc = PostLaserInit.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc(laser)
  end
end

-- The collection of functions for each baby
PostLaserInit.functions = {}

-- Belial Baby
PostLaserInit.functions[51] = function(laser)
  if laser:GetSprite():GetFilename() == "gfx/007.001_Thick Red Laser.anm2" then
    -- If we set the distance on frame 0 in the MC_POST_LASER_UPDATE update, it will look buggy,
    -- so manually make it invisible as soon as it spawns, and then we will make it visible later
    laser.Visible = false
  end
end

return PostLaserInit
