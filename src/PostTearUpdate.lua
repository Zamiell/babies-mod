local PostTearUpdate = {}

-- Includes
local g    = require("src/globals")
local Misc = require("src/misc")

-- ModCallbacks.MC_POST_TEAR_UPDATE (40)
function PostTearUpdate:Main(tear)
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local room = game:GetRoom()
  local roomFrameCount = room:GetFrameCount()
  local player = game:GetPlayer(0)
  local sprite = tear:GetSprite()
  local data = tear:GetData()
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Ed Baby" and -- 100
     tear.SubType == 1 and
     tear.FrameCount % 2 == 0 then

    -- Fire trail tears
    local fire = game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.HOT_BOMB_FIRE, -- 1000.51
                            tear.Position, Vector(0, 0), nil, 0, 0)
    fire.SpriteScale = Vector(0.5, 0.5)

    -- Fade the fire so that it is easier to see everything
    local color = fire:GetColor()
    local fadeAmount = 0.5
    local newColor = Color(color.R, color.G, color.B, fadeAmount, color.RO, color.GO, color.BO)
    fire:SetColor(newColor, 0, 0, true, true)

  elseif baby.name == "Skinny Baby" and -- 213
     tear.SubType == 1 and
     tear.FrameCount >= 10 then

    -- Find the nearest enemy
    local distance = 40000
    local closestNPC
    for i, entity in pairs(Isaac.GetRoomEntities()) do
      local npc = entity:ToNPC()
      if npc ~= nil and
         npc:IsVulnerableEnemy() and -- Returns true for enemies that can be damaged
         npc:IsDead() == false and
         player.Position:Distance(npc.Position) < distance then

        distance = player.Position:Distance(npc.Position)
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

  elseif baby.name == "Hanger Baby" and -- 228
         tear.FrameCount == 1 and
         tear.SpawnerType == EntityType.ENTITY_FAMILIAR and -- 3
         tear.SpawnerVariant == FamiliarVariant.ABEL then -- 8

    -- Abel's tears hurt you
    if roomFrameCount >= 30 then
      -- Abel is spawned on top of the player when the player first enters a room;
      -- don't shoot if this is the case
      game:Spawn(EntityType.ENTITY_PROJECTILE, ProjectileVariant.PROJECTILE_NORMAL, -- 9.0
                 tear.Position, tear.Velocity, nil, 0, tear.InitSeed)
    end
    tear:Remove()

  elseif baby.name == "8 Ball Baby" and -- 251
         tear.SubType == 1 then

    -- Orbiting tears
    local positionMod = Vector(0, baby.distance * -1) -- The tear starts directly above the player
    local degrees = tear.FrameCount * 8 -- Tears rotate 4 degrees per frame
    positionMod = positionMod:Rotated(degrees)
    tear.Position = player.Position + positionMod

    -- We want the tear to be moving perpendicular to the line between the player and the tear
    tear.Velocity = Vector(baby.distance / 4, 0)
    tear.Velocity = tear.Velocity:Rotated(degrees)

    -- Keep it in the air for a while
    if tear.FrameCount < 150 then
      tear.FallingSpeed = 0
    end

  elseif baby.name == "Lantern Baby" and -- 292
         tear.Parent ~= nil and
         tear.Parent.Type == EntityType.ENTITY_PLAYER then -- 1

    -- Emulate having a Godhead aura
    tear.Position = Vector(player.Position.X, player.Position.Y + 10)

    -- Clear the sprite for the Ludo tear
    sprite:Reset()

  elseif baby.name == "Speaker Baby" and -- 316
         tear.SubType == 1 and
         tear.FrameCount >= 20 then

    local rotation = 45
    for i = 1, 4 do
      rotation = rotation + 90
      local rotatedVelocity = tear.Velocity:Rotated(rotation)
      g.run.babyBool = true
      local xTear = player:FireTear(player.Position, rotatedVelocity, false, true, false)
      g.run.babyBool = false
      xTear.Position = tear.Position
      xTear.Height = tear.Height
    end
    tear:Remove()

  elseif baby.name == "Octopus Baby" and -- 380
         tear.SubType == 1 and
         gameFrameCount % 5 == 0 then -- If we spawn creep on every frame, it becomes too thick

    -- Make the tear drip black creep
    local creep = game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_BLACK, -- 45
                               tear.Position, Vector(0, 0), tear, 0, 0)
    creep:ToEffect().Timeout = 240

  elseif baby.name == "Cylinder Baby" then -- 434
    tear.SpriteScale = Vector(tear.SpriteScale.X + 0.1, tear.SpriteScale.Y + 0.1)

  elseif baby.name == "Green Koopa Baby" and -- 455
         tear.SubType == 1 then

    if tear.FrameCount <= 120 then -- 4 seconds
      -- The MC_POST_TEAR_UPDATE callback will fire before the MC_POST_FIRE_TEAR callback,
      -- so do nothing if we are in on the first frame
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

  elseif baby.name == "Red Koopa Baby" and -- 458
         tear.SubType == 1 then

    if tear.FrameCount <= 120 then -- 4 seconds
      -- The MC_POST_TEAR_UPDATE callback will fire before the MC_POST_FIRE_TEAR callback,
      -- so do nothing if we are in on the first frame
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

  elseif baby.name == "Sad Bunny Baby" and -- 459
         tear.SubType == 1 and
         tear:IsDead() then -- Tears will not die if they hit an enemy, but they will die if they hit a wall or object

    -- The streak ended
    g.run.babyCounters = 0
    player:AddCacheFlags(CacheFlag.CACHE_FIREDELAY) -- 2
    player:EvaluateItems()

  elseif baby.name == "404 Baby" and -- 463
         tear.FrameCount == 0 then

    Misc:SetRandomColor(tear)

  elseif baby.name == "Cursed Pillow Baby" and -- 487
         tear.SubType == 1 and
         tear:IsDead() then -- Tears will not die if they hit an enemy, but they will die if they hit a wall or object

    -- Missing tears causes damage
    -- It only applies to the Nth missed tear
    g.run.babyCounters = g.run.babyCounters + 1
    if g.run.babyCounters == baby.num then
      g.run.babyCounters = 0
      player:TakeDamage(1, 0, EntityRef(player), 0)
    end

  elseif baby.name == "Brother Bobby" and -- 522
         tear.SubType == 1 then

    -- This tear is supposed to be attached to the knife
    local entities = Isaac.FindByType(EntityType.ENTITY_KNIFE, -1, -1, false, false) -- 8
    if #entities > 0 then
      local knife = entities[1]
      tear.Height = -10 -- Keep it in the air forever
      tear.Position = knife.Position
      tear.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE -- 0
      tear.GridCollisionClass = GridCollisionClass.COLLISION_NONE -- 0
    end

  elseif baby.name == "Abel" and -- 531
         tear.SubType == 1 and
         tear:IsDead() then -- Tears will not die if they hit an enemy, but they will die if they hit a wall or object

    -- Missing tears causes Paralysis
    -- It only applies to the Nth missed tear
    g.run.babyCounters = g.run.babyCounters + 1
    if g.run.babyCounters == baby.num then
      g.run.babyCounters = 0
      player:UsePill(PillEffect.PILLEFFECT_PARALYSIS, PillColor.PILL_NULL) -- 22, 0
      -- (we can't cancel the animation or it will cause the bug where the player cannot pick up pedestal items)
    end
  end
end

return PostTearUpdate
