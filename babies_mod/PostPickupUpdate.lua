local PostPickupUpdate = {}

-- Note: This callback only fires on frame 1 and onwards

-- Includes
local g = require("babies_mod/globals")
local Misc = require("babies_mod/misc")

-- ModCallbacks.MC_POST_PICKUP_UPDATE (38)
function PostPickupUpdate:Main(pickup)
  -- Local variables
  local data = pickup:GetData()
  local sprite = pickup:GetSprite()
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  -- All baby effects should ignore the Checkpoint
  if (
    pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE -- 100
    and pickup.SubType == CollectibleType.COLLECTIBLE_CHECKPOINT
  ) then
    return
  end

  -- If the player is on a trinket baby, then they will not be able to take any dropped trinkets
  -- (unless they have Mom's Purse or Belly Button)
  -- So, if this is the case, replace any trinkets that drop with a random pickup
  -- (this cannot be in the MC_POST_PICKUP_INIT callback,
  -- because the position is not initialized yet)
  if (
    baby.trinket ~= nil
    and pickup.Variant == PickupVariant.PICKUP_TRINKET -- 350
    and pickup.SubType ~= baby.trinket -- We don't want to replace a dropped trinket
    and pickup.FrameCount == 1 -- Frame 0 does not work
    and not g.p:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_PURSE) -- 139
    and not g.p:HasCollectible(CollectibleType.COLLECTIBLE_BELLY_BUTTON) -- 458
  ) then
    Misc:SpawnRandomPickup(pickup.Position, pickup.Velocity, true)
    pickup:Remove()
    return
  end

  -- Keep track of pickups that are touched
  if (
    sprite:IsPlaying("Collect")
    and data.touched == nil
  ) then
    data.touched = true
    Isaac.DebugString(
      "Touched pickup: "
      .. tostring(pickup.Type) .. "." .. tostring(pickup.Variant) .. "." .. tostring(pickup.SubType)
      .. " (BM)"
    )

    local babyFunc = PostPickupUpdate.touchedFunctions[babyType]
    if babyFunc ~= nil then
      babyFunc()
    end
  end

  local babyFunc = PostPickupUpdate.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc(pickup)
  end
end

-- The collection of functions for each baby
PostPickupUpdate.functions = {}

-- Bugeyed Baby
PostPickupUpdate.functions[131] = function(pickup)
  -- Change pickups into Blue Spiders
  -- (this cannot be in the MC_POST_PICKUP_INIT callback since the pickups do not have position
  -- there)
  if (
    pickup.FrameCount == 1 -- Frame 0 does not work
    and pickup.Variant ~= PickupVariant.PICKUP_COLLECTIBLE -- 100
    and pickup.Variant ~= PickupVariant.PICKUP_SHOPITEM -- 150
    and pickup.Variant ~= PickupVariant.PICKUP_BIGCHEST -- 340
    and pickup.Variant ~= PickupVariant.PICKUP_TROPHY -- 370
    and pickup.Variant ~= PickupVariant.PICKUP_BED -- 380
    and pickup.Price == 0 -- We don't want it to affect shop items
  ) then
    pickup:Remove()
    for i = 1, 3 do
      -- We want to space out the spiders so that you can see each individual one
      local position = Vector(pickup.Position.X + 15 * i, pickup.Position.X + 15 * i)
      g.p:ThrowBlueSpider(position, g.p.Position)
    end
  end
end

-- No Arms Baby
PostPickupUpdate.functions[140] = function(pickup)
  if (
    pickup.Variant ~= PickupVariant.PICKUP_COLLECTIBLE -- 100
    and pickup.Variant ~= PickupVariant.PICKUP_SHOPITEM -- 150
    and pickup.Variant ~= PickupVariant.PICKUP_BIGCHEST -- 340
    and pickup.Variant ~= PickupVariant.PICKUP_TROPHY -- 370
    and pickup.Variant ~= PickupVariant.PICKUP_BED -- 380
  ) then
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
  end
end

