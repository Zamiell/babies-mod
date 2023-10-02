-- cspell:disable
-- https://github.com/Sanio46/character-costume-protector

-- Modifications:
-- - Better logging on line 70.
-- - Double Brimstone fix on line 573.
-- - Active item bug fix on line 907.
-- - I Found Pills + R U a Wizard fix on line 910.
-- - Empty Vessel shield fix on line 1122.
-- - Strawman bug fix on line 1135.
-- - Global variable `CCPMainResetPlayerCostumes` on line 1203.

--VERSION = "1.4.2"

--Character Costume Protector by Sanio! (Sanio46 on Steam and Twitter)
--This local library has the goal of protecting the unique looks of custom characters that regularly
--interfere with how costumes look while allowing customization between different characters with ease.

--For any questions, contact Sanio or leave a comment under the workshop upload, preferably the latter.

local ccp = {}
local game = Game()

local playerToProtect = {}
local playerCostume = {}
local playerSpritesheet = {}
local playerItemCostumeWhitelist = {}
local playerNullItemCostumeWhitelist = {}
local playerTrinketCostumeWhitelist = {}
local defaultItemWhitelist = {
	[CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS] = true,
	[CollectibleType.COLLECTIBLE_HOLY_MANTLE] = true,
	[CollectibleType.COLLECTIBLE_DADS_RING] = true,
}
local defaultNullItemWhitelist = {}
local nullEffectsBlacklist = {}
local CallbacksTable = {
	["MC_POST_COSTUME_RESET"] = {},
	["MC_POST_COSTUME_DEINIT"] = {},
	["MC_POST_COSTUME_INIT"] = {}
}

--List of player data for convenience and explanation--
--[[
	data.CCP.HasCostumeInitialized: Boolean. Used for initializing the player data adding them to the system in place.

	data.CCP.NumCollectibles: Int. Tracking player:GetCollectibleCount for a change to reset costume

	data.CCP.NumTemporaryEffects: Int. Tracking the length of player:GetEffects():GetEffectsList() for a change to reset costume.

	data.CCP.CustomFlightCostume: Boolean. Tracks when you suddenly gain/lose flight to reset costume.

	data.CCP.DelayCostumeReset: Boolean. For lots of various callbacks in this code, the costume is added after its callback. This is set to true
	and immediately resets your costume before returning to nil on the next frame.

	data.CCP.QueueCostumeRemove: Table. Similar to DelayCostumeReset, but the table contains items to remove only that item's costume.
	Used for Modeling Clay, Whore of Babylon, Empty Vessel, and Taurus.

	data.CCP.DelayTaurusCostumeReset: Boolean. When entering an uncleared room, waits for you to reach max speed to remove Taurus' costume.

	data.CCP.AstralProjectionDisabled = Boolean. As Astral Projection's temporary effect is not auto-removed when returning to your normal form,
	unlike Spirit Shackles, manual detection is needed. This is to stop adding Astral Projection's costume during a costume reset.
	True after getting hit in your ghost form or clearing a room. False upon losing the temporary effect.
]]

---------------------
--  API FUNCTIONS  --
---------------------

local function apiError(func, invalidVar, num, expectedType)
	local err = (
		"(CCP) Something went wrong in Character Costume Protector. "
		.. "func: " .. tostring(func) .. ", "
		.. "invalidVar: " .. tostring(invalidVar) .. ", "
		.. "num: " .. tostring(num) .. ", "
		.. "expectedType: " .. tostring(expectedType)
	)

	if expectedType ~= nil then
		err = "Bad Argument #" ..
			num ..
			" in " ..
			func ..
			"(Attempt to index a " ..
			type(invalidVar) .. " value, field '" .. tostring(invalidVar) .. "', expected " .. expectedType .. ")."
	end
	error(err)
	Isaac.DebugString(err)
end

local function costumeError(func, num, msg)
	local err = "Bad Argument #" .. num .. " in " .. func .. "(" .. msg .. ")."
	error(err)
	Isaac.DebugString(err)
end

local function initiateItemWhitelist(playerType)
	playerItemCostumeWhitelist[playerType] = {}
	for itemID, boolean in pairs(defaultItemWhitelist) do
		playerItemCostumeWhitelist[playerType][itemID] = boolean
	end
end

local function initiateNullItemWhitelist(playerType)
	playerNullItemCostumeWhitelist[playerType] = {}
	for nullItemID, boolean in pairs(defaultNullItemWhitelist) do
		playerNullItemCostumeWhitelist[playerType][nullItemID] = boolean
	end
end

local function apiSetOptionalArgs(playerType, func, costumeFlight, spritesheetFlight, costumeExtra)

	if costumeFlight ~= nil then
		if costumeFlight ~= -1
			and type(costumeFlight) == "number"
		then
			local nullConfig = Isaac.GetItemConfig():GetNullItem(costumeFlight)

			if nullConfig == nil then
				costumeError(func, "4", "Invalid NullItemID.")
			elseif nullConfig.Costume.Anm2Path == "" then
				costumeError(func, "4", "NullItemID does not contain a costume.")
			elseif nullConfig.Costume.IsFlying == false then
				costumeError(func, "4", "Flight costume's 'isFlying' paramater is not set or false")
			end

			playerCostume[playerType]["Flight"] = costumeFlight
		else
			apiError(func, costumeFlight, "4", "number")
		end
	end

	if spritesheetFlight ~= nil then
		if type(spritesheetFlight) == "string" then
			playerSpritesheet[playerType]["Flight"] = spritesheetFlight
		else
			apiError(func, spritesheetFlight, "5", "string")
		end
	end

	if costumeExtra ~= nil then
		if costumeExtra ~= -1
			and type(costumeExtra) == "number" then
			local nullConfig = Isaac.GetItemConfig():GetNullItem(costumeExtra)

			if nullConfig == nil then
				costumeError(func, "6", "Invalid NullItemID.")
			elseif nullConfig.Costume.Anm2Path == "" then
				costumeError(func, "6", "NullItemID does not contain a costume.")
			end
			playerCostume[playerType]["Extra"] = costumeExtra
		else
			apiError(func, costumeExtra, "6", "number")
		end
	end
