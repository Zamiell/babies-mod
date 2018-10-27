local version = 2.150
local firstLoad = false

if not stats or stats.Version < version then
    if not stats then
        stats = RegisterMod( "Stats API 2.0", 1 )
        firstLoad = true
    end
    stats.Version = version

    if firstLoad then
        firstLoad = false
        Isaac.DebugString("Loading StatAPI...")
        stats.Functions = {}

        function stats.UpdateFunctions(mod, player, cacheFlag)
            stats.RevertStats(player, cacheFlag)
            for stage = 1,4 do
                stats.UpdateStage(mod, player, cacheFlag, stage)
                stats.UpdateStats(player, cacheFlag, stage)
            end
        end

        stats:AddCallback(ModCallbacks.MC_EVALUATE_CACHE, stats.UpdateFunctions)

        function stats:Update()
            stats:FirstStart()
            stats:UpdateValues()
        end

        stats:AddCallback(ModCallbacks.MC_POST_UPDATE, stats.Update)

        function stats:GameStart(fromSave)
            stats:PreStart(fromSave)
            stats:Load(fromSave)
        end

        stats:AddCallback(ModCallbacks.MC_POST_GAME_STARTED, stats.GameStart)

        function stats:GameExit()
            stats:Save()
        end

        stats:AddCallback(ModCallbacks.MC_PRE_GAME_EXIT, stats.GameExit)

        function stats:Damage(Target ,DamageAmount ,DamageFlags ,DamageSource ,DamageCountdown)
            stats:DamageChanges(Target, DamageAmount, DamageFlags, DamageSource, DamageCountdown)
        end

        stats:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG, stats.Damage)

        function stats:UseItem(collectibleType, RNG)
            stats:UseD8(collectibleType, RNG)
        end

        stats:AddCallback(ModCallbacks.MC_USE_ITEM, stats.UseItem)

        function stats:NewRoom()
            stats:RoomUpdate()
        end

        stats:AddCallback(ModCallbacks.MC_POST_NEW_ROOM, stats.NewRoom)

        function stats:NewLevel()
            stats:LevelUpdate()
            stats:Save()
        end

        stats:AddCallback(ModCallbacks.MC_POST_NEW_LEVEL, stats.NewLevel)

    else
        Isaac.DebugString("Overwriting older version of StatAPI...")
    end

    stats.CharacterList =
    {
        [PlayerType.PLAYER_EVE] = 0.75,
        [PlayerType.PLAYER_XXX] = 1.05,
        [PlayerType.PLAYER_KEEPER] = 1.20,
        [PlayerType.PLAYER_CAIN] = 1.20,
        [PlayerType.PLAYER_LAZARUS2] = 1.20,
        [PlayerType.PLAYER_JUDAS] = 1.35,
        [PlayerType.PLAYER_KEEPER] = 1.50,
        [PlayerType.PLAYER_BLACKJUDAS] = 2.00,
        [PlayerType.PLAYER_THEFORGOTTEN] = 1.50
    }

    StatStage =
    {
        MULTI = 4,
        FLAT = 3,
        BREAK_MULTI = 2,
        BASE = 1,
        ALL = 0
    }

     function stats.AddCache(mod, func, cacheFlag, stage, name)
        stage = stage or StatStage.ALL
        cacheFlag = cacheFlag or CacheFlag.CACHE_ALL
        mod = mod or stats
        table.insert(stats.Functions, {Func = func, Flag = cacheFlag, Stage = stage, Name = name, Mod = mod})
    end

    function stats.RemoveCache(mod, name)
        for num, CacheTable in pairs(stats.Functions) do
            if name == CacheTable.Name then
                if not mod or mod == CacheTable.Mod then
                    table.remove(stats.Functions, num)
                end
            end
        end
    end

    function stats.UpdateStage(mod, player, cacheFlag, stage)
        if cacheFlag ~= CacheFlag.CACHE_DAMAGE or not stats.DeadEyeCheck then
            for num, CacheTable in pairs(stats.Functions) do
                if CacheTable.Stage == stage or CacheTable.Stage == StatStage.ALL then
                    if CacheTable.Flag == cacheFlag or CacheTable.Flag == CacheFlag.CACHE_ALL then
                        CacheTable.Func(CacheTable.Mod, player, cacheFlag, stage)
                    end
                end
            end
        end
    end


    --------------------------- Lots of big code down here for reverse engineering stats --------------------------


    function stats.RevertStats(player, flag)
        ---[[
        local tempStat = nil
        local data = player:GetData()
        local effects = player:GetEffects()

        if not data.SuccubusEffect then
            data.SuccubusEffect = 0
        end
        if not data.LevelDamage then
            data.LevelDamage = 0
        end

        if flag == CacheFlag.CACHE_DAMAGE then
            ---[[
            -- Get damage stat --
            if not stats.DeadEyeCheck then
                tempStat = player.Damage

                data.DamageBeforeLast = data.LastDamage
                data.LastDamage = player.Damage

                if not data.DeadEyeCharge then
                    data.DeadEyeCharge = 0
                end

                tempStat = tempStat/((data.DeadEyeCharge*0.125)+1)

                if not data.DamageMult then
                    data.DamageMult = 1
                end
                tempStat = tempStat / data.DamageMult

                -- Remove multipliers --
                if player:HasCollectible(CollectibleType.COLLECTIBLE_SOY_MILK) then
                    tempStat = tempStat*5
                end
                if player:HasCollectible(CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM) or player:HasCollectible(CollectibleType.COLLECTIBLE_MAXS_HEAD) or effects:HasCollectibleEffect(CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM) or (player:HasCollectible(CollectibleType.COLLECTIBLE_BLOOD_MARTYR) and player:GetEffects():HasCollectibleEffect(CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL)) then
                    tempStat = tempStat/1.5
                end
                if player:HasCollectible(CollectibleType.COLLECTIBLE_EVES_MASCARA) then
                    tempStat = tempStat/2
                end
                if player:HasCollectible(CollectibleType.COLLECTIBLE_PROPTOSIS) then
                    tempStat = tempStat/2
                end
                if player:HasCollectible(CollectibleType.COLLECTIBLE_SACRED_HEART) then
                    tempStat = tempStat/2.3
                end
                if player:HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY_2) then
                    tempStat = tempStat/0.65
                end
                if player:HasCollectible(CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT) and not data.RoomDamage then
                    tempStat = tempStat/2
                end
                if player:HasCollectible(CollectibleType.COLLECTIBLE_BLOODY_LUST) then
                    tempStat = tempStat/((100 + math.ceil(math.max(0,data.LevelDamage-3)*33.3))/100)
                end
                for i = 1,data.SuccubusEffect do
                    tempStat = tempStat/1.5
                end
                if player:HasCollectible(CollectibleType.COLLECTIBLE_HAEMOLACRIA) then
                    tempStat = tempStat/1.31142857
                end

                -- Remove flat changes --
                if player:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) then
                    tempStat = tempStat - 40
                end
                if player:HasTrinket(TrinketType.TRINKET_CURVED_HORN) then
                    if player:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_BOX) then
                        tempStat = tempStat - 4
                    else
                        tempStat = tempStat - 2
                    end
                end
                if player:HasCollectible(CollectibleType.COLLECTIBLE_BOZO) then
                    tempStat = tempStat - 0.1
                end
                if player:HasCollectible(CollectibleType.COLLECTIBLE_POLYPHEMUS) then
                    tempStat = tempStat - 8
                end
                if player:HasCollectible(CollectibleType.COLLECTIBLE_MONEY_IS_POWER) then
                    tempStat = tempStat - player:GetNumCoins()*0.04
                end
                if player:HasCollectible(CollectibleType.COLLECTIBLE_BLOODY_LUST) then
                    tempStat = tempStat - 0.5*math.min(3, data.LevelDamage)
                end

                -- Remove character damage mult --
                local mult = 1
                local playerType = player:GetPlayerType()
                for pType,pMult in pairs(stats.CharacterList) do
                    if playerType == pType then
                        if playerType == PlayerType.PLAYER_EVE and player:GetEffects():HasCollectibleEffect(CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON) then
                            mult = 1
                        else
                            mult = pMult
                        end
                    end
                end
                tempStat = tempStat/(3.5*mult)

                -- Remove break multipliers --
                if player:HasCollectible(CollectibleType.COLLECTIBLE_POLYPHEMUS) then
                    tempStat = tempStat/2
                end
                if player:HasCollectible(CollectibleType.COLLECTIBLE_ODD_MUSHROOM_RATE) then
                    tempStat = tempStat/0.95
                end

                -- Square it to get inside the root --
                tempStat = tempStat ^ 2

                -- Final last bit of operations to get down to the Base Damage --
                tempStat = tempStat - 1
                tempStat = tempStat / 1.2
                tempStat = math.max(0,tempStat)

                player.Damage = tempStat

            end
            --]]
        elseif flag == CacheFlag.CACHE_FIREDELAY then
            -- Get initial stat --
            tempStat = player.MaxFireDelay

            data.FireDelayBeforeLast = data.LastFireDelay
            data.LastFireDelay = player.MaxFireDelay

            if not data.FireDelayMult then
                data.FireDelayMult = 1
            end
            tempStat = tempStat / data.FireDelayMult

            -- Remove Multipliers --

            if player:GetPlayerType() == PlayerType.PLAYER_THEFORGOTTEN then
                tempStat = tempStat/2
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_HAEMOLACRIA) then
                tempStat = tempStat/2
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_SOY_MILK) then
                tempStat = tempStat/0.25
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) and not player:HasCollectible(CollectibleType.COLLECTIBLE_HAEMOLACRIA) then
                tempStat = tempStat/3
            elseif not player:HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) then
                if player:GetPlayerType() == PlayerType.PLAYER_AZAZEL then
                    tempStat = tempStat/3.7
                end
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) then
                tempStat = tempStat/2
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) then
                tempStat = tempStat/4.3
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS) and not player:HasCollectible(CollectibleType.COLLECTIBLE_HAEMOLACRIA) then
                tempStat = tempStat/2.5
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_EVES_MASCARA) then
                tempStat = tempStat/2
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) and not player:HasCollectible(CollectibleType.COLLECTIBLE_LUDOVICO_TECHNIQUE) then
                tempStat = tempStat/2.5
            end

            -- Remove Flat Changes --
            if player:HasCollectible(CollectibleType.COLLECTIBLE_HAEMOLACRIA) then
                tempStat = tempStat - 5
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_ANTI_GRAVITY) then
                tempStat = tempStat + 2
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_CAPRICORN) or player:GetZodiacEffect() == CollectibleType.COLLECTIBLE_CAPRICORN then
                tempStat = tempStat + 1
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) and player:HasCollectible(CollectibleType.COLLECTIBLE_LUDOVICO_TECHNIQUE) then
                tempStat = tempStat + 2
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_CRICKETS_BODY) then
                tempStat = tempStat + 1
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_GUILLOTINE) or effects:HasCollectibleEffect(CollectibleType.COLLECTIBLE_GUILLOTINE) then
                tempStat = tempStat + 1
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) then
                tempStat = tempStat - 5
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_MILK) and data.RoomDamage then
                tempStat = tempStat + 2*player:GetCollectibleNum(CollectibleType.COLLECTIBLE_MILK)
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_PERFUME) then
                tempStat = tempStat + 1
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_PISCES) or player:GetZodiacEffect() == CollectibleType.COLLECTIBLE_PISCES then
                tempStat = tempStat + 1
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_SOY_MILK) then
                tempStat = tempStat + 8
            end
            if (player:HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER) or player:HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) or player:HasCollectible(CollectibleType.COLLECTIBLE_POLYPHEMUS)) and player:GetPlayerType() ~= PlayerType.PLAYER_KEEPER then
                tempStat = tempStat - 3
            end

            if player:HasTrinket(TrinketType.TRINKET_CANCER) or player:GetEffects():HasTrinketEffect(TrinketType.TRINKET_CANCER) then
                if player:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_BOX) then
                    tempStat = tempStat + 4
                else
                    tempStat = tempStat + 2
                end
            end
            if player:HasTrinket(TrinketType.TRINKET_CRACKED_CROWN) or player:GetEffects():HasTrinketEffect(TrinketType.TRINKET_CRACKED_CROWN) then
                if player:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_BOX) then
                    tempStat = tempStat + 2
                else
                    tempStat = tempStat + 1
                end
            end

            -- Odd Multipliers --
            if (player:HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER) or player:HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) or player:HasCollectible(CollectibleType.COLLECTIBLE_POLYPHEMUS)) and player:GetPlayerType() ~= PlayerType.PLAYER_KEEPER then
                tempStat = tempStat/2.1
            end

            -- Deconstruct the tears formula back down to the stat --

            if tempStat < 11 then
                tempStat = tempStat - 16
                tempStat = tempStat/(-6)
                tempStat = tempStat^2 * (math.abs(tempStat)/tempStat)
                tempStat = tempStat - 1
                tempStat = tempStat/1.3
            else
                tempStat = math.floor(tempStat + 0.5)
                if tempStat == 11 then
                    tempStat = -0.1
                elseif tempStat == 12 then
                    tempStat = -0.2
                elseif tempStat == 13 then
                    tempStat = -0.3
                elseif tempStat == 14 then
                    tempStat = -0.4
                elseif tempStat == 15 then
                    tempStat = -0.5
                elseif tempStat == 16 then
                    tempStat = -0.6
                elseif tempStat == 17 then
                    tempStat = -0.65
                elseif tempStat == 18 then
                    tempStat = -0.7
                elseif tempStat == 19 then
                    tempStat = -0.75
                elseif tempStat == 20 then
                    tempStat = -0.8
                elseif tempStat == 21 then
                    tempStat = -0.9
                else
                    tempStat = (tempStat-16)/(-6)
                end
            end

            player.MaxFireDelay = math.floor(tempStat*1000 + 100000) -- We did it boys --

            -- Successful deconstruction --

        elseif flag == CacheFlag.CACHE_SPEED then
            tempStat = player.MoveSpeed

            data.SpeedBeforeLast = data.LastSpeed
            data.LastSpeed = player.MoveSpeed

            -- D8 multiplier --
            if not data.SpeedMult then
                data.SpeedMult = 1
            end
            tempStat = tempStat / data.SpeedMult

            -- Speed downs which lower the cap instead of the speed value --
            if player:GetEffects():HasCollectibleEffect(CollectibleType.COLLECTIBLE_THE_NAIL) then
                tempStat = tempStat + 0.18
            end
            tempStat = tempStat + 0.2*player:GetCollectibleNum(CollectibleType.COLLECTIBLE_SMALL_ROCK)
            tempStat = tempStat + 0.2*player:GetCollectibleNum(CollectibleType.COLLECTIBLE_BUCKET_LARD)
            if player:HasCollectible(CollectibleType.COLLECTIBLE_TAURUS) or player:GetZodiacEffect() == CollectibleType.COLLECTIBLE_TAURUS then
                tempStat = tempStat + 0.3
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_VIRUS) or player:HasCollectible(CollectibleType.COLLECTIBLE_ODD_MUSHROOM_DAMAGE) or effects:HasCollectibleEffect(CollectibleType.COLLECTIBLE_ODD_MUSHROOM_DAMAGE) then
                tempStat = tempStat + 0.1
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_THUNDER_THIGHS) then
                tempStat = tempStat + 0.4
            end

            player.MoveSpeed = tempStat

        elseif flag == CacheFlag.CACHE_RANGE then
            tempStat = player.TearHeight

            data.RangeBeforeLast = data.LastRange
            data.LastRange = player.TearHeight

            if not data.RangeMult then
                data.RangeMult = 1
            end
            tempStat = tempStat / data.RangeMult

            player.TearHeight = tempStat
        end
        --]]
    end


    --------------------- Update stats in stages so they can be properly messed with ----------------------


    function stats.UpdateStats(player, cacheFlag, stage)
        ---[[
        local preFire = player.MaxFireDelay
        local preDamage = player.Damage

        if (cacheFlag ~= CacheFlag.CACHE_DAMAGE) or not stats.DeadEyeCheck then
            if stage == StatStage.BASE then
                stats.StageBase(player, cacheFlag)
            elseif stage == StatStage.BREAK_MULTI then
                stats.StageBreak(player, cacheFlag)
            elseif stage == StatStage.FLAT then
                stats.StageFlat(player, cacheFlag)
            elseif stage == StatStage.MULTI then
                stats.StageMulti(player, cacheFlag)
            end
        end
        --]]
    end

    function stats.StageBase(player, flag)
        local data = player:GetData()
        local effects = player:GetEffects()

        local tempStat = nil
        if flag == CacheFlag.CACHE_DAMAGE then
            tempStat = player.Damage

            tempStat = math.sqrt(math.max(0,tempStat)*1.2 + 1)
            local mult = 1
            local playerType = player:GetPlayerType()
            for pType,pMult in pairs(stats.CharacterList) do
                if playerType == pType then
                    if playerType == PlayerType.PLAYER_EVE and player:GetEffects():HasCollectibleEffect(CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON) then
                        mult = 1
                    else
                        mult = pMult
                    end
                end
            end
            tempStat = tempStat*3.5*mult

            tempStat = tempStat * data.DamageMult

            player.Damage = tempStat

        elseif flag == CacheFlag.CACHE_FIREDELAY then
            tempStat = player.MaxFireDelay

            tempStat = (tempStat - 100000)/1000

            if tempStat*100 <= -1*100 then
                tempStat = 16 - (6*tempStat)
            elseif tempStat <= -0.85 then
                tempStat = 21
            elseif tempStat <= -0.75 then
                tempStat = 20
            elseif tempStat <= -0.65 then
                tempStat = 18
            elseif tempStat <= -0.55 then
                tempStat = 16
            elseif tempStat <= -0.45 then
                tempStat = 15
            elseif tempStat <= -0.35 then
                tempStat = 14
            elseif tempStat <= -0.25 then
                tempStat = 13
            elseif tempStat <= -0.15 then
                tempStat = 12
            elseif tempStat < 0 then
                tempStat = 11
            else
                tempStat = tempStat*1.3
                tempStat = tempStat + 1
                tempStat = tempStat^(1/2)
                tempStat = tempStat*(6)
                tempStat = 16 - tempStat
            end

            tempStat = tempStat * data.FireDelayMult

            player.MaxFireDelay = math.floor(tempStat + 0.5)
        elseif flag == CacheFlag.CACHE_SPEED then
            tempStat = player.MoveSpeed

            -- Set to cap --
            if not player:HasCollectible(CollectibleType.COLLECTIBLE_TAURUS) then
                tempStat = math.min(2,tempStat)
            end

            -- Speed downs which lower the cap instead of the speed value --
            if player:GetEffects():HasCollectibleEffect(CollectibleType.COLLECTIBLE_THE_NAIL) then
                tempStat = tempStat - 0.18
            end
            tempStat = tempStat - 0.2*player:GetCollectibleNum(CollectibleType.COLLECTIBLE_SMALL_ROCK)
            tempStat = tempStat - 0.2*player:GetCollectibleNum(CollectibleType.COLLECTIBLE_BUCKET_LARD)
            if player:HasCollectible(CollectibleType.COLLECTIBLE_TAURUS) or player:GetZodiacEffect() == CollectibleType.COLLECTIBLE_TAURUS then
                tempStat = tempStat - 0.3
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_VIRUS) or player:HasCollectible(CollectibleType.COLLECTIBLE_ODD_MUSHROOM_DAMAGE) or effects:HasCollectibleEffect(CollectibleType.COLLECTIBLE_ODD_MUSHROOM_DAMAGE) then
                tempStat = tempStat - 0.1
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_THUNDER_THIGHS) then
                tempStat = tempStat - 0.4
            end

            -- D8 multiplier --
            tempStat = tempStat * data.SpeedMult

            tempStat = math.max(0.1,tempStat)

            player.MoveSpeed = tempStat
        end
    end

    function stats.StageBreak(player, cacheFlag)
        local data = player:GetData()
        local effects = player:GetEffects()

        local tempStat = nil
        if cacheFlag == CacheFlag.CACHE_DAMAGE then
            tempStat = player.Damage

            if player:HasCollectible(CollectibleType.COLLECTIBLE_POLYPHEMUS) then
                tempStat = tempStat*2
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_ODD_MUSHROOM_RATE) then
                tempStat = tempStat*0.95
            end

            player.Damage = tempStat
        elseif cacheFlag == CacheFlag.CACHE_FIREDELAY then
            tempStat = math.max(5,player.MaxFireDelay)

            if (player:HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER) or player:HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) or player:HasCollectible(CollectibleType.COLLECTIBLE_POLYPHEMUS)) then
                tempStat = tempStat*2.1
            end

            player.MaxFireDelay = math.floor(tempStat + 0.5)
        end
    end

    function stats.StageFlat(player, cacheFlag)
        local data = player:GetData()
        local effects = player:GetEffects()

        local tempStat = nil
        if cacheFlag == CacheFlag.CACHE_DAMAGE then
            tempStat = player.Damage

            if player:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) then
                tempStat = tempStat + 40
            end
            if player:HasTrinket(TrinketType.TRINKET_CURVED_HORN) then
                if player:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_BOX) then
                    tempStat = tempStat + 4
                else
                    tempStat = tempStat + 2
                end
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_BOZO) then
                tempStat = tempStat + 0.1
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_POLYPHEMUS) then
                tempStat = tempStat + 8
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_MONEY_IS_POWER) then
                tempStat = tempStat + player:GetNumCoins()*0.04
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_BLOODY_LUST) then
                tempStat = tempStat + 0.5*math.min(3, data.LevelDamage)
            end

            player.Damage = tempStat
        elseif cacheFlag == CacheFlag.CACHE_FIREDELAY then
            tempStat = player.MaxFireDelay

            if player:HasCollectible(CollectibleType.COLLECTIBLE_ANTI_GRAVITY) then
                tempStat = tempStat - 2
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_CAPRICORN) or player:GetZodiacEffect() == CollectibleType.COLLECTIBLE_CAPRICORN then
                tempStat = tempStat - 1
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) and player:HasCollectible(CollectibleType.COLLECTIBLE_LUDOVICO_TECHNIQUE) then
                tempStat = tempStat - 2
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_CRICKETS_BODY) then
                tempStat = tempStat - 1
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_GUILLOTINE) or effects:HasCollectibleEffect(CollectibleType.COLLECTIBLE_GUILLOTINE) then
                tempStat = tempStat - 1
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) then
                tempStat = tempStat + 5
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_MILK) and data.RoomDamage then
                tempStat = tempStat - 2
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_PERFUME) then
                tempStat = tempStat - 1
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_PISCES) or player:GetZodiacEffect() == CollectibleType.COLLECTIBLE_PISCES then
                tempStat = tempStat - 1
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_SOY_MILK) then
                tempStat = tempStat - 8
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER) or player:HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) or player:HasCollectible(CollectibleType.COLLECTIBLE_POLYPHEMUS) then
                tempStat = tempStat + 3
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_HAEMOLACRIA) then
                tempStat = tempStat + 5
            end

            if player:HasTrinket(TrinketType.TRINKET_CANCER) or player:GetEffects():HasTrinketEffect(TrinketType.TRINKET_CANCER) then
                if player:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_BOX) then
                    tempStat = tempStat - 4
                else
                    tempStat = tempStat - 2
                end
            end
            if player:HasTrinket(TrinketType.TRINKET_CRACKED_CROWN) or player:GetEffects():HasTrinketEffect(TrinketType.TRINKET_CRACKED_CROWN) then
                if player:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_BOX) then
                    tempStat = tempStat - 2
                else
                    tempStat = tempStat - 1
                end
            end

            player.MaxFireDelay = math.floor(tempStat + 0.5)
        end
    end

    function stats.StageMulti(player, cacheFlag)
        local data = player:GetData()
        local effects = player:GetEffects()

        local tempStat = nil
        if cacheFlag == CacheFlag.CACHE_DAMAGE then
            tempStat = player.Damage

            if player:HasCollectible(CollectibleType.COLLECTIBLE_SOY_MILK) then
                tempStat = tempStat/5
            end
            if (player:HasCollectible(CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM) or effects:HasCollectibleEffect(CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM) or player:HasCollectible(CollectibleType.COLLECTIBLE_MAXS_HEAD) or (player:HasCollectible(CollectibleType.COLLECTIBLE_BLOOD_MARTYR) and player:GetEffects():HasCollectibleEffect(CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL))) then
                tempStat = tempStat*1.5
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_EVES_MASCARA) then
                tempStat = tempStat*2
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_PROPTOSIS) then
                tempStat = tempStat*2
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_SACRED_HEART) then
                tempStat = tempStat*2.3
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY_2) then
                tempStat = tempStat*0.65
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT) and not data.RoomDamage then
                tempStat = tempStat*2
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_BLOODY_LUST) then
                tempStat = tempStat*((100 + math.ceil(math.max(0,data.LevelDamage-3)*33.3))/100)
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_DEAD_EYE) then
                tempStat = tempStat*(1+(0.125*data.DeadEyeCharge))
            end
            for i = 1,data.SuccubusEffect do
                tempStat = tempStat*1.5
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_HAEMOLACRIA) then
                tempStat = tempStat*1.31142857
            end

            player.Damage = tempStat
        elseif cacheFlag == CacheFlag.CACHE_FIREDELAY then
            tempStat = player.MaxFireDelay

            if player:GetPlayerType() == PlayerType.PLAYER_THEFORGOTTEN then
                tempStat = tempStat*2
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_SOY_MILK) then
                tempStat = tempStat*0.25
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) and not player:HasCollectible(CollectibleType.COLLECTIBLE_HAEMOLACRIA) then
                tempStat = tempStat*3
            elseif player:GetPlayerType() == PlayerType.PLAYER_AZAZEL then
                if not player:HasCollectible(CollectibleType.COLLECTIBLE_HAEMOLACRIA) then
                    tempStat = tempStat*3.7
                end
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) then
                tempStat = tempStat*2
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) then
                tempStat = tempStat*4.3
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS) and not player:HasCollectible(CollectibleType.COLLECTIBLE_HAEMOLACRIA) then
                tempStat = tempStat*2.5
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_EVES_MASCARA) then
                tempStat = tempStat*2
            end
            if player:HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) and not player:HasCollectible(CollectibleType.COLLECTIBLE_LUDOVICO_TECHNIQUE) then
                tempStat = tempStat*2.5
            end
             if player:HasCollectible(CollectibleType.COLLECTIBLE_HAEMOLACRIA) then
                tempStat = tempStat*2
            end

            player.MaxFireDelay = math.floor(tempStat + 0.5)
        end
    end


    ---------------------- Updating certain values which change based on criteria -------------------------


    function stats:FirstStart()
        if stats.RunFirst then
            for i = 0,3 do
                local player = Isaac.GetPlayer(i)
                player:AddCacheFlags(CacheFlag.CACHE_ALL)
                player:EvaluateItems()
                stats.RunFirst = false
            end
        end
    end

    function stats:PreStart()
        stats.RunFirst = true
    end

    function stats:UpdateValues()
        for i = 0,3 do
            local player = Isaac.GetPlayer(i)
            local data = player:GetData()
            if data.TakingDamage and data.TakingDamage > (player:GetHearts() + player:GetSoulHearts() + player:GetEternalHearts() + player:GetBoneHearts()) then
                if player:HasCollectible(CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT) then
                    data.RoomDamage = true
                end
                if player:HasCollectible(CollectibleType.COLLECTIBLE_BLOODY_LUST) then
                    data.LevelDamage = math.min(6,data.LevelDamage + 1)
                end
                data.TakingDamage = nil
            end
            local oldSucc = data.SuccubusEffect
            data.SuccubusEffect = 0
            for index,entity in pairs(Isaac.GetRoomEntities()) do
                if entity.Type == EntityType.ENTITY_FAMILIAR and entity.Variant == FamiliarVariant.SUCCUBUS then
                    if entity.Position:Distance(player.Position) < 90 + player.Size then
                        data.SuccubusEffect = data.SuccubusEffect + 1
                    end
                    if entity.Position:Distance(player.Position) < 91 + player.Size and entity.Position:Distance(player.Position) < 91 + player.Size then
                        player:AddCacheFlags(CacheFlag.CACHE_DAMAGE)
                        player:EvaluateItems()
                    end
                end
            end
            if data.SuccubusEffect ~= oldSucc then
                player:AddCacheFlags(CacheFlag.CACHE_DAMAGE)
                player:EvaluateItems()
            end
            ---[[
            stats.DeadEyeCheck = true
            player:AddCacheFlags(CacheFlag.CACHE_DAMAGE)
            player:EvaluateItems()
            local beforeDamage = player.Damage
            for i = 1,8 do
                player:ClearDeadEyeCharge()
                player:AddCacheFlags(CacheFlag.CACHE_DAMAGE)
                player:EvaluateItems()
            end
            data.DeadEyeCharge = math.floor(((beforeDamage/player.Damage)-1)*8 + 0.5)
            for i = 1, data.DeadEyeCharge do
                player:AddDeadEyeCharge()
            end
            player:AddCacheFlags(CacheFlag.CACHE_DAMAGE)
            player:EvaluateItems()
            stats.DeadEyeCheck = false
            player:AddCacheFlags(CacheFlag.CACHE_DAMAGE)
            player:EvaluateItems()
            --]]
        end
    end

    function stats:DamageChanges(Target ,DamageAmount ,DamageFlags ,DamageSource ,DamageCountdown)
            if Target:ToPlayer() then
                local player = Target:ToPlayer()
                local data = player:GetData()
                if DamageFlags & DamageFlag.DAMAGE_FAKE ~= 0 then
                    if player:HasCollectible(CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT) then
                        data.RoomDamage = true
                    end
                    if player:HasCollectible(CollectibleType.COLLECTIBLE_BLOODY_LUST) then
                        data.LevelDamage = math.min(6,data.LevelDamage + 1)
                    end
                else
                    data.TakingDamage = player:GetHearts() + player:GetSoulHearts() + player:GetEternalHearts() + player:GetBoneHearts()
                end
            end
    end

    function stats:RoomUpdate()
        for i = 0,3 do
            local player = Isaac.GetPlayer(i)
            local data = player:GetData()
            data.RoomDamage = nil
        end
    end

    function stats:LevelUpdate()
        for i = 0,3 do
            local player = Isaac.GetPlayer(i)
            local data = player:GetData()
            data.LevelDamage = 0
            player:AddCacheFlags(CacheFlag.CACHE_DAMAGE)
            player:EvaluateItems()
        end
    end

    function stats:UseD8(collectibleType, RNG)
        if collectibleType == CollectibleType.COLLECTIBLE_D8 then
            for i = 0,3 do
                local player = Isaac.GetPlayer(i)
                local data = player:GetData()
                data.SpeedMult = data.SpeedMult * (data.LastSpeed / data.SpeedBeforeLast)
                data.DamageMult = data.DamageMult * (data.LastDamage / data.DamageBeforeLast)
                data.RangeMult = data.RangeMult * (data.LastRange / data.RangeBeforeLast)
                data.FireDelayMult = data.FireDelayMult * (data.LastFireDelay / data.FireDelayBeforeLast)
                player:AddCacheFlags(CacheFlag.CACHE_ALL)
                player:EvaluateItems()
            end
        end
    end


    -------------------------------- Save/Load ---------------------------------


    function stats:Save()
    end

    function stats:Load(fromSave)
    end

    function stats.GenerateSave()
        saveData = ""
        for i = 0,3 do
            local player = Isaac.GetPlayer(i)
            local data = player:GetData()
            if data.LevelDamage then
                saveData = saveData .. string.format("%10f",data.LevelDamage)
            else
                saveData = saveData .. string.format("%10f",0)
            end
            if data.SpeedMult then
                saveData = saveData .. string.format("%10f",data.SpeedMult)
            else
                saveData = saveData .. string.format("%10f",1)
            end
            if data.DamageMult then
                saveData = saveData .. string.format("%10f",data.DamageMult)
            else
                saveData = saveData .. string.format("%10f",1)
            end
            if data.RangeMult then
                saveData = saveData .. string.format("%10f",data.RangeMult)
            else
                saveData = saveData .. string.format("%10f",1)
            end
            if data.FireDelayMult then
                saveData = saveData .. string.format("%10f",data.FireDelayMult)
            else
                saveData = saveData .. string.format("%10f",1)
            end
        end
        return saveData
    end

    function stats.LoadSave(saveData)
        for i = 0,3 do
            local player = Isaac.GetPlayer(i)
            if player and player:GetData() then
                local data = player:GetData()
                data.LevelDamage = tonumber(saveData:sub(1+i*50,10+i*50))
                data.SpeedMult = tonumber(saveData:sub(11+i*50,20+i*50))
                data.DamageMult = tonumber(saveData:sub(21+i*50,30+i*50))
                data.RangeMult = tonumber(saveData:sub(31+i*50,40+i*50))
                data.FireDelayMult = tonumber(saveData:sub(41+i*50,50+i*50))
                player:AddCacheFlags(CacheFlag.CACHE_ALL)
                player:EvaluateItems()
            end
        end
        return saveData:sub(201, saveData:len())
    end

end

statAPI.ForceCrash()
