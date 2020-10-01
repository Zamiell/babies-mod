local PostFireTear = {}

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_POST_FIRE_TEAR (61)
function PostFireTear:Main(tear)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  local babyFunc = PostFireTear.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc(tear)
  end
end

-- The collection of functions for each baby
PostFireTear.functions = {}

-- Bloat Baby
PostFireTear.functions[2] = function(tear)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]

  g.run.babyCounters = g.run.babyCounters + 1
  if g.run.babyCounters == baby.num then
    g.run.babyCounters = 0
    tear:ChangeVariant(TearVariant.NEEDLE) -- 31
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_NEEDLE -- 1 << 52
  end
end

-- Cockeyed Baby
PostFireTear.functions[8] = function(tear)
  if g.run.babyBool then
    return
  end

  -- Spawn a new tear with a random velocity
  local seed = tear:GetDropRNG():GetSeed()
  math.randomseed(seed)
  local rotation = math.random(1, 359)
  local vel = tear.Velocity:Rotated(rotation)
  g.run.babyBool = true
  g.p:FireTear(g.p.Position, vel, false, true, false)
  g.run.babyBool = false
end

-- Mag Baby
PostFireTear.functions[18] = function(tear)
  tear:ChangeVariant(TearVariant.METALLIC) -- 3
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_CONFUSION -- 1 << 14
end

-- Blue Baby
PostFireTear.functions[30] = function(tear)
  -- Sprinkler tears need to originate at the player
  tear.Position = g.p.Position
end

-- Long Baby
PostFireTear.functions[34] = function(tear)
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_FLAT -- 1 << 27
end

-- Green Baby
PostFireTear.functions[35] = function(tear)
  tear:ChangeVariant(TearVariant.BOOGER) -- 26
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_BOOGER -- 1 << 46
end

-- Super Greed Baby
PostFireTear.functions[54] = function(tear)
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_MIDAS -- 1 << 51
end

-- Mort Baby
PostFireTear.functions[55] = function(tear)
  -- Mark that we shot this tear
  tear.SubType = 1
end

-- Big Eyes Baby
PostFireTear.functions[59] = function(tear)
  -- Tears cause self-knockback
  g.p.Velocity = g.p.Velocity + (tear.Velocity * -0.75)
end

-- Mustache Baby
PostFireTear.functions[66] = function(tear)
  -- Boomerang tears
  -- We can't just use The Boomerang item because there is no way to avoid a long cooldown
  -- So we spawn an effect instead
  g.g:Spawn(
    EntityType.ENTITY_EFFECT, -- 1000
    EffectVariant.BOOMERANG, -- 60
    tear.Position,
    tear.Velocity,
    tear.SpawnerEntity,
    0,
    tear.InitSeed
  )
  tear:Remove()
end

-- Parasite Baby
PostFireTear.functions[77] = function(tear)
  tear:ChangeVariant(TearVariant.BALLOON) -- 35
end

-- Scream Baby
PostFireTear.functions[81] = function(tear)
  g.p:UseActiveItem(CollectibleType.COLLECTIBLE_SHOOP_DA_WHOOP, false, false, false, false) -- 49
  tear:Remove()
end

-- Square Eyes Baby
PostFireTear.functions[94] = function(tear)
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_SQUARE -- 1 << 31
end

-- Ed Baby
PostFireTear.functions[100] = function(tear)
  -- Mark that we shot this tear
  tear.SubType = 1
end

-- Aether Baby
PostFireTear.functions[106] = function(tear)
  -- Shoot 8 tears at a time
  -- (we store the rotation angle inside the "babyCounters" variable)
  g.run.babyCounters = g.run.babyCounters + 45
  if g.run.babyCounters < 360 then
    local vel = tear.Velocity:Rotated(g.run.babyCounters)
    g.p:FireTear(g.p.Position, vel, false, true, false)
  else
    g.run.babyCounters = 0
  end
end