end

function ccp:addPlayer(
player, playerType, spritesheetNormal, costumeFlight, spritesheetFlight, costumeExtra
)
	local func = "AddPlayer"

	if player ~= nil
		and type(player) == "userdata"
		and playerType ~= nil
		and type(playerType) == "number"
		and spritesheetNormal ~= nil
		and type(spritesheetNormal) == "string" then

		playerToProtect[playerType] = true
		playerCostume[playerType] = {}
		playerSpritesheet[playerType] = {}
		playerSpritesheet[playerType]["Normal"] = spritesheetNormal
		initiateItemWhitelist(playerType)
		initiateNullItemWhitelist(playerType)
		playerTrinketCostumeWhitelist[playerType] = {}

		apiSetOptionalArgs(playerType, func, costumeFlight, spritesheetFlight, costumeExtra)
		if player:GetPlayerType() == playerType then
			ccp:initPlayerCostume(player)
		end
	else
		if player == nil
			or type(player) ~= "userdata"
		then
			apiError(func, player, "1", "EntityPlayer")
		elseif playerType == nil
			or type(playerType) ~= "number"
		then
			apiError(func, playerType, "2", "number")
		elseif spritesheetNormal == nil
			or type(spritesheetNormal) ~= "string"
		then
			apiError(func, spritesheetNormal, "3", "string")
		else
			apiError(func)
		end
	end
end

function ccp:removePlayer(player, playerType)
	if playerToProtect[playerType] then
		ccp:removeCCPPlayer(player)
		playerToProtect[playerType] = nil
		playerCostume[playerType] = nil
		playerSpritesheet[playerType] = nil
		playerItemCostumeWhitelist[playerType] = nil
		playerNullItemCostumeWhitelist[playerType] = nil
		playerTrinketCostumeWhitelist[playerType] = nil
	else
		local err = "RemovePlayer on PlayerType" .. playerType .. "..failed. PlayerType isn't inside protection system!"
		error(err)
		Isaac.DebugString(err)
	end
end

function ccp:removeAllPlayers(player)
	for playerType, _ in pairs(playerToProtect) do
		ccp:removePlayer(player, playerType)
	end
end

function ccp:updatePlayer(
player, playerType, spritesheetNormal, costumeFlight, spritesheetFlight, costumeExtra
)
	local func = "UpdatePlayer"

	if player ~= nil
		and type(player) == "userdata"
		and playerType ~= nil
		and playerToProtect[playerType] == true then

		if spritesheetNormal ~= nil then
			if type(spritesheetNormal) == "string" then
				playerSpritesheet[playerType]["Normal"] = spritesheetNormal
			else
				apiError(func, spritesheetNormal, "3", "string")
			end
		end

		apiSetOptionalArgs(playerType, func, costumeFlight, spritesheetFlight, costumeExtra)

		ccp:mainResetPlayerCostumes(player)
	else
		if player == nil
			or type(player) ~= "userdata"
		then
			apiError(func, player, "1", "EntityPlayer")
		elseif playerType == nil
			or type(playerType) ~= "number"
		then
			apiError(func, playerType, "2", "number")
		else
			apiError(func)
		end
	end
end

function ccp:itemCostumeWhitelist(playerType, costumeList)
	if playerType ~= nil
		and type(playerType) == "number"
		and costumeList ~= nil
		and type(costumeList) == "table"
	then
		for itemID, bool in pairs(costumeList) do
			if itemID ~= nil
				and type(itemID) == "number"
				and bool ~= nil
				and type(bool) == "boolean"
			then
				playerItemCostumeWhitelist[playerType][itemID] = bool
			end
		end
	else
		local func = "ItemCostumeWhitelist"
		if playerType == nil
			or type(playerType) ~= "number" then
			apiError(func, playerType, "1", "number")
		elseif costumeList == nil
			or type(costumeList) ~= "table" then
			apiError(func, costumeList, "2", "table")
		else
			apiError(func)
		end
	end
end

function ccp:nullItemIDWhitelist(playerType, costumeList)
	if playerType ~= nil
		and type(playerType) == "number"
		and costumeList ~= nil
		and type(costumeList) == "table"
	then
		for nullItemID, bool in pairs(costumeList) do
			if nullItemID ~= nil
				and type(nullItemID) == "number"
				and bool ~= nil
				and type(bool) == "boolean"
			then
				playerNullItemCostumeWhitelist[playerType][nullItemID] = bool
			end
		end
	else
		local func = "NullItemIDWhitelist"
		if playerType == nil
			or type(playerType) ~= "number" then
			apiError(func, playerType, "1", "number")
		elseif costumeList == nil
			or type(costumeList) ~= "table" then
			apiError(func, costumeList, "2", "table")
		else
			apiError(func)
		end
	end
end

function ccp:trinketCostumeWhitelist(playerType, costumeList)
	if playerType ~= nil
		and type(playerType) == "number"
		and costumeList ~= nil
		and type(costumeList) == "table"
	then
		for trinketID, bool in pairs(costumeList) do
			if trinketID ~= nil
				and type(trinketID) == "number"
				and bool ~= nil
				and type(bool) == "boolean"
			then
				playerTrinketCostumeWhitelist[playerType][trinketID] = bool
			end
		end
	else
		local func = "TrinketCostumeWhitelist"
		if playerType == nil
			or type(playerType) ~= "number" then
			apiError(func, playerType, "1", "number")
		elseif costumeList == nil
			or type(costumeList) ~= "table" then
			apiError(func, costumeList, "2", "table")
		else
			apiError(func)
		end
	end
