local PostPickupUpdate = {}

-- Includes
local g    = require("babies_mod/globals")
local Misc = require("babies_mod/misc")

-- ModCallbacks.MC_POST_PICKUP_UPDATE (38)
function PostPickupUpdate:Main(pickup)
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local roomIndex = g.l:GetCurrentRoomDesc().SafeGridIndex
  if roomIndex < 0 then -- SafeGridIndex is always -1 for rooms outside the grid
    roomIndex = g.l:GetCurrentRoomIndex()
  end
  local roomType = g.r:GetType()
  local firstVisit = g.r:IsFirstVisit()
  local data = pickup:GetData()
  local sprite = pickup:GetSprite()
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  --[[
  Isaac.DebugString("MC_POST_PICKUP_UPDATE - " ..
                    tostring(pickup.Type) .. "." .. tostring(pickup.Variant) .. "." ..
                    tostring(pickup.SubType) .. "." .. tostring(pickup.State))
  Isaac.DebugString("  Spawner: " .. tostring(pickup.SpawnerType) .. "." .. tostring(pickup.SpawnerVariant))
  Isaac.DebugString("  FrameCount: " .. tostring(pickup.FrameCount))
  --]]
  -- (this callback will not fire on the 0th frame for some reason)

  -- All baby effects should ignore the Checkpoint
  if pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE and
     pickup.SubType == Isaac.GetItemIdByName("Checkpoint") then

    return
  end

  -- If the player is on a trinket baby, then they will not be able to take any dropped trinkets
  -- (unless they have Mom's Purse or Belly Button)
  -- So, if this is the case, replace any trinkets that drop with a random pickup
  -- (this cannot be in the MC_POST_PICKUP_INIT callback, because the position is not initialized yet)
  if baby.trinket ~= nil and
     pickup.Variant == PickupVariant.PICKUP_TRINKET and -- 350
     pickup.SubType ~= baby.trinket and -- We don't want to replace a dropped trinket
     pickup.FrameCount == 1 and -- Frame 0 does not work
     not g.p:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_PURSE) and -- 139
     not g.p:HasCollectible(CollectibleType.COLLECTIBLE_BELLY_BUTTON) then -- 458

    Misc:SpawnRandomPickup(pickup.Position, pickup.Velocity, true) -- The third argument is "noItems"
    pickup:Remove()
    return
  end

  -- Keep track of pickups that are touched
  if sprite:IsPlaying("Collect") and
     data.touched == nil then

    data.touched = true
    Isaac.DebugString("Touched pickup: " .. tostring(pickup.Type) .. "." .. tostring(pickup.Variant) .. "." ..
                      tostring(pickup.SubType) .. " (BM)")
    PostPickupUpdate:Touched(pickup)
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
      g.p:ThrowBlueSpider(position, g.p.Position)
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
    if g.p.Position:Distance(pickup.Position) <= 25 then
      local x = pickup.Position.X - g.p.Position.X
      local y = pickup.Position.Y - g.p.Position.Y
      pickup.Velocity = Vector(x / 2, y / 2)
    end

  elseif baby.name == "Rictus Baby" and -- 154
         pickup.Variant ~= PickupVariant.PICKUP_COLLECTIBLE and -- 100
         pickup.Variant ~= PickupVariant.PICKUP_SHOPITEM and -- 150
         pickup.Variant ~= PickupVariant.PICKUP_BIGCHEST and -- 340
         pickup.Variant ~= PickupVariant.PICKUP_TROPHY and -- 370
         pickup.Variant ~= PickupVariant.PICKUP_BED and -- 380
         pickup.Price == 0 and -- We don't want it to affect shop items
         pickup.Position:Distance(g.p.Position) <= 80 then

    -- Scared pickups
    local velocity = pickup.Position - g.p.Position
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
       data.unavoidableReplacement == nil then
       -- Racing+ will change some Spiked Chests / Mimic Chests to normal chests
       -- to prevent unavoidable damage in rooms with a 1x1 path
       -- It will set "data.unavoidableReplacement = true" when it does this

      -- Replace all chests with Mimics (5.54)
      -- (this does not work in the MC_POST_PICKUP_SELECTION callback because
      -- the chest will not initialize properly for some reason)
      -- (this does not work in the MC_POST_PICKUP_INIT callback because the position is not initialized)
      g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_MIMICCHEST, -- 5.54
                pickup.Position, pickup.Velocity, pickup.Parent, 0, pickup.InitSeed)
      pickup:Remove()

    elseif pickup.Variant == PickupVariant.PICKUP_SPIKEDCHEST and -- 52
           pickup.SubType == 0 then -- SubType of 1 is closed and 0 is opened

      -- Replace the contents of the chest with an item
      g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
                pickup.Position, g.zeroVector, nil, 0, pickup.InitSeed)
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
      if g.p.Position:Distance(pickup.Position) <= 25 then
        local x = pickup.Position.X - g.p.Position.X
        local y = pickup.Position.Y - g.p.Position.Y
        pickup.Velocity = Vector(x / 2, y / 2)
      end

      -- Play the custom "Blink" animation
      if not sprite:IsPlaying("Blink") then
        sprite:Play("Blink", true)
      end
    else
      -- The coin has been spawned for a while, so set the collision back to normal
      if pickup.EntityCollisionClass ~= EntityCollisionClass.ENTCOLL_ALL then -- 4
        pickup.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL -- 4
      end

      -- Stop the custom "Blink" animation
      if not sprite:IsPlaying("Idle") then
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

  elseif baby.name == "Fancy Baby" and -- 216
         pickup.Variant == PickupVariant.PICKUP_HEART and -- 10
         pickup.SubType == HeartSubType.HEART_FULL and -- 1
         pickup.Price == 3 and
         roomIndex == g.l:GetStartingRoomIndex() then

    -- Delete the rerolled teleports
    pickup:Remove()

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

  elseif baby.name == "Suit Baby" and -- 287
         roomType ~= RoomType.ROOM_DEFAULT and -- 1
         roomType ~= RoomType.ROOM_ERROR and -- 3
         roomType ~= RoomType.ROOM_BOSS and -- 5
         roomType ~= RoomType.ROOM_DEVIL and -- 14
         roomType ~= RoomType.ROOM_ANGEL and -- 15
         roomType ~= RoomType.ROOM_DUNGEON and -- 16
         roomType ~= RoomType.ROOM_BOSSRUSH and -- 17
         roomType ~= RoomType.ROOM_BLACK_MARKET then -- 22

    -- All special rooms are Devil Rooms
    if pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE then
      -- If the price is not correct, update it
      -- (we have to check on every frame in case the health situation changes)
      local price = Misc:GetItemHeartPrice(pickup.SubType)
      if pickup.Price ~= price then
        pickup.AutoUpdatePrice = false
        pickup.Price = price
      end

    elseif pickup.Variant == PickupVariant.PICKUP_HEART and -- 10
           pickup.SubType == HeartSubType.HEART_FULL and -- 1
           pickup.Price == 3 then

      -- Rerolled items turn into hearts since this is a not an actual Devil Room,
      -- so delete the heart and manually create another pedestal item
      g.run.roomRNG = g:IncrementRNG(g.run.roomRNG)
      local item = g.itemPool:GetCollectible(ItemPoolType.POOL_DEVIL, true, g.run.roomRNG) -- 3
      local pedestal = g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
                                 pickup.Position, g.zeroVector, nil, item, pickup.InitSeed):ToPickup()

      -- Set the price
      pedestal.AutoUpdatePrice = false
      pickup.Price = Misc:GetItemHeartPrice(pickup.SubType)

      -- Remove the heart
      pickup:Remove()
    end

  elseif baby.name == "Scary Baby" then -- 317
    -- Items cost hearts
    if pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE then
      -- If the price is not correct, update it
      -- (we have to check on every frame in case the health situation changes)
      local price = Misc:GetItemHeartPrice(pickup.SubType)
      if pickup.Price ~= price then
        pickup.AutoUpdatePrice = false
        pickup.Price = price
      end

    elseif pickup.Variant == PickupVariant.PICKUP_HEART and -- 10
           pickup.SubType == HeartSubType.HEART_FULL and -- 1
           pickup.Price == 3 and
           roomType ~= RoomType.ROOM_SHOP then -- 2

      -- Rerolled items turn into hearts since we are not in a Devil Room,
      -- so delete the heart and manually create another pedestal item
      local pedestal = g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
                                 pickup.Position, g.zeroVector, nil, 0, pickup.InitSeed):ToPickup()

      -- Set the price
      pedestal.AutoUpdatePrice = false
      pickup.Price = Misc:GetItemHeartPrice(pickup.SubType)

      -- Remove the heart
      pickup:Remove()
    end

  elseif baby.name == "Orange Pig Baby" and -- 381
         pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE and
         firstVisit and
         pickup.FrameCount == 2 and
         -- Frame 0 does not work
         -- Frame 1 works but we need to wait an extra frame for Racing+ to replace the pedestal
         pickup.State ~= 2 and -- We mark a state of 2 to indicate a duplicated pedestal
         (g.run.babyCountersRoom == 0 or
          g.run.babyCountersRoom == gameFrameCount) then

    -- Double items
    -- (we can't do this in the MC_POST_PICKUP_INIT callback because the position is not set)
    local position = g.r:FindFreePickupSpawnPosition(pickup.Position, 1, true)
    g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
    local pedestal = g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
                               position, g.zeroVector, nil, 0, g.run.randomSeed):ToPickup()
    pedestal.Price = pickup.Price -- We don't want it to automatically be bought
    pedestal.TheresOptionsPickup = pickup.TheresOptionsPickup -- We want it to keep the behavior of the room
    pedestal.State = 2 -- Mark it so that we don't duplicate it again

    -- We only want to duplicate pedestals once per room to avoid duplicating rerolled pedestals
    -- (the state will go back to 0 for a rerolled pedestal)
    g.run.babyCountersRoom = gameFrameCount

  elseif baby.name == "Cowboy Baby" and -- 394
         pickup.FrameCount % 35 == 0 and -- Every 1.17 seconds
         not sprite:IsPlaying("Collect") then -- Don't shoot if we already picked it up

    local velocity = g.p.Position - pickup.Position
    velocity:Normalize()
    velocity = velocity * 7
    g.g:Spawn(EntityType.ENTITY_PROJECTILE, ProjectileVariant.PROJECTILE_NORMAL,
              pickup.Position, velocity, pickup, 0, 0) -- 9.0

  elseif baby.name == "Fate's Reward" and -- 537
         roomType ~= RoomType.ROOM_SHOP and -- 2
         roomType ~= RoomType.ROOM_ERROR and -- 3
         pickup.Variant == PickupVariant.PICKUP_HEART and -- 10
         pickup.SubType == HeartSubType.HEART_FULL and -- 1
         pickup.Price == 3 then

    -- Rerolled items turn into hearts
    -- so delete the heart and manually create another pedestal item
     g.run.roomRNG = g:IncrementRNG(g.run.roomRNG)
     local pedestal = g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100.0
                                pickup.Position, g.zeroVector, nil, 0, g.run.roomRNG):ToPickup()
     pedestal.Price = 15
     pickup:Remove()
  end
end

function PostPickupUpdate:Touched(pickup)
  -- Local variables
  local type = g.run.babyType
  local baby = g.babies[type]

  if baby.name == "Cute Baby" then -- 11
    -- -1 damage per pickup taken
    g.run.babyCounters = g.run.babyCounters + 1
    g.p:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
    g.p:EvaluateItems()

  elseif baby.name == "Bluebird Baby" then -- 147
    -- Touching pickups causes paralysis (2/2)
    g.p:UsePill(PillEffect.PILLEFFECT_PARALYSIS, PillColor.PILL_NULL) -- 22, 0

  elseif baby.name == "Worry Baby" then -- 167
    -- Touching pickups causes teleportation (2/2)
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_TELEPORT, false, false, false, false) -- 44

  elseif baby.name == "Corrupted Baby" then -- 307
    -- Touching items/pickups causes damage (2/2)
    g.p:TakeDamage(1, 0, EntityRef(g.p), 0)

  elseif baby.name == "Robbermask Baby" then -- 473
    -- Touching pickups gives extra damage
    g.run.babyCounters = g.run.babyCounters + 1
    g.p:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
    g.p:EvaluateItems()
  end
end

return PostPickupUpdate