-- Eyemouth Baby
PostFireTear.functions[111] = function(tear)
  -- Shoot an extra tear every 3rd shot
  g.run.babyTears.tear = g.run.babyTears.tear + 1
  if g.run.babyTears.tear >= 4 then
    -- Mark to fire a tear 1 frame from now
    g.run.babyTears.tear = 0
    g.run.babyTears.frame = g.g:GetFrameCount() + 1
    g.run.babyTears.velocity = Vector(tear.Velocity.X, tear.Velocity.Y)
  end
end

-- V Baby
PostFireTear.functions[113] = function(tear)
  g.p:FireTechXLaser(tear.Position, tear.Velocity, 5)
  tear:Remove()
end

-- Strange Mouth Baby
PostFireTear.functions[114] = function(tear)
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_WIGGLE -- 1 << 10
end

-- Strange Shape Baby
PostFireTear.functions[130] = function(tear)
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_PULSE -- 1 << 25
end

-- Crooked Baby
PostFireTear.functions[133] = function(tear)
  tear.Velocity = tear.Velocity:Rotated(-15)
end

-- Cape Baby
PostFireTear.functions[152] = function(tear)
  local angleModifier = math.random(0, 90) - 45
  tear.Velocity = tear.Velocity:Rotated(angleModifier)
  tear:SetColor(Color(2, 2, 0, 0.7, 1, 1, 1), 10000, 10000, false, false) -- Yellow
end

-- Lights Baby
PostFireTear.functions[165] = function(tear)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]

  g.run.babyCounters = g.run.babyCounters + 1
  if g.run.babyCounters == baby.num then
    g.run.babyCounters = 0
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_LIGHT_FROM_HEAVEN -- 1 << 37
  end
end

-- Web Baby
PostFireTear.functions[185] = function(tear)
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_SLOW -- 1 << 3
end

-- Sick Baby
PostFireTear.functions[187] = function(tear)
  g.g:Spawn(
    EntityType.ENTITY_FAMILIAR, -- 3
    FamiliarVariant.BLUE_FLY, -- 43
    tear.Position,
    tear.Velocity,
    tear.SpawnerEntity,
    g.BlueFlyVariant.BLUEFLY_RED,
    tear.InitSeed
  )
  tear:Remove()
end

-- Cold Baby
PostFireTear.functions[194] = function(tear)
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_FREEZE -- 1 << 5
  tear:SetColor(Color(0, 0, 2, 0.7, 1, 1, 1), 10000, 10000, false, false) -- Blue
end

-- Nice Baby
PostFireTear.functions[197] = function(tear)
  g.p:FireBrimstone(tear.Velocity)
  tear:Remove()
end

-- Blindfold Baby
PostFireTear.functions[202] = function(tear)
  -- Starts with Incubus + blindfolded
  -- (we need to manually blindfold the player so that the Incubus works properly)
  tear:Remove()
end

-- Monocle Baby
PostFireTear.functions[206] = function(tear)
  tear.Scale = tear.Scale * 3
end

-- Skinny Baby
PostFireTear.functions[213] = function(tear)
  -- Mark that we shot this tear
  tear.SubType = 1
end

-- Tilt Baby
PostFireTear.functions[230] = function(tear)
  tear.Velocity = tear.Velocity:Rotated(15)
end

-- Bawl Baby
PostFireTear.functions[231] = function(tear)
  tear.CollisionDamage = g.p.Damage / 2
end

-- 8 Ball Baby
PostFireTear.functions[246] = function(tear)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]

  -- Mark that we shot this tear
  tear.SubType = 1

  -- We need to have spectral for this ability to work properly
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_SPECTRAL -- 1

  -- Start with the tears directly above the player and moving towards the right
  tear.Position = Vector(0, baby.distance * -1)
  tear.Velocity = Vector(baby.distance / 4, 0)
  tear.FallingSpeed = 0
end

-- Orange Demon Baby
PostFireTear.functions[279] = function(tear)
  -- Explosivo tears
  -- Only do every other tear to avoid softlocks
  g.run.babyCounters = g.run.babyCounters + 1
  if g.run.babyCounters == 2 then
    g.run.babyCounters = 0
    tear:ChangeVariant(TearVariant.EXPLOSIVO) -- 19
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_STICKY -- 1 << 35
  end