end

function ccp.addCallback(callback, newFunction)
	if CallbacksTable[callback] then
		table.insert(CallbacksTable[callback], newFunction)
	else
		error("Bad Argument #1 in ccp.AddCallback (Attempt to index a " ..
			type(callback) .. "value, field '" .. tostring(callback) .. "'")
	end
end

-----------------
--  CALLBACKS  --
-----------------

--Callback logic provided by AgentCucco

function ccp:afterCostumeInit(player)
	for _, callback in ipairs(CallbacksTable["MC_POST_COSTUME_INIT"]) do
		callback(player)
	end
end

function ccp:afterCostumeReset(player)
	for _, callback in ipairs(CallbacksTable["MC_POST_COSTUME_RESET"]) do
		callback(player)
	end
end

function ccp:afterCostumeDeinit(player)
	for _, callback in ipairs(CallbacksTable["MC_POST_COSTUME_DEINIT"]) do
		callback(player)
	end
end

--------------
--  LOCALS  --
--------------

local collectiblesEffectsOnlyAddOnEffect = {
	[CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS] = true,
	[CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON] = true,
	[CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL] = true,
	[CollectibleType.COLLECTIBLE_MOMS_BRA] = true,
	[CollectibleType.COLLECTIBLE_EMPTY_VESSEL] = true,
	[CollectibleType.COLLECTIBLE_RAZOR_BLADE] = true,
	[CollectibleType.COLLECTIBLE_THE_NAIL] = true,
	[CollectibleType.COLLECTIBLE_MY_LITTLE_UNICORN] = true,
	[CollectibleType.COLLECTIBLE_GAMEKID] = true,
	[CollectibleType.COLLECTIBLE_SHOOP_DA_WHOOP] = true,
	[CollectibleType.COLLECTIBLE_DELIRIOUS] = true,
}

local activesToDelayCostumeReset = {
	[CollectibleType.COLLECTIBLE_RAZOR_BLADE] = true,
	[CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL] = true,
	[CollectibleType.COLLECTIBLE_MOMS_BRA] = true,
	[CollectibleType.COLLECTIBLE_THE_NAIL] = true,
	[CollectibleType.COLLECTIBLE_MY_LITTLE_UNICORN] = true,
	[CollectibleType.COLLECTIBLE_GAMEKID] = true,
	[CollectibleType.COLLECTIBLE_SHOOP_DA_WHOOP] = true,
	[CollectibleType.COLLECTIBLE_PONY] = true,
	[CollectibleType.COLLECTIBLE_WHITE_PONY] = true,
	[CollectibleType.COLLECTIBLE_D4] = true,
	[CollectibleType.COLLECTIBLE_D100] = true,
	[CollectibleType.COLLECTIBLE_DELIRIOUS] = true,
}

local costumeTrinkets = {
	[TrinketType.TRINKET_TICK] = true,
	[TrinketType.TRINKET_RED_PATCH] = true
}

local playerFormToNullItemID = {
	[PlayerForm.PLAYERFORM_GUPPY] = NullItemID.ID_GUPPY,
	[PlayerForm.PLAYERFORM_LORD_OF_THE_FLIES] = NullItemID.ID_LORD_OF_THE_FLIES,
	[PlayerForm.PLAYERFORM_MUSHROOM] = NullItemID.ID_MUSHROOM,
	[PlayerForm.PLAYERFORM_ANGEL] = NullItemID.ID_ANGEL,
	[PlayerForm.PLAYERFORM_BOB] = NullItemID.ID_BOB,
	[PlayerForm.PLAYERFORM_DRUGS] = NullItemID.ID_DRUGS,
	[PlayerForm.PLAYERFORM_MOM] = NullItemID.ID_MOM,
	[PlayerForm.PLAYERFORM_BABY] = NullItemID.ID_BABY,
	[PlayerForm.PLAYERFORM_EVIL_ANGEL] = NullItemID.ID_EVIL_ANGEL,
	[PlayerForm.PLAYERFORM_POOP] = NullItemID.ID_POOP,
	[PlayerForm.PLAYERFORM_BOOK_WORM] = NullItemID.ID_BOOK_WORM,
	[PlayerForm.PLAYERFORM_ADULTHOOD] = NullItemID.ID_ADULTHOOD,
	[PlayerForm.PLAYERFORM_SPIDERBABY] = NullItemID.ID_SPIDERBABY,
}

if REPENTANCE then
	defaultNullItemWhitelist = {
		[NullItemID.ID_MARS] = true,
		[NullItemID.ID_TOOTH_AND_NAIL] = true,
		[NullItemID.ID_ESAU_JR] = true,
		[NullItemID.ID_SPIRIT_SHACKLES_SOUL] = true,
		[NullItemID.ID_SPIRIT_SHACKLES_DISABLED] = true,
		[NullItemID.ID_LOST_CURSE] = true
	}

	defaultItemWhitelist[CollectibleType.COLLECTIBLE_SPIRIT_SHACKLES] = true
	defaultItemWhitelist[CollectibleType.COLLECTIBLE_ASTRAL_PROJECTION] = true

	nullEffectsBlacklist = {
		[NullItemID.ID_HUGE_GROWTH] = true,
		[NullItemID.ID_ERA_WALK] = true,
		[NullItemID.ID_HOLY_CARD] = true,
		[NullItemID.ID_SPIN_TO_WIN] = true,
		[NullItemID.ID_INTRUDER] = true,
		[NullItemID.ID_REVERSE_HIGH_PRIESTESS] = true,
		[NullItemID.ID_REVERSE_STRENGTH] = true,
		[NullItemID.ID_REVERSE_TEMPERANCE] = true,
		[NullItemID.ID_EXTRA_BIG_FAN] = true,
		[NullItemID.ID_DARK_ARTS] = true,
		[NullItemID.ID_LAZARUS_SOUL_REVIVE] = true,
		[NullItemID.ID_SOUL_MAGDALENE] = true,
		[NullItemID.ID_SOUL_BLUEBABY] = true,
		[NullItemID.ID_MIRROR_DEATH] = true,
		[NullItemID.ID_SOUL_FORGOTTEN] = true,
		[NullItemID.ID_SOUL_JACOB] = true,
	}

	collectiblesEffectsOnlyAddOnEffect[CollectibleType.COLLECTIBLE_LARYNX] = true
	collectiblesEffectsOnlyAddOnEffect[CollectibleType.COLLECTIBLE_TOOTH_AND_NAIL] = true
	collectiblesEffectsOnlyAddOnEffect[CollectibleType.COLLECTIBLE_ASTRAL_PROJECTION] = true

	activesToDelayCostumeReset[CollectibleType.COLLECTIBLE_LARYNX] = true
	activesToDelayCostumeReset[CollectibleType.COLLECTIBLE_SULFUR] = true
	activesToDelayCostumeReset[CollectibleType.COLLECTIBLE_LEMEGETON] = true

	costumeTrinkets[TrinketType.TRINKET_AZAZELS_STUMP] = true
