local PostTearUpdate = {}

-- Includes
local g    = require("babies_mod/globals")
local Misc = require("babies_mod/misc")

-- ModCallbacks.MC_POST_TEAR_UPDATE (40)
function PostTearUpdate:Main(tear)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  local babyFunc = PostTearUpdate.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc(tear)
  end
end

-- The collection of functions for each baby
PostTearUpdate.functions = {}

-- Ed Baby
PostTearUpdate.functions[100] = function(tear)
  -- Fire trail tears
  if tear.SubType == 1 and
     tear.FrameCount % 2 == 0 then

    local fire = Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.HOT_BOMB_FIRE, 0, -- 1000.51
                             tear.Position, g.zeroVector, nil)
    fire.SpriteScale = Vector(0.5, 0.5)

    -- Fade the fire so that it is easier to see everything
    local color = fire:GetColor()
    local fadeAmount = 0.5
    local newColor = Color(color.R, color.G, color.B, fadeAmount, color.RO, color.GO, color.BO)
    fire:SetColor(newColor, 0, 0, true, true)
  end
end

-- Skinny Baby
PostTearUpdate.functions[213] = function(tear)
  if tear.SubType == 1 and
     tear.FrameCount >= 10 then

    -- Find the nearest enemy
    local distance = 40000
    local closestNPC
    for _, entity in ipairs(Isaac.GetRoomEntities()) do
      local npc = entity:ToNPC()
      if npc ~= nil and
         npc:IsVulnerableEnemy() and -- Returns true for enemies that can be damaged
         not npc:IsDead() and
         g.p.Position:Distance(npc.Position) < distance then

        distance = g.p.Position:Distance(npc.Position)
        closestNPC = npc
      end
    end
    if closestNPC == nil then
      return
    end

    -- Super homing tears
    local initialSpeed = tear.Velocity:LengthSquared()
    tear.Velocity = closestNPC.Position - tear.Position
    tear.Velocity = tear.Velocity:Normalized()
    while tear.Velocity:LengthSquared() < initialSpeed do
      tear.Velocity = tear.Velocity * 1.1
    end
  end
end

-- Hanger Baby
PostTearUpdate.functions[228] = function(tear)
  -- Abel's tears hurt you
  if tear.FrameCount == 1 and
     tear.SpawnerType == EntityType.ENTITY_FAMILIAR and -- 3
     tear.SpawnerVariant == FamiliarVariant.ABEL then -- 8

    if g.r:GetFrameCount() >= 30 then
      -- Abel is spawned on top of the player when the player first enters a room;
      -- don't shoot if this is the case
      g.g:Spawn(EntityType.ENTITY_PROJECTILE, ProjectileVariant.PROJECTILE_NORMAL, -- 9.0
                tear.Position, tear.Velocity, nil, 0, tear.InitSeed)
    end
    tear:Remove()
  end
end

-- 8 Ball Baby
PostTearUpdate.functions[246] = function(tear)
  -- Orbiting tears
  if tear.SubType ~= 1 then
    return
  end

  local positionMod = Vector(0, g.babies[251].distance * -1) -- The tear starts directly above the player
  local degrees = tear.FrameCount * 8 -- Tears rotate 4 degrees per frame
  positionMod = positionMod:Rotated(degrees)
  tear.Position = g.p.Position + positionMod

  -- We want the tear to be moving perpendicular to the line between the player and the tear
  tear.Velocity = Vector(g.babies[251].distance / 4, 0)
  tear.Velocity = tear.Velocity:Rotated(degrees)

  -- Keep it in the air for a while
  if tear.FrameCount < 150 then
    tear.FallingSpeed = 0
  end
end

-- Lantern Baby
PostTearUpdate.functions[292] = function(tear)
  -- Emulate having a Godhead aura
  if tear.Parent ~= nil and
     tear.Parent.Type == EntityType.ENTITY_PLAYER then -- 1

    tear.Position = Vector(g.p.Position.X, g.p.Position.Y + 10)

    -- Clear the sprite for the Ludo tear
    tear:GetSprite():Reset()
  end
end

-- Speaker Baby
PostTearUpdate.functions[316] = function(tear)
  if tear.SubType == 1 and
     tear.FrameCount >= 20 then

    local rotation = 45
    for i = 1, 4 do
      rotation = rotation + 90
      local rotatedVelocity = tear.Velocity:Rotated(rotation)
      g.run.babyBool = true
      local xTear = g.p:FireTear(g.p.Position, rotatedVelocity, false, true, false)
      g.run.babyBool = false
      xTear.Position = tear.Position
      xTear.Height = tear.Height
    end
    tear:Remove()
  end
end