end

-- Butt Baby
PostFireTear.functions[288] = function(tear)
  g.p:UseActiveItem(CollectibleType.COLLECTIBLE_BEAN, false, false, false, false) -- 111
end

-- Speaker Baby
PostFireTear.functions[316] = function(tear)
  -- We mark it so that we can split it later
  if not g.run.babyBool then
    tear.SubType = 1
  end
end

-- Slicer Baby
PostFireTear.functions[331] = function(tear)
  -- Make the Soy Milk tears do extra damage
  tear.CollisionDamage = g.p.Damage * 3
end

-- Boxers Baby
PostFireTear.functions[337] = function(tear)
  -- Turn all tears into boxing glove / punch tears similar to Antibirth's Knockout Drops
  -- Find out the size of the tear,
  -- which will determine the corresponding frame/animation for the new sprite
  local sprite = tear:GetSprite()
  local tearSize = "RegularTear6" -- Use the 6th one by default
  for i = 1, 13 do
    local animationName = "RegularTear" .. tostring(i)
    if sprite:IsPlaying(animationName) then
      tearSize = animationName
      break
    end
  end

  -- Change the sprite
  sprite:Load("gfx/fist_tears.anm2", true)
  sprite:Play(tearSize, false)

  -- By default, the sprite is facing to the right
  local tearAngle = tear.Velocity:GetAngleDegrees()
  if (
    (tearAngle > 90 and tearAngle <= 180)
    or (tearAngle >= -180 and tearAngle < -90)
  ) then
    -- If the tear is shooting to the left, then we need to rotate it and flip the sprite
    sprite.FlipY = true
    sprite.Rotation = tearAngle * -1
  else
    -- If the tear is shooting to the right, then just rotate it
    sprite.Rotation = tearAngle
  end

  -- Mark it as a special tear so that we can play a sound effect later
  tear.SubType = 1

  -- Apparently, the "tear:SetKnockbackMultiplier()" function does not work,
  -- so we have to set the custom knockback in the "EntityTakeDmg:Entity()" function
end

-- X Baby
PostFireTear.functions[339] = function(tear)
  g.run.babyCounters = g.run.babyCounters + 1
  tear.Velocity = tear.Velocity:Rotated(45)
  if g.run.babyCounters < 4 then
    g.p:FireTear(g.p.Position, tear.Velocity:Rotated(45), false, true, false)
  else
    g.run.babyCounters = 0
  end
end

-- O Baby 2
PostFireTear.functions[340] = function(tear)
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_SPIRAL -- 1 << 26
end

-- Locust Baby
PostFireTear.functions[345] = function(tear)
  tear:ChangeVariant(TearVariant.BOOGER) -- 26
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_BOOGER -- 1 << 46
end

-- 2600 Baby
PostFireTear.functions[347] = function(tear)
  tear.Velocity = tear.Velocity:Rotated(180)
end

-- Mushroom Girl Baby
PostFireTear.functions[361] = function(tear)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]

  -- Extra bomb shots
  g.run.babyCounters = g.run.babyCounters + 1
  if g.run.babyCounters == baby.num then
    g.run.babyCounters = 0
    g.g:Spawn(
      EntityType.ENTITY_BOMBDROP, -- 4
      BombVariant.BOMB_NORMAL, -- 1
      tear.Position,
      tear.Velocity,
      tear.SpawnerEntity,
      0,
      tear.InitSeed
    )
    tear:Remove()
  end
end

-- Turtle Dragon Baby
PostFireTear.functions[364] = function(tear)
  -- If we do "player:ShootRedCandle(tear.Velocity)",
  -- the fires have enormous speed and are hard to control
  local angle = tear.Velocity:GetAngleDegrees()
  local normalizedVelocity = Vector.FromAngle(angle)
  g.p:ShootRedCandle(normalizedVelocity)
  tear:Remove()
end