end

-----------------------
--  LOCAL FUNCTIONS  --
-----------------------

local function onSpiritShacklesGhost(player)
	local playerType = player:GetPlayerType()

	player:ClearCostumes()
	if playerCostume[playerType]["Extra"] ~= nil then
		local costumeExtra = playerCostume[playerType]["Extra"]
		player:AddNullCostume(costumeExtra)
	end
end

local function addAllWhitelistedCostumes(player)
	local playerType = player:GetPlayerType()
	local playerEffects = player:GetEffects()
	local data = player:GetData()

	--Item Costumes
	if playerItemCostumeWhitelist[playerType] then
		for itemID, _ in pairs(playerItemCostumeWhitelist[playerType]) do
			local itemCostume = Isaac.GetItemConfig():GetCollectible(itemID)

			if ccp:canAddCollectibleCostume(player, itemID)
				and playerItemCostumeWhitelist[playerType][itemID] == true then
				player:AddCostume(itemCostume, false)
			end
		end
	end

	--Item Costumes Only On Effect
	for itemID, boolean in pairs(collectiblesEffectsOnlyAddOnEffect) do
		if playerEffects:HasCollectibleEffect(itemID)
			and playerItemCostumeWhitelist[playerType][itemID] == true
		then
			local itemCostume = Isaac.GetItemConfig():GetCollectible(itemID)

			if itemID ~= CollectibleType.COLLECTIBLE_ASTRAL_PROJECTION then
				player:AddCostume(itemCostume)
			elseif not player:GetData().CCP_AstralProjectionDisabled then
				player:AddCostume(itemCostume)
			end
		end
	end

	--Null Costumes
	for nullItemID, _ in pairs(playerNullItemCostumeWhitelist[playerType]) do
		if playerEffects:HasNullEffect(nullItemID)
			and not nullEffectsBlacklist[nullItemID] then
			if REPENTANCE and nullItemID == NullItemID.ID_SPIRIT_SHACKLES_SOUL then
				onSpiritShacklesGhost(player)
			end
			player:AddNullCostume(nullItemID)
		end
	end

	--Trinkets
	for trinketID, _ in pairs(costumeTrinkets) do
		if ((trinketID == TrinketType.TRINKET_TICK
			and player:HasTrinket(trinketID))
			or playerEffects:HasTrinketEffect(trinketID))
			and data.CCP.TrinketActive[trinketID]
			and playerTrinketCostumeWhitelist[playerType][trinketID] == true then
			local trinketCostume = Isaac.GetItemConfig():GetTrinket(trinketID)
			player:AddCostume(trinketCostume)
		end
	end

	--Transformations
	for playerForm, nullItemID in pairs(playerFormToNullItemID) do
		if player:HasPlayerForm(playerForm)
			and playerNullItemCostumeWhitelist[playerType][nullItemID] == true
		then
			player:AddNullCostume(nullItemID)
		end
	end
end

local function addItemSpecificCostumes(player)
	local playerType = player:GetPlayerType()
	local playerEffects = player:GetEffects()
	local holyMantleCostume = Isaac.GetItemConfig():GetCollectible(CollectibleType.COLLECTIBLE_HOLY_MANTLE)

	--Empty Vessel
	if playerEffects:HasCollectibleEffect(CollectibleType.COLLECTIBLE_EMPTY_VESSEL)
		and playerNullItemCostumeWhitelist[playerType][NullItemID.ID_EMPTY_VESSEL] == true then
		player:AddNullCostume(NullItemID.ID_EMPTY_VESSEL)
	end

	if REPENTANCE then
		--Holy Card
		if REPENTANCE and playerEffects:HasNullEffect(NullItemID.ID_HOLY_CARD) then
			player:AddCostume(holyMantleCostume, false)
		end

		if player:GetCollectibleNum(CollectibleType.COLLECTIBLE_BRIMSTONE) >= 2 then
			player:AddNullCostume(NullItemID.ID_BRIMSTONE2)
		end

		local ID_DOUBLE_GUPPYS_EYE = 125
		local ID_DOUBLE_GLASS_EYE = 126

		--Double Guppy's Eye
		if player:GetCollectibleNum(CollectibleType.COLLECTIBLE_GUPPYS_EYE) >= 2 then
			if playerItemCostumeWhitelist[CollectibleType.COLLECTIBLE_GUPPYS_EYE] == true then
				player:AddNullCostume(ID_DOUBLE_GUPPYS_EYE)
			end
		end

		--Double Glass Eye
		if player:GetCollectibleNum(CollectibleType.COLLECTIBLE_GLASS_EYE) >= 2 then
			if playerItemCostumeWhitelist[CollectibleType.COLLECTIBLE_GLASS_EYE] == true then
				player:AddRemoveNullCostume(ID_DOUBLE_GLASS_EYE)
			end
		end
	end