-- Octopus Baby
PostTearUpdate.functions[380] = function(tear)
  if tear.SubType == 1 and
     g.g:GetFrameCount() % 5 == 0 then -- If we spawn creep on every frame, it becomes too thick

    -- Make the tear drip black creep
    local creep = Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_BLACK, 0, -- 1000.45
                              tear.Position, g.zeroVector, tear)
    creep:ToEffect().Timeout = 240
  end
end

-- Cylinder Baby
PostTearUpdate.functions[434] = function(tear)
  tear.SpriteScale = Vector(tear.SpriteScale.X + 0.1, tear.SpriteScale.Y + 0.1)
end

-- Green Koopa Baby
PostTearUpdate.functions[455] = function(tear)
  if tear.SubType ~= 1 then
    return
  end

  if tear.FrameCount <= 120 then -- 4 seconds
    -- The MC_POST_TEAR_UPDATE callback will fire before the MC_POST_FIRE_TEAR callback,
    -- so do nothing if we are in on the first frame
    local data = tear:GetData()
    if data.Height == nil then
      return
    end

    -- If the tear bounced, then we need to update the stored velocity to the new velocity\
    -- ("tear.Bounce" does not ever seem to go to true, so we can't use that)
    if (tear.Velocity.X > 0 and data.Velocity.X < 0) or
        (tear.Velocity.X < 0 and data.Velocity.X > 0) or
        (tear.Velocity.Y > 0 and data.Velocity.Y < 0) or
        (tear.Velocity.Y < 0 and data.Velocity.Y > 0) then

      data.Velocity = tear.Velocity
    end

    -- Continue to apply the initial tear conditions for the duration of the tear
    tear.Height = data.Height
    tear.Velocity = data.Velocity

  else
    -- The tear has lived long enough, so manually kill it
    tear:Remove()
  end
end

-- Red Koopa Baby
PostTearUpdate.functions[458] = function(tear)
  if tear.SubType ~= 1 then
    return
  end

  if tear.FrameCount <= 120 then -- 4 seconds
    -- The MC_POST_TEAR_UPDATE callback will fire before the MC_POST_FIRE_TEAR callback,
    -- so do nothing if we are in on the first frame
    local data = tear:GetData()
    if data.Height == nil then
      return
    end

    -- Continue to apply the initial tear conditions for the duration of the tear
    tear.Height = data.Height

    -- However, we can't apply a static velocity or else the shells won't home
    tear.Velocity = tear.Velocity:Normalized() * 10

  else
    -- The tear has lived long enough, so manually kill it
    tear:Remove()
  end
end

-- Sad Bunny Baby
PostTearUpdate.functions[459] = function(tear)
  if tear.SubType == 1 and
     tear:IsDead() then -- Tears will not die if they hit an enemy, but they will die if they hit a wall or object

    -- The streak ended
    g.run.babyCounters = 0
    g.p:AddCacheFlags(CacheFlag.CACHE_FIREDELAY) -- 2
    g.p:EvaluateItems()
  end
end

-- 404 Baby
PostTearUpdate.functions[463] = function(tear)
  if tear.FrameCount == 0 then
    Misc:SetRandomColor(tear)
  end
end

-- Cursed Pillow Baby
PostTearUpdate.functions[487] = function(tear)
  if tear.SubType == 1 and
     tear:IsDead() then -- Tears will not die if they hit an enemy, but they will die if they hit a wall or object

    -- Missing tears causes damage
    -- It only applies to the Nth missed tear
    g.run.babyCounters = g.run.babyCounters + 1
    if g.run.babyCounters == g.babies[487].num then
      g.run.babyCounters = 0
      g.p:TakeDamage(1, 0, EntityRef(g.p), 0)
    end
  end
end

-- Brother Bobby
PostTearUpdate.functions[522] = function(tear)
  if tear.SubType ~= 1 then
    return
  end

  -- This tear is supposed to be attached to the knife
  local knives = Isaac.FindByType(EntityType.ENTITY_KNIFE, -1, -1, false, false) -- 8
  if #knives > 0 then
    local knife = knives[1]
    tear.Height = -10 -- Keep it in the air forever
    tear.Position = knife.Position
    tear.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE -- 0
    tear.GridCollisionClass = GridCollisionClass.COLLISION_NONE -- 0
  end
end

-- Abel
PostTearUpdate.functions[531] = function(tear)
  if tear.SubType == 1 and
     tear:IsDead() then -- Tears will not die if they hit an enemy, but they will die if they hit a wall or object

    -- Missing tears causes Paralysis
    -- It only applies to the Nth missed tear
    g.run.babyCounters = g.run.babyCounters + 1
    if g.run.babyCounters == g.babies[531].num then
      g.run.babyCounters = 0
      g.p:UsePill(PillEffect.PILLEFFECT_PARALYSIS, PillColor.PILL_NULL) -- 22, 0
      -- (we can't cancel the animation or it will cause the bug where the player cannot pick up pedestal items)
    end
  end
end

return PostTearUpdate