-- Rictus Baby
PostPickupUpdate.functions[154] = function(pickup)
  if (
    pickup.Variant ~= PickupVariant.PICKUP_COLLECTIBLE -- 100
    and pickup.Variant ~= PickupVariant.PICKUP_SHOPITEM -- 150
    and pickup.Variant ~= PickupVariant.PICKUP_BIGCHEST -- 340
    and pickup.Variant ~= PickupVariant.PICKUP_TROPHY -- 370
    and pickup.Variant ~= PickupVariant.PICKUP_BED -- 380
    and pickup.Price == 0 -- We don't want it to affect shop items
    and pickup.Position:Distance(g.p.Position) <= 80
  ) then
    -- Scared pickups
    local velocity = pickup.Position - g.p.Position
    velocity:Normalize()
    velocity = velocity * 8
    pickup.Velocity = velocity
  end
end

-- Spike Baby
PostPickupUpdate.functions[166] = function(pickup)
  local data = pickup:GetData()
  if (
    -- Frame 0 does not work and frame 1 interferes with Racing+ replacement code
    pickup.FrameCount == 2
    and (
      pickup.Variant == PickupVariant.PICKUP_CHEST -- 50
      or pickup.Variant == PickupVariant.PICKUP_BOMBCHEST -- 51
      or pickup.Variant == PickupVariant.PICKUP_ETERNALCHEST -- 53
      or pickup.Variant == PickupVariant.PICKUP_LOCKEDCHEST -- 60
      or pickup.Variant == PickupVariant.PICKUP_REDCHEST -- 360
    )
    -- Racing+ will change some Spiked Chests / Mimic Chests to normal chests
    -- to prevent unavoidable damage in rooms with a 1x1 path
    -- It will set "data.unavoidableReplacement = true" when it does this
    and data.unavoidableReplacement == nil
  ) then
    -- Replace all chests with Mimics (5.54)
    -- (this does not work in the MC_POST_PICKUP_SELECTION callback because
    -- the chest will not initialize properly for some reason)
    -- (this does not work in the MC_POST_PICKUP_INIT callback because the position is not
    -- initialized)
    g.g:Spawn(
      EntityType.ENTITY_PICKUP, -- 5
      PickupVariant.PICKUP_MIMICCHEST, -- 54
      pickup.Position,
      pickup.Velocity,
      pickup.Parent,
      0,
      pickup.InitSeed
    )
    pickup:Remove()
  elseif (
    pickup.Variant == PickupVariant.PICKUP_SPIKEDCHEST -- 52
    and pickup.SubType == 0 -- SubType of 1 is closed and 0 is opened
  ) then
    -- Replace the contents of the chest with an item
    g.g:Spawn(
      EntityType.ENTITY_PICKUP, -- 5
      PickupVariant.PICKUP_COLLECTIBLE, -- 100
      pickup.Position,
      g.zeroVector,
      nil,
      0,
      pickup.InitSeed
    )
    pickup:Remove()
  end
end

-- Aban Baby
PostPickupUpdate.functions[177] = function(pickup)
  if pickup.Variant ~= PickupVariant.PICKUP_COIN then -- 20
    return
  end

  local data = pickup:GetData()
  if (
    data.touched ~= nil -- Don't mess with coins anymore after we have picked them up
    or not data.recovery -- We only want to target manually spawned coins
  ) then
    return
  end

  local sprite = pickup:GetSprite()
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
end

-- Fancy Baby
PostPickupUpdate.functions[216] = function(pickup)
  if (
    pickup.Variant == PickupVariant.PICKUP_HEART -- 10
    and pickup.SubType == HeartSubType.HEART_FULL -- 1
    and pickup.Price == 3
    and g.l:GetCurrentRoomIndex() == g.l:GetStartingRoomIndex()
  ) then
    -- Delete the rerolled teleports
    pickup:Remove()
  end
end

-- Spiky Demon Baby
PostPickupUpdate.functions[277] = function(pickup)
  local sprite = pickup:GetSprite()
  if (
    pickup.Variant == PickupVariant.PICKUP_MIMICCHEST -- 54
    and sprite:GetFilename() ~= "gfx/005.054_mimic chest2.anm2"
  ) then
    -- Replace the sprite with the pre-nerf version
    sprite:Load("gfx/005.054_mimic chest2.anm2", true)

    -- We have to play an animation for the new sprite to actually appear
    sprite:Play("Appear", false)
  elseif (
    pickup.Variant == PickupVariant.PICKUP_SPIKEDCHEST -- 52
    and sprite:GetFilename() ~= "gfx/005.052_spikedchest2.anm2"
  ) then
    -- Replace the sprite with the pre-nerf version
    sprite:Load("gfx/005.052_spikedchest2.anm2", true)
    if pickup.FrameCount == 0 then
      -- We have to play an animation for the new sprite to actually appear
      sprite:Play("Appear", false)
    else
      -- We have to play an animation for the new sprite to actually appear
      sprite:Play("Idle", false)
    end
  end