end

local function updatePlayerSpritesheet(player, sprite)
	local playerType = player:GetPlayerType()
	local spritesheetPath = playerSpritesheet[playerType]["Normal"]

	if player.CanFly and playerSpritesheet[playerType]["Flight"] ~= nil then
		spritesheetPath = playerSpritesheet[playerType]["Flight"]
	end

	sprite:ReplaceSpritesheet(12, spritesheetPath)
	sprite:ReplaceSpritesheet(4, spritesheetPath)
	sprite:ReplaceSpritesheet(2, spritesheetPath)
	sprite:ReplaceSpritesheet(1, spritesheetPath)
	sprite:LoadGraphics()
end

local function tryAddFlightCostume(player)
	local playerType = player:GetPlayerType()
	local data = player:GetData()

	if player.CanFly == true
		and playerCostume[playerType]["Flight"] ~= nil then
		player:AddNullCostume(playerCostume[playerType]["Flight"])
	end
end

local function returnOnHemoptysis(player)
	local effects = player:GetEffects()
	local playerType = player:GetPlayerType()
	local hemo = CollectibleType.COLLECTIBLE_HEMOPTYSIS
	local shouldStopReset = false

	if effects:HasCollectibleEffect(hemo)
		and playerItemCostumeWhitelist[playerType]
		and playerItemCostumeWhitelist[playerType][hemo] ~= nil then
		shouldStopReset = true
	end
	return shouldStopReset
end

local function tryRemoveOldCostume(player, playerType)
	local basePath = playerCostume[playerType]

	if basePath ~= nil then
		if basePath["Flight"] ~= nil then
			player:TryRemoveNullCostume(basePath["Flight"])
		end
		if basePath["Extra"] ~= nil then
			player:TryRemoveNullCostume(basePath["Extra"])
		end
	end
end

----------------------
--  MAIN FUNCTIONS  --
----------------------

function ccp:addCustomNullCostume(player, nullID)
	if nullID ~= -1 then
		player:AddNullCostume(nullID)
	else
		error("Custom Costume Protector Error: attempt to add costume returns nil")
	end
end

function ccp:canAddCollectibleCostume(player, itemID)
	local canAdd = false

	if (player:HasCollectible(itemID) or player:GetEffects():HasCollectibleEffect(itemID))
		and not collectiblesEffectsOnlyAddOnEffect[itemID]
	then
		local item = Isaac.GetItemConfig():GetCollectible(itemID)
		if item ~= nil then
			local costume = item.Costume.Anm2Path
			if costume ~= "" then
				canAdd = true
			end
		end
	end

	return canAdd
end

function ccp:mainResetPlayerCostumes(player)
	local playerType = player:GetPlayerType()

	if (REPENTANCE and playerToProtect[playerType] == true and not player:IsCoopGhost()) or
		(not REPENTANCE and playerToProtect[playerType] == true) then

		player:ClearCostumes()
		updatePlayerSpritesheet(player, player:GetSprite())

		if playerCostume[playerType]["Flight"] ~= nil then
			tryAddFlightCostume(player)
		end

		if playerCostume[playerType]["Extra"] ~= nil then
			local costumeExtra = playerCostume[playerType]["Extra"]
			ccp:addCustomNullCostume(player, costumeExtra)
		end

		addAllWhitelistedCostumes(player)
		addItemSpecificCostumes(player)
		ccp:afterCostumeReset(player)
	end
end

function ccp:removeCCPPlayer(player)
	local data = player:GetData()
	local playerEffects = player:GetEffects()

	if data.CCP and data.CCP.HasCostumeInitialized then
		for playerType, _ in pairs(data.CCP.HasCostumeInitialized) do

			tryRemoveOldCostume(player, playerType)

			--Item Costumes
			for itemID = 1, CollectibleType.NUM_COLLECTIBLES do
				local itemCostume = Isaac.GetItemConfig():GetCollectible(itemID)
				if ccp:canAddCollectibleCostume(player, itemID)
					and not playerItemCostumeWhitelist[playerType][itemID] then
					player:AddCostume(itemCostume, false)
				end
			end

			--Item Costumes Only On Effect
			for itemID, boolean in pairs(collectiblesEffectsOnlyAddOnEffect) do
				local itemCostume = Isaac.GetItemConfig():GetCollectible(itemID)
				if playerEffects:HasCollectibleEffect(itemID)
					and not playerItemCostumeWhitelist[playerType][itemID] then
					player:AddCostume(itemCostume)
				end
			end

			--Null Costumes
			for nullItemID = 1, NullItemID.NUM_NULLITEMS do
				if playerEffects:HasNullEffect(nullItemID)
					and not nullEffectsBlacklist[nullItemID]
					and not playerNullItemCostumeWhitelist[playerType][nullItemID] then
					player:AddNullCostume(nullItemID)
				end
			end

			--Trinkets
			for trinketID, _ in pairs(costumeTrinkets) do
				if ((trinketID == TrinketType.TRINKET_TICK
					and player:HasTrinket(trinketID))
					or playerEffects:HasTrinketEffect(trinketID))
					and data.CCP.TrinketActive[trinketID]
					and not playerTrinketCostumeWhitelist[playerType][trinketID] then
					local trinketCostume = Isaac.GetItemConfig():GetTrinket(trinketID)
					player:AddCostume(trinketCostume)
				end
			end

			--Transformations
			for playerForm, nullItemID in pairs(playerFormToNullItemID) do
				if player:HasPlayerForm(playerForm) then
					player:AddNullCostume(nullItemID)
				end
			end
		end
	end
	data.CCP = nil
end

