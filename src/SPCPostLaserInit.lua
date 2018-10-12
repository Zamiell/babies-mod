local SPCPostLaserInit = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_LASER_INIT (47)
function SPCPostLaserInit:Main(laser)
  -- Local variables
  local sprite = laser:GetSprite()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  --[[
  Isaac.DebugString("MC_POST_LASER_INIT - " ..
                    tostring(laser.Type) .. "." .. tostring(laser.Variant) .. "." .. tostring(laser.SubType))
  --]]
  -- ("laser.SpawnerType" is not initialized yet and always 0 in this callback)
  -- ("laser.MaxDistance" is not initialized yet and always 0 in this callback)

  if baby.name == "Belial Baby" and -- 51
     sprite:GetFilename() == "gfx/007.001_Thick Red Laser.anm2" then

    -- If we set the distance on frame 0 in the MC_POST_LASER_UPDATE update, it will look buggy,
    -- so manually make it invisible as soon as it spawns, and then we will make it visible later
    laser.Visible = false
  end
end

return SPCPostLaserInit