-- Arcade Baby
PostFireTear.functions[368] = function(tear)
  -- Changing the variant does not actually increase the damage, only the appearance
  tear:ChangeVariant(TearVariant.RAZOR) -- 28
  tear.CollisionDamage = g.p.Damage * 3
end

-- Pink Ghost Baby
PostFireTear.functions[372] = function(tear)
  tear:SetColor(Color(2, 0.05, 1, 0.7, 1, 1, 1), 10000, 10000, false, false) -- Hot pink
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_CHARM -- 1 << 13
end

-- Octopus Baby
PostFireTear.functions[380] = function(tear)
  -- Mark that we shot this tear
  tear.SubType = 1
end

-- Dark Space Soldier Baby
PostFireTear.functions[398] = function(tear)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]

  g.run.babyCounters = g.run.babyCounters + 1
  if g.run.babyCounters == baby.num then
    g.run.babyCounters = 0
    tear:ChangeVariant(TearVariant.CHAOS_CARD) -- 9
  end
end

-- Astronaut Baby
PostFireTear.functions[406] = function(tear)
  -- Mark that we shot this tear
  tear.SubType = 1
end

-- Gills Baby
PostFireTear.functions[410] = function(tear)
  tear:SetColor(Color(0.7, 1.5, 2, 0.7, 1, 1, 1), 10000, 10000, false, false) -- Light cyan

  -- Mark that we shot this tear
  tear.SubType = 1
end

-- Little Horn Baby
PostFireTear.functions[429] = function(tear)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]

  -- Void tears
  g.run.babyCounters = g.run.babyCounters + 1
  if g.run.babyCounters == baby.num then
    g.run.babyCounters = 0
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_HORN -- 1 << 54
  end
end

-- Tooth Head Baby
PostFireTear.functions[442] = function(tear)
  -- Changing the variant does not actually increase the damage, only the appearance
  tear:ChangeVariant(TearVariant.TOOTH) -- 2
  tear.CollisionDamage = g.p.Damage * 3.2
end

-- Green Koopa Baby
PostFireTear.functions[455] = function(tear)
  -- Turn all tears into green shell tears
  local sprite = tear:GetSprite()
  sprite:Load("gfx/shell_green_tears.anm2", true)
  sprite:Play("RegularTear1", false)

  -- Make it bouncy
  tear.TearFlags = (
    TearFlags.TEAR_BOUNCE -- 1 << 19
    | TearFlags.TEAR_POP -- 1 << 56
  )

  -- Make it lower to the ground
  tear.Height = -5

  -- Mark it as a special tear so that we can keep it updated
  tear.SubType = 1

  -- Store the initial height and velocity
  local data = tear:GetData()
  data.Height = tear.Height
  data.Velocity = tear.Velocity
end

-- Red Koopa Baby
PostFireTear.functions[458] = function(tear)
  -- Turn all tears into red shell tears
  local sprite = tear:GetSprite()
  sprite:Load("gfx/shell_red_tears.anm2", true)
  sprite:Play("RegularTear1", false)

  -- Make it bouncy and homing
  tear.TearFlags = (
    TearFlags.TEAR_HOMING -- 1 << 2
    | TearFlags.TEAR_BOUNCE -- 1 << 19
    | TearFlags.TEAR_POP -- 1 << 56
  )

  -- Make it lower to the ground
  tear.Height = -5

  -- Mark it as a special tear so that we can keep it updated
  tear.SubType = 1

  -- Store the initial height and velocity
  local data = tear:GetData()
  data.Height = tear.Height
  data.Velocity = tear.Velocity
end

-- Sad Bunny Baby
PostFireTear.functions[459] = function(tear)
  -- Mark that we shot this tear
  tear.SubType = 1
end

-- Voxdog Baby
PostFireTear.functions[462] = function(tear)
  -- Shockwave tears
  g.run.babyTears[#g.run.babyTears + 1] = {
    frame = g.g:GetFrameCount(),
    position = tear.Position,
    velocity = tear.Velocity:Normalized() * 30,
  }
  tear:Remove()
end