function ccp:initPlayerCostume(player)
	if not REPENTANCE
		or (REPENTANCE and not player:IsCoopGhost())
	then
		local playerType = player:GetPlayerType()
		local data = player:GetData()

		ccp:mainResetPlayerCostumes(player)
		data.CCP = {}
		data.CCP.NumCollectibles = player:GetCollectibleCount()
		data.CCP.NumTemporaryEffects = player:GetEffects():GetEffectsList().Size
		data.CCP.TrinketActive = {}
		data.CCP.QueueCostumeRemove = {}
		data.CCP.HasCostumeInitialized = {
			[playerType] = true
		}
		ccp:afterCostumeInit(player)
	end
end

function ccp:deinitPlayerCostume(player)
	local data = player:GetData()
	local playerType = player:GetPlayerType()

	if data.CCP
		and data.CCP.HasCostumeInitialized --You have protection data
		and not data.CCP.HasCostumeInitialized[playerType] then --You are not longer the character you initialized as
		for dataPlayerType, _ in pairs(data.CCP.HasCostumeInitialized) do
			if playerToProtect[playerType] then --Your current player is within the library's protection! Initialize them with their new data.
				tryRemoveOldCostume(player, dataPlayerType)
				data.CCP.HasCostumeInitialized[dataPlayerType] = nil
				ccp:initPlayerCostume(player)
			elseif playerToProtect[dataPlayerType] then --You current player isn't protected, but previously was within this library's protection.
				ccp:removeCCPPlayer(player)
				ccp:afterCostumeDeinit(player)
			end
		end
	end
end

function ccp:miscCostumeResets(player)
	local playerType = player:GetPlayerType()
	local playerEffects = player:GetEffects()
	local data = player:GetData()

	if data.CCP.NumCollectibles
		and data.CCP.NumCollectibles ~= player:GetCollectibleCount()
	then
		data.CCP.NumCollectibles = player:GetCollectibleCount()
		ccp:mainResetPlayerCostumes(player)
	end

	if data.CCP.NumTemporaryEffects
		and data.CCP.NumTemporaryEffects ~= player:GetEffects():GetEffectsList().Size
		and not returnOnHemoptysis(player)
	then
		data.CCP.NumTemporaryEffects = player:GetEffects():GetEffectsList().Size
		ccp:mainResetPlayerCostumes(player)
	end

	for trinketID, _ in pairs(costumeTrinkets) do
		if ((trinketID == TrinketType.TRINKET_TICK
			and player:HasTrinket(trinketID))
			or playerEffects:HasTrinketEffect(trinketID))
		then
			if not data.CCP.TrinketActive[trinketID] then
				if not playerTrinketCostumeWhitelist[playerType][trinketID] then
					local trinketCostume = Isaac.GetItemConfig():GetTrinket(trinketID)
					if trinketID == TrinketType.TRINKET_TICK then
						if player.QueuedItem.Item then
							if player.QueuedItem.Item.ID == TrinketType.TRINKET_TICK then
								data.CCP.DelayTick = true
							end
						else
							if data.CCP.DelayTick then
								player:RemoveCostume(trinketCostume)
								data.CCP.DelayTick = false
								data.CCP.TrinketActive[trinketID] = true
							end
						end
					else
						player:RemoveCostume(trinketCostume)
					end
				end
			end
		elseif (trinketID == TrinketType.TRINKET_TICK
			and not player:HasTrinket(trinketID))
			or not playerEffects:HasTrinketEffect(trinketID)
		then
			if data.CCP.TrinketActive[trinketID] then
				data.CCP.TrinketActive[trinketID] = false
			end
		end
	end

	if player.CanFly and not data.CCP.CustomFlightCostume then
		ccp:mainResetPlayerCostumes(player)
		data.CCP.CustomFlightCostume = true
	elseif not player.CanFly and data.CCP.CustomFlightCostume then
		ccp:mainResetPlayerCostumes(player)
		data.CCP.CustomFlightCostume = false
	end
end

----------------------------------------------
--  RESETTING COSTUME ON SPECIFIC TRIGGERS  --
----------------------------------------------

--Code provided by piber20
local function ABPlusUseItemPlayer(itemID)
	local player
	for i = 0, Game():GetNumPlayers() - 1 do

		local thisPlayer = Isaac.GetPlayer(i)

		--check the player's input
		if Input.IsActionTriggered(ButtonAction.ACTION_ITEM, thisPlayer.ControllerIndex) or
			Input.IsActionTriggered(ButtonAction.ACTION_PILLCARD, thisPlayer.ControllerIndex) and
			thisPlayer:GetActiveItem() == itemID then

			player = thisPlayer
			break

		end

	end

	if player then return player end
end

function ccp:resetCostumeOnItem(
  itemID, rng, player, useFlags, activeSlot, customVarData
)
	local player = player or ABPlusUseItemPlayer(itemID)
	if player then
		local playerType = player:GetPlayerType()
		local data = player:GetData()
		local playerHasUsedItem = activesToDelayCostumeReset[itemID] == true

		if playerToProtect[playerType] and data.CCP then
			if data.CCP.HasCostumeInitialized and playerHasUsedItem then
				if playerItemCostumeWhitelist[playerType] and not playerItemCostumeWhitelist[playerType][itemID] then
					data.CCP.DelayCostumeReset = true
				end
			end
		end
	end
	return nil
end

function ccp:resetCostumeOnPill(
 pillEffect, player, useFlags
)
	local playerType = player:GetPlayerType()
	local data = player:GetData()

	if playerToProtect[playerType] and data.CCP then
		if (
			pillEffect == PillEffect.PILLEFFECT_I_FOUND_PILLS -- 6
			or pillEffect == PillEffect.PILLEFFECT_WIZARD -- 27
		) then
			ccp:mainResetPlayerCostumes(player)
		end
	end
end

