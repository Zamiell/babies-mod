local SPCPostFireTear = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_FIRE_TEAR (61)
function SPCPostFireTear:Main(tear)
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Water Baby" and -- 3
     SPCGlobals.run.waterBabyTears > 0 then

    SPCGlobals.run.waterBabyTears = SPCGlobals.run.waterBabyTears - 1

    -- Make it look more impressive
    tear.Scale = 5
    tear.KnockbackMultiplier = 20

    -- We can't modify the damage ("BaseDamage" is a constant)
    -- We can improve the damage in the EntityTakeDmg callback
    -- Mark the tear for later (tears do not usually use SubTypes and we cannot use the "GetData()" function)
    tear.SubType = 1

  elseif baby.name == "Cockeyed Baby" and -- 8
         SPCGlobals.run.cockeyedBabyFiring == false then

    -- Spawn a new tear with a random velocity
    local seed = tear:GetDropRNG():GetSeed()
    math.randomseed(seed)
    local rotation = math.random(1, 359)
    local vel = tear.Velocity:Rotated(rotation)
    SPCGlobals.run.cockeyedBabyFiring = true
    player:FireTear(player.Position, vel, false, true, false)
    SPCGlobals.run.cockeyedBabyFiring = false

  elseif baby.name == "Aether Baby" then -- 106
    SPCGlobals.run.aetherBabyRotation = SPCGlobals.run.aetherBabyRotation + 45
    if SPCGlobals.run.aetherBabyRotation < 360 then
      local vel = tear.Velocity:Rotated(SPCGlobals.run.aetherBabyRotation)
      player:FireTear(player.Position, vel, false, true, false)
    else
      SPCGlobals.run.aetherBabyRotation = 0
    end

  elseif baby.name == "Eyemouth Baby" then -- 111
    SPCGlobals.run.eyemouthBaby.tear = SPCGlobals.run.eyemouthBaby.tear + 1
    if SPCGlobals.run.eyemouthBaby.tear >= 4 then
      -- Mark to fire a tear 1 frame from now
      SPCGlobals.run.eyemouthBaby.tear = 0
      SPCGlobals.run.eyemouthBaby.frame = gameFrameCount + 1
      SPCGlobals.run.eyemouthBaby.velocity = Vector(tear.Velocity.X, tear.Velocity.Y)
    end

  elseif baby.name == "Crooked Baby" then -- 133
    tear.Velocity = tear.Velocity:Rotated(-15)

  elseif baby.name == "Monocle Baby" then -- 206
    tear.Scale = tear.Scale * 3

  elseif baby.name == "Tilt Baby" then -- 230
    tear.Velocity = tear.Velocity:Rotated(15)

  elseif baby.name == "Spiky Demon Baby" then -- 277
    SPCGlobals.run.spikyDemonBabyRot = SPCGlobals.run.spikyDemonBabyRot + 90
    if SPCGlobals.run.spikyDemonBabyRot < 360 then
      local vel = tear.Velocity:Rotated(SPCGlobals.run.spikyDemonBabyRot)
      player:FireTear(player.Position, vel, false, true, false)
    else
      SPCGlobals.run.spikyDemonBabyRot = 0
    end

  elseif baby.name == "Butt Baby" then -- 288
    player:UseActiveItem(CollectibleType.COLLECTIBLE_BEAN, false, false, false, false) -- 111

  elseif baby.name == "X Baby" then -- 339
    SPCGlobals.run.xBabyTears = SPCGlobals.run.xBabyTears + 1
    tear.Velocity = tear.Velocity:Rotated(45)
    if SPCGlobals.run.xBabyTears < 4 then
      player:FireTear(player.Position, tear.Velocity:Rotated(45), false, true, false)
    else
      SPCGlobals.run.xBabyTears = 0
    end

  elseif baby.name == "Locust Baby" then -- 345
    tear:ChangeVariant(TearVariant.BOOGER) -- 26
    tear.TearFlags = TearFlags.TEAR_BOOGER -- 1 << 46

  elseif baby.name == "2600 Baby" then -- 347
    tear.Velocity = tear.Velocity:Rotated(180)

  elseif baby.name == "Turtle Dragon Baby" then -- 364
    -- If we do "player:ShootRedCandle(tear.Velocity)", the fires have enormous speed and are hard to control
    local angle = tear.Velocity:GetAngleDegrees()
    local normalizedVelocity = Vector.FromAngle(angle)
    player:ShootRedCandle(normalizedVelocity)
    tear:Remove()

  elseif baby.name == "Pink Ghost Baby" then -- 372
    tear:SetColor(Color(2, 0.05, 1, 0.7, 1, 1, 1), 10000, 10000, false, false) -- Hot pink
    tear.TearFlags = TearFlags.TEAR_CHARM -- 1 << 13

  elseif baby.name == "Blindcursed Baby" then -- 466
    tear.Visible = false

  elseif baby.name == "Mern Baby" then -- 500
    SPCGlobals.run.mernBaby.tear = SPCGlobals.run.mernBaby.tear + 1
    if SPCGlobals.run.mernBaby.tear >= 2 then
      -- Mark to fire a tear 1 frame from now
      SPCGlobals.run.mernBaby.tear = 0
      SPCGlobals.run.mernBaby.frame = gameFrameCount + 1
      SPCGlobals.run.mernBaby.velocity = Vector(tear.Velocity.X, tear.Velocity.Y)
    end
  end
end

return SPCPostFireTear