end

-- Suit Baby
PostPickupUpdate.functions[287] = function(pickup)
  -- Ignore some select special rooms
  local roomType = g.r:GetType()
  if (
    roomType == RoomType.ROOM_DEFAULT -- 1
    or roomType == RoomType.ROOM_ERROR -- 3
    or roomType == RoomType.ROOM_BOSS -- 5
    or roomType == RoomType.ROOM_DEVIL -- 14
    or roomType == RoomType.ROOM_ANGEL -- 15
    or roomType == RoomType.ROOM_DUNGEON -- 16
    or roomType == RoomType.ROOM_BOSSRUSH -- 17
    or roomType == RoomType.ROOM_BLACK_MARKET -- 22
  ) then
    return
  end

  -- All special rooms are Devil Rooms
  if pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE then
    -- If the price is not correct, update it
    -- (we have to check on every frame in case the health situation changes)
    local price = Misc:GetItemHeartPrice(pickup.SubType)
    if pickup.Price ~= price then
      pickup.AutoUpdatePrice = false
      pickup.Price = price
    end
  elseif (
    pickup.Variant == PickupVariant.PICKUP_HEART -- 10
    and pickup.SubType == HeartSubType.HEART_FULL -- 1
    and pickup.Price == 3
  ) then
    -- Rerolled items turn into hearts since this is a not an actual Devil Room,
    -- so delete the heart and manually create another pedestal item
    g.run.roomRNG = g:IncrementRNG(g.run.roomRNG)
    local item = g.itemPool:GetCollectible(ItemPoolType.POOL_DEVIL, true, g.run.roomRNG) -- 3
    local pedestal = g.g:Spawn(
      EntityType.ENTITY_PICKUP, -- 5
      PickupVariant.PICKUP_COLLECTIBLE, -- 100
      pickup.Position,
      g.zeroVector,
      nil,
      item,
      pickup.InitSeed
    ):ToPickup()

    -- Set the price
    pedestal.AutoUpdatePrice = false
    pickup.Price = Misc:GetItemHeartPrice(pickup.SubType)

    -- Remove the heart
    pickup:Remove()
  end
end

-- Scary Baby
PostPickupUpdate.functions[317] = function(pickup)
  -- Items cost hearts
  if pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE then
    -- If the price is not correct, update it
    -- (we have to check on every frame in case the health situation changes)
    local price = Misc:GetItemHeartPrice(pickup.SubType)
    if pickup.Price ~= price then
      pickup.AutoUpdatePrice = false
      pickup.Price = price
    end
  elseif (
    pickup.Variant == PickupVariant.PICKUP_HEART -- 10
    and pickup.SubType == HeartSubType.HEART_FULL -- 1
    and pickup.Price == 3
    and g.r:GetType() ~= RoomType.ROOM_SHOP -- 2
  ) then
    -- Rerolled items turn into hearts since we are not in a Devil Room,
    -- so delete the heart and manually create another pedestal item
    local pedestal = g.g:Spawn(
      EntityType.ENTITY_PICKUP, -- 5
      PickupVariant.PICKUP_COLLECTIBLE, -- 100
      pickup.Position,
      g.zeroVector,
      nil,
      0,
      pickup.InitSeed
    ):ToPickup()

    -- Set the price
    pedestal.AutoUpdatePrice = false
    pickup.Price = Misc:GetItemHeartPrice(pickup.SubType)

    -- Remove the heart
    pickup:Remove()
  end
end