function ccp:resetOnCoopRevive(player)
	local data = player:GetData()
	if player:IsCoopGhost() and not data.CCP.WaitOnCoopRevive then
		data.CCP.WaitOnCoopRevive = true
	elseif not player:IsCoopGhost() and data.CCP.WaitOnCoopRevive then
		ccp:mainResetPlayerCostumes(player)
		data.CCP.WaitOnCoopRevive = false
	end
end

function ccp:stopNewRoomCostumes(player)
	local playerType = player:GetPlayerType()
	local data = player:GetData()

	if player:HasCollectible(CollectibleType.COLLECTIBLE_TAURUS)
		and not playerItemCostumeWhitelist[playerType][CollectibleType.COLLECTIBLE_TAURUS] then
		table.insert(data.CCP.QueueCostumeRemove, CollectibleType.COLLECTIBLE_TAURUS)
		data.CCP.DelayTaurusCostumeReset = true
	end

	if player:HasCollectible(CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON)
		and not playerItemCostumeWhitelist[playerType][CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON] then
		if player:GetHearts() <= 1 then
			table.insert(data.CCP.QueueCostumeRemove, CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON)
		end
	end

	if player:HasCollectible(CollectibleType.COLLECTIBLE_EMPTY_VESSEL)
		and not playerItemCostumeWhitelist[playerType][CollectibleType.COLLECTIBLE_EMPTY_VESSEL] then
		if player:GetHearts() == 0 then
			table.insert(data.CCP.QueueCostumeRemove, CollectibleType.COLLECTIBLE_EMPTY_VESSEL)
			Isaac.DebugString("GETTING HERE - data.CCP.QueueCostumeRemove: " .. tostring(data.CCP.QueueCostumeRemove))
		end
	end
end

function ccp:stopTaurusCostumeOnInvincibility(player)
	local effects = player:GetEffects()
	local data = player:GetData()

	if player:GetEffects():HasCollectibleEffect(CollectibleType.COLLECTIBLE_TAURUS)
		and player.MoveSpeed >= 2.0
		and data.CCP.DelayTaurusCostumeReset then
		table.insert(data.CCP.QueueCostumeRemove, CollectibleType.COLLECTIBLE_TAURUS)
		data.CCP.DelayTaurusCostumeReset = false
	end
end

function ccp:resetOnMissingNoNewFloor(player)
	if player:HasCollectible(CollectibleType.COLLECTIBLE_MISSING_NO) then
		ccp:mainResetPlayerCostumes(player)
	end
end

function ccp:modelingClay(player)
	local playerType = player:GetPlayerType()
	local data = player:GetData()
	local itemID = player:GetModelingClayEffect()

	if player:HasTrinket(TrinketType.TRINKET_MODELING_CLAY)
		and itemID ~= 0
		and playerItemCostumeWhitelist[playerType][itemID] == nil
	then
		table.insert(data.CCP.QueueCostumeRemove, itemID)
	end
end

local function LoadPlayerAndCostumeSprites(player)
	local playerType = player:GetPlayerType()
	local pSprite = player:GetSprite()
	local data = player:GetData()
	local itemConfig = Isaac.GetItemConfig()
	local costumePath = itemConfig:GetNullItem(playerCostume[playerType]["Extra"]).Costume.Anm2Path

	data.CCP.MineshaftHeadCostume = Sprite()
	data.CCP.MineshaftBodyCostume = Sprite()
	data.CCP.MineshaftHead = Sprite()
	data.CCP.MineshaftBody = Sprite()
	data.CCP.MineshaftHead:Load(pSprite:GetFilename(), true)
	data.CCP.MineshaftBody:Load(pSprite:GetFilename(), true)
	data.CCP.MineshaftHeadCostume:Load(costumePath, true)
	data.CCP.MineshaftHead:Play("HeadUp", true)
	data.CCP.MineshaftBody:Play("WalkUp", true)
	data.CCP.MineshaftHeadCostume:Play("HeadUp", true)
	updatePlayerSpritesheet(player, data.CCP.MineshaftHead)
	updatePlayerSpritesheet(player, data.CCP.MineshaftBody)
	local bodyCostumePath = costumePath
	if player.CanFly then bodyCostumePath = itemConfig:GetNullItem(playerCostume[playerType]["Flight"]).Costume.Anm2Path end
	data.CCP.MineshaftBodyCostume:Load(bodyCostumePath, true)
	data.CCP.MineshaftBodyCostume:Play("WalkUp", true)
end

function ccp:restoreCostumeInMineshaft(player)
	local playerType = player:GetPlayerType()
	local pSprite = player:GetSprite()
	local data = player:GetData()
	local room = game:GetRoom()

	if playerToProtect[playerType] == true and data.CCP then
		if room:HasCurseMist() and
			(playerCostume[playerType]["Extra"] or (player.CanFly and playerCostume[playerType]["Flight"])) then
			if not data.CCP.MineshaftHeadCostume
				and not data.CCP.MineshaftBodyCostume then
				LoadPlayerAndCostumeSprites(player)
			else
				local screenpos = game:GetRoom():WorldToScreenPosition(player.Position)
				local walkAnims = {
					"WalkDown",
					"WalkRight",
					"WalkUp",
					"WalkLeft"
				}
				local isWalking = false
				for i = 1, #walkAnims do
					if pSprite:GetAnimation() == walkAnims[i] then
						isWalking = true
					end
				end
				if isWalking then
					local spriteToUse = {
						data.CCP.MineshaftBody,
						data.CCP.MineshaftBodyCostume,
						data.CCP.MineshaftHead,
						data.CCP.MineshaftHeadCostume
					}
					for i = 1, #spriteToUse do
						local animToUse = pSprite:GetAnimation()
						local frameToUse = pSprite:GetFrame()
						if i > 2 then
							animToUse = pSprite:GetOverlayAnimation()
							frameToUse = pSprite:GetOverlayFrame()
						end
						spriteToUse[i].Color = pSprite.Color
						spriteToUse[i]:SetFrame(animToUse, frameToUse)
						spriteToUse[i]:Render(screenpos - game.ScreenShakeOffset, Vector.Zero, Vector.Zero)
					end
				end
			end
		elseif data.CCP.MineshaftHeadCostume
			and data.CCP.MineshaftBodyCostume then
			data.CCP.MineshaftHeadCostume = nil
			data.CCP.MineshaftBodyCostume = nil
			data.CCP.MineshaftHead = nil
			data.CCP.MineshaftBody = nil
		end
	end