-- Blindcursed Baby
PostFireTear.functions[466] = function(tear)
  tear.Visible = false
end

-- Fly Baby
PostFireTear.functions[469] = function(tear)
  tear:ChangeVariant(TearVariant.GODS_FLESH) -- 16
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_PIERCING -- 1 << 1
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_SPLIT -- 1 << 6
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_WIGGLE -- 1 << 10
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_PULSE -- 1 << 25
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_BONE -- 1 << 49
end

-- Headphone Baby
PostFireTear.functions[470] = function(tear)
  -- Soundwave tears
  tear:ChangeVariant(TearVariant.PUPULA)
  -- Giving a tear flag of TEAR_FLAT makes it look worse
  tear.Scale = tear.Scale * 10
end

-- Imp Baby 2
PostFireTear.functions[480] = function(tear)
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_ACID -- 1 << 48
end

-- Cursed Pillow Baby
PostFireTear.functions[487] = function(tear)
  -- Mark that we shot this tear
  tear.SubType = 1
end

-- Pompadour Baby
PostFireTear.functions[494] = function(tear)
  tear:ChangeVariant(TearVariant.GODS_FLESH) -- 16
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_GODS_FLESH -- 1 << 41
end

-- Ill Baby
PostFireTear.functions[498] = function(tear)
  tear:ChangeVariant(TearVariant.BOBS_HEAD) -- 4
end

-- Mern Baby
PostFireTear.functions[500] = function(tear)
  g.run.babyTears.tear = g.run.babyTears.tear + 1
  if g.run.babyTears.tear >= 2 then
    -- Mark to fire a tear 1 frame from now
    g.run.babyTears.tear = 0
    g.run.babyTears.frame = g.g:GetFrameCount() + 1
    g.run.babyTears.velocity = Vector(tear.Velocity.X, tear.Velocity.Y)
  end
end

-- Psychic Baby
PostFireTear.functions[504] = function(tear)
  if (
    g.r:GetFrameCount() < 900 -- Only do it for the first 30 seconds of a room to avoid softlocks
    and g.r:GetRoomShape() < RoomShape.ROOMSHAPE_2x2 -- 8 (the L room shapes are 9, 10, 11, and 12)
  ) then
    -- Starts with Abel; tears come from Abel
    -- Get Abel's position
    local abels = Isaac.FindByType(
      EntityType.ENTITY_FAMILIAR, -- 3
      FamiliarVariant.ABEL, -- 8
      -1,
      false,
      false
    )
    if #abels > 0 then
      tear.Position = abels[1].Position
    else
      Isaac.DebugString("Error: Abel was not found.")
    end
  end
end

-- Master Cook Baby
PostFireTear.functions[517] = function(tear)
  tear:ChangeVariant(TearVariant.EGG) -- 27
  tear.TearFlags = tear.TearFlags | TearFlags.TEAR_EGG -- 1 << 47
end

-- Spider Baby
PostFireTear.functions[521] = function(tear)
  g.run.babyCounters = g.run.babyCounters + 1
  if g.run.babyCounters == 2 then
    g.run.babyCounters = 0

    -- Every second tear spawns a spider
    g.p:ThrowBlueSpider(g.p.Position, g.p.Position)
    tear:Remove()
  end
end

-- Abel
PostFireTear.functions[531] = function(tear)
  -- Mark that we shot this tear
  tear.SubType = 1
end

-- Rotten Baby
PostFireTear.functions[533] = function(tear)
  tear:Remove()
  g.p:AddBlueFlies(1, g.p.Position, nil)
end

-- Lil' Loki
PostFireTear.functions[539] = function(tear)
  -- Cross tears
  -- (we store the rotation angle in the "babyCounters" variable)
  g.run.babyCounters = g.run.babyCounters + 90
  if g.run.babyCounters < 360 then
    local vel = tear.Velocity:Rotated(g.run.babyCounters)
    g.p:FireTear(g.p.Position, vel, false, true, false)
  else
    g.run.babyCounters = 0
  end
end

return PostFireTear
