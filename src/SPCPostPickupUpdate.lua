local SPCPostPickupUpdate = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_PICKUP_UPDATE (38)
function SPCPostPickupUpdate:Main(pickup)
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  -- Keep track of pickups that are touched
  local data = pickup:GetData()
  if pickup:GetSprite():IsPlaying("Collect") and
     data.touched == nil then

    data.touched = true
    Isaac.DebugString("Touched pickup: " .. tostring(pickup.Type) .. "." .. tostring(pickup.Variant) .. "." ..
                      tostring(pickup.SubType) .. " (SPC)")

    if baby.name == "Corrupted Baby" then -- 307
      -- Taking items/pickups causes damage (2/2)
      player:TakeDamage(1, 0, EntityRef(player), 0)

    elseif baby.name == "Robbermask Baby" then -- 473
      -- Taking pickups gives extra damage
      SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
      player:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
      player:EvaluateItems()
    end
  end

  local sprite = pickup:GetSprite()
  if baby.name == "Spiky Demon Baby" then -- 277
    if pickup.Variant == PickupVariant.PICKUP_MIMICCHEST and -- 54
       sprite:GetFilename() ~= "gfx/005.054_mimic chest2.anm2" then

      -- Replace the sprite with the pre-nerf version
      sprite:Load("gfx/005.054_mimic chest2.anm2", true)
      sprite:Play("Appear", false) -- We have to play an animation for the new sprite to actually appear

    elseif pickup.Variant == PickupVariant.PICKUP_SPIKEDCHEST and -- 52
           sprite:GetFilename() ~= "gfx/005.052_spikedchest2.anm2" then

      -- Replace the sprite with the pre-nerf version
      sprite:Load("gfx/005.052_spikedchest2.anm2", true)
      if pickup.Frame == 0 then
        sprite:Play("Appear", false) -- We have to play an animation for the new sprite to actually appear
      else
        sprite:Play("Idle", false) -- We have to play an animation for the new sprite to actually appear
      end
    end
  end
end

return SPCPostPickupUpdate
