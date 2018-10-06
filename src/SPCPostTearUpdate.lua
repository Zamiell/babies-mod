local SPCPostTearUpdate = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_TEAR_UPDATE (40)
function SPCPostTearUpdate:Main(tear)
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Speaker Baby" and -- 316
     tear.SubType == 1 and
     tear.FrameCount >= 20 then -- If we spawn creep on every frame, it becomes too thick

    local rotation = 45
    for i = 1, 4 do
      rotation = rotation + 90
      local rotatedVelocity = tear.Velocity:Rotated(rotation)
      SPCGlobals.run.speakerBabyShooting = true
      local xTear = player:FireTear(player.Position, rotatedVelocity, false, true, false)
      SPCGlobals.run.speakerBabyShooting = false
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

  elseif baby.name == "Green Koopa Baby" and -- 455
         tear.SubType == 1 then

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

  elseif baby.name == "Red Koopa Baby" and -- 458
         tear.SubType == 1 then

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

  elseif baby.name == "Sad Bunny Baby" and -- 459
         tear.SubType == 1 and
         tear:IsDead() then -- Tears will not die if they hit an enemy, but they will die if they hit a wall or object

    -- The streak ended
    SPCGlobals.run.sadBunnyCounters = 0
    player:AddCacheFlags(CacheFlag.CACHE_FIREDELAY) -- 2
    player:EvaluateItems()

  elseif baby.name == "Cursed Pillow Baby" and -- 487
         tear.SubType == 1 and
         tear:IsDead() then -- Tears will not die if they hit an enemy, but they will die if they hit a wall or object

    -- Missing tears causes damage
    player:TakeDamage(1, 0, EntityRef(player), 0)

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
    player:UsePill(PillEffect.PILLEFFECT_PARALYSIS, PillColor.PILL_NULL) -- 22, 0
    player:StopExtraAnimation()
  end
end

return SPCPostTearUpdate