end

local roomIsClear = true

function ccp:astralProjectionOnClear(player)
	local playerType = player:GetPlayerType()
	local data = player:GetData()
	local room = game:GetRoom()

	if player:GetEffects():HasCollectibleEffect(CollectibleType.COLLECTIBLE_ASTRAL_PROJECTION) then
		if roomIsClear == false and room:IsClear() == true and not data.CCP.AstralProjectionDisabled then
			data.CCP.DelayCostumeReset = true
			data.CCP.AstralProjectionDisabled = true
		end
	else
		if data.CCP.AstralProjectionDisabled then
			data.CCP.AstralProjectionDisabled = nil
		end
	end
	roomIsClear = room:IsClear()
end

function ccp:astralProjectionOnHit(ent, amount, flags, source, countdown)
	local player = ent:ToPlayer()
	local playerType = player:GetPlayerType()
	local data = player:GetData()

	if playerToProtect[playerType] == true and data.CCP then
		if player:GetEffects():HasCollectibleEffect(CollectibleType.COLLECTIBLE_ASTRAL_PROJECTION) then
			data.CCP.DelayCostumeReset = true
			data.CCP.AstralProjectionDisabled = true
		end
	end
end

function ccp:delayInCostumeReset(player)
	local data = player:GetData()

	if data.CCP.DelayCostumeReset and data.CCP.DelayCostumeReset then
		ccp:mainResetPlayerCostumes(player)
		data.CCP.DelayCostumeReset = nil
	end

	if data.CCP.QueueCostumeRemove and data.CCP.QueueCostumeRemove[1] ~= nil then
		while #data.CCP.QueueCostumeRemove > 0 do
			local isEmptyVessel = data.CCP.QueueCostumeRemove[1] == CollectibleType.COLLECTIBLE_EMPTY_VESSEL
			local itemCostume = Isaac.GetItemConfig():GetCollectible(data.CCP.QueueCostumeRemove[1])
			player:RemoveCostume(itemCostume)
			table.remove(data.CCP.QueueCostumeRemove, 1)

			if isEmptyVessel then
				ccp:mainResetPlayerCostumes(player)
			end
		end
	end
end

----------------------------
--  INITIATING CALLBACKS  --
----------------------------

function ccp:init(mod)
	mod:AddCallback(ModCallbacks.MC_POST_PLAYER_INIT, function(_, player)
		-- Ignore e.g. Strawman players.
		if player.Parent == nil then
			return
		end

		ccp:removeAllPlayers(player)
	end)

	mod:AddCallback(ModCallbacks.MC_POST_PEFFECT_UPDATE, function(_, player)
		local playerType = player:GetPlayerType()
		local data = player:GetData()

		if game:GetFrameCount() > 1 then
			ccp:deinitPlayerCostume(player)

			if playerToProtect[playerType] and not data.CCP then
				ccp:initPlayerCostume(player)
			end
		end

		if playerToProtect[playerType] == true and data.CCP then
			ccp:miscCostumeResets(player)
			ccp:delayInCostumeReset(player)
			ccp:stopTaurusCostumeOnInvincibility(player)
			if REPENTANCE then
				ccp:astralProjectionOnClear(player)
			end
		end
	end)

	mod:AddCallback(ModCallbacks.MC_POST_NEW_ROOM, function()
		for i = 0, game:GetNumPlayers() - 1 do
			local player = Isaac.GetPlayer(i)
			local playerType = player:GetPlayerType()
			local data = player:GetData()

			if playerToProtect[playerType] == true and data.CCP then
				ccp:stopNewRoomCostumes(player)
				if REPENTANCE then
					ccp:modelingClay(player)
				end
			end
		end
	end)

	mod:AddCallback(ModCallbacks.MC_POST_NEW_LEVEL, function()
		for i = 0, game:GetNumPlayers() - 1 do
			local player = Isaac.GetPlayer(i)
			local playerType = player:GetPlayerType()
			local data = player:GetData()

			if playerToProtect[playerType] == true and data.CCP then
				ccp:resetOnMissingNoNewFloor(player)
			end
		end
	end)

	mod:AddCallback(ModCallbacks.MC_USE_ITEM, ccp.resetCostumeOnItem)

	mod:AddCallback(ModCallbacks.MC_USE_PILL, ccp.resetCostumeOnPill)

	if REPENTANCE then
		mod:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG, ccp.astralProjectionOnHit, EntityType.ENTITY_PLAYER)
		mod:AddCallback(ModCallbacks.MC_POST_PLAYER_RENDER, ccp.restoreCostumeInMineshaft, 0)
	end
end

-- Make the "mainResetPlayerCostumes" function global so that other mods can use it.
CCPMainResetPlayerCostumes = ccp.mainResetPlayerCostumes;

return {
	Init = ccp.init,
	AddPlayer = ccp.addPlayer,
	RemovePlayer = ccp.removePlayer,
	RemoveAllPlayers = ccp.removeAllPlayers,
	UpdatePlayer = ccp.updatePlayer,
	ItemCostumeWhitelist = ccp.itemCostumeWhitelist,
	NullItemIDWhitelist = ccp.nullItemIDWhitelist,
	TrinketCostumeWhitelist = ccp.trinketCostumeWhitelist,
	AddCallback = ccp.addCallback,
}