-- Orange Pig Baby
PostPickupUpdate.functions[381] = function(pickup)
  -- Double items
  -- (we can't do this in the MC_POST_PICKUP_INIT callback because the position is not set)
  local gameFrameCount = g.g:GetFrameCount()
  if (
    pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE
    and g.r:IsFirstVisit()
    -- Frame 0 does not work
    -- Frame 1 works but we need to wait an extra frame for Racing+ to replace the pedestal
    and pickup.FrameCount == 2
    and pickup.State ~= 2 -- We mark a state of 2 to indicate a duplicated pedestal
    and (g.run.babyCountersRoom == 0 or g.run.babyCountersRoom == gameFrameCount)
  ) then
    local position = g.r:FindFreePickupSpawnPosition(pickup.Position, 1, true)
    g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
    local pedestal = g.g:Spawn(
      EntityType.ENTITY_PICKUP, -- 5
      PickupVariant.PICKUP_COLLECTIBLE, -- 100
      position,
      g.zeroVector,
      nil,
      0,
      g.run.randomSeed
    ):ToPickup()
    pedestal.Price = pickup.Price -- We don't want it to automatically be bought
    -- We want it to keep the behavior of the room
    pedestal.TheresOptionsPickup = pickup.TheresOptionsPickup
    pedestal.State = 2 -- Mark it so that we don't duplicate it again

    -- We only want to duplicate pedestals once per room to avoid duplicating rerolled pedestals
    -- (the state will go back to 0 for a rerolled pedestal)
    g.run.babyCountersRoom = gameFrameCount
  end
end

-- Cowboy Baby
PostPickupUpdate.functions[394] = function(pickup)
  -- Pickups shoot
  if (
    pickup.FrameCount % 35 == 0 -- Every 1.17 seconds
    and not pickup:GetSprite():IsPlaying("Collect") -- Don't shoot if we already picked it up
  ) then
    local velocity = g.p.Position - pickup.Position
    velocity:Normalize()
    velocity = velocity * 7
    Isaac.Spawn(
      EntityType.ENTITY_PROJECTILE, -- 9
      ProjectileVariant.PROJECTILE_NORMAL, -- 0
      0,
      pickup.Position,
      velocity,
      pickup
    )
  end
end

-- Fate's Reward
PostPickupUpdate.functions[537] = function(pickup)
  -- Rerolled items turn into hearts
  -- so delete the heart and manually create another pedestal item
  local roomType = g.r:GetType()
  if (
    roomType ~= RoomType.ROOM_SHOP -- 2
    and roomType ~= RoomType.ROOM_ERROR -- 3
    and pickup.Variant == PickupVariant.PICKUP_HEART -- 10
    and pickup.SubType == HeartSubType.HEART_FULL -- 1
    and pickup.Price == 3
  ) then
    g.run.roomRNG = g:IncrementRNG(g.run.roomRNG)
    local pedestal = g.g:Spawn(
      EntityType.ENTITY_PICKUP, -- 5
      PickupVariant.PICKUP_COLLECTIBLE, -- 100
      pickup.Position,
      g.zeroVector,
      nil,
      0,
      g.run.roomRNG
    ):ToPickup()
    pedestal.Price = 15
    pickup:Remove()
  end
end

-- The collection of functions for each baby
PostPickupUpdate.touchedFunctions = {}

-- Cute Baby
PostPickupUpdate.touchedFunctions[11] = function()
  -- -1 damage per pickup taken
  g.run.babyCounters = g.run.babyCounters + 1
  g.p:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
  g.p:EvaluateItems()
end

-- Bluebird Baby
PostPickupUpdate.touchedFunctions[147] = function()
  -- Touching pickups causes paralysis (2/2)
  g.p:UsePill(PillEffect.PILLEFFECT_PARALYSIS, PillColor.PILL_NULL) -- 22, 0
end

-- Worry Baby
PostPickupUpdate.touchedFunctions[167] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local baby = g.babies[167]

  -- Touching pickups causes teleportation (1/2)
  -- Teleport 2 frames in the future so that we can put an item in the Schoolbag
  if g.run.babyFrame == 0 then
    g.run.babyFrame = gameFrameCount + baby.num
  end
end

-- Corrupted Baby
PostPickupUpdate.touchedFunctions[307] = function()
  -- Touching items/pickups causes damage (2/2)
  g.p:TakeDamage(1, 0, EntityRef(g.p), 0)
end

-- Robbermask Baby
PostPickupUpdate.touchedFunctions[473] = function()
  -- Touching pickups gives extra damage
  g.run.babyCounters = g.run.babyCounters + 1
  g.p:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
  g.p:EvaluateItems()
end

return PostPickupUpdate
