local PostLaserInit = {}

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_POST_LASER_INIT (47)
-- "laser.SpawnerType" and "laser.MaxDistance" are not initialized yet in this callback
function PostLaserInit:Main(laser)
  -- Local variables
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  local babyFunc = PostLaserInit.functions[type]
  if babyFunc ~= nil then
    babyFunc(laser)
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
