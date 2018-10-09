local SPCPostPickupUpdate = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_PICKUP_UPDATE (38)
function SPCPostPickupUpdate:Main(pickup)
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local player = game:GetPlayer(0)
  local data = pickup:GetData()
  local sprite = pickup:GetSprite()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  --[[
  Isaac.DebugString("MC_POST_PICKUP_UPDATE - " ..
                    tostring(pickup.Type) .. "." .. tostring(pickup.Variant) .. "." ..
                    tostring(pickup.SubType) .. "." .. tostring(pickup.State) ..
                    " (spawner: " .. pickup.SpawnerType .. "." .. pickup.SpawnerVariant .. ")")
  --]]

  -- Keep track of pickups that are touched
  if sprite:IsPlaying("Collect") and
     data.touched == nil then

    data.touched = true
    Isaac.DebugString("Touched pickup: " .. tostring(pickup.Type) .. "." .. tostring(pickup.Variant) .. "." ..
                      tostring(pickup.SubType) .. " (SPC)")
    SPCPostPickupUpdate:Touched()
  end

  if baby.name == "Bugeyed Baby" and -- 131
     pickup.FrameCount == 1 and -- Frame 0 does not work
     pickup.Variant ~= PickupVariant.PICKUP_COLLECTIBLE and -- 100
     pickup.Variant ~= PickupVariant.PICKUP_SHOPITEM and -- 150
     pickup.Variant ~= PickupVariant.PICKUP_BIGCHEST and -- 340
     pickup.Variant ~= PickupVariant.PICKUP_TROPHY and -- 370
     pickup.Variant ~= PickupVariant.PICKUP_BED and -- 380
     pickup.Price == 0 then -- We don't want it to affect shop items

    -- Change pickups into Blue Spiders
    -- (this cannot be in the MC_POST_PICKUP_INIT callback since the pickups do not have position there)
    pickup:Remove()
    for i = 1, 3 do
      -- We want to space out the spiders so that you can see each individual one
      local position = Vector(pickup.Position.X + 15 * i, pickup.Position.X + 15 * i)
      player:ThrowBlueSpider(position, player.Position)
    end

  elseif baby.name == "No Arms Baby" and -- 140
         pickup.Variant ~= PickupVariant.PICKUP_COLLECTIBLE and -- 100
         pickup.Variant ~= PickupVariant.PICKUP_SHOPITEM and -- 150
         pickup.Variant ~= PickupVariant.PICKUP_BIGCHEST and -- 340
         pickup.Variant ~= PickupVariant.PICKUP_TROPHY and -- 370
         pickup.Variant ~= PickupVariant.PICKUP_BED then -- 380

    -- Make it impossible for the player to pick up this pickup
    if pickup.EntityCollisionClass ~= EntityCollisionClass.ENTCOLL_NONE then -- 0
      pickup.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE -- 0
    end

    -- Make it bounce off the player if they get too close
    if SPCGlobals:InsideSquare(player.Position, pickup.Position, 25) then
      local x = pickup.Position.X - player.Position.X
      local y = pickup.Position.Y - player.Position.Y
      pickup.Velocity = Vector(x / 2, y / 2)
    end

  elseif baby.name == "Rictus Baby" and -- 154
         pickup.Variant ~= PickupVariant.PICKUP_COLLECTIBLE and -- 100
         pickup.Variant ~= PickupVariant.PICKUP_SHOPITEM and -- 150
         pickup.Variant ~= PickupVariant.PICKUP_BIGCHEST and -- 340
         pickup.Variant ~= PickupVariant.PICKUP_TROPHY and -- 370
         pickup.Variant ~= PickupVariant.PICKUP_BED and -- 380
         pickup.Price == 0 and -- We don't want it to affect shop items
         SPCGlobals:InsideSquare(pickup.Position, player.Position, 80) then

    -- Scared pickups
    local velocity = pickup.Position - player.Position
    velocity:Normalize()
    velocity = velocity * 8
    pickup.Velocity = velocity

  elseif baby.name == "Spike Baby" then -- 166
    if pickup.FrameCount == 2 and -- Frame 0 does not work and frame 1 interferes with Racing+ replacement code
       (pickup.Variant == PickupVariant.PICKUP_CHEST or -- 50
        pickup.Variant == PickupVariant.PICKUP_BOMBCHEST or -- 51
        pickup.Variant == PickupVariant.PICKUP_ETERNALCHEST or -- 53
        pickup.Variant == PickupVariant.PICKUP_LOCKEDCHEST or -- 60
        pickup.Variant == PickupVariant.PICKUP_REDCHEST) and -- 360
       pickup.TheresOptionsPickup == false and
       -- Racing+ will change Spiked Chests / Mimic Chests to variant 50 during the "Appear" animation
       -- to prevent unavoidable damage; it sets "pickup.TheresOptionsPickup" when it does this
       data.unavoidableReplacement == nil then
       -- Racing+ will change some Spiked Chests / Mimic Chests to normal chests to prevent unavoidable damage
       -- It will set "unavoidableReplacement" when it does this

      -- Replace all chests with Mimics (5.54)
      -- (this does not work in the MC_POST_PICKUP_SELECTION callback because
      -- the chest will not initialize properly for some reason)
      -- (this does not work in the MC_POST_PICKUP_INIT callback because the position is not initialized)
      game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_MIMICCHEST, -- 5.54
                 pickup.Position, pickup.Velocity, pickup.Parent, 0, pickup.InitSeed)
      pickup:Remove()

    elseif pickup.Variant == PickupVariant.PICKUP_SPIKEDCHEST and -- 52
           pickup.SubType == 0 then -- SubType of 1 is closed and 0 is opened

      -- Replace the contents of the chest with an item
      game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
                 pickup.Position, Vector(0, 0), nil, 0, pickup.InitSeed)
      pickup:Remove()
    end

  elseif baby.name == "Aban Baby" and -- 177
         pickup.Variant == PickupVariant.PICKUP_COIN and -- 20
         data.touched == nil and -- Don't mess with coins anymore after we have picked them up
         data.recovery then -- We manually spawned this coin

    if pickup.FrameCount <= 60 then
      -- Make it impossible for the player to pick up this pickup
      if pickup.EntityCollisionClass ~= EntityCollisionClass.ENTCOLL_NONE then -- 0
        pickup.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE -- 0
      end

      -- Make it bounce off the player if they get too close
      if SPCGlobals:InsideSquare(player.Position, pickup.Position, 25) then
        local x = pickup.Position.X - player.Position.X
        local y = pickup.Position.Y - player.Position.Y
        pickup.Velocity = Vector(x / 2, y / 2)
      end

      -- Play the custom "Blink" animation
      if sprite:IsPlaying("Blink") == false then
        sprite:Play("Blink", true)
      end
    else
      -- The coin has been spawned for a while, so set the collision back to normal
      if pickup.EntityCollisionClass ~= EntityCollisionClass.ENTCOLL_ALL then -- 4
        pickup.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL -- 4
      end

      -- Stop the custom "Blink" animation
      if sprite:IsPlaying("Idle") == false then
        sprite:Play("Idle", true)
      end

      -- Make it start to fade away
      local color = pickup:GetColor()
      local fadeAmount = 1 - ((pickup.FrameCount - 60) * 0.01)
      if fadeAmount <= 0 then
        pickup:Remove()
      else
        local newColor = Color(color.R, color.G, color.B, fadeAmount, color.RO, color.GO, color.BO)
        pickup:SetColor(newColor, 0, 0, true, true)
      end
    end

  elseif baby.name == "Spiky Demon Baby" then -- 277
    if pickup.Variant == PickupVariant.PICKUP_MIMICCHEST and -- 54
       sprite:GetFilename() ~= "gfx/005.054_mimic chest2.anm2" then

      -- Replace the sprite with the pre-nerf version
      sprite:Load("gfx/005.054_mimic chest2.anm2", true)
      sprite:Play("Appear", false) -- We have to play an animation for the new sprite to actually appear

    elseif pickup.Variant == PickupVariant.PICKUP_SPIKEDCHEST and -- 52
           sprite:GetFilename() ~= "gfx/005.052_spikedchest2.anm2" then

      -- Replace the sprite with the pre-nerf version
      sprite:Load("gfx/005.052_spikedchest2.anm2", true)
      if pickup.FrameCount == 0 then
        sprite:Play("Appear", false) -- We have to play an animation for the new sprite to actually appear
      else
        sprite:Play("Idle", false) -- We have to play an animation for the new sprite to actually appear
      end
    end

  elseif baby.name == "Orange Pig Baby" and -- 381
         pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE and
         pickup.FrameCount == 2 and
         -- Frame 0 does not work
         -- Frame 1 works but we need to wait an extra frame for Racing+ to replace the pedestal
         pickup.Touched == false then

    -- Double items
    -- (we can't do this in the MC_POST_PICKUP_INIT callback because the position is not set)
    local position = room:FindFreePickupSpawnPosition(pickup.Position, 1, true)
    SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
    local pedestal = game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
                                position, Vector(0, 0), nil, 0, SPCGlobals.run.randomSeed):ToPickup()
    pedestal.Price = pickup.Price -- We don't want it to automatically be bought
    pedestal.TheresOptionsPickup = pickup.TheresOptionsPickup -- We want it to keep the behavior of the room
    pedestal.Touched = true -- Mark to not double this pedestal

  elseif baby.name == "Cowboy Baby" and -- 394
         pickup.FrameCount % 30 == 0 and -- Every second
         sprite:IsPlaying("Collect") == false then -- Don't shoot if we already picked it up

    local velocity = player.Position - pickup.Position
    velocity:Normalize()
    velocity = velocity * 8
    game:Spawn(EntityType.ENTITY_PROJECTILE, ProjectileVariant.PROJECTILE_NORMAL,
               pickup.Position, velocity, pickup, 0, 0) -- 9.0
  end
end

function SPCPostPickupUpdate:Touched(pickup)
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  if baby.name == "Cute Baby" then -- 11
    -- Touching pickups takes away damage
    SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
    player:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
    player:EvaluateItems()

  elseif baby.name == "Worry Baby" then -- 167
    -- Touching pickups causes teleportation
    player:UseActiveItem(CollectibleType.COLLECTIBLE_TELEPORT, false, false, false, false) -- 44

  elseif baby.name == "Corrupted Baby" then -- 307
    -- Touching items/pickups causes damage (2/2)
    player:TakeDamage(1, 0, EntityRef(player), 0)

  elseif baby.name == "Robbermask Baby" then -- 473
    -- Touching pickups gives extra damage
    SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
    player:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
    player:EvaluateItems()
  end
end

return SPCPostPickupUpdate
