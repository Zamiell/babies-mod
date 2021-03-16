
local ____modules = {}
local ____moduleCache = {}
local ____originalRequire = require
local function require(file)
    if ____moduleCache[file] then
        return ____moduleCache[file]
    end
    if ____modules[file] then
        ____moduleCache[file] = ____modules[file]()
        return ____moduleCache[file]
    else
        if ____originalRequire then
            return ____originalRequire(file)
        else
            error("module '" .. file .. "' not found")
        end
    end
end
____modules = {
["lualib_bundle"] = function() function __TS__ArrayIsArray(value)
    return (type(value) == "table") and ((value[1] ~= nil) or (next(value, nil) == nil))
end

function __TS__ArrayConcat(arr1, ...)
    local args = {...}
    local out = {}
    for ____, val in ipairs(arr1) do
        out[#out + 1] = val
    end
    for ____, arg in ipairs(args) do
        if __TS__ArrayIsArray(arg) then
            local argAsArray = arg
            for ____, val in ipairs(argAsArray) do
                out[#out + 1] = val
            end
        else
            out[#out + 1] = arg
        end
    end
    return out
end

function __TS__ArrayEvery(arr, callbackfn)
    do
        local i = 0
        while i < #arr do
            if not callbackfn(_G, arr[i + 1], i, arr) then
                return false
            end
            i = i + 1
        end
    end
    return true
end

function __TS__ArrayFilter(arr, callbackfn)
    local result = {}
    do
        local i = 0
        while i < #arr do
            if callbackfn(_G, arr[i + 1], i, arr) then
                result[#result + 1] = arr[i + 1]
            end
            i = i + 1
        end
    end
    return result
end

function __TS__ArrayForEach(arr, callbackFn)
    do
        local i = 0
        while i < #arr do
            callbackFn(_G, arr[i + 1], i, arr)
            i = i + 1
        end
    end
end

function __TS__ArrayFind(arr, predicate)
    local len = #arr
    local k = 0
    while k < len do
        local elem = arr[k + 1]
        if predicate(_G, elem, k, arr) then
            return elem
        end
        k = k + 1
    end
    return nil
end

function __TS__ArrayFindIndex(arr, callbackFn)
    do
        local i = 0
        local len = #arr
        while i < len do
            if callbackFn(_G, arr[i + 1], i, arr) then
                return i
            end
            i = i + 1
        end
    end
    return -1
end

function __TS__ArrayIncludes(self, searchElement, fromIndex)
    if fromIndex == nil then
        fromIndex = 0
    end
    local len = #self
    local k = fromIndex
    if fromIndex < 0 then
        k = len + fromIndex
    end
    if k < 0 then
        k = 0
    end
    for i = k, len do
        if self[i + 1] == searchElement then
            return true
        end
    end
    return false
end

function __TS__ArrayIndexOf(arr, searchElement, fromIndex)
    local len = #arr
    if len == 0 then
        return -1
    end
    local n = 0
    if fromIndex then
        n = fromIndex
    end
    if n >= len then
        return -1
    end
    local k
    if n >= 0 then
        k = n
    else
        k = len + n
        if k < 0 then
            k = 0
        end
    end
    do
        local i = k
        while i < len do
            if arr[i + 1] == searchElement then
                return i
            end
            i = i + 1
        end
    end
    return -1
end

function __TS__ArrayJoin(self, separator)
    if separator == nil then
        separator = ","
    end
    local result = ""
    for index, value in ipairs(self) do
        if index > 1 then
            result = tostring(result) .. tostring(separator)
        end
        result = tostring(result) .. tostring(
            tostring(value)
        )
    end
    return result
end

function __TS__ArrayMap(arr, callbackfn)
    local newArray = {}
    do
        local i = 0
        while i < #arr do
            newArray[i + 1] = callbackfn(_G, arr[i + 1], i, arr)
            i = i + 1
        end
    end
    return newArray
end

function __TS__ArrayPush(arr, ...)
    local items = {...}
    for ____, item in ipairs(items) do
        arr[#arr + 1] = item
    end
    return #arr
end

function __TS__ArrayReduce(arr, callbackFn, ...)
    local len = #arr
    local k = 0
    local accumulator = nil
    if select("#", ...) ~= 0 then
        accumulator = select(1, ...)
    elseif len > 0 then
        accumulator = arr[1]
        k = 1
    else
        error("Reduce of empty array with no initial value", 0)
    end
    for i = k, len - 1 do
        accumulator = callbackFn(_G, accumulator, arr[i + 1], i, arr)
    end
    return accumulator
end

function __TS__ArrayReduceRight(arr, callbackFn, ...)
    local len = #arr
    local k = len - 1
    local accumulator = nil
    if select("#", ...) ~= 0 then
        accumulator = select(1, ...)
    elseif len > 0 then
        accumulator = arr[k + 1]
        k = k - 1
    else
        error("Reduce of empty array with no initial value", 0)
    end
    for i = k, 0, -1 do
        accumulator = callbackFn(_G, accumulator, arr[i + 1], i, arr)
    end
    return accumulator
end

function __TS__ArrayReverse(arr)
    local i = 0
    local j = #arr - 1
    while i < j do
        local temp = arr[j + 1]
        arr[j + 1] = arr[i + 1]
        arr[i + 1] = temp
        i = i + 1
        j = j - 1
    end
    return arr
end

function __TS__ArrayShift(arr)
    return table.remove(arr, 1)
end

function __TS__ArrayUnshift(arr, ...)
    local items = {...}
    do
        local i = #items - 1
        while i >= 0 do
            table.insert(arr, 1, items[i + 1])
            i = i - 1
        end
    end
    return #arr
end

function __TS__ArraySort(arr, compareFn)
    if compareFn ~= nil then
        table.sort(
            arr,
            function(a, b) return compareFn(_G, a, b) < 0 end
        )
    else
        table.sort(arr)
    end
    return arr
end

function __TS__ArraySlice(list, first, last)
    local len = #list
    local relativeStart = first or 0
    local k
    if relativeStart < 0 then
        k = math.max(len + relativeStart, 0)
    else
        k = math.min(relativeStart, len)
    end
    local relativeEnd = last
    if last == nil then
        relativeEnd = len
    end
    local final
    if relativeEnd < 0 then
        final = math.max(len + relativeEnd, 0)
    else
        final = math.min(relativeEnd, len)
    end
    local out = {}
    local n = 0
    while k < final do
        out[n + 1] = list[k + 1]
        k = k + 1
        n = n + 1
    end
    return out
end

function __TS__ArraySome(arr, callbackfn)
    do
        local i = 0
        while i < #arr do
            if callbackfn(_G, arr[i + 1], i, arr) then
                return true
            end
            i = i + 1
        end
    end
    return false
end

function __TS__ArraySplice(list, ...)
    local len = #list
    local actualArgumentCount = select("#", ...)
    local start = select(1, ...)
    local deleteCount = select(2, ...)
    local actualStart
    if start < 0 then
        actualStart = math.max(len + start, 0)
    else
        actualStart = math.min(start, len)
    end
    local itemCount = math.max(actualArgumentCount - 2, 0)
    local actualDeleteCount
    if actualArgumentCount == 0 then
        actualDeleteCount = 0
    elseif actualArgumentCount == 1 then
        actualDeleteCount = len - actualStart
    else
        actualDeleteCount = math.min(
            math.max(deleteCount or 0, 0),
            len - actualStart
        )
    end
    local out = {}
    do
        local k = 0
        while k < actualDeleteCount do
            local from = actualStart + k
            if list[from + 1] then
                out[k + 1] = list[from + 1]
            end
            k = k + 1
        end
    end
    if itemCount < actualDeleteCount then
        do
            local k = actualStart
            while k < (len - actualDeleteCount) do
                local from = k + actualDeleteCount
                local to = k + itemCount
                if list[from + 1] then
                    list[to + 1] = list[from + 1]
                else
                    list[to + 1] = nil
                end
                k = k + 1
            end
        end
        do
            local k = len
            while k > ((len - actualDeleteCount) + itemCount) do
                list[k] = nil
                k = k - 1
            end
        end
    elseif itemCount > actualDeleteCount then
        do
            local k = len - actualDeleteCount
            while k > actualStart do
                local from = (k + actualDeleteCount) - 1
                local to = (k + itemCount) - 1
                if list[from + 1] then
                    list[to + 1] = list[from + 1]
                else
                    list[to + 1] = nil
                end
                k = k - 1
            end
        end
    end
    local j = actualStart
    for i = 3, actualArgumentCount do
        list[j + 1] = select(i, ...)
        j = j + 1
    end
    do
        local k = #list - 1
        while k >= ((len - actualDeleteCount) + itemCount) do
            list[k + 1] = nil
            k = k - 1
        end
    end
    return out
end

function __TS__ArrayToObject(array)
    local object = {}
    do
        local i = 0
        while i < #array do
            object[i] = array[i + 1]
            i = i + 1
        end
    end
    return object
end

function __TS__ArrayFlat(array, depth)
    if depth == nil then
        depth = 1
    end
    local result = {}
    for ____, value in ipairs(array) do
        if (depth > 0) and __TS__ArrayIsArray(value) then
            result = __TS__ArrayConcat(
                result,
                __TS__ArrayFlat(value, depth - 1)
            )
        else
            result[#result + 1] = value
        end
    end
    return result
end

function __TS__ArrayFlatMap(array, callback)
    local result = {}
    do
        local i = 0
        while i < #array do
            local value = callback(_G, array[i + 1], i, array)
            if (type(value) == "table") and __TS__ArrayIsArray(value) then
                result = __TS__ArrayConcat(result, value)
            else
                result[#result + 1] = value
            end
            i = i + 1
        end
    end
    return result
end

function __TS__ArraySetLength(arr, length)
    if (((length < 0) or (length ~= length)) or (length == math.huge)) or (math.floor(length) ~= length) then
        error(
            "invalid array length: " .. tostring(length),
            0
        )
    end
    do
        local i = #arr - 1
        while i >= length do
            arr[i + 1] = nil
            i = i - 1
        end
    end
    return length
end

function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

function __TS__CloneDescriptor(____bindingPattern0)
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    local configurable
    configurable = ____bindingPattern0.configurable
    local get
    get = ____bindingPattern0.get
    local set
    set = ____bindingPattern0.set
    local writable
    writable = ____bindingPattern0.writable
    local value
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = (get ~= nil) or (set ~= nil)
    local hasValueOrWritableAttribute = (writable ~= nil) or (value ~= nil)
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

function __TS__Decorate(decorators, target, key, desc)
    local result = target
    do
        local i = #decorators
        while i >= 0 do
            local decorator = decorators[i + 1]
            if decorator then
                local oldResult = result
                if key == nil then
                    result = decorator(_G, result)
                elseif desc == true then
                    local value = rawget(target, key)
                    local descriptor = __TS__ObjectGetOwnPropertyDescriptor(target, key) or ({configurable = true, writable = true, value = value})
                    local desc = decorator(_G, target, key, descriptor) or descriptor
                    local isSimpleValue = (((desc.configurable == true) and (desc.writable == true)) and (not desc.get)) and (not desc.set)
                    if isSimpleValue then
                        rawset(target, key, desc.value)
                    else
                        __TS__SetDescriptor(
                            target,
                            key,
                            __TS__ObjectAssign({}, descriptor, desc)
                        )
                    end
                elseif desc == false then
                    result = decorator(_G, target, key, desc)
                else
                    result = decorator(_G, target, key)
                end
                result = result or oldResult
            end
            i = i - 1
        end
    end
    return result
end

function __TS__DecorateParam(paramIndex, decorator)
    return function(____, target, key) return decorator(_G, target, key, paramIndex) end
end

function __TS__ObjectGetOwnPropertyDescriptors(object)
    local metatable = getmetatable(object)
    if not metatable then
        return {}
    end
    return rawget(metatable, "_descriptors") or ({})
end

function __TS__Delete(target, key)
    local descriptors = __TS__ObjectGetOwnPropertyDescriptors(target)
    local descriptor = descriptors[key]
    if descriptor then
        if not descriptor.configurable then
            error(
                ((("Cannot delete property " .. tostring(key)) .. " of ") .. tostring(target)) .. ".",
                0
            )
        end
        descriptors[key] = nil
        return true
    end
    if target[key] ~= nil then
        target[key] = nil
        return true
    end
    return false
end

function __TS__DelegatedYield(iterable)
    if type(iterable) == "string" then
        for index = 0, #iterable - 1 do
            coroutine.yield(
                __TS__StringAccess(iterable, index)
            )
        end
    elseif iterable.____coroutine ~= nil then
        local co = iterable.____coroutine
        while true do
            local status, value = coroutine.resume(co)
            if not status then
                error(value, 0)
            end
            if coroutine.status(co) == "dead" then
                return value
            else
                coroutine.yield(value)
            end
        end
    elseif iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        while true do
            local result = iterator:next()
            if result.done then
                return result.value
            else
                coroutine.yield(result.value)
            end
        end
    else
        for ____, value in ipairs(iterable) do
            coroutine.yield(value)
        end
    end
end

function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

function __TS__GetErrorStack(self, constructor)
    local level = 1
    while true do
        local info = debug.getinfo(level, "f")
        level = level + 1
        if not info then
            level = 1
            break
        elseif info.func == constructor then
            break
        end
    end
    return debug.traceback(nil, level)
end
function __TS__WrapErrorToString(self, getDescription)
    return function(self)
        local description = getDescription(self)
        local caller = debug.getinfo(3, "f")
        if (_VERSION == "Lua 5.1") or (caller and (caller.func ~= error)) then
            return description
        else
            return (tostring(description) .. "\n") .. self.stack
        end
    end
end
function __TS__InitErrorClass(self, Type, name)
    Type.name = name
    return setmetatable(
        Type,
        {
            __call = function(____, _self, message) return __TS__New(Type, message) end
        }
    )
end
Error = __TS__InitErrorClass(
    _G,
    (function()
        local ____ = __TS__Class()
        ____.name = ""
        function ____.prototype.____constructor(self, message)
            if message == nil then
                message = ""
            end
            self.message = message
            self.name = "Error"
            self.stack = __TS__GetErrorStack(_G, self.constructor.new)
            local metatable = getmetatable(self)
            if not metatable.__errorToStringPatched then
                metatable.__errorToStringPatched = true
                metatable.__tostring = __TS__WrapErrorToString(_G, metatable.__tostring)
            end
        end
        function ____.prototype.__tostring(self)
            return (((self.message ~= "") and (function() return (self.name .. ": ") .. self.message end)) or (function() return self.name end))()
        end
        return ____
    end)(),
    "Error"
)
for ____, errorName in ipairs({"RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"}) do
    _G[errorName] = __TS__InitErrorClass(
        _G,
        (function()
            local ____ = __TS__Class()
            ____.name = ____.name
            __TS__ClassExtends(____, Error)
            function ____.prototype.____constructor(self, ...)
                Error.prototype.____constructor(self, ...)
                self.name = errorName
            end
            return ____
        end)(),
        errorName
    )
end

__TS__Unpack = table.unpack or unpack

function __TS__FunctionBind(fn, thisArg, ...)
    local boundArgs = {...}
    return function(____, ...)
        local args = {...}
        do
            local i = 0
            while i < #boundArgs do
                table.insert(args, i + 1, boundArgs[i + 1])
                i = i + 1
            end
        end
        return fn(
            thisArg,
            __TS__Unpack(args)
        )
    end
end

____symbolMetatable = {
    __tostring = function(self)
        return ("Symbol(" .. (self.description or "")) .. ")"
    end
}
function __TS__Symbol(description)
    return setmetatable({description = description}, ____symbolMetatable)
end
Symbol = {
    iterator = __TS__Symbol("Symbol.iterator"),
    hasInstance = __TS__Symbol("Symbol.hasInstance"),
    species = __TS__Symbol("Symbol.species"),
    toStringTag = __TS__Symbol("Symbol.toStringTag")
}

function __TS__GeneratorIterator(self)
    return self
end
function __TS__GeneratorNext(self, ...)
    local co = self.____coroutine
    if coroutine.status(co) == "dead" then
        return {done = true}
    end
    local status, value = coroutine.resume(co, ...)
    if not status then
        error(value, 0)
    end
    return {
        value = value,
        done = coroutine.status(co) == "dead"
    }
end
function __TS__Generator(fn)
    return function(...)
        local args = {...}
        local argsLength = select("#", ...)
        return {
            ____coroutine = coroutine.create(
                function() return fn(
                    (unpack or table.unpack)(args, 1, argsLength)
                ) end
            ),
            [Symbol.iterator] = __TS__GeneratorIterator,
            next = __TS__GeneratorNext
        }
    end
end

function __TS__InstanceOf(obj, classTbl)
    if type(classTbl) ~= "table" then
        error("Right-hand side of 'instanceof' is not an object", 0)
    end
    if classTbl[Symbol.hasInstance] ~= nil then
        return not (not classTbl[Symbol.hasInstance](classTbl, obj))
    end
    if type(obj) == "table" then
        local luaClass = obj.constructor
        while luaClass ~= nil do
            if luaClass == classTbl then
                return true
            end
            luaClass = luaClass.____super
        end
    end
    return false
end

function __TS__InstanceOfObject(value)
    local valueType = type(value)
    return (valueType == "table") or (valueType == "function")
end

function __TS__IteratorGeneratorStep(self)
    local co = self.____coroutine
    local status, value = coroutine.resume(co)
    if not status then
        error(value, 0)
    end
    if coroutine.status(co) == "dead" then
        return
    end
    return true, value
end
function __TS__IteratorIteratorStep(self)
    local result = self:next()
    if result.done then
        return
    end
    return true, result.value
end
function __TS__IteratorStringStep(self, index)
    index = index + 1
    if index > #self then
        return
    end
    return index, string.sub(self, index, index)
end
function __TS__Iterator(iterable)
    if type(iterable) == "string" then
        return __TS__IteratorStringStep, iterable, 0
    elseif iterable.____coroutine ~= nil then
        return __TS__IteratorGeneratorStep, iterable
    elseif iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        return __TS__IteratorIteratorStep, iterator
    else
        return __TS__Unpack(
            {
                ipairs(iterable)
            }
        )
    end
end

Map = (function()
    local Map = __TS__Class()
    Map.name = "Map"
    function Map.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "Map"
        self.items = {}
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self:set(value[1], value[2])
            end
        else
            local array = entries
            for ____, kvp in ipairs(array) do
                self:set(kvp[1], kvp[2])
            end
        end
    end
    function Map.prototype.clear(self)
        self.items = {}
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
    end
    function Map.prototype.delete(self, key)
        local contains = self:has(key)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[key]
            local previous = self.previousKey[key]
            if next and previous then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[key] = nil
            self.previousKey[key] = nil
        end
        self.items[key] = nil
        return contains
    end
    function Map.prototype.forEach(self, callback)
        for ____, key in __TS__Iterator(
            self:keys()
        ) do
            callback(_G, self.items[key], key, self)
        end
    end
    function Map.prototype.get(self, key)
        return self.items[key]
    end
    function Map.prototype.has(self, key)
        return (self.nextKey[key] ~= nil) or (self.lastKey == key)
    end
    function Map.prototype.set(self, key, value)
        local isNewValue = not self:has(key)
        if isNewValue then
            self.size = self.size + 1
        end
        self.items[key] = value
        if self.firstKey == nil then
            self.firstKey = key
            self.lastKey = key
        elseif isNewValue then
            self.nextKey[self.lastKey] = key
            self.previousKey[key] = self.lastKey
            self.lastKey = key
        end
        return self
    end
    Map.prototype[Symbol.iterator] = function(self)
        return self:entries()
    end
    function Map.prototype.entries(self)
        local ____ = self
        local items = ____.items
        local nextKey = ____.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, items[key]}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.values(self)
        local ____ = self
        local items = ____.items
        local nextKey = ____.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = items[key]}
                key = nextKey[key]
                return result
            end
        }
    end
    Map[Symbol.species] = Map
    return Map
end)()

__TS__MathAtan2 = math.atan2 or math.atan

function __TS__Number(value)
    local valueType = type(value)
    if valueType == "number" then
        return value
    elseif valueType == "string" then
        local numberValue = tonumber(value)
        if numberValue then
            return numberValue
        end
        if value == "Infinity" then
            return math.huge
        end
        if value == "-Infinity" then
            return -math.huge
        end
        local stringWithoutSpaces = string.gsub(value, "%s", "")
        if stringWithoutSpaces == "" then
            return 0
        end
        return 0 / 0
    elseif valueType == "boolean" then
        return (value and 1) or 0
    else
        return 0 / 0
    end
end

function __TS__NumberIsFinite(value)
    return (((type(value) == "number") and (value == value)) and (value ~= math.huge)) and (value ~= -math.huge)
end

function __TS__NumberIsNaN(value)
    return value ~= value
end

____radixChars = "0123456789abcdefghijklmnopqrstuvwxyz"
function __TS__NumberToString(self, radix)
    if ((((radix == nil) or (radix == 10)) or (self == math.huge)) or (self == -math.huge)) or (self ~= self) then
        return tostring(self)
    end
    radix = math.floor(radix)
    if (radix < 2) or (radix > 36) then
        error("toString() radix argument must be between 2 and 36", 0)
    end
    local integer, fraction = math.modf(
        math.abs(self)
    )
    local result = ""
    if radix == 8 then
        result = string.format("%o", integer)
    elseif radix == 16 then
        result = string.format("%x", integer)
    else
        repeat
            do
                result = tostring(
                    __TS__StringAccess(____radixChars, integer % radix)
                ) .. tostring(result)
                integer = math.floor(integer / radix)
            end
        until not (integer ~= 0)
    end
    if fraction ~= 0 then
        result = tostring(result) .. "."
        local delta = 1e-16
        repeat
            do
                fraction = fraction * radix
                delta = delta * radix
                local digit = math.floor(fraction)
                result = tostring(result) .. tostring(
                    __TS__StringAccess(____radixChars, digit)
                )
                fraction = fraction - digit
            end
        until not (fraction >= delta)
    end
    if self < 0 then
        result = "-" .. tostring(result)
    end
    return result
end

function __TS__ObjectAssign(to, ...)
    local sources = {...}
    if to == nil then
        return to
    end
    for ____, source in ipairs(sources) do
        for key in pairs(source) do
            to[key] = source[key]
        end
    end
    return to
end

function ____descriptorIndex(self, key)
    local value = rawget(self, key)
    if value ~= nil then
        return value
    end
    local metatable = getmetatable(self)
    while metatable do
        local rawResult = rawget(metatable, key)
        if rawResult ~= nil then
            return rawResult
        end
        local descriptors = rawget(metatable, "_descriptors")
        if descriptors then
            local descriptor = descriptors[key]
            if descriptor then
                if descriptor.get then
                    return descriptor.get(self)
                end
                return descriptor.value
            end
        end
        metatable = getmetatable(metatable)
    end
end
function ____descriptorNewindex(self, key, value)
    local metatable = getmetatable(self)
    while metatable do
        local descriptors = rawget(metatable, "_descriptors")
        if descriptors then
            local descriptor = descriptors[key]
            if descriptor then
                if descriptor.set then
                    descriptor.set(self, value)
                else
                    if descriptor.writable == false then
                        error(
                            ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                            0
                        )
                    end
                    descriptor.value = value
                end
                return
            end
        end
        metatable = getmetatable(metatable)
    end
    rawset(self, key, value)
end
function __TS__SetDescriptor(target, key, desc, isPrototype)
    if isPrototype == nil then
        isPrototype = false
    end
    local metatable = ((isPrototype and (function() return target end)) or (function() return getmetatable(target) end))()
    if not metatable then
        metatable = {}
        setmetatable(target, metatable)
    end
    local value = rawget(target, key)
    if value ~= nil then
        rawset(target, key, nil)
    end
    if not rawget(metatable, "_descriptors") then
        metatable._descriptors = {}
    end
    local descriptor = __TS__CloneDescriptor(desc)
    metatable._descriptors[key] = descriptor
    metatable.__index = ____descriptorIndex
    metatable.__newindex = ____descriptorNewindex
end

function __TS__ObjectDefineProperty(target, key, desc)
    local luaKey = (((type(key) == "number") and (function() return key + 1 end)) or (function() return key end))()
    local value = rawget(target, luaKey)
    local hasGetterOrSetter = (desc.get ~= nil) or (desc.set ~= nil)
    local descriptor
    if hasGetterOrSetter then
        if value ~= nil then
            error(
                "Cannot redefine property: " .. tostring(key),
                0
            )
        end
        descriptor = desc
    else
        local valueExists = value ~= nil
        descriptor = {
            set = desc.set,
            get = desc.get,
            configurable = (((desc.configurable ~= nil) and (function() return desc.configurable end)) or (function() return valueExists end))(),
            enumerable = (((desc.enumerable ~= nil) and (function() return desc.enumerable end)) or (function() return valueExists end))(),
            writable = (((desc.writable ~= nil) and (function() return desc.writable end)) or (function() return valueExists end))(),
            value = (((desc.value ~= nil) and (function() return desc.value end)) or (function() return value end))()
        }
    end
    __TS__SetDescriptor(target, luaKey, descriptor)
    return target
end

function __TS__ObjectEntries(obj)
    local result = {}
    for key in pairs(obj) do
        result[#result + 1] = {key, obj[key]}
    end
    return result
end

function __TS__ObjectFromEntries(entries)
    local obj = {}
    local iterable = entries
    if iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        while true do
            local result = iterator:next()
            if result.done then
                break
            end
            local value = result.value
            obj[value[1]] = value[2]
        end
    else
        for ____, entry in ipairs(entries) do
            obj[entry[1]] = entry[2]
        end
    end
    return obj
end

function __TS__ObjectGetOwnPropertyDescriptor(object, key)
    local metatable = getmetatable(object)
    if not metatable then
        return
    end
    if not rawget(metatable, "_descriptors") then
        return
    end
    return rawget(metatable, "_descriptors")[key]
end

function __TS__ObjectKeys(obj)
    local result = {}
    for key in pairs(obj) do
        result[#result + 1] = key
    end
    return result
end

function __TS__ObjectRest(target, usedProperties)
    local result = {}
    for property in pairs(target) do
        if not usedProperties[property] then
            result[property] = target[property]
        end
    end
    return result
end

function __TS__ObjectValues(obj)
    local result = {}
    for key in pairs(obj) do
        result[#result + 1] = obj[key]
    end
    return result
end

function __TS__ParseFloat(numberString)
    local infinityMatch = string.match(numberString, "^%s*(-?Infinity)")
    if infinityMatch then
        return (((__TS__StringAccess(infinityMatch, 0) == "-") and (function() return -math.huge end)) or (function() return math.huge end))()
    end
    local number = tonumber(
        string.match(numberString, "^%s*(-?%d+%.?%d*)")
    )
    return number or (0 / 0)
end

__TS__parseInt_base_pattern = "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTvVwWxXyYzZ"
function __TS__ParseInt(numberString, base)
    if base == nil then
        base = 10
        local hexMatch = string.match(numberString, "^%s*-?0[xX]")
        if hexMatch then
            base = 16
            numberString = ((string.match(hexMatch, "-") and (function() return "-" .. tostring(
                __TS__StringSubstr(numberString, #hexMatch)
            ) end)) or (function() return __TS__StringSubstr(numberString, #hexMatch) end))()
        end
    end
    if (base < 2) or (base > 36) then
        return 0 / 0
    end
    local allowedDigits = (((base <= 10) and (function() return __TS__StringSubstring(__TS__parseInt_base_pattern, 0, base) end)) or (function() return __TS__StringSubstr(__TS__parseInt_base_pattern, 0, 10 + (2 * (base - 10))) end))()
    local pattern = ("^%s*(-?[" .. allowedDigits) .. "]*)"
    local number = tonumber(
        string.match(numberString, pattern),
        base
    )
    if number == nil then
        return 0 / 0
    end
    if number >= 0 then
        return math.floor(number)
    else
        return math.ceil(number)
    end
end

Set = (function()
    local Set = __TS__Class()
    Set.name = "Set"
    function Set.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "Set"
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self:add(result.value)
            end
        else
            local array = values
            for ____, value in ipairs(array) do
                self:add(value)
            end
        end
    end
    function Set.prototype.add(self, value)
        local isNewValue = not self:has(value)
        if isNewValue then
            self.size = self.size + 1
        end
        if self.firstKey == nil then
            self.firstKey = value
            self.lastKey = value
        elseif isNewValue then
            self.nextKey[self.lastKey] = value
            self.previousKey[value] = self.lastKey
            self.lastKey = value
        end
        return self
    end
    function Set.prototype.clear(self)
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
    end
    function Set.prototype.delete(self, value)
        local contains = self:has(value)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[value]
            local previous = self.previousKey[value]
            if next and previous then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[value] = nil
            self.previousKey[value] = nil
        end
        return contains
    end
    function Set.prototype.forEach(self, callback)
        for ____, key in __TS__Iterator(
            self:keys()
        ) do
            callback(_G, key, key, self)
        end
    end
    function Set.prototype.has(self, value)
        return (self.nextKey[value] ~= nil) or (self.lastKey == value)
    end
    Set.prototype[Symbol.iterator] = function(self)
        return self:values()
    end
    function Set.prototype.entries(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, key}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.values(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    Set[Symbol.species] = Set
    return Set
end)()

WeakMap = (function()
    local WeakMap = __TS__Class()
    WeakMap.name = "WeakMap"
    function WeakMap.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "WeakMap"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self.items[value[1]] = value[2]
            end
        else
            for ____, kvp in ipairs(entries) do
                self.items[kvp[1]] = kvp[2]
            end
        end
    end
    function WeakMap.prototype.delete(self, key)
        local contains = self:has(key)
        self.items[key] = nil
        return contains
    end
    function WeakMap.prototype.get(self, key)
        return self.items[key]
    end
    function WeakMap.prototype.has(self, key)
        return self.items[key] ~= nil
    end
    function WeakMap.prototype.set(self, key, value)
        self.items[key] = value
        return self
    end
    WeakMap[Symbol.species] = WeakMap
    return WeakMap
end)()

WeakSet = (function()
    local WeakSet = __TS__Class()
    WeakSet.name = "WeakSet"
    function WeakSet.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "WeakSet"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self.items[result.value] = true
            end
        else
            for ____, value in ipairs(values) do
                self.items[value] = true
            end
        end
    end
    function WeakSet.prototype.add(self, value)
        self.items[value] = true
        return self
    end
    function WeakSet.prototype.delete(self, value)
        local contains = self:has(value)
        self.items[value] = nil
        return contains
    end
    function WeakSet.prototype.has(self, value)
        return self.items[value] == true
    end
    WeakSet[Symbol.species] = WeakSet
    return WeakSet
end)()

function __TS__SourceMapTraceBack(fileName, sourceMap)
    _G.__TS__sourcemap = _G.__TS__sourcemap or ({})
    _G.__TS__sourcemap[fileName] = sourceMap
    if _G.__TS__originalTraceback == nil then
        _G.__TS__originalTraceback = debug.traceback
        debug.traceback = function(thread, message, level)
            local trace
            if ((thread == nil) and (message == nil)) and (level == nil) then
                trace = _G.__TS__originalTraceback()
            else
                trace = _G.__TS__originalTraceback(thread, message, level)
            end
            if type(trace) ~= "string" then
                return trace
            end
            local result = string.gsub(
                trace,
                "(%S+).lua:(%d+)",
                function(file, line)
                    local fileSourceMap = _G.__TS__sourcemap[tostring(file) .. ".lua"]
                    if fileSourceMap and fileSourceMap[line] then
                        return (file .. ".ts:") .. tostring(fileSourceMap[line])
                    end
                    return (file .. ".lua:") .. line
                end
            )
            return result
        end
    end
end

function __TS__Spread(iterable)
    local arr = {}
    if type(iterable) == "string" then
        do
            local i = 0
            while i < #iterable do
                arr[#arr + 1] = __TS__StringAccess(iterable, i)
                i = i + 1
            end
        end
    else
        for ____, item in __TS__Iterator(iterable) do
            arr[#arr + 1] = item
        end
    end
    return __TS__Unpack(arr)
end

function __TS__StringAccess(self, index)
    if (index >= 0) and (index < #self) then
        return string.sub(self, index + 1, index + 1)
    end
end

function __TS__StringCharAt(self, pos)
    if pos ~= pos then
        pos = 0
    end
    if pos < 0 then
        return ""
    end
    return string.sub(self, pos + 1, pos + 1)
end

function __TS__StringCharCodeAt(self, index)
    if index ~= index then
        index = 0
    end
    if index < 0 then
        return 0 / 0
    end
    return string.byte(self, index + 1) or (0 / 0)
end

function __TS__StringConcat(str1, ...)
    local args = {...}
    local out = str1
    for ____, arg in ipairs(args) do
        out = tostring(out) .. tostring(arg)
    end
    return out
end

function __TS__StringEndsWith(self, searchString, endPosition)
    if (endPosition == nil) or (endPosition > #self) then
        endPosition = #self
    end
    return string.sub(self, (endPosition - #searchString) + 1, endPosition) == searchString
end

function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

function __TS__StringPadEnd(self, maxLength, fillString)
    if fillString == nil then
        fillString = " "
    end
    if maxLength ~= maxLength then
        maxLength = 0
    end
    if (maxLength == -math.huge) or (maxLength == math.huge) then
        error("Invalid string length", 0)
    end
    if (#self >= maxLength) or (#fillString == 0) then
        return self
    end
    maxLength = maxLength - #self
    if maxLength > #fillString then
        fillString = tostring(fillString) .. tostring(
            string.rep(
                fillString,
                math.floor(maxLength / #fillString)
            )
        )
    end
    return tostring(self) .. tostring(
        string.sub(
            fillString,
            1,
            math.floor(maxLength)
        )
    )
end

function __TS__StringPadStart(self, maxLength, fillString)
    if fillString == nil then
        fillString = " "
    end
    if maxLength ~= maxLength then
        maxLength = 0
    end
    if (maxLength == -math.huge) or (maxLength == math.huge) then
        error("Invalid string length", 0)
    end
    if (#self >= maxLength) or (#fillString == 0) then
        return self
    end
    maxLength = maxLength - #self
    if maxLength > #fillString then
        fillString = tostring(fillString) .. tostring(
            string.rep(
                fillString,
                math.floor(maxLength / #fillString)
            )
        )
    end
    return tostring(
        string.sub(
            fillString,
            1,
            math.floor(maxLength)
        )
    ) .. tostring(self)
end

function __TS__StringReplace(source, searchValue, replaceValue)
    searchValue = string.gsub(searchValue, "[%%%(%)%.%+%-%*%?%[%^%$]", "%%%1")
    if type(replaceValue) == "string" then
        replaceValue = string.gsub(replaceValue, "%%", "%%%%")
        local result = string.gsub(source, searchValue, replaceValue, 1)
        return result
    else
        local result = string.gsub(
            source,
            searchValue,
            function(match) return replaceValue(_G, match) end,
            1
        )
        return result
    end
end

function __TS__StringSlice(self, start, ____end)
    if (start == nil) or (start ~= start) then
        start = 0
    end
    if ____end ~= ____end then
        ____end = 0
    end
    if start >= 0 then
        start = start + 1
    end
    if (____end ~= nil) and (____end < 0) then
        ____end = ____end - 1
    end
    return string.sub(self, start, ____end)
end

function __TS__StringSubstring(self, start, ____end)
    if ____end ~= ____end then
        ____end = 0
    end
    if (____end ~= nil) and (start > ____end) then
        start, ____end = __TS__Unpack({____end, start})
    end
    if start >= 0 then
        start = start + 1
    else
        start = 1
    end
    if (____end ~= nil) and (____end < 0) then
        ____end = 0
    end
    return string.sub(self, start, ____end)
end

function __TS__StringSplit(source, separator, limit)
    if limit == nil then
        limit = 4294967295
    end
    if limit == 0 then
        return {}
    end
    local out = {}
    local index = 0
    local count = 0
    if (separator == nil) or (separator == "") then
        while (index < (#source - 1)) and (count < limit) do
            out[count + 1] = __TS__StringAccess(source, index)
            count = count + 1
            index = index + 1
        end
    else
        local separatorLength = #separator
        local nextIndex = (string.find(source, separator, nil, true) or 0) - 1
        while (nextIndex >= 0) and (count < limit) do
            out[count + 1] = __TS__StringSubstring(source, index, nextIndex)
            count = count + 1
            index = nextIndex + separatorLength
            nextIndex = (string.find(
                source,
                separator,
                math.max(index + 1, 1),
                true
            ) or 0) - 1
        end
    end
    if count < limit then
        out[count + 1] = __TS__StringSubstring(source, index)
    end
    return out
end

function __TS__StringStartsWith(self, searchString, position)
    if (position == nil) or (position < 0) then
        position = 0
    end
    return string.sub(self, position + 1, #searchString + position) == searchString
end

function __TS__StringSubstr(self, from, length)
    if from ~= from then
        from = 0
    end
    if length ~= nil then
        if (length ~= length) or (length <= 0) then
            return ""
        end
        length = length + from
    end
    if from >= 0 then
        from = from + 1
    end
    return string.sub(self, from, length)
end

function __TS__StringTrim(self)
    local result = string.gsub(self, "^[%s ﻿]*(.-)[%s ﻿]*$", "%1")
    return result
end

function __TS__StringTrimEnd(self)
    local result = string.gsub(self, "[%s ﻿]*$", "")
    return result
end

function __TS__StringTrimStart(self)
    local result = string.gsub(self, "^[%s ﻿]*", "")
    return result
end

____symbolRegistry = {}
function __TS__SymbolRegistryFor(key)
    if not ____symbolRegistry[key] then
        ____symbolRegistry[key] = __TS__Symbol(key)
    end
    return ____symbolRegistry[key]
end
function __TS__SymbolRegistryKeyFor(sym)
    for key in pairs(____symbolRegistry) do
        if ____symbolRegistry[key] == sym then
            return key
        end
    end
end

function __TS__TypeOf(value)
    local luaType = type(value)
    if luaType == "table" then
        return "object"
    elseif luaType == "nil" then
        return "undefined"
    else
        return luaType
    end
end

end,
["types.enums.custom"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.PlayerTypeCustom = PlayerTypeCustom or ({})
____exports.PlayerTypeCustom.PLAYER_RANDOM_BABY = Isaac.GetPlayerTypeByName("Random Baby")
____exports.PlayerTypeCustom[____exports.PlayerTypeCustom.PLAYER_RANDOM_BABY] = "PLAYER_RANDOM_BABY"
____exports.EffectVariantCustom = EffectVariantCustom or ({})
____exports.EffectVariantCustom.FETUS_BOSS_TARGET = Isaac.GetEntityVariantByName("FetusBossTarget")
____exports.EffectVariantCustom[____exports.EffectVariantCustom.FETUS_BOSS_TARGET] = "FETUS_BOSS_TARGET"
____exports.EffectVariantCustom.FETUS_BOSS_ROCKET = Isaac.GetEntityVariantByName("FetusBossRocket")
____exports.EffectVariantCustom[____exports.EffectVariantCustom.FETUS_BOSS_ROCKET] = "FETUS_BOSS_ROCKET"
____exports.CollectibleTypeCustom = CollectibleTypeCustom or ({})
____exports.CollectibleTypeCustom.COLLECTIBLE_CLOCKWORK_ASSEMBLY = Isaac.GetItemIdByName("Clockwork Assembly")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_CLOCKWORK_ASSEMBLY] = "COLLECTIBLE_CLOCKWORK_ASSEMBLY"
____exports.CollectibleTypeCustom.COLLECTIBLE_FLOCK_OF_SUCCUBI = Isaac.GetItemIdByName("Flock of Succubi")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_FLOCK_OF_SUCCUBI] = "COLLECTIBLE_FLOCK_OF_SUCCUBI"
____exports.CollectibleTypeCustom.COLLECTIBLE_CHARGING_STATION = Isaac.GetItemIdByName("Charging Station")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_CHARGING_STATION] = "COLLECTIBLE_CHARGING_STATION"
____exports.CollectibleTypeCustom.COLLECTIBLE_SHOP_TELEPORT = Isaac.GetItemIdByName("Shop Teleport")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_SHOP_TELEPORT] = "COLLECTIBLE_SHOP_TELEPORT"
____exports.CollectibleTypeCustom.COLLECTIBLE_TREASURE_ROOM_TELEPORT = Isaac.GetItemIdByName("Treasure Room Teleport")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_TREASURE_ROOM_TELEPORT] = "COLLECTIBLE_TREASURE_ROOM_TELEPORT"
____exports.CollectibleTypeCustom.COLLECTIBLE_MINIBOSS_ROOM_TELEPORT = Isaac.GetItemIdByName("Mini-Boss Room Teleport")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_MINIBOSS_ROOM_TELEPORT] = "COLLECTIBLE_MINIBOSS_ROOM_TELEPORT"
____exports.CollectibleTypeCustom.COLLECTIBLE_ARCADE_TELEPORT = Isaac.GetItemIdByName("Arcade Teleport")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_ARCADE_TELEPORT] = "COLLECTIBLE_ARCADE_TELEPORT"
____exports.CollectibleTypeCustom.COLLECTIBLE_CURSE_ROOM_TELEPORT = Isaac.GetItemIdByName("Curse Room Teleport")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_CURSE_ROOM_TELEPORT] = "COLLECTIBLE_CURSE_ROOM_TELEPORT"
____exports.CollectibleTypeCustom.COLLECTIBLE_CHALLENGE_ROOM_TELEPORT = Isaac.GetItemIdByName("Challenge Room Teleport")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_CHALLENGE_ROOM_TELEPORT] = "COLLECTIBLE_CHALLENGE_ROOM_TELEPORT"
____exports.CollectibleTypeCustom.COLLECTIBLE_LIBRARY_TELEPORT = Isaac.GetItemIdByName("Library Teleport")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_LIBRARY_TELEPORT] = "COLLECTIBLE_LIBRARY_TELEPORT"
____exports.CollectibleTypeCustom.COLLECTIBLE_SACRIFICE_ROOM_TELEPORT = Isaac.GetItemIdByName("Sacrifice Room Teleport")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_SACRIFICE_ROOM_TELEPORT] = "COLLECTIBLE_SACRIFICE_ROOM_TELEPORT"
____exports.CollectibleTypeCustom.COLLECTIBLE_BEDROOM_CLEAN_TELEPORT = Isaac.GetItemIdByName("Bedroom (Clean) Teleport")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_BEDROOM_CLEAN_TELEPORT] = "COLLECTIBLE_BEDROOM_CLEAN_TELEPORT"
____exports.CollectibleTypeCustom.COLLECTIBLE_BEDROOM_DIRTY_TELEPORT = Isaac.GetItemIdByName("Bedroom (Dirty) Teleport")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_BEDROOM_DIRTY_TELEPORT] = "COLLECTIBLE_BEDROOM_DIRTY_TELEPORT"
____exports.CollectibleTypeCustom.COLLECTIBLE_TREASURE_CHEST_ROOM_TELEPORT = Isaac.GetItemIdByName("Treasure Chest Room Teleport")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_TREASURE_CHEST_ROOM_TELEPORT] = "COLLECTIBLE_TREASURE_CHEST_ROOM_TELEPORT"
____exports.CollectibleTypeCustom.COLLECTIBLE_DICE_ROOM_TELEPORT = Isaac.GetItemIdByName("Dice Room Teleport")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_DICE_ROOM_TELEPORT] = "COLLECTIBLE_DICE_ROOM_TELEPORT"
____exports.CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM = Isaac.GetItemIdByName("Schoolbag")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM] = "COLLECTIBLE_SCHOOLBAG_CUSTOM"
____exports.CollectibleTypeCustom.COLLECTIBLE_SOUL_JAR = Isaac.GetItemIdByName("Soul Jar")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_SOUL_JAR] = "COLLECTIBLE_SOUL_JAR"
____exports.CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT = Isaac.GetItemIdByName("Checkpoint")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT] = "COLLECTIBLE_CHECKPOINT"
return ____exports
end,
["types.BabyDescription"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
end,
["babies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____enums_2Ecustom = require("types.enums.custom")
local CollectibleTypeCustom = ____enums_2Ecustom.CollectibleTypeCustom
local babies = {{name = "Null", description = "", sprite = ""}, {name = "Love Baby", description = "Spawns a random heart per room cleared", sprite = "001_baby_love.png"}, {name = "Bloat Baby", description = "Syringe tears", sprite = "002_baby_bloat.png", num = 3, mustHaveTears = true}, {name = "Water Baby", description = "Starts with Isaac's Tears (improved)", sprite = "003_baby_water.png", item = CollectibleType.COLLECTIBLE_ISAACS_TEARS}, {name = "Psy Baby", description = "Starts with Spoon Bender", sprite = "004_baby_psy.png", item = CollectibleType.COLLECTIBLE_SPOON_BENDER}, {name = "Cursed Baby", description = "Starts with Cursed Eye", sprite = "005_baby_cursed.png", item = CollectibleType.COLLECTIBLE_CURSED_EYE, mustHaveTears = true}, {name = "Troll Baby", description = "Spawns a Troll Bomb every 3 seconds", sprite = "006_baby_troll.png"}, {name = "Ybab Baby", description = "Starts with Analog Stick", sprite = "007_baby_ybab.png", item = CollectibleType.COLLECTIBLE_ANALOG_STICK, mustHaveTears = true}, {name = "Cockeyed Baby", description = "Shoots extra tears with random velocity", sprite = "008_baby_cockeyed.png", mustHaveTears = true}, {name = "Host Baby", description = "Spawns 10 Blue Spiders on hit", sprite = "009_baby_host.png"}, {name = "Lost Baby", description = "Starts with Holy Mantle + Lost-style health", sprite = "010_baby_lost.png", item = CollectibleType.COLLECTIBLE_HOLY_MANTLE}, {name = "Cute Baby", description = "-1 damage per pickup taken", sprite = "011_baby_cute.png", item = CollectibleType.COLLECTIBLE_MAGGYS_BOW}, {name = "Crow Baby", description = "Starts with Dead Bird (improved)", sprite = "012_baby_crow.png", item = CollectibleType.COLLECTIBLE_DEAD_BIRD}, {name = "Shadow Baby", description = "Devil Rooms / Angel Rooms go to the Black Market instead", sprite = "013_baby_shadow.png"}, {name = "Glass Baby", description = "Orbiting laser ring", sprite = "014_baby_glass.png"}, {name = "Gold Baby", description = "Gold gear + gold poops + gold rooms", sprite = "015_baby_gold.png"}, {name = "Cy-Baby", description = "Starts with Technology 2", sprite = "016_baby_cy.png", item = CollectibleType.COLLECTIBLE_TECHNOLOGY_2}, {name = "Bean Baby", description = "Constant Butter Bean effect", sprite = "017_baby_bean.png"}, {name = "Mag Baby", description = "Confusion tears", sprite = "018_baby_mag.png", mustHaveTears = true}, {name = "Wrath Baby", description = "Anarchist Cookbook effect every 7 seconds", sprite = "019_baby_wrath.png", num = 210}, {name = "Wrapped Baby", description = "5x Kamikaze! effect on hit", sprite = "020_baby_wrapped.png"}, {name = "Begotten Baby", description = "Starts with Eve's Mascara", sprite = "021_baby_begotten.png", item = CollectibleType.COLLECTIBLE_EVES_MASCARA}, {name = "Dead Baby", description = "Starts with ???'s Only Friend + blindfolded", sprite = "022_baby_dead.png", item = CollectibleType.COLLECTIBLE_BLUEBABYS_ONLY_FRIEND, blindfolded = true, softlockPreventionDestroyPoops = true}, {name = "Fighting Baby", description = "Starts with Bloody Lust", sprite = "023_baby_fighting.png", item = CollectibleType.COLLECTIBLE_BLOODY_LUST}, {name = "-0- Baby", description = "Invulnerability", sprite = "024_baby_0.png"}, {name = "Glitch Baby", description = "Starts with 40x GB Bug", sprite = "025_baby_glitch.png", item = CollectibleType.COLLECTIBLE_GB_BUG, itemNum = 40}, {name = "Magnet Baby", description = "Starts with Magneto", sprite = "026_baby_magnet.png", item = CollectibleType.COLLECTIBLE_MAGNETO}, {name = "Black Baby", description = "Curse Room doors in uncleared rooms", sprite = "027_baby_black.png"}, {name = "Red Baby", description = "Starts with 5x Distant Admiration", sprite = "028_baby_red.png", item = CollectibleType.COLLECTIBLE_DISTANT_ADMIRATION, itemNum = 5}, {name = "White Baby", description = "Starts with Hallowed Ground", sprite = "029_baby_white.png", item = CollectibleType.COLLECTIBLE_HALLOWED_GROUND}, {name = "Blue Baby", description = "Sprinkler tears", sprite = "030_baby_blue.png", mustHaveTears = true}, {name = "Rage Baby", description = "Starts with Pyro + Sad Bombs + blindfolded", sprite = "031_baby_rage.png", item = CollectibleType.COLLECTIBLE_SAD_BOMBS, blindfolded = true}, {name = "Cry Baby", description = "Enemies are fully healed on hit", sprite = "032_baby_cry.png"}, {name = "Yellow Baby", description = "Lemon Party effect on hit", sprite = "033_baby_yellow.png"}, {name = "Long Baby", description = "Flat tears", sprite = "034_baby_long.png", mustHaveTears = true}, {name = "Green Baby", description = "Booger tears", sprite = "035_baby_green.png", mustHaveTears = true}, {name = "Lil' Baby", description = "Everything is tiny", sprite = "036_baby_lil.png"}, {name = "Big Baby", description = "Everything is giant", sprite = "037_baby_big.png"}, {name = "Brown Baby", description = "Spawns a poop per enemy killed", sprite = "038_baby_brown.png"}, {name = "Noose Baby", description = "Don't shoot when the timer reaches 0", sprite = "039_baby_noose.png", time = 6 * 30}, {name = "Hive Baby", description = "Starts with Hive Mind + max Blue Flies + max Blue Spiders", sprite = "040_baby_hive.png", item = CollectibleType.COLLECTIBLE_HIVE_MIND}, {name = "Buddy Baby", description = "Removes a heart container on hit", sprite = "041_baby_buddy.png"}, {name = "Colorful Baby", description = "Starts with 3 Dollar Bill", sprite = "042_baby_colorful.png", item = CollectibleType.COLLECTIBLE_3_DOLLAR_BILL, mustHaveTears = true}, {name = "Whore Baby", description = "All enemies explode", sprite = "043_baby_whore.png"}, {name = "Cracked Baby", description = "Starts with Cracked Dice", sprite = "044_baby_cracked.png", trinket = TrinketType.TRINKET_CRACKED_DICE}, {name = "Dripping Baby", description = "Starts with Isaac's Heart", sprite = "045_baby_dripping.png", item = CollectibleType.COLLECTIBLE_ISAACS_HEART}, {name = "Blinding Baby", description = "Spawns a Sun Card on hit", sprite = "046_baby_blinding.png"}, {name = "Sucky Baby", description = "Succubus aura", sprite = "047_baby_sucky.png", item = CollectibleType.COLLECTIBLE_SUCCUBUS}, {name = "Dark Baby", description = "Temporary blindness", sprite = "048_baby_dark.png", num = 110}, {name = "Picky Baby", description = "Starts with More Options", sprite = "049_baby_picky.png", item = CollectibleType.COLLECTIBLE_MORE_OPTIONS}, {name = "Revenge Baby", description = "Spawns a random heart on hit", sprite = "050_baby_revenge.png"}, {name = "Belial Baby", description = "Starts with Azazel-style Brimstone + flight", sprite = "051_baby_belial.png", item = CollectibleType.COLLECTIBLE_BRIMSTONE, flight = true, mustHaveTears = true}, {name = "Sale Baby", description = "Starts with Steam Sale", sprite = "052_baby_sale.png", item = CollectibleType.COLLECTIBLE_STEAM_SALE}, {name = "Goat Head Baby", description = "Starts with Goat Head", sprite = "053_baby_goatbaby.png", item = CollectibleType.COLLECTIBLE_GOAT_HEAD}, {name = "Super Greed Baby", description = "Midas tears", sprite = "054_baby_super greedbaby.png", mustHaveTears = true}, {name = "Mort Baby", description = "Guppy tears", sprite = "055_baby_mort.png", mustHaveTears = true}, {name = "Apollyon Baby", description = "Black rune effect on hit", sprite = "056_baby_apollyon.png"}, {name = "Boner Baby", description = "Starts with Brittle Bones", sprite = "057_baby_boner.png", item = CollectibleType.COLLECTIBLE_BRITTLE_BONES}, {name = "Bound Baby", description = "Monster Manual effect every 7 seconds", sprite = "058_baby_bound.png"}, {name = "Big Eyes Baby", description = "Tears cause self-knockback", sprite = "059_baby_bigeyes.png", mustHaveTears = true}, {name = "Sleep Baby", description = "Starts with Broken Modem", sprite = "060_baby_sleep.png", item = CollectibleType.COLLECTIBLE_BROKEN_MODEM}, {name = "Zombie Baby", description = "Brings back enemies from the dead", sprite = "061_baby_zombie.png"}, {name = "Goat Baby", description = "Guaranteed Devil Room + Angel Room after 6 hits", sprite = "062_baby_goat.png", numHits = 6}, {name = "Butthole Baby", description = "Spawns a random poop every 5 seconds", sprite = "063_baby_butthole.png"}, {name = "Eye Patch Baby", description = "Starts with Callus + makes spikes", sprite = "064_baby_eyepatch.png", trinket = TrinketType.TRINKET_CALLUS}, {name = "Blood Eyes Baby", description = "Starts with Haemolacria", sprite = "065_baby_bloodeyes.png", item = CollectibleType.COLLECTIBLE_HAEMOLACRIA}, {name = "Mustache Baby", description = "Boomerang tears", sprite = "066_baby_mustache.png", mustHaveTears = true, softlockPreventionDestroyPoops = true}, {name = "Spittle Baby", description = "Starts with Dead Onion", sprite = "067_baby_spittle.png", item = CollectibleType.COLLECTIBLE_DEAD_ONION}, {name = "Brain Baby", description = "Starts with The Mind", sprite = "068_baby_brain.png", item = CollectibleType.COLLECTIBLE_MIND}, {name = "3 Eyes Baby", description = "Starts with The Inner Eye", sprite = "069_baby_threeeyes.png", item = CollectibleType.COLLECTIBLE_INNER_EYE}, {name = "Viridian Baby", description = "Starts with How to Jump", sprite = "070_baby_viridian.png", item = CollectibleType.COLLECTIBLE_HOW_TO_JUMP}, {name = "Blockhead Baby", description = "Starts with Dr. Fetus + Soy Milk + explosion immunity", sprite = "071_baby_blockhead.png", item = CollectibleType.COLLECTIBLE_DR_FETUS, item2 = CollectibleType.COLLECTIBLE_SOY_MILK, explosionImmunity = true}, {name = "Worm Baby", description = "Starts with 5x Little Chubby", sprite = "072_baby_worm.png", item = CollectibleType.COLLECTIBLE_LITTLE_CHUBBY, itemNum = 5}, {name = "Lowface Baby", description = "0.5x range", sprite = "073_baby_lowface.png"}, {name = "Alien Hominid Baby", description = "Starts with The Parasite", sprite = "074_baby_alienhominid.png", item = CollectibleType.COLLECTIBLE_PARASITE}, {name = "Bomb Baby", description = "50% chance for bombs to have the D6 effect", sprite = "075_baby_bomb.png", requireBombs = true}, {name = "Video Baby", description = "Starts with Tech X", sprite = "076_baby_video.png", item = CollectibleType.COLLECTIBLE_TECH_X}, {name = "Parasite Baby", description = "Balloon tears", sprite = "077_baby_parasite.png", mustHaveTears = true}, {name = "Derp Baby", description = "Starts with Cube of Meat + BFFS! + 0.5x damage", sprite = "078_baby_derp.png", item = CollectibleType.COLLECTIBLE_CUBE_OF_MEAT, item2 = CollectibleType.COLLECTIBLE_BFFS}, {name = "Lobotomy Baby", description = "Starts with Delirious", sprite = "079_baby_lobotomy.png", item = CollectibleType.COLLECTIBLE_DELIRIOUS}, {name = "Choke Baby", description = "Starts with Kidney Stone", sprite = "080_baby_choke.png", item = CollectibleType.COLLECTIBLE_KIDNEY_STONE, mustHaveTears = true}, {name = "Scream Baby", description = "Shoop tears", sprite = "081_baby_scream.png", mustHaveTears = true}, {name = "Gurdy Baby", description = "Starts with 20x Lil Gurdy", sprite = "082_baby_gurdy.png", item = CollectibleType.COLLECTIBLE_LIL_GURDY, itemNum = 20}, {name = "Ghoul Baby", description = "Book of Secrets effect on hit", sprite = "083_baby_ghoul.png"}, {name = "Goatee Baby", description = "Starts with Death's Touch and Lachryphagy", sprite = "084_baby_goatee.png", item = CollectibleType.COLLECTIBLE_DEATHS_TOUCH, item2 = CollectibleType.COLLECTIBLE_LACHRYPHAGY, mustHaveTears = true}, {name = "Shades Baby", description = "Starts with X-Ray Vision", sprite = "085_baby_shades.png", item = CollectibleType.COLLECTIBLE_XRAY_VISION}, {name = "Statue Baby", description = "Starts with Duality", sprite = "086_baby_statue.png", item = CollectibleType.COLLECTIBLE_DUALITY}, {name = "Bloodsucker Baby", description = "Starts with 3x Lil Delirium", sprite = "087_baby_bloodsucker.png", item = CollectibleType.COLLECTIBLE_LIL_DELIRIUM, itemNum = 3}, {name = "Bandaid Baby", description = "Spawns a random pedestal item per room cleared", sprite = "088_baby_bandaid.png"}, {name = "Eyebrows Baby", description = "Starts with Guppy's Hair Ball", sprite = "089_baby_eyebrows.png", item = CollectibleType.COLLECTIBLE_GUPPYS_HAIRBALL}, {name = "Nerd Baby", description = "Locked doors in uncleared rooms", sprite = "090_baby_nerd.png", requireKeys = true}, {name = "Boss Baby", description = "Starts with There's Options", sprite = "091_baby_boss.png", item = CollectibleType.COLLECTIBLE_THERES_OPTIONS}, {name = "Turd Baby", description = "Enemies fart on death", sprite = "092_baby_turd.png"}, {name = "O Baby", description = "Starts with Tiny Planet", sprite = "093_baby_o.png", item = CollectibleType.COLLECTIBLE_TINY_PLANET}, {name = "Square Eyes Baby", description = "Square tears", sprite = "094_baby_squareeyes.png", mustHaveTears = true}, {name = "Teeth Baby", description = "Starts with Dog Tooth", sprite = "095_baby_teeth.png", item = CollectibleType.COLLECTIBLE_DOG_TOOTH}, {name = "Frown Baby", description = "Summons Best Friend every 5 seconds", sprite = "096_baby_frown.png"}, {name = "Tongue Baby", description = "Recharge bombs", sprite = "097_baby_tongue.png", requireBombs = true}, {name = "Half Head Baby", description = "Takes 2x damage", sprite = "098_baby_halfhead.png"}, {name = "Makeup Baby", description = "8-shot", sprite = "099_baby_makeup.png", item = CollectibleType.COLLECTIBLE_THE_WIZ, itemNum = 4, mustHaveTears = true}, {name = "Ed Baby", description = "Fire trail tears", sprite = "100_baby_ed.png", mustHaveTears = true}, {name = "D Baby", description = "Spawns creep on hit (improved)", sprite = "101_baby_d.png"}, {name = "Guppy Baby", description = "Starts with Guppy's Head", sprite = "102_baby_guppy.png", item = CollectibleType.COLLECTIBLE_GUPPYS_HEAD}, {name = "Puke Baby", description = "Starts with Ipecac", sprite = "103_baby_puke.png", item = CollectibleType.COLLECTIBLE_IPECAC}, {name = "Dumb Baby", description = "Starts with No. 2", sprite = "104_baby_dumb.png", item = CollectibleType.COLLECTIBLE_NUMBER_TWO}, {name = "Lipstick Baby", description = "2x range", sprite = "105_baby_lipstick.png"}, {name = "Aether Baby", description = "All direction tears", sprite = "106_baby_aether.png", mustHaveTears = true}, {name = "Brownie Baby", description = "Starts with Level 4 Meatboy + Level 4 Meatgirl", sprite = "107_baby_brownie.png"}, {name = "VVVVVV Baby", description = "Starts with Anti-Gravity", sprite = "108_baby_vvvvvv.png", item = CollectibleType.COLLECTIBLE_ANTI_GRAVITY}, {name = "Nosferatu Baby", description = "Enemies have homing projectiles", sprite = "109_baby_nosferatu.png"}, {name = "Pubic Baby", description = "Must full clear", sprite = "110_baby_pubic.png"}, {name = "Eyemouth Baby", description = "Shoots an extra tear every 3rd shot", sprite = "111_baby_eyemouth.png", mustHaveTears = true}, {name = "Weirdo Baby", description = "Starts with The Ludovico Technique", sprite = "112_baby_weirdo.png", item = CollectibleType.COLLECTIBLE_LUDOVICO_TECHNIQUE}, {name = "V Baby", description = "Electric ring tears", sprite = "113_baby_v.png", mustHaveTears = true}, {name = "Strange Mouth Baby", description = "Wiggle tears", sprite = "114_baby_strangemouth.png", mustHaveTears = true}, {name = "Masked Baby", description = "Can't shoot while moving", sprite = "115_baby_masked.png", mustHaveTears = true}, {name = "Cyber Baby", description = "Spawns a random pickup on hit", sprite = "116_baby_cyber.png"}, {name = "Axe Wound Baby", description = "Starts with Sacrificial Dagger + flight", description2 = "+ explosion immunity + blindfolded", sprite = "117_baby_axewound.png", item = CollectibleType.COLLECTIBLE_SACRIFICIAL_DAGGER, flight = true, explosionImmunity = true, blindfolded = true}, {name = "Statue Baby 2", description = "Improved Secret Rooms", sprite = "118_baby_statue.png"}, {name = "Grin Baby", description = "Starts with Godhead", sprite = "119_baby_grin.png", item = CollectibleType.COLLECTIBLE_GODHEAD}, {name = "Upset Baby", description = "Starts with Sad Bombs", sprite = "120_baby_upset.png", item = CollectibleType.COLLECTIBLE_SAD_BOMBS, requireBombs = true}, {name = "Plastic Baby", description = "Starts with Rubber Cement", sprite = "121_baby_plastic.png", item = CollectibleType.COLLECTIBLE_RUBBER_CEMENT, mustHaveTears = true}, {name = "Monochrome Baby", description = "Starts with Dead Eye", sprite = "122_baby_monochrome.png", item = CollectibleType.COLLECTIBLE_DEAD_EYE}, {name = "One Tooth Baby", description = "Starts with Rainbow Worm", sprite = "123_baby_onetooth.png", trinket = TrinketType.TRINKET_RAINBOW_WORM, mustHaveTears = true}, {name = "Tusks Baby", description = "2x damage", sprite = "124_baby_tusks.png"}, {name = "Hopeless Baby", description = "+2 keys + keys are hearts", sprite = "125_baby_hopeless.png"}, {name = "Big Mouth Baby", description = "Starts with 10x Jaw Bone", sprite = "126_baby_bigmouth.png", item = CollectibleType.COLLECTIBLE_JAW_BONE, itemNum = 10}, {name = "Pee Eyes Baby", description = "Starts with Number One", sprite = "127_baby_peeeyes.png", item = CollectibleType.COLLECTIBLE_NUMBER_ONE}, {name = "Earwig Baby", description = "3 rooms are already explored", sprite = "128_baby_earwig.png", num = 3}, {name = "Ninkumpoop Baby", description = "Starts with Ouroboros Worm", sprite = "129_baby_ninkumpoop.png", trinket = TrinketType.TRINKET_OUROBOROS_WORM, mustHaveTears = true}, {name = "Strange Shape Baby", description = "Pulsing tears", sprite = "130_baby_strangeshape.png", mustHaveTears = true}, {name = "Bugeyed Baby", description = "Pickups turn into Blue Spiders", sprite = "131_baby_bugeyed.png"}, {name = "Freaky Baby", description = "Converter effect on hit", sprite = "132_baby_freaky.png"}, {name = "Crooked Baby", description = "Tears angled by 15 degrees to the left", sprite = "133_baby_crooked.png", mustHaveTears = true}, {name = "Spider Legs Baby", description = "Starts with 15x Sissy Longlegs", sprite = "134_baby_spiderlegs.png", item = CollectibleType.COLLECTIBLE_SISSY_LONGLEGS, itemNum = 15}, {name = "Smiling Baby", description = "Starts with Sacred Heart", sprite = "135_baby_smiling.png", item = CollectibleType.COLLECTIBLE_SACRED_HEART}, {name = "Tears Baby", description = "Starts with the Soul Jar", sprite = "136_baby_tears.png", item = CollectibleTypeCustom.COLLECTIBLE_SOUL_JAR, requiresRacingPlus = true}, {name = "Bowling Baby", description = "Starts with Flat Stone", sprite = "137_baby_bowling.png", item = CollectibleType.COLLECTIBLE_FLAT_STONE, mustHaveTears = true}, {name = "Mohawk Baby", description = "+2 bombs + bombs are hearts", sprite = "138_baby_mohawk.png"}, {name = "Rotten Meat Baby", description = "Teleport to starting room on hit", sprite = "139_baby_rottenmeat.png"}, {name = "No Arms Baby", description = "Pickups are bouncy", sprite = "140_baby_noarms.png"}, {name = "Twin Baby", description = "Uncontrollable Teleport 2.0", sprite = "141_baby_twin2.png"}, {name = "Ugly Girl Baby", description = "Starts with Ipecac + Dr. Fetus", sprite = "142_baby_uglygirl.png", item = CollectibleType.COLLECTIBLE_IPECAC, item2 = CollectibleType.COLLECTIBLE_DR_FETUS}, {name = "Chompers Baby", description = "Everything is Red Poop", sprite = "143_baby_chompers.png"}, {name = "Camillo Jr. Baby", description = "Starts with Tech.5", sprite = "144_baby_camillojr.png", item = CollectibleType.COLLECTIBLE_TECH_5}, {name = "Eyeless Baby", description = "Starts with 20x The Peeper", sprite = "145_baby_eyeless.png", item = CollectibleType.COLLECTIBLE_PEEPER, itemNum = 20}, {name = "Sloppy Baby", description = "Starts with Epic Fetus (improved)", sprite = "146_baby_sloppy.png", item = CollectibleType.COLLECTIBLE_EPIC_FETUS}, {name = "Bluebird Baby", description = "Touching items/pickups causes paralysis", sprite = "147_baby_bluebird.png"}, {name = "Fat Baby", description = "Necronomicon effect on hit", sprite = "148_baby_fat.png"}, {name = "Butterfly Baby", description = "Improved Super Secret Rooms", sprite = "149_baby_butterfly.png"}, {name = "Goggles Baby", description = "Starts with 20/20", sprite = "150_baby_goggles.png", item = CollectibleType.COLLECTIBLE_20_20}, {name = "Apathetic Baby", description = "Starts with Diplopia", sprite = "151_baby_apathetic.png", item = CollectibleType.COLLECTIBLE_DIPLOPIA}, {name = "Cape Baby", description = "Spray tears", sprite = "152_baby_cape.png", mustHaveTears = true}, {name = "Sorrow Baby", description = "Projectiles are reflected as bombs", sprite = "153_baby_sorrow.png", distance = 50}, {name = "Rictus Baby", description = "Scared pickups", sprite = "154_baby_rictus.png"}, {name = "Awaken Baby", description = "Constant Telekinesis effect", sprite = "155_baby_awaken.png"}, {name = "Puff Baby", description = "Mega Bean effect every 5 seconds", sprite = "156_baby_puff.png"}, {name = "Attractive Baby", description = "All enemies are permanently charmed", sprite = "157_baby_attractive.png", seed = SeedEffect.SEED_ALWAYS_CHARMED}, {name = "Pretty Baby", description = "Summons a random familiar every 5 seconds", sprite = "158_baby_pretty.png"}, {name = "Cracked Infamy Baby", description = "Starts with Dr. Fetus + Remote Detonator", sprite = "159_baby_crackedinfamy.png", item = CollectibleType.COLLECTIBLE_REMOTE_DETONATOR, item2 = CollectibleType.COLLECTIBLE_DR_FETUS, mustHaveTears = true}, {name = "Distended Baby", description = "Starts with Contagion", sprite = "160_baby_distended.png", item = CollectibleType.COLLECTIBLE_CONTAGION}, {name = "Mean Baby", description = "Starts with Epic Fetus", sprite = "161_baby_mean.png", item = CollectibleType.COLLECTIBLE_EPIC_FETUS}, {name = "Digital Baby", description = "B00B T00B", sprite = "162_baby_digital.png"}, {name = "Helmet Baby", description = "Invulnerability when standing still", sprite = "163_baby_helmet.png"}, {name = "Black Eye Baby", description = "Starts with Leprosy, +5 damage on Leprosy breaking", sprite = "164_baby_blackeye.png", item = CollectibleType.COLLECTIBLE_LEPROCY, num = 5}, {name = "Lights Baby", description = "Holy tears", sprite = "165_baby_lights.png", num = 3, mustHaveTears = true}, {name = "Spike Baby", description = "All chests are Mimics + all chests have items", sprite = "166_baby_spike.png"}, {name = "Worry Baby", description = "Touching items/pickups causes teleportation", sprite = "167_baby_worry.png", num = 1}, {name = "Ears Baby", description = "Starts with 3x Mystery Sack", sprite = "168_baby_ears.png", item = CollectibleType.COLLECTIBLE_MYSTERY_SACK, itemNum = 3}, {name = "Funeral Baby", description = "Starts with Death's Touch", sprite = "169_baby_funeral.png", item = CollectibleType.COLLECTIBLE_DEATHS_TOUCH}, {name = "Libra Baby", description = "Starts with Libra", sprite = "170_baby_libra.png", item = CollectibleType.COLLECTIBLE_LIBRA}, {name = "Gappy Baby", description = "Destroying machines gives items", sprite = "171_baby_gappy.png"}, {name = "Sunburn Baby", description = "Starts with Ghost Pepper", sprite = "172_baby_sunburn.png", item = CollectibleType.COLLECTIBLE_GHOST_PEPPER}, {name = "Ate Poop Baby", description = "Destroying poops spawns random pickups", sprite = "173_baby_atepoop.png"}, {name = "Electric Baby", description = "Starts with Jacob's Ladder", sprite = "174_baby_electris.png", item = CollectibleType.COLLECTIBLE_JACOBS_LADDER, mustHaveTears = true}, {name = "Blood Hole Baby", description = "Starts with Proptosis", sprite = "175_baby_bloodhole.png", item = CollectibleType.COLLECTIBLE_PROPTOSIS}, {name = "Transforming Baby", description = "Starts with Technology Zero", sprite = "176_baby_transforming.png", item = CollectibleType.COLLECTIBLE_TECHNOLOGY_ZERO, mustHaveTears = true}, {name = "Aban Baby", description = "+2 coins + Sonic-style health", sprite = "177_baby_aban.png"}, {name = "Bandage Girl Baby", description = "Starts with Cube of Meat + Ball of Bandages", sprite = "178_baby_bandagegirl.png", item = CollectibleType.COLLECTIBLE_CUBE_OF_MEAT, item2 = CollectibleType.COLLECTIBLE_BALL_OF_BANDAGES}, {name = "Piece A Baby", description = "Can only move up + down + left + right", sprite = "179_baby_piecea.png"}, {name = "Piece B Baby", description = "Starts with Charging Station", sprite = "180_baby_pieceb.png", item = CollectibleTypeCustom.COLLECTIBLE_CHARGING_STATION, requireCoins = true}, {name = "Spelunker Baby", description = "Starts with Stud Finder; Crawlspace --> Black Market", sprite = "181_baby_spelunker.png", trinket = TrinketType.TRINKET_STUD_FINDER}, {name = "Frog Baby", description = "Starts with Scorpio", sprite = "182_baby_frog.png", item = CollectibleType.COLLECTIBLE_SCORPIO}, {name = "Crook Baby", description = "Starts with Mr. ME!", sprite = "183_baby_crook.png", item = CollectibleType.COLLECTIBLE_MR_ME}, {name = "Don Baby", description = "Starts with Bob's Brain", sprite = "184_baby_don.png", item = CollectibleType.COLLECTIBLE_BOBS_BRAIN}, {name = "Web Baby", description = "Slow tears", sprite = "185_baby_web.png", mustHaveTears = true}, {name = "Faded Baby", description = "Random teleport on hit", sprite = "186_baby_faded.png"}, {name = "Sick Baby", description = "Shoots explosive flies + flight", sprite = "187_baby_sick.png", flight = true, mustHaveTears = true}, {name = "Dr. Fetus Baby", description = "Starts with Dr. Fetus", sprite = "188_baby_drfetus.png", item = CollectibleType.COLLECTIBLE_DR_FETUS}, {name = "Spectral Baby", description = "Starts with Ouija Board", sprite = "189_baby_spectral.png", item = CollectibleType.COLLECTIBLE_OUIJA_BOARD, mustHaveTears = true}, {name = "Red Skeleton Baby", description = "Starts with 3x Slipped Rib", sprite = "190_baby_redskeleton.png", item = CollectibleType.COLLECTIBLE_SLIPPED_RIB, itemNum = 3}, {name = "Skeleton Baby", description = "Starts with Compound Fracture", sprite = "191_baby_skeleton.png", item = CollectibleType.COLLECTIBLE_COMPOUND_FRACTURE, mustHaveTears = true}, {name = "Jammies Baby", description = "Extra charge per room cleared", sprite = "192_baby_jammies.png"}, {name = "New Jammies Baby", description = "Starts with 5x Big Chubby", sprite = "193_baby_newjammies.png", item = CollectibleType.COLLECTIBLE_BIG_CHUBBY, itemNum = 5}, {name = "Cold Baby", description = "Freeze tears", sprite = "194_baby_cold.png", mustHaveTears = true}, {name = "Old Man Baby", description = "Starts with Dad's Key", sprite = "195_baby_oldman.png", item = CollectibleType.COLLECTIBLE_DADS_KEY}, {name = "Spooked Baby", description = "All enemies are permanently feared", sprite = "196_baby_spooked.png", seed = SeedEffect.SEED_ALWAYS_AFRAID}, {name = "Nice Baby", description = "Brimstone tears", sprite = "197_baby_nice.png", mustHaveTears = true}, {name = "Dots Baby", description = "Starts with Cricket's Body", sprite = "198_baby_dots.png", item = CollectibleType.COLLECTIBLE_CRICKETS_BODY, mustHaveTears = true}, {name = "Peeling Baby", description = "Starts with Potato Peeler", sprite = "199_baby_peeling.png", item = CollectibleType.COLLECTIBLE_POTATO_PEELER}, {name = "Small Face Baby", description = "My Little Unicorn effect on hit", sprite = "200_baby_smallface.png"}, {name = "Good Baby", description = "Starts with 15x Seraphim", sprite = "201_baby_good.png", item = CollectibleType.COLLECTIBLE_SERAPHIM, itemNum = 15}, {name = "Blindfold Baby", description = "Starts with Incubus + blindfolded", sprite = "202_baby_blindfold.png", item = CollectibleType.COLLECTIBLE_INCUBUS, mustHaveTears = true}, {name = "Pipe Baby", description = "Starts with Tractor Beam", sprite = "203_baby_pipe.png", item = CollectibleType.COLLECTIBLE_TRACTOR_BEAM, mustHaveTears = true}, {name = "Dented Baby", description = "Spawns a random key on hit", sprite = "204_baby_dented.png"}, {name = "Steven Baby", description = "Starts with 20x Little Steven", sprite = "205_baby_steven.png", item = CollectibleType.COLLECTIBLE_LITTLE_STEVEN, itemNum = 20}, {name = "Monocle Baby", description = "3x tear size", sprite = "206_baby_monocle.png", mustHaveTears = true}, {name = "Belial Baby 2", description = "Starts with Eye of Belial", sprite = "207_baby_belial.png", item = CollectibleType.COLLECTIBLE_EYE_OF_BELIAL, mustHaveTears = true}, {name = "Monstro Baby", description = "Starts with 5x Lil Monstro", sprite = "208_baby_monstro.png", item = CollectibleType.COLLECTIBLE_LIL_MONSTRO, itemNum = 5}, {name = "Fez Baby", description = "Starts with The Book of Belial", sprite = "209_baby_fez.png", item = CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL}, {name = "MeatBoy Baby", description = "Potato Peeler effect on hit", sprite = "210_baby_meatboy.png"}, {name = "Skull Baby", description = "Shockwave bombs", sprite = "211_baby_skull.png", requireBombs = true}, {name = "Conjoined Baby", description = "Doors open on hit", sprite = "212_baby_conjoined.png"}, {name = "Skinny Baby", description = "Super homing tears", sprite = "213_baby_skinny.png", mustHaveTears = true}, {name = "Basic Spider Baby", description = "Starts with Mutant Spider", sprite = "214_baby_spider.png", item = CollectibleType.COLLECTIBLE_MUTANT_SPIDER}, {name = "Shopkeeper Baby", description = "Free shop items", sprite = "215_baby_shopkeeper.png"}, {name = "Fancy Baby", description = "Can purchase teleports to special rooms", sprite = "216_baby_fancy.png"}, {name = "Chubby Baby", description = "Starts with Technology Zero + Tiny Planet", sprite = "217_baby_chubby.png", item = CollectibleType.COLLECTIBLE_TECHNOLOGY_ZERO, item2 = CollectibleType.COLLECTIBLE_TINY_PLANET, mustHaveTears = true}, {name = "Cyclops Baby", description = "Starts with Polyphemus", sprite = "218_baby_cyclops.png", item = CollectibleType.COLLECTIBLE_POLYPHEMUS}, {name = "Isaac Baby", description = "Starts with The Battery", sprite = "219_baby_isaac.png", item = CollectibleType.COLLECTIBLE_BATTERY}, {name = "Plug Baby", description = "Starts with the Sharp Plug", sprite = "220_baby_plug.png", item = CollectibleType.COLLECTIBLE_SHARP_PLUG}, {name = "Drool Baby", description = "Starts with Monstro's Tooth (improved)", sprite = "221_baby_drool.png", item = CollectibleType.COLLECTIBLE_MONSTROS_TOOTH, num = 4}, {name = "Wink Baby", description = "Starts with the Stop Watch", sprite = "222_baby_wink.png", item = CollectibleType.COLLECTIBLE_STOP_WATCH}, {name = "Pox Baby", description = "Starts with Toxic Shock", sprite = "223_baby_pox.png", item = CollectibleType.COLLECTIBLE_TOXIC_SHOCK}, {name = "Onion Baby", description = "Projectiles have 2x speed", sprite = "224_baby_onion.png"}, {name = "Zipper Baby", description = "Extra enemies spawn on hit", sprite = "225_baby_zipper.png"}, {name = "Buckteeth Baby", description = "Starts with 15x Angry Fly", sprite = "226_baby_buckteeth.png", item = CollectibleType.COLLECTIBLE_ANGRY_FLY, itemNum = 15}, {name = "Beard Baby", description = "Crooked Penny effect on hit", sprite = "227_baby_beard.png"}, {name = "Hanger Baby", description = "Starts with Abel; Abel's tears hurt you", sprite = "228_baby_hanger.png", item = CollectibleType.COLLECTIBLE_ABEL}, {name = "Vampire Baby", description = "Starts with Contract From Below", sprite = "229_baby_vampire.png", item = CollectibleType.COLLECTIBLE_CONTRACT_FROM_BELOW}, {name = "Tilt Baby", description = "Tears angled by 15 degrees to the right", sprite = "230_baby_tilt.png", mustHaveTears = true}, {name = "Bawl Baby", description = "Constant Isaac's Tears effect + blindfolded", sprite = "231_baby_bawl.png", blindfolded = true, softlockPreventionIsland = true}, {name = "Lemon Baby", description = "Starts with Lemon Mishap (improved)", sprite = "232_baby_lemon.png", item = CollectibleType.COLLECTIBLE_LEMON_MISHAP}, {name = "Punkboy Baby", description = "Starts with The Polaroid", sprite = "233_baby_punkboy.png", item = CollectibleType.COLLECTIBLE_POLAROID}, {name = "Punkgirl Baby", description = "Starts with The Negative", sprite = "234_baby_punkgirl.png", item = CollectibleType.COLLECTIBLE_NEGATIVE}, {name = "Computer Baby", description = "Starts with Technology + Technology 2", sprite = "235_baby_computer.png", item = CollectibleType.COLLECTIBLE_TECHNOLOGY, item2 = CollectibleType.COLLECTIBLE_TECHNOLOGY_2, mustHaveTears = true}, {name = "Mask Baby", description = "All enemies are permanently confused", sprite = "236_baby_mask.png", seed = SeedEffect.SEED_ALWAYS_CONFUSED}, {name = "Gem Baby", description = "Pennies spawn as nickels", sprite = "237_baby_gem.png"}, {name = "Shark Baby", description = "Starts with 5x Fate's Reward", sprite = "238_baby_shark.png", item = CollectibleType.COLLECTIBLE_FATES_REWARD, itemNum = 5}, {name = "Beret Baby", description = "All champions", sprite = "239_baby_beret.png", seed = SeedEffect.SEED_ALL_CHAMPIONS, noEndFloors = true}, {name = "Blisters Baby", description = "Low shot speed", sprite = "240_baby_blisters.png", mustHaveTears = true}, {name = "Radioactive Baby", description = "Starts with Mysterious Liquid", sprite = "241_baby_radioactive.png", item = CollectibleType.COLLECTIBLE_MYSTERIOUS_LIQUID}, {name = "Beast Baby", description = "Random enemies", sprite = "242_baby_beast.png"}, {name = "Dark Baby 2", description = "Starts with Strange Attractor", sprite = "243_baby_dark.png", item = CollectibleType.COLLECTIBLE_STRANGE_ATTRACTOR}, {name = "Snail Baby", description = "0.5x speed", sprite = "244_baby_snail.png"}, {name = "Blood Baby", description = "Starts with 5x Forever Alone", sprite = "245_baby_blood.png", item = CollectibleType.COLLECTIBLE_FOREVER_ALONE, itemNum = 5}, {name = "8 Ball Baby", description = "Orbiting tears", sprite = "246_baby_8ball.png", mustHaveTears = true, distance = 90, softlockPreventionIsland = true}, {name = "Wisp Baby", description = "Starts with Crack the Sky", sprite = "247_baby_wisp.png", item = CollectibleType.COLLECTIBLE_CRACK_THE_SKY}, {name = "Cactus Baby", description = "Starts with Locust of Famine", sprite = "248_baby_cactus.png", trinket = TrinketType.TRINKET_LOCUST_OF_FAMINE}, {name = "Love Eye Baby", description = "Falls in loves with the first enemy killed", sprite = "249_baby_loveeye.png"}, {name = "Medusa Baby", description = "Coins refill bombs and keys when depleted", sprite = "250_baby_medusa.png", requireCoins = true}, {name = "Nuclear Baby", description = "Starts with Mama Mega!", sprite = "251_baby_nuclear.png", item = CollectibleType.COLLECTIBLE_MAMA_MEGA}, {name = "Purple Baby", description = "Fires are holy", sprite = "252_baby_purple.png"}, {name = "Wizard Baby", description = "Cards are face up", sprite = "253_baby_wizard.png"}, {name = "Earth Baby", description = "Starts with Fruit Cake", sprite = "254_baby_earth.png", item = CollectibleType.COLLECTIBLE_FRUIT_CAKE, mustHaveTears = true}, {name = "Saturn Baby", description = "Starts with Continuum", sprite = "255_baby_saturn.png", item = CollectibleType.COLLECTIBLE_CONTINUUM, mustHaveTears = true}, {name = "Cloud Baby", description = "Ventricle Razor effect every 15 seconds", sprite = "256_baby_cloud.png", num = 30 * 15}, {name = "Tube Baby", description = "Starts with Varicose Veins", sprite = "257_baby_tube.png", item = CollectibleType.COLLECTIBLE_VARICOSE_VEINS}, {name = "Rocker Baby", description = "Spawns a random bomb on hit", sprite = "258_baby_rocker.png"}, {name = "King Baby", description = "Starts with Crown of Light", sprite = "259_baby_king.png", item = CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT}, {name = "Coat Baby", description = "Spawns a random card on hit", sprite = "260_baby_coat.png"}, {name = "Viking Baby", description = "Secret Room --> Super Secret Room", sprite = "261_baby_viking.png"}, {name = "Panda Baby", description = "Starts with The Poop (improved)", sprite = "262_baby_panda.png", item = CollectibleType.COLLECTIBLE_POOP}, {name = "Raccoon Baby", description = "Random rocks", sprite = "263_baby_raccoon.png"}, {name = "Bear Baby", description = "Starts with Mystery Gift", sprite = "264_baby_bear.png", item = CollectibleType.COLLECTIBLE_MYSTERY_GIFT}, {name = "Polar Bear Baby", description = "Starts with Lil Brimstone + Robo Baby + Baby Bender", sprite = "265_baby_polarbear.png", item = CollectibleType.COLLECTIBLE_LIL_BRIMSTONE, item2 = CollectibleType.COLLECTIBLE_ROBO_BABY, trinket = TrinketType.TRINKET_BABY_BENDER}, {name = "Lovebear Baby", description = "Starts with The Relic", sprite = "266_baby_lovebear.png", item = CollectibleType.COLLECTIBLE_RELIC}, {name = "Hare Baby", description = "Takes damage when standing still", sprite = "267_baby_hare.png", seed = SeedEffect.SEED_DAMAGE_WHEN_STOPPED}, {name = "Squirrel Baby", description = "Starts with Walnut (improved)", sprite = "268_baby_squirrel.png", trinket = TrinketType.TRINKET_WALNUT, requireBombs = true}, {name = "Tabby Baby", description = "0.5x tear rate", sprite = "269_baby_tabby.png"}, {name = "Porcupine Baby", description = "Wait What? effect every 5 seconds", sprite = "270_baby_porcupine.png"}, {name = "Puppy Baby", description = "Starts with Cricket's Head", sprite = "271_baby_puppy.png", item = CollectibleType.COLLECTIBLE_MAXS_HEAD}, {name = "Parrot Baby", description = "Starts with The Pony", sprite = "272_baby_parrot.png", item = CollectibleType.COLLECTIBLE_PONY}, {name = "Chameleon Baby", description = "Starts with 5x Rotten Baby", sprite = "273_baby_chameleon.png", item = CollectibleType.COLLECTIBLE_ROTTEN_BABY, itemNum = 5}, {name = "Boulder Baby", description = "Starts with Leo", sprite = "274_baby_boulder.png", item = CollectibleType.COLLECTIBLE_LEO}, {name = "Aqua Baby", description = "Starts with Taurus", sprite = "275_baby_aqua.png", item = CollectibleType.COLLECTIBLE_TAURUS}, {name = "Gargoyle Baby", description = "Head of Krampus effect on hit", sprite = "276_baby_gargoyle.png"}, {name = "Spiky Demon Baby", description = "Pre-nerf Mimic Chests", sprite = "277_baby_spikydemon.png"}, {name = "Red Demon Baby", description = "Starts with Brimstone + Anti-Gravity", sprite = "278_baby_reddemon.png", item = CollectibleType.COLLECTIBLE_BRIMSTONE, item2 = CollectibleType.COLLECTIBLE_ANTI_GRAVITY}, {name = "Orange Demon Baby", description = "Explosivo tears", sprite = "279_baby_orangedemon.png", mustHaveTears = true}, {name = "Eye Demon Baby", description = "Enemies have Continuum projectiles", sprite = "280_baby_eyedemon.png"}, {name = "Fang Demon Baby", description = "Directed light beams", sprite = "281_baby_fangdemon.png", item = CollectibleType.COLLECTIBLE_MARKED, blindfolded = true, cooldown = 15, noEndFloors = true, mustHaveTears = true, softlockPreventionDestroyPoops = true}, {name = "Ghost Baby 2", description = "Constant Maw of the Void effect + flight + blindfolded", sprite = "282_baby_ghost.png", blindfolded = true, flight = true}, {name = "Arachnid Baby", description = "Starts with 5x Daddy Longlegs", sprite = "283_baby_arachnid.png", item = CollectibleType.COLLECTIBLE_DADDY_LONGLEGS, itemNum = 5}, {name = "Bony Baby", description = "All bombs are doubled", sprite = "284_baby_bony.png", requireBombs = true}, {name = "Big Tongue Baby", description = "Flush effect on hit", sprite = "285_baby_bigtongue.png"}, {name = "3D Baby", description = "Starts with My Reflection", sprite = "286_baby_3d.png", item = CollectibleType.COLLECTIBLE_MY_REFLECTION, mustHaveTears = true}, {name = "Suit Baby", description = "All special rooms are Devil Rooms", sprite = "287_baby_suit.png"}, {name = "Butt Baby", description = "Farts after shooting", sprite = "288_baby_butt.png", mustHaveTears = true}, {name = "Cupid Baby", description = "Starts with Cupid's Arrow", sprite = "289_baby_cupid.png", item = CollectibleType.COLLECTIBLE_CUPIDS_ARROW, mustHaveTears = true}, {name = "Heart Baby", description = "Dull Razor effect every 5 seconds", sprite = "290_baby_heart.png"}, {name = "Killer Baby", description = "+0.2 damage per enemy killed", sprite = "291_baby_killer.png"}, {name = "Lantern Baby", description = "Godhead aura + flight + blindfolded", sprite = "292_baby_lantern.png", item = CollectibleType.COLLECTIBLE_GODHEAD, item2 = CollectibleType.COLLECTIBLE_LUDOVICO_TECHNIQUE, flight = true, mustHaveTears = true, blindfolded2 = true}, {name = "Banshee Baby", description = "Crack the Sky effect on hit", sprite = "293_baby_banshee.png"}, {name = "Ranger Baby", description = "Starts with 3x Lil Chest", sprite = "294_baby_ranger.png", item = CollectibleType.COLLECTIBLE_LIL_CHEST, itemNum = 3}, {name = "Rider Baby", description = "Starts with A Pony (improved) + blindfolded", sprite = "295_baby_rider.png", item = CollectibleType.COLLECTIBLE_PONY, blindfolded = true}, {name = "Choco Baby", description = "Starts with Chocolate Milk", sprite = "296_baby_choco.png", item = CollectibleType.COLLECTIBLE_CHOCOLATE_MILK}, {name = "Woodsman Baby", description = "All doors are open", sprite = "297_baby_woodsman.png"}, {name = "Brunette Baby", description = "Starts with The Poop + Brown Cap", sprite = "298_baby_brunette.png", item = CollectibleType.COLLECTIBLE_POOP, trinket = TrinketType.TRINKET_BROWN_CAP}, {name = "Blonde Baby", description = "Starts with Dad's Ring", sprite = "299_baby_blonde.png", item = CollectibleType.COLLECTIBLE_DADS_RING}, {name = "Blue Hair Baby", description = "Starts with The Candle", sprite = "300_baby_bluehair.png", item = CollectibleType.COLLECTIBLE_CANDLE}, {name = "Bloodied Baby", description = "Starts with Blood Rights + The Polaroid", sprite = "301_baby_bloodied.png", item = CollectibleType.COLLECTIBLE_BLOOD_RIGHTS, item2 = CollectibleType.COLLECTIBLE_POLAROID}, {name = "Cheese Baby", description = "Starts with Libra + Soy Milk", sprite = "302_baby_cheese.png", item = CollectibleType.COLLECTIBLE_LIBRA, item2 = CollectibleType.COLLECTIBLE_SOY_MILK, mustHaveTears = true}, {name = "Pizza Baby", description = "Starts with Brown Nugget (improved)", sprite = "303_baby_pizza.png", item = CollectibleType.COLLECTIBLE_BROWN_NUGGET, delay = 3}, {name = "Hotdog Baby", description = "Constant The Bean effect + flight + explosion immunity + blindfolded", sprite = "304_baby_hotdog.png", flight = true, explosionImmunity = true, blindfolded = true, noEndFloors = true}, {name = "Nature Baby", description = "Starts with Sprinkler", sprite = "305_baby_pear.png", item = CollectibleType.COLLECTIBLE_SPRINKLER}, {name = "Borg Baby", description = "Starts with Teleport 2.0", sprite = "306_baby_borg.png", item = CollectibleType.COLLECTIBLE_TELEPORT_2}, {name = "Corrupted Baby", description = "Touching items/pickups causes damage", sprite = "307_baby_corrupted.png"}, {name = "X Mouth Baby", description = "Moving Box effect on hit", sprite = "308_baby_xmouth.png"}, {name = "X Eyed Baby", description = "Starts with Marked", sprite = "309_baby_xeyes.png", item = CollectibleType.COLLECTIBLE_MARKED, mustHaveTears = true}, {name = "Starry Eyed Baby", description = "Spawns a Stars Card on hit", sprite = "310_baby_stareyes.png"}, {name = "Surgeon Baby", description = "Starts with Ventricle Razor", sprite = "311_baby_surgeon.png", item = CollectibleType.COLLECTIBLE_VENTRICLE_RAZOR}, {name = "Sword Baby", description = "Starts with Sacrificial Dagger", sprite = "312_baby_sword.png", item = CollectibleType.COLLECTIBLE_SACRIFICIAL_DAGGER}, {name = "Monk Baby", description = "PAC1F1CM", sprite = "313_baby_monk.png", seed = SeedEffect.SEED_PACIFIST}, {name = "Disco Baby", description = "Starts with 10x Angelic Prism", sprite = "314_baby_disco.png", item = CollectibleType.COLLECTIBLE_ANGELIC_PRISM, itemNum = 10}, {name = "Puzzle Baby", description = "The D6 effect on hit", sprite = "315_baby_puzzle.png"}, {name = "Speaker Baby", description = "X splitting tears", sprite = "316_baby_speaker.png", mustHaveTears = true}, {name = "Scary Baby", description = "Items cost hearts", sprite = "317_baby_scary.png"}, {name = "Fireball Baby", description = "Explosion immunity + fire immunity", sprite = "318_baby_fireball.png", explosionImmunity = true}, {name = "Maw Baby", description = "Starts with Maw of the Void", sprite = "319_baby_maw.png", item = CollectibleType.COLLECTIBLE_MAW_OF_VOID}, {name = "Exploding Baby", description = "Kamikaze! effect upon touching an obstacle", sprite = "320_baby_exploding.png", explosionImmunity = true}, {name = "Cupcake Baby", description = "High shot speed", sprite = "321_baby_cupcake.png", mustHaveTears = true}, {name = "Skinless Baby", description = "2x damage + takes 2x damage", sprite = "322_baby_skinless.png"}, {name = "Ballerina Baby", description = "Summons a Restock Machine after 6 hits", sprite = "323_baby_ballerina.png"}, {name = "Goblin Baby", description = "Starts with Rotten Penny", sprite = "324_baby_goblin.png", trinket = TrinketType.TRINKET_ROTTEN_PENNY}, {name = "Cool Goblin Baby", description = "Starts with 5x Acid Baby", sprite = "325_baby_coolgoblin.png", item = CollectibleType.COLLECTIBLE_ACID_BABY, itemNum = 5}, {name = "Geek Baby", description = "Starts with 20x Robo-Baby 2.0 + blindfolded", sprite = "326_baby_geek.png", item = CollectibleType.COLLECTIBLE_ROBO_BABY_2, itemNum = 20, blindfolded = true, softlockPreventionDestroyPoops = true}, {name = "Long Beard Baby", description = "Starts with 10x Gemini", sprite = "327_baby_longbeard.png", item = CollectibleType.COLLECTIBLE_GEMINI, itemNum = 10}, {name = "Muttonchops Baby", description = "Starts with Lachryphagy", sprite = "328_baby_muttonchops.png", item = CollectibleType.COLLECTIBLE_LACHRYPHAGY, mustHaveTears = true}, {name = "Spartan Baby", description = "Spawns a pedestal item after 6 hits", sprite = "329_baby_spartan.png"}, {name = "Tortoise Baby", description = "50% chance to ignore damage", sprite = "330_baby_tortoise.png"}, {name = "Slicer Baby", description = "Slice tears", sprite = "331_baby_slicer.png", item = CollectibleType.COLLECTIBLE_SOY_MILK, item2 = CollectibleType.COLLECTIBLE_PROPTOSIS, mustHaveTears = true}, {name = "Butterfly Baby 2", description = "Flight + can walk through walls", sprite = "332_baby_butterfly.png"}, {name = "Homeless Baby", description = "Starts with 15x Buddy in a Box", sprite = "333_baby_homeless.png", item = CollectibleType.COLLECTIBLE_BUDDY_IN_A_BOX, itemNum = 15}, {name = "Lumberjack Baby", description = "Starts with 3x Sack of Sacks", sprite = "334_baby_lumberjack.png", item = CollectibleType.COLLECTIBLE_SACK_OF_SACKS, itemNum = 3}, {name = "Cyberspace Baby", description = "Starts with Brimstone + Spoon Bender", sprite = "335_baby_cyberspace.png", item = CollectibleType.COLLECTIBLE_BRIMSTONE, item2 = CollectibleType.COLLECTIBLE_SPOON_BENDER}, {name = "Hero Baby", description = "3x damage + 3x tear rate when at 1 heart or less", sprite = "336_baby_hero.png"}, {name = "Boxers Baby", description = "Boxing glove tears", sprite = "337_baby_boxers.png", mustHaveTears = true}, {name = "Wing Helmet Baby", description = "Starts with The Ludovico Technique + The Parasite", sprite = "338_baby_winghelmet.png", item = CollectibleType.COLLECTIBLE_LUDOVICO_TECHNIQUE, item2 = CollectibleType.COLLECTIBLE_PARASITE, mustHaveTears = true}, {name = "X Baby", description = "Shoots 4 tears diagonally", sprite = "339_baby_x.png", mustHaveTears = true}, {name = "O Baby 2", description = "Spiral tears", sprite = "340_baby_o.png", mustHaveTears = true}, {name = "Vomit Baby", description = "Must stand still every 10 seconds", sprite = "341_baby_vomit.png", time = 10 * 30}, {name = "Merman Baby", description = "Keys spawn as bombs", sprite = "342_baby_merman.png"}, {name = "Cyborg Baby", description = "Sees numerical damage values", sprite = "343_baby_cyborg.png"}, {name = "Barbarian Baby", description = "Mama Mega bombs", sprite = "344_baby_barbarian.png", requireBombs = true}, {name = "Locust Baby", description = "Starts with Soy Milk + booger tears", sprite = "345_baby_locust.png", item = CollectibleType.COLLECTIBLE_SOY_MILK, mustHaveTears = true}, {name = "Twotone Baby", description = "Dataminer effect on hit", sprite = "346_baby_twotone.png"}, {name = "2600 Baby", description = "Backwards tears", sprite = "347_baby_2600.png", mustHaveTears = true}, {name = "Fourtone Baby", description = "Starts with The Candle + blindfolded", sprite = "348_baby_fourtone.png", item = CollectibleType.COLLECTIBLE_CANDLE, blindfolded = true, softlockPreventionDestroyPoops = true}, {name = "Grayscale Baby", description = "Delirious effect every 10 seconds", sprite = "349_baby_grayscale.png"}, {name = "Rabbit Baby", description = "Starts with How to Jump; must jump often", sprite = "350_baby_rabbit.png", item = CollectibleType.COLLECTIBLE_HOW_TO_JUMP, num = 45 * 2}, {name = "Mouse Baby", description = "Coin doors in uncleared rooms", sprite = "351_baby_mouse.png", item = CollectibleType.COLLECTIBLE_PAY_TO_PLAY, requireCoins = true}, {name = "Critter Baby", description = "Starts with Infestation 2", sprite = "352_baby_critter.png", item = CollectibleType.COLLECTIBLE_INFESTATION_2}, {name = "Blue Robot Baby", description = "Starts with Broken Watch", sprite = "353_baby_bluerobot.png", item = CollectibleType.COLLECTIBLE_BROKEN_WATCH}, {name = "Pilot Baby", description = "Starts with Dr. Fetus + Haemolacria", sprite = "354_baby_pilot.png", item = CollectibleType.COLLECTIBLE_DR_FETUS, item2 = CollectibleType.COLLECTIBLE_HAEMOLACRIA}, {name = "Red Plumber Baby", description = "Starts with Locust of War", sprite = "355_baby_redplumber.png", trinket = TrinketType.TRINKET_LOCUST_OF_WRATH}, {name = "Green Plumber Baby", description = "Starts with Locust of Pestilence", sprite = "356_baby_greenplumber.png", trinket = TrinketType.TRINKET_LOCUST_OF_PESTILENCE}, {name = "Yellow Plumber Baby", description = "Starts with Locust of Conquest", sprite = "357_baby_yellowplumber.png", trinket = TrinketType.TRINKET_LOCUST_OF_CONQUEST}, {name = "Purple Plumber Baby", description = "Starts with Locust of Death", sprite = "358_baby_purpleplumber.png", trinket = TrinketType.TRINKET_LOCUST_OF_DEATH}, {name = "Tanooki Baby", description = "Mr. ME! effect on hit", sprite = "359_baby_tanooki.png"}, {name = "Mushroom Man Baby", description = "Starts with Magic Mushroom", sprite = "360_baby_mushroomman.png", item = CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM}, {name = "Mushroom Girl Baby", description = "Every 8th tear is a bomb", sprite = "361_baby_mushroomgirl.png", num = 8, mustHaveTears = true}, {name = "Cannonball Baby", description = "Starts with 15x Samson's Chains", sprite = "362_baby_cannonball.png", item = CollectibleType.COLLECTIBLE_SAMSONS_CHAINS, itemNum = 15}, {name = "Froggy Baby", description = "Starts with Ludo + Brimstone + Wiggle Worm", sprite = "363_baby_froggy.png", item = CollectibleType.COLLECTIBLE_LUDOVICO_TECHNIQUE, item2 = CollectibleType.COLLECTIBLE_BRIMSTONE, trinket = TrinketType.TRINKET_WIGGLE_WORM, mustHaveTears = true}, {name = "Turtle Dragon Baby", description = "Fiery tears", sprite = "364_baby_turtledragon.png", mustHaveTears = true}, {name = "Shell Suit Baby", description = "Starts with Burnt Penny", sprite = "365_baby_shellsuit.png", trinket = TrinketType.TRINKET_BURNT_PENNY}, {name = "Fiery Baby", description = "Spawns a fire on hit", sprite = "366_baby_fiery.png"}, {name = "Mean Mushroom Baby", description = "Starts with 5x Sack of Pennies", sprite = "367_baby_meanmushroom.png", item = CollectibleType.COLLECTIBLE_SACK_OF_PENNIES, itemNum = 5}, {name = "Arcade Baby", description = "Razor blade tears", sprite = "368_baby_arcade.png", num = 3, mustHaveTears = true}, {name = "Scared Ghost Baby", description = "2x speed", sprite = "369_baby_scaredghost.png"}, {name = "Blue Ghost Baby", description = "Max tear rate", sprite = "370_baby_blueghost.png"}, {name = "Red Ghost Baby", description = "+10 damage", sprite = "371_baby_redghost.png"}, {name = "Pink Ghost Baby", description = "Charm tears", sprite = "372_baby_pinkghost.png", mustHaveTears = true}, {name = "Orange Ghost Baby", description = "Placed bombs are Mega Troll Bombs", sprite = "373_baby_orangeghost.png", requireBombs = true}, {name = "Pink Princess Baby", description = "Summons random stomps", sprite = "374_baby_pinkprincess.png"}, {name = "Yellow Princess Baby", description = "Starts with Ipecac + Trisagion + Flat Stone", sprite = "375_baby_yellowprincess.png", item = CollectibleType.COLLECTIBLE_IPECAC, item2 = CollectibleType.COLLECTIBLE_TRISAGION, mustHaveTears = true}, {name = "Dino Baby", description = "Gains a explosive egg per enemy killed", sprite = "376_baby_dino.png"}, {name = "Elf Baby", description = "Starts with Spear of Destiny (improved) + flight", description2 = "+ explosion immunity + blindfolded", sprite = "377_baby_elf.png", item = CollectibleType.COLLECTIBLE_SPEAR_OF_DESTINY, flight = true, explosionImmunity = true, blindfolded = true}, {name = "Dark Elf Baby", description = "Book of the Dead effect on hit", sprite = "378_baby_darkelf.png"}, {name = "Dark Knight Baby", description = "Starts with 5x Dry Baby", sprite = "379_baby_darkknight.png", item = CollectibleType.COLLECTIBLE_DRY_BABY, itemNum = 5}, {name = "Octopus Baby", description = "Tears make black creep", sprite = "380_baby_octopus.png", mustHaveTears = true}, {name = "Orange Pig Baby", description = "Double items", sprite = "381_baby_orangepig.png"}, {name = "Blue Pig Baby", description = "Spawns a Mega Troll Bomb every 5 seconds", sprite = "382_baby_bluepig.png"}, {name = "Elf Princess Baby", description = "Starts with 10x Mom's Razor", sprite = "383_baby_elfprincess.png", item = CollectibleType.COLLECTIBLE_MOMS_RAZOR, itemNum = 10}, {name = "Fishman Baby", description = "Spawns a random bomb per room cleared", sprite = "384_baby_fishman.png"}, {name = "Fairyman Baby", description = "-30% damage on hit", sprite = "385_baby_fairyman.png"}, {name = "Imp Baby", description = "Blender + flight + explosion immunity + blindfolded", sprite = "386_baby_imp.png", item = CollectibleType.COLLECTIBLE_MOMS_KNIFE, item2 = CollectibleType.COLLECTIBLE_LOKIS_HORNS, flight = true, explosionImmunity = true, blindfolded = true, noEndFloors = true, num = 3}, {name = "Worm Baby 2", description = "Starts with 20x Leech", sprite = "387_baby_worm.png", item = CollectibleType.COLLECTIBLE_LEECH, itemNum = 20}, {name = "Blue Wrestler Baby", description = "Enemies spawn projectiles upon death", sprite = "388_baby_bluewrestler.png", num = 6}, {name = "Red Wrestler Baby", description = "Everything is TNT", sprite = "389_baby_redwrestler.png"}, {name = "Toast Baby", description = "Enemies leave a Red Candle fire upon death", sprite = "390_baby_toast.png"}, {name = "Roboboy Baby", description = "Starts with Technology + A Lump of Coal", sprite = "391_baby_roboboy.png", item = CollectibleType.COLLECTIBLE_TECHNOLOGY, item2 = CollectibleType.COLLECTIBLE_LUMP_OF_COAL}, {name = "Liberty Baby", description = "Starts with Liberty Cap", sprite = "392_baby_liberty.png", trinket = TrinketType.TRINKET_LIBERTY_CAP}, {name = "Dream Knight Baby", description = "Starts with Super Bum", sprite = "393_baby_dreamknight.png", item = CollectibleType.COLLECTIBLE_BUM_FRIEND, item2 = CollectibleType.COLLECTIBLE_DARK_BUM}, {name = "Cowboy Baby", description = "Pickups shoot", sprite = "394_baby_cowboy.png"}, {name = "Mermaid Baby", description = "Bombs spawn as keys", sprite = "395_baby_mermaid.png"}, {name = "Plague Baby", description = "Leaves a trail of creep", sprite = "396_baby_plague.png"}, {name = "Space Soldier Baby", description = "Starts with Void", sprite = "397_baby_spacesoldier.png", item = CollectibleType.COLLECTIBLE_VOID}, {name = "Dark Space Soldier Baby", description = "Chaos card tears", sprite = "398_baby_darkspacesoldier.png", num = 5, mustHaveTears = true}, {name = "Gas Mask Baby", description = "Starts with Wait What?", sprite = "399_baby_gasmask.png", item = CollectibleType.COLLECTIBLE_WAIT_WHAT}, {name = "Tomboy Baby", description = "Starts with We Need to Go Deeper! (uncharged)", sprite = "400_baby_tomboy.png", item = CollectibleType.COLLECTIBLE_WE_NEED_GO_DEEPER, uncharged = true}, {name = "Corgi Baby", description = "Spawns a fly every 1.5 seconds", sprite = "401_baby_corgi.png"}, {name = "Unicorn Baby", description = "Starts with Unicorn Stump + Cube of Meat", sprite = "402_baby_unicorn.png", item = CollectibleType.COLLECTIBLE_UNICORN_STUMP, item2 = CollectibleType.COLLECTIBLE_CUBE_OF_MEAT}, {name = "Pixie Baby", description = "Starts with 3x YO LISTEN! (improved)", sprite = "403_baby_pixie.png", item = CollectibleType.COLLECTIBLE_YO_LISTEN, itemNum = 3}, {name = "Referee Baby", description = "Starts with Crooked Penny", sprite = "404_baby_referee.png", item = CollectibleType.COLLECTIBLE_CROOKED_PENNY}, {name = "Deal With It Baby", description = "Starts with Teleport", sprite = "405_baby_dealwithit.png", item = CollectibleType.COLLECTIBLE_TELEPORT}, {name = "Astronaut Baby", description = "Tears have a 5% chance to create a Black Hole effect", sprite = "406_baby_astronaut.png", mustHaveTears = true}, {name = "Blurred Baby", description = "Starts with Ipecac + Ludo + Flat Stone", sprite = "407_baby_blurred.png", item = CollectibleType.COLLECTIBLE_IPECAC, item2 = CollectibleType.COLLECTIBLE_LUDOVICO_TECHNIQUE, mustHaveTears = true}, {name = "Censored Baby", description = "All enemies get confused on hit", sprite = "408_baby_censored.png"}, {name = "Cool Ghost Baby", description = "Starts with Flock of Succubi", sprite = "409_baby_coolghost.png", item = CollectibleTypeCustom.COLLECTIBLE_FLOCK_OF_SUCCUBI}, {name = "Gills Baby", description = "Splash tears", sprite = "410_baby_gills.png", mustHaveTears = true}, {name = "Blue Hat Baby", description = "Starts with Blue Map", sprite = "411_baby_bluehat.png", item = CollectibleType.COLLECTIBLE_BLUE_MAP}, {name = "Catsuit Baby", description = "Guppy's Paw effect on hit", sprite = "412_baby_catsuit.png"}, {name = "Pirate Baby", description = "Starts with Treasure Map", sprite = "413_baby_pirate.png", item = CollectibleType.COLLECTIBLE_TREASURE_MAP}, {name = "Super Robo Baby", description = "Starts with Broken Remote", sprite = "414_baby_superrobo.png", trinket = TrinketType.TRINKET_BROKEN_REMOTE}, {name = "Lightmage Baby", description = "Starts with Trisagion", sprite = "415_baby_lightmage.png", item = CollectibleType.COLLECTIBLE_TRISAGION, mustHaveTears = true}, {name = "Puncher Baby", description = "Starts with 10x Punching Bag", sprite = "416_baby_puncher.png", item = CollectibleType.COLLECTIBLE_PUNCHING_BAG, itemNum = 10}, {name = "Holy Knight Baby", description = "Starts with Eucharist", sprite = "417_baby_holyknight.png", item = CollectibleType.COLLECTIBLE_EUCHARIST}, {name = "Shadowmage Baby", description = "Starts with Death's List", sprite = "418_baby_shadowmage.png", item = CollectibleType.COLLECTIBLE_DEATH_LIST}, {name = "Firemage Baby", description = "Starts with Fire Mind + 13 luck", sprite = "419_baby_firemage.png", item = CollectibleType.COLLECTIBLE_FIRE_MIND, mustHaveTears = true}, {name = "Priest Baby", description = "Starts with Scapular", sprite = "420_baby_priest.png", item = CollectibleType.COLLECTIBLE_SCAPULAR}, {name = "Zipper Baby 2", description = "Starts with Door Stop", sprite = "421_baby_zipper.png", trinket = TrinketType.TRINKET_DOOR_STOP}, {name = "Bag Baby", description = "Starts with Sack Head", sprite = "422_baby_bag.png", item = CollectibleType.COLLECTIBLE_SACK_HEAD}, {name = "Sailor Baby", description = "Starts with The Compass", sprite = "423_baby_sailor.png", item = CollectibleType.COLLECTIBLE_COMPASS}, {name = "Rich Baby", description = "Starts with 99 cents", sprite = "424_baby_rich.png"}, {name = "Toga Baby", description = "Starts with Finger! (improved)", sprite = "425_baby_toga.png", item = CollectibleType.COLLECTIBLE_FINGER, itemNum = 10}, {name = "Knight Baby", description = "Starts with 5x 7 Seals", sprite = "426_baby_knight.png", item = CollectibleType.COLLECTIBLE_LIL_HARBINGERS, itemNum = 5}, {name = "Black Knight Baby", description = "Starts with Black Hole", sprite = "427_baby_blackknight.png", item = CollectibleType.COLLECTIBLE_BLACK_HOLE}, {name = "Magic Cat Baby", description = "Constant Kidney Bean effect", sprite = "428_baby_magiccat.png"}, {name = "Little Horn Baby", description = "Void tears", sprite = "429_baby_littlehorn.png", num = 3, mustHaveTears = true}, {name = "Folder Baby", description = "Swaps item/shop pools + devil/angel pools", sprite = "430_baby_folder.png"}, {name = "Driver Baby", description = "Slippery movement", sprite = "431_baby_driver.png", seed = SeedEffect.SEED_ICE_PHYSICS}, {name = "Dragon Baby", description = "Starts with Lil Brimstone", sprite = "432_baby_dragon.png", item = CollectibleType.COLLECTIBLE_LIL_BRIMSTONE}, {name = "Downwell Baby", description = "Starts with Eden's Soul", sprite = "433_baby_downwell.png", item = CollectibleType.COLLECTIBLE_EDENS_SOUL, uncharged = true}, {name = "Cylinder Baby", description = "Tear size increases with distance", sprite = "434_baby_cylinder.png", mustHaveTears = true}, {name = "Cup Baby", description = "Card Against Humanity on hit", sprite = "435_baby_cup.png"}, {name = "Cave Robot Baby", description = "Starts with Hairpin", sprite = "436_baby_cave_robot.png", trinket = TrinketType.TRINKET_HAIRPIN}, {name = "Breadmeat Hoodiebread Baby", description = "Starts with Eye of Greed", sprite = "437_baby_breadmeat_hoodiebread.png", item = CollectibleType.COLLECTIBLE_EYE_OF_GREED, mustHaveTears = true}, {name = "Big Mouth Baby 2", description = "Starts with Mega Blast", sprite = "438_baby_bigmouth.png", item = CollectibleType.COLLECTIBLE_MEGA_SATANS_BREATH}, {name = "Afro Rainbow Baby", description = "Starts with 20x Rainbow Baby", sprite = "439_baby_afro_rainbow.png", item = CollectibleType.COLLECTIBLE_RAINBOW_BABY, itemNum = 20}, {name = "Afro Baby", description = "Starts with D1", sprite = "440_baby_afro.png", item = CollectibleType.COLLECTIBLE_D1}, {name = "TV Baby", description = "Mega Blast effect after 6 hits", sprite = "441_baby_tv.png", numHits = 6}, {name = "Tooth Head Baby", description = "Tooth tears", sprite = "442_baby_tooth.png", num = 3, mustHaveTears = true}, {name = "Tired Baby", description = "Starts with 5x Bum Friend", sprite = "443_baby_tired.png", item = CollectibleType.COLLECTIBLE_BUM_FRIEND, itemNum = 5}, {name = "Steroids Baby", description = "Forget Me Now on 2nd hit (per room)", sprite = "444_baby_steroids.png"}, {name = "Soap Monster Baby", description = "Starts with Butter", sprite = "445_baby_soap_monster.png", trinket = TrinketType.TRINKET_BUTTER}, {name = "Rojen Whitefox Baby", description = "Shield on hit", sprite = "446_baby_rojen_whitefox.png"}, {name = "Rocket Baby", description = "Starts with Super Magnet", sprite = "447_baby_rocket.png", trinket = TrinketType.TRINKET_SUPER_MAGNET}, {name = "Nurf Baby", description = "Starts with 3x Rune Bag", sprite = "448_baby_nurf.png", item = CollectibleType.COLLECTIBLE_RUNE_BAG, itemNum = 3}, {name = "Mutated Fish Baby", description = "Summons a Sprinkler every 7 seconds", sprite = "449_baby_mutated_fish.png"}, {name = "Moth Baby", description = "Starts with Soy Milk + Ipecac", sprite = "450_baby_moth.png", item = CollectibleType.COLLECTIBLE_SOY_MILK, item2 = CollectibleType.COLLECTIBLE_IPECAC, mustHaveTears = true}, {name = "Buttface Baby", description = "Spawns a Black Poop per enemy killed", sprite = "451_baby_buttface.png"}, {name = "Flying Candle Baby", description = "Starts with Night Light", sprite = "452_baby_flying_candle.png", item = CollectibleType.COLLECTIBLE_NIGHT_LIGHT}, {name = "Graven Baby", description = "Starts with Level 4 Bumbo (improved)", sprite = "453_baby_graven.png", item = CollectibleType.COLLECTIBLE_BUMBO}, {name = "Gizzy Chargeshot Baby", description = "Starts with Poke Go", sprite = "454_baby_gizzy_chargeshot.png", item = CollectibleType.COLLECTIBLE_POKE_GO}, {name = "Green Koopa Baby", description = "Shoots bouncy green shells", sprite = "455_baby_green_koopa.png", mustHaveTears = true}, {name = "Handsome Mr. Frog Baby", description = "Spawns 20 Blue Flies on hit", sprite = "456_baby_handsome_mrfrog.png", num = 20}, {name = "Pumpkin Guy Baby", description = "Starts with Pop!", sprite = "457_baby_pumpkin_guy.png", item = CollectibleType.COLLECTIBLE_POP, mustHaveTears = true}, {name = "Red Koopa Baby", description = "Shoots bouncy & homing red shells", sprite = "458_baby_red_koopa.png", mustHaveTears = true}, {name = "Sad Bunny Baby", description = "Accuracy increases tear rate", sprite = "459_baby_sad_bunny.png", mustHaveTears = true}, {name = "Saturn Baby 2", description = "Starts with The Ludovico Technique + Strange Attractor", sprite = "460_baby_saturn.png", item = CollectibleType.COLLECTIBLE_LUDOVICO_TECHNIQUE, item2 = CollectibleType.COLLECTIBLE_STRANGE_ATTRACTOR, mustHaveTears = true}, {name = "Toast Boy Baby", description = "Starts with 5x Friend Zone", sprite = "461_baby_toast_boy.png", item = CollectibleType.COLLECTIBLE_FRIEND_ZONE, itemNum = 5}, {name = "Voxdog Baby", description = "Shockwave tears", sprite = "462_baby_voxdog.png", mustHaveTears = true}, {name = "404 Baby", description = "Acid trip", sprite = "463_baby_404.png"}, {name = "Arrowhead Baby", description = "Starts with Technology Zero + Cupid's Arrow", sprite = "464_baby_arrowhead.png", item = CollectibleType.COLLECTIBLE_TECHNOLOGY_ZERO, item2 = CollectibleType.COLLECTIBLE_CUPIDS_ARROW, mustHaveTears = true}, {name = "Beanie Baby", description = "Starts with Smelter", sprite = "465_baby_beanie.png", item = CollectibleType.COLLECTIBLE_SMELTER}, {name = "Blindcursed Baby", description = "Invisible tears", sprite = "466_baby_blindcursed.png", mustHaveTears = true}, {name = "Burning Baby", description = "Starts with Fire Mind", sprite = "467_baby_burning.png", item = CollectibleType.COLLECTIBLE_FIRE_MIND}, {name = "Cursor Baby", description = "Starts with Pause", sprite = "468_baby_cursor.png", item = CollectibleType.COLLECTIBLE_PAUSE}, {name = "Fly Baby", description = "Mass splitting tears", sprite = "469_baby_flybaby.png", mustHaveTears = true}, {name = "Headphone Baby", description = "Soundwave tears", sprite = "470_baby_headphone.png", mustHaveTears = true}, {name = "Knife Baby", description = "Starts with Mom's Knife", sprite = "471_baby_knife.png", item = CollectibleType.COLLECTIBLE_MOMS_KNIFE}, {name = "Mufflerscarf Baby", description = "All enemies get freezed on hit", sprite = "472_baby_mufflerscarf.png"}, {name = "Robbermask Baby", description = "+1 damage per pickup taken", sprite = "473_baby_robbermask.png"}, {name = "Scoreboard Baby", description = "Dies 1 minute after getting hit", sprite = "474_baby_scoreboard.png"}, {name = "So Many Eyes Baby", description = "Starts with Mutant Spider + The Inner Eye", sprite = "475_baby_somanyeyes.png", item = CollectibleType.COLLECTIBLE_MUTANT_SPIDER, item2 = CollectibleType.COLLECTIBLE_INNER_EYE}, {name = "Text Baby", description = "0.5x damage", sprite = "476_baby_text.png"}, {name = "Wing Baby", description = "Starts with White Pony", sprite = "477_baby_wing.png", item = CollectibleType.COLLECTIBLE_WHITE_PONY}, {name = "Tooth Baby", description = "Starts with Dead Tooth", sprite = "478_baby_tooth.png", item = CollectibleType.COLLECTIBLE_DEAD_TOOTH}, {name = "Haunt Baby", description = "Starts with 10x Lil Haunt", sprite = "479_baby_haunt.png", item = CollectibleType.COLLECTIBLE_LIL_HAUNT, itemNum = 10}, {name = "Imp Baby 2", description = "Acid tears", sprite = "480_baby_imp.png", mustHaveTears = true}, {name = "32bit Baby", description = "No HUD", sprite = "481_baby_32bit.png", seed = SeedEffect.SEED_NO_HUD}, {name = "Adventure Baby", description = "Starts with Moving Box", sprite = "482_baby_adventure.png", item = CollectibleType.COLLECTIBLE_MOVING_BOX}, {name = "Bubbles Baby", description = "+1 damage per pill used", sprite = "483_baby_bubbles.png"}, {name = "Bulb Baby", description = "Starts with Vibrant Bulb", sprite = "484_baby_bulb.png", trinket = TrinketType.TRINKET_VIBRANT_BULB}, {name = "Cool Orange Baby", description = "Summons random missiles", sprite = "485_baby_coolorange.png"}, {name = "Crazy Ghost Baby", description = "Starts with 20x Ghost Baby", sprite = "486_baby_crazyghost.png", item = CollectibleType.COLLECTIBLE_GHOST_BABY, itemNum = 20}, {name = "Cursed Pillow Baby", description = "Every 3rd missed tear causes damage", sprite = "487_baby_cursedpillow.png", num = 3, mustHaveTears = true}, {name = "Egg Baby", description = "Random pill effect on hit", sprite = "488_baby_egg.png"}, {name = "Factory Baby", description = "Starts with Clockwork Assembly", sprite = "489_baby_factory.png", item = CollectibleTypeCustom.COLLECTIBLE_CLOCKWORK_ASSEMBLY}, {name = "Falling Baby", description = "Starts with Incubus", sprite = "490_baby_falling.png", item = CollectibleType.COLLECTIBLE_INCUBUS}, {name = "Funny Baby", description = "Enemies spawn Mega Troll Bombs on death", sprite = "491_baby_funny.png"}, {name = "Gamer Baby", description = "Constant Retro Vision pill effect", sprite = "492_baby_gamer.png"}, {name = "Glittery Peach Baby", description = "Teleports to the boss room after 6 hits", sprite = "493_baby_glitterypeach.png", numHits = 6}, {name = "Pompadour Baby", description = "Shrink tears", sprite = "494_baby_pompadour.png", mustHaveTears = true}, {name = "Head Kick Baby", description = "Starts with Kamikaze! + explosion immunity", sprite = "495_baby_headkick.png", item = CollectibleType.COLLECTIBLE_KAMIKAZE, explosionImmunity = true}, {name = "Horn Baby", description = "Starts with Dark Bum", sprite = "496_baby_horn.png", item = CollectibleType.COLLECTIBLE_DARK_BUM}, {name = "Ichor Baby", description = "Starts with 5x Lil Spewer", sprite = "497_baby_ichor.png", item = CollectibleType.COLLECTIBLE_LIL_SPEWER, itemNum = 5}, {name = "Ill Baby", description = "Bob's Brain tears", sprite = "498_baby_ill.png", mustHaveTears = true}, {name = "Lazy Baby", description = "Random card effect on hit", sprite = "499_baby_lazy.png"}, {name = "Mern Baby", description = "Double tears", sprite = "500_baby_mern.png", mustHaveTears = true}, {name = "Necro Baby", description = "Starts with Book of the Dead", sprite = "501_baby_necro.png", item = CollectibleType.COLLECTIBLE_BOOK_OF_THE_DEAD}, {name = "Peeping Baby", description = "Starts with 8x Bloodshot Eye", sprite = "502_baby_peeping.png", item = CollectibleType.COLLECTIBLE_BLOODSHOT_EYE, itemNum = 8}, {name = "Penance Baby", description = "Starts with 3x Sworn Protector", sprite = "503_baby_penance.png", item = CollectibleType.COLLECTIBLE_SWORN_PROTECTOR, itemNum = 3}, {name = "Psychic Baby", description = "Starts with Abel; tears come from Abel", sprite = "504_baby_psychic.png", item = CollectibleType.COLLECTIBLE_ABEL, mustHaveTears = true}, {name = "Puppet Baby", description = "Starts with 5x Key Bum", sprite = "505_baby_puppet.png", item = CollectibleType.COLLECTIBLE_KEY_BUM, itemNum = 5}, {name = "Reaper Baby", description = "Spawns a random rune on hit", sprite = "506_baby_reaper.png"}, {name = "Road Kill Baby", description = "Starts with Pointy Rib (improved) + blindfolded", sprite = "507_baby_roadkill.png", item = CollectibleType.COLLECTIBLE_POINTY_RIB, blindfolded = true}, {name = "Sausage Lover Baby", description = "Summons Monstro every 5 seconds", sprite = "508_baby_sausagelover.png"}, {name = "Scribble Baby", description = "Starts with Lead Pencil", sprite = "509_baby_scribble.png", item = CollectibleType.COLLECTIBLE_LEAD_PENCIL, mustHaveTears = true}, {name = "Star Plant Baby", description = "Starts with Dim Bulb", sprite = "510_baby_starplant.png", trinket = TrinketType.TRINKET_DIM_BULB}, {name = "Twitchy Baby", description = "Tear rate oscillates", sprite = "511_baby_twitchy.png", mustHaveTears = true, num = 60, min = -4, max = 4}, {name = "Witch Baby", description = "Starts with Crystal Ball (uncharged)", sprite = "512_baby_witch.png", item = CollectibleType.COLLECTIBLE_CRYSTAL_BALL, uncharged = true}, {name = "Workshop Baby", description = "Starts with Humbling Bundle", sprite = "513_baby_workshop.png", item = CollectibleType.COLLECTIBLE_HUMBLEING_BUNDLE}, {name = "Hooligan Baby", description = "Double enemies", sprite = "514_baby_hooligan.png"}, {name = "Half Spider Baby", description = "Starts with 3x Pretty Fly", sprite = "515_baby_halfspider.png", item = CollectibleType.COLLECTIBLE_HALO_OF_FLIES, itemNum = 2}, {name = "Silly Baby", description = "Constant I'm Excited pill effect", sprite = "516_baby_silly.png"}, {name = "Master Cook Baby", description = "Egg tears", sprite = "517_baby_mastercook.png", mustHaveTears = true}, {name = "Green Pepper Baby", description = "Starts with Serpent's Kiss", sprite = "518_baby_greenpepper.png", item = CollectibleType.COLLECTIBLE_SERPENTS_KISS, mustHaveTears = true}, {name = "Baggy Cap Baby", description = "Cannot bomb through rooms", sprite = "519_baby_baggycap.png", requireBombs = true}, {name = "Stylish Baby", description = "Starts with Store Credit", sprite = "520_baby_stylish.png", trinket = TrinketType.TRINKET_STORE_CREDIT}, {name = "Spider Baby", description = "Shoots a Blue Spider every 2nd tear", sprite = "000_baby_spider.png", mustHaveTears = true}, {name = "Brother Bobby", description = "Slings Godhead aura", sprite = "familiar_shooters_01_brotherbobby.png", item = CollectibleType.COLLECTIBLE_MOMS_KNIFE, mustHaveTears = true}, {name = "Sister Maggy", description = "Loses last item on 2nd hit (per room)", sprite = "familiar_shooters_07_sistermaggie.png"}, {name = "Robo-Baby", description = "Starts with Technology", sprite = "familiar_shooters_06_robobaby.png", item = CollectibleType.COLLECTIBLE_TECHNOLOGY}, {name = "Little Gish", description = "All items from the Curse Room pool", sprite = "familiar_shooters_04_littlegish.png"}, {name = "Little Steven", description = "Starts with Chaos", sprite = "familiar_shooters_05_littlesteve.png", item = CollectibleType.COLLECTIBLE_CHAOS}, {name = "Demon Baby", description = "Free devil deals", sprite = "familiar_shooters_02_demonbaby.png"}, {name = "Ghost Baby", description = "All items from the Shop pool", sprite = "familiar_shooters_09_ghostbaby.png"}, {name = "Harlequin Baby", description = "Starts with The Wiz", sprite = "familiar_shooters_10_harlequinbaby.png", item = CollectibleType.COLLECTIBLE_THE_WIZ, mustHaveTears = true}, {name = "Rainbow Baby", description = "Chest per enemy killed", sprite = "familiar_shooters_11_rainbowbaby.png"}, {name = "Abel", description = "Every 3rd missed tear causes paralysis", sprite = "familiar_shooters_08_abel.png", num = 3, mustHaveTears = true}, {name = "Robo-Baby 2.0", description = "Starts with Undefined (uncharged)", sprite = "familiar_shooters_267_robobaby20.png", item = CollectibleType.COLLECTIBLE_UNDEFINED, uncharged = true}, {name = "Rotten Baby", description = "Shoots Blue Flies + flight", sprite = "costume_268_rottenbaby.png", flight = true, mustHaveTears = true}, {name = "Lil Brimstone", description = "Starts with Brimstone", sprite = "costume_rebirth_77_lilbrimstone.png", item = CollectibleType.COLLECTIBLE_BRIMSTONE}, {name = "Mongo Baby", description = "All items from the Angel Room pool", sprite = "familiar_shooters_322_mongobaby.png"}, {name = "Incubus", description = "All items from the Devil Room pool", sprite = "familiar_shooters_80_incubus.png"}, {name = "Fate's Reward", description = "Items cost money", sprite = "familiar_shooters_81_fatesreward.png"}, {name = "Seraphim", description = "Censer aura", sprite = "familiars_shooters_92_seraphim.png", item = CollectibleType.COLLECTIBLE_CENSER}, {name = "Lil' Loki", description = "Cross tears", sprite = "familiar_097_shooters_lilloki.png", mustHaveTears = true}, {name = "Lil Monstro", description = "Starts with Monstro's Lung", sprite = "familiar_108_lilmonstro.png", item = CollectibleType.COLLECTIBLE_MONSTROS_LUNG}, {name = "Invisible Baby", description = "Invisibility", sprite = "n/a"}}
____exports.default = babies
return ____exports
end,
["types.GlobalsRunBabyExplosion"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
end,
["types.GlobalsRunBabyNPC"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
end,
["constants"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____enums_2Ecustom = require("types.enums.custom")
local CollectibleTypeCustom = ____enums_2Ecustom.CollectibleTypeCustom
____exports.VERSION = "1.1.0"
____exports.R7_SEASON_5 = "R+7 (Season 5)"
____exports.ZERO_VECTOR = Vector(0, 0)
____exports.DEFAULT_KCOLOR = KColor(1, 1, 1, 1)
____exports.TELEPORT_TO_ROOM_TYPE_MAP = __TS__New(Map, {{CollectibleTypeCustom.COLLECTIBLE_SHOP_TELEPORT, RoomType.ROOM_SHOP}, {CollectibleTypeCustom.COLLECTIBLE_TREASURE_ROOM_TELEPORT, RoomType.ROOM_TREASURE}, {CollectibleTypeCustom.COLLECTIBLE_MINIBOSS_ROOM_TELEPORT, RoomType.ROOM_MINIBOSS}, {CollectibleTypeCustom.COLLECTIBLE_ARCADE_TELEPORT, RoomType.ROOM_ARCADE}, {CollectibleTypeCustom.COLLECTIBLE_CURSE_ROOM_TELEPORT, RoomType.ROOM_CURSE}, {CollectibleTypeCustom.COLLECTIBLE_CHALLENGE_ROOM_TELEPORT, RoomType.ROOM_CHALLENGE}, {CollectibleTypeCustom.COLLECTIBLE_LIBRARY_TELEPORT, RoomType.ROOM_LIBRARY}, {CollectibleTypeCustom.COLLECTIBLE_SACRIFICE_ROOM_TELEPORT, RoomType.ROOM_SACRIFICE}, {CollectibleTypeCustom.COLLECTIBLE_BEDROOM_CLEAN_TELEPORT, RoomType.ROOM_ISAACS}, {CollectibleTypeCustom.COLLECTIBLE_BEDROOM_DIRTY_TELEPORT, RoomType.ROOM_BARREN}, {CollectibleTypeCustom.COLLECTIBLE_TREASURE_CHEST_ROOM_TELEPORT, RoomType.ROOM_CHEST}, {CollectibleTypeCustom.COLLECTIBLE_DICE_ROOM_TELEPORT, RoomType.ROOM_DICE}})
return ____exports
end,
["types.GlobalsRunBabyTears"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____constants = require("constants")
local ZERO_VECTOR = ____constants.ZERO_VECTOR
____exports.default = (function()
    ____exports.default = __TS__Class()
    local GlobalsRunBabyTears = ____exports.default
    GlobalsRunBabyTears.name = "GlobalsRunBabyTears"
    function GlobalsRunBabyTears.prototype.____constructor(self)
        self.numFired = 0
        self.frame = 0
        self.position = ZERO_VECTOR
        self.velocity = ZERO_VECTOR
        self.numLeftToFire = 0
    end
    return GlobalsRunBabyTears
end)()
return ____exports
end,
["types.PoopDescription"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
end,
["types.GlobalsRunLevel"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
____exports.default = (function()
    ____exports.default = __TS__Class()
    local GlobalsRunLevel = ____exports.default
    GlobalsRunLevel.name = "GlobalsRunLevel"
    function GlobalsRunLevel.prototype.____constructor(self, stage, stageType, stageFrame)
        self.roomsEntered = 0
        self.trinketGone = false
        self.blindfoldedApplied = false
        self.killedPoops = {}
        self.stage = stage
        self.stageType = stageType
        self.stageFrame = stageFrame
    end
    return GlobalsRunLevel
end)()
return ____exports
end,
["types.NPCDescription"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
end,
["types.TearDescription"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
end,
["types.GlobalsRunRoom"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
____exports.default = (function()
    ____exports.default = __TS__Class()
    local GlobalsRunRoom = ____exports.default
    GlobalsRunRoom.name = "GlobalsRunRoom"
    function GlobalsRunRoom.prototype.____constructor(self, roomIndex, clearState, roomSeed)
        self.index = 0
        self.lastRoomIndex = 0
        self.clearDelayFrame = 0
        self.RNG = 0
        self.pseudoClear = true
        self.doorsModified = {}
        self.buttonsPushed = false
        self.softlock = false
        self.tears = {}
        self.NPCs = {}
        self.lastRoomIndex = self.index
        self.index = roomIndex
        self.clearState = clearState
        self.RNG = roomSeed
    end
    return GlobalsRunRoom
end)()
return ____exports
end,
["types.GlobalsRun"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____GlobalsRunBabyTears = require("types.GlobalsRunBabyTears")
local GlobalsRunBabyTears = ____GlobalsRunBabyTears.default
local ____GlobalsRunLevel = require("types.GlobalsRunLevel")
local GlobalsRunLevel = ____GlobalsRunLevel.default
local ____GlobalsRunRoom = require("types.GlobalsRunRoom")
local GlobalsRunRoom = ____GlobalsRunRoom.default
____exports.default = (function()
    ____exports.default = __TS__Class()
    local GlobalsRun = ____exports.default
    GlobalsRun.name = "GlobalsRun"
    function GlobalsRun.prototype.____constructor(self, randomSeed)
        self.enabled = false
        self.babyType = 0
        self.drawIntro = false
        self.queuedItems = false
        self.passiveItems = {}
        self.animation = ""
        self.level = __TS__New(GlobalsRunLevel, 0, 0, 0)
        self.room = __TS__New(GlobalsRunRoom, 0, true, 0)
        self.reloadSprite = false
        self.showIntroFrame = 0
        self.showVersionFrame = 0
        self.invulnerable = false
        self.invulnerabilityFrame = 0
        self.dealingExtraDamage = false
        self.babyBool = false
        self.babyCounters = 0
        self.babyCountersRoom = 0
        self.babyFrame = 0
        self.babyTears = __TS__New(GlobalsRunBabyTears)
        self.babyNPC = {type = 0, variant = 0, subType = 0}
        self.babyExplosions = {}
        self.babySprite = nil
        self.clockworkAssembly = false
        self.randomSeed = randomSeed
    end
    return GlobalsRun
end)()
return ____exports
end,
["types.Globals"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____babies = require("babies")
local babies = ____babies.default
local ____GlobalsRun = require("types.GlobalsRun")
local GlobalsRun = ____GlobalsRun.default
____exports.default = (function()
    ____exports.default = __TS__Class()
    local Globals = ____exports.default
    Globals.name = "Globals"
    function Globals.prototype.____constructor(self)
        self.babiesMod = nil
        self.g = Game(nil)
        self.l = Game(nil):GetLevel()
        self.r = Game(nil):GetRoom()
        self.p = Isaac.GetPlayer(0)
        self.seeds = Game(nil):GetSeeds()
        self.itemPool = Game(nil):GetItemPool()
        self.itemConfig = Isaac.GetItemConfig()
        self.sfx = SFXManager(nil)
        self.font = Font()
        self.racingPlusEnabled = RacingPlusGlobals ~= nil
        self.babies = babies
        self.pastBabies = {}
        self.debugBabyNum = nil
        local randomSeed = self.l:GetDungeonPlacementSeed()
        self.font:Load("font/teammeatfont10.fnt")
        self.run = __TS__New(GlobalsRun, randomSeed)
    end
    return Globals
end)()
return ____exports
end,
["globals"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____Globals = require("types.Globals")
local Globals = ____Globals.default
local globals = __TS__New(Globals)
____exports.default = globals
SinglePlayerCoopBabies = globals
return ____exports
end,
["misc"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____constants = require("constants")
local ZERO_VECTOR = ____constants.ZERO_VECTOR
local ____globals = require("globals")
local g = ____globals.default
function ____exports.getItemConfig(self, itemID)
    if itemID <= 0 then
        error(
            "getItemConfig was passed an invalid item ID of: " .. tostring(itemID)
        )
    end
    return g.itemConfig:GetCollectible(itemID)
end
function ____exports.getItemMaxCharges(self, itemID)
    return ____exports.getItemConfig(nil, itemID).MaxCharges
end
function ____exports.incrementRNG(self, seed)
    local rng = RNG()
    rng:SetSeed(seed, 35)
    rng:Next()
    local newSeed = rng:GetSeed()
    return newSeed
end
function ____exports.addCharge(self, singleCharge)
    if singleCharge == nil then
        singleCharge = false
    end
    local roomShape = g.r:GetRoomShape()
    local activeItem = g.p:GetActiveItem()
    local activeCharge = g.p:GetActiveCharge()
    local batteryCharge = g.p:GetBatteryCharge()
    if not g.p:NeedsCharge() then
        return
    end
    local chargesToAdd = 1
    if roomShape >= 8 then
        chargesToAdd = 2
    elseif g.p:HasTrinket(TrinketType.TRINKET_AAA_BATTERY) and (activeCharge == (____exports.getItemMaxCharges(nil, activeItem) - 2)) then
        chargesToAdd = 2
    elseif ((g.p:HasTrinket(TrinketType.TRINKET_AAA_BATTERY) and (activeCharge == ____exports.getItemMaxCharges(nil, activeItem))) and g.p:HasCollectible(CollectibleType.COLLECTIBLE_BATTERY)) and (batteryCharge == (____exports.getItemMaxCharges(nil, activeItem) - 2)) then
        chargesToAdd = 2
    end
    if singleCharge then
        chargesToAdd = 1
    end
    local currentCharge = g.p:GetActiveCharge()
    g.p:SetActiveCharge(currentCharge + chargesToAdd)
end
function ____exports.getCurrentBaby(self)
    local babyType = g.run.babyType
    local baby = g.babies[babyType + 1]
    if baby == nil then
        error(
            ("Baby " .. tostring(babyType)) .. " not found."
        )
    end
    return {babyType, baby, babyType ~= 0}
end
function ____exports.getHeartXOffset(self)
    local curses = g.l:GetCurses()
    local maxHearts = g.p:GetMaxHearts()
    local soulHearts = g.p:GetSoulHearts()
    local boneHearts = g.p:GetBoneHearts()
    local extraLives = g.p:GetExtraLives()
    local heartLength = 12
    local combinedHearts = (maxHearts + soulHearts) + (boneHearts * 2)
    if combinedHearts > 12 then
        combinedHearts = 12
    end
    if curses == LevelCurse.CURSE_OF_THE_UNKNOWN then
        combinedHearts = 2
    end
    local offset = (combinedHearts / 2) * heartLength
    if extraLives > 9 then
        offset = offset + 20
        if g.p:HasCollectible(CollectibleType.COLLECTIBLE_GUPPYS_COLLAR) then
            offset = offset + 6
        end
    elseif extraLives > 0 then
        offset = offset + 16
        if g.p:HasCollectible(CollectibleType.COLLECTIBLE_GUPPYS_COLLAR) then
            offset = offset + 4
        end
    end
    return offset
end
function ____exports.getItemHeartPrice(self, itemID)
    local maxHearts = g.p:GetMaxHearts()
    if itemID == 0 then
        return 0
    end
    if maxHearts == 0 then
        return -3
    end
    return ____exports.getItemConfig(nil, itemID).DevilPrice * -1
end
function ____exports.getOffsetPosition(self, position, offsetSize, seed)
    math.randomseed(seed)
    local offsetDirection = math.random(1, 4)
    local offsetX
    local offsetY
    local ____switch24 = offsetDirection
    if ____switch24 == 1 then
        goto ____switch24_case_0
    elseif ____switch24 == 2 then
        goto ____switch24_case_1
    elseif ____switch24 == 3 then
        goto ____switch24_case_2
    elseif ____switch24 == 4 then
        goto ____switch24_case_3
    end
    goto ____switch24_case_default
    ::____switch24_case_0::
    do
        do
            offsetX = offsetSize
            offsetY = offsetSize
            goto ____switch24_end
        end
    end
    ::____switch24_case_1::
    do
        do
            offsetX = offsetSize
            offsetY = offsetSize * -1
            goto ____switch24_end
        end
    end
    ::____switch24_case_2::
    do
        do
            offsetX = offsetSize * -1
            offsetY = offsetSize
            goto ____switch24_end
        end
    end
    ::____switch24_case_3::
    do
        do
            offsetX = offsetSize * -1
            offsetY = offsetSize * -1
            goto ____switch24_end
        end
    end
    ::____switch24_case_default::
    do
        do
            error(
                "The offset direction was an unknown value of: " .. tostring(offsetDirection)
            )
        end
    end
    ::____switch24_end::
    return Vector(position.X + offsetX, position.Y + offsetY)
end
function ____exports.getRandomItemFromPool(self, itemPoolType)
    g.run.room.RNG = ____exports.incrementRNG(nil, g.run.room.RNG)
    g.run.babyBool = true
    local item = g.itemPool:GetCollectible(itemPoolType, true, g.run.room.RNG)
    g.run.babyBool = false
    return item
end
function ____exports.getRoomIndex(self)
    local roomIndex = g.l:GetCurrentRoomDesc().SafeGridIndex
    if roomIndex < 0 then
        return g.l:GetCurrentRoomIndex()
    end
    return roomIndex
end
function ____exports.gridToPos(self, x, y)
    x = x + 1
    y = y + 1
    return g.r:GetGridPosition(
        (y * g.r:GetGridWidth()) + x
    )
end
function ____exports.isButtonPressed(self, buttonAction)
    do
        local i = 0
        while i <= 3 do
            if Input.IsActionPressed(buttonAction, i) then
                return true
            end
            i = i + 1
        end
    end
    return false
end
function ____exports.round(self, num, numDecimalPlaces)
    local mult = 10 ~ (numDecimalPlaces or 0)
    return math.floor((num * mult) + 0.5) / mult
end
function ____exports.setRandomColor(self, entity)
    local colorValues = {}
    local seed = entity.InitSeed
    do
        local i = 0
        while i < 3 do
            seed = ____exports.incrementRNG(nil, seed)
            math.randomseed(seed)
            local colorValue = math.random(0, 200)
            colorValue = colorValue / 100
            __TS__ArrayPush(colorValues, colorValue)
            i = i + 1
        end
    end
    local color = Color(colorValues[1], colorValues[2], colorValues[3], 1, 1, 1, 1)
    entity:SetColor(color, 10000, 10000, false, false)
end
function ____exports.spawnRandomPickup(self, position, velocity, noItems)
    if velocity == nil then
        velocity = ZERO_VECTOR
    end
    if noItems == nil then
        noItems = false
    end
    g.run.randomSeed = ____exports.incrementRNG(nil, g.run.randomSeed)
    math.randomseed(g.run.randomSeed)
    local pickupVariant
    if noItems then
        pickupVariant = math.random(1, 9)
    else
        pickupVariant = math.random(1, 11)
    end
    g.run.randomSeed = ____exports.incrementRNG(nil, g.run.randomSeed)
    local ____switch44 = pickupVariant
    if ____switch44 == 1 then
        goto ____switch44_case_0
    elseif ____switch44 == 2 then
        goto ____switch44_case_1
    elseif ____switch44 == 3 then
        goto ____switch44_case_2
    elseif ____switch44 == 4 then
        goto ____switch44_case_3
    elseif ____switch44 == 5 then
        goto ____switch44_case_4
    elseif ____switch44 == 6 then
        goto ____switch44_case_5
    elseif ____switch44 == 7 then
        goto ____switch44_case_6
    elseif ____switch44 == 8 then
        goto ____switch44_case_7
    elseif ____switch44 == 9 then
        goto ____switch44_case_8
    elseif ____switch44 == 10 then
        goto ____switch44_case_9
    elseif ____switch44 == 11 then
        goto ____switch44_case_10
    end
    goto ____switch44_case_default
    ::____switch44_case_0::
    do
        do
            g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_HEART, position, velocity, nil, 0, g.run.randomSeed)
            goto ____switch44_end
        end
    end
    ::____switch44_case_1::
    do
        do
            g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COIN, position, velocity, nil, 0, g.run.randomSeed)
            goto ____switch44_end
        end
    end
    ::____switch44_case_2::
    do
        do
            g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_KEY, position, velocity, nil, 0, g.run.randomSeed)
            goto ____switch44_end
        end
    end
    ::____switch44_case_3::
    do
        do
            g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BOMB, position, velocity, nil, 0, g.run.randomSeed)
            goto ____switch44_end
        end
    end
    ::____switch44_case_4::
    do
        do
            g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_CHEST, position, velocity, nil, 0, g.run.randomSeed)
            goto ____switch44_end
        end
    end
    ::____switch44_case_5::
    do
        do
            g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_GRAB_BAG, position, velocity, nil, 0, g.run.randomSeed)
            goto ____switch44_end
        end
    end
    ::____switch44_case_6::
    do
        do
            g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_LIL_BATTERY, position, velocity, nil, 0, g.run.randomSeed)
            goto ____switch44_end
        end
    end
    ::____switch44_case_7::
    do
        do
            g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_PILL, position, velocity, nil, 0, g.run.randomSeed)
            goto ____switch44_end
        end
    end
    ::____switch44_case_8::
    do
        do
            g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TAROTCARD, position, velocity, nil, 0, g.run.randomSeed)
            goto ____switch44_end
        end
    end
    ::____switch44_case_9::
    do
        do
            g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TRINKET, position, velocity, nil, 0, g.run.randomSeed)
            goto ____switch44_end
        end
    end
    ::____switch44_case_10::
    do
        do
            g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, position, velocity, nil, 0, g.run.randomSeed)
            goto ____switch44_end
        end
    end
    ::____switch44_case_default::
    do
        do
            error(
                "The pickup variant was an unknown value of: " .. tostring(pickupVariant)
            )
        end
    end
    ::____switch44_end::
end
return ____exports
end,
["babyAddFunctions"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    15,
    function()
        g.p:AddGoldenBomb()
        g.p:AddGoldenKey()
        g.p:AddGoldenHearts(12)
    end
)
functionMap:set(
    31,
    function()
        g.p:AddBombs(99)
    end
)
functionMap:set(
    39,
    function()
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.time == nil then
            error(("The \"time\" attribute was not defined for " .. baby.name) .. ".")
        end
        g.run.babyCounters = g.g:GetFrameCount() + baby.time
    end
)
functionMap:set(
    40,
    function()
        g.p:AddBlueFlies(64, g.p.Position, nil)
        do
            local i = 0
            while i < 64 do
                g.p:AddBlueSpider(g.p.Position)
                i = i + 1
            end
        end
    end
)
functionMap:set(
    43,
    function()
        g.run.babyExplosions = {}
    end
)
functionMap:set(
    48,
    function()
        g.run.babySprite = Sprite()
        g.run.babySprite:Load("gfx/misc/black.anm2", true)
        g.run.babySprite:SetFrame("Default", 0)
    end
)
functionMap:set(
    125,
    function()
        g.p:AddKeys(2)
        g.run.babySprite = Sprite()
        g.run.babySprite:Load("gfx/custom-health/key.anm2", true)
        g.run.babySprite:SetFrame("Default", 0)
    end
)
functionMap:set(
    138,
    function()
        g.p:AddBombs(2)
        g.run.babySprite = Sprite()
        g.run.babySprite:Load("gfx/custom-health/bomb.anm2", true)
        g.run.babySprite:SetFrame("Default", 0)
    end
)
functionMap:set(
    177,
    function()
        g.p:AddCoins(2)
    end
)
functionMap:set(
    281,
    function()
        g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE)
        g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS)
        g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG)
        g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_TECH_X)
    end
)
functionMap:set(
    341,
    function()
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.time == nil then
            error(("The \"time\" attribute was not defined for " .. baby.name) .. ".")
        end
        g.run.babyCounters = g.g:GetFrameCount() + baby.time
    end
)
functionMap:set(
    343,
    function()
        Isaac.ExecuteCommand("debug 7")
    end
)
functionMap:set(
    350,
    function()
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        g.run.babyFrame = g.g:GetFrameCount() + baby.num
    end
)
functionMap:set(
    375,
    function()
        g.p:AddCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE, 0, false)
        Isaac.DebugString(
            "Removing collectible " .. tostring(CollectibleType.COLLECTIBLE_FLAT_STONE)
        )
    end
)
functionMap:set(
    386,
    function()
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        g.run.babyCounters = ButtonAction.ACTION_SHOOTLEFT
        g.run.babyFrame = g.g:GetFrameCount() + baby.num
    end
)
functionMap:set(
    393,
    function()
        g.p:AddCollectible(CollectibleType.COLLECTIBLE_KEY_BUM, 0, false)
    end
)
functionMap:set(
    407,
    function()
        g.p:AddCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE, 0, false)
        Isaac.DebugString(
            "Removing collectible " .. tostring(CollectibleType.COLLECTIBLE_FLAT_STONE)
        )
    end
)
functionMap:set(
    424,
    function()
        g.p:AddCoins(99)
    end
)
functionMap:set(
    511,
    function()
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.max == nil then
            error(("The \"max\" attribute was not defined for " .. baby.name) .. ".")
        end
        g.run.babyCounters = baby.max
        g.run.babyFrame = g.g:GetFrameCount()
    end
)
return ____exports
end,
["babyAdd"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____babyAddFunctions = require("babyAddFunctions")
local babyAddFunctions = ____babyAddFunctions.default
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local ____enums_2Ecustom = require("types.enums.custom")
local CollectibleTypeCustom = ____enums_2Ecustom.CollectibleTypeCustom
function ____exports.default(self)
    local stage = g.l:GetStage()
    local soulHearts = g.p:GetSoulHearts()
    local blackHearts = g.p:GetBlackHearts()
    local coins = g.p:GetNumCoins()
    local bombs = g.p:GetNumBombs()
    local keys = g.p:GetNumKeys()
    local babyType, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    g.run.drawIntro = true
    if g.babiesMod ~= nil then
        Isaac.SaveModData(g.babiesMod, baby.description)
    end
    if baby.item ~= nil then
        if misc:getItemConfig(baby.item).Type == ItemType.ITEM_ACTIVE then
            local charges = misc:getItemMaxCharges(baby.item)
            if baby.uncharged ~= nil then
                charges = 0
            end
            if (g.racingPlusEnabled and g.p:HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM)) and (RacingPlusGlobals.run.schoolbag.item == 0) then
                RacingPlusSchoolbag:Put(baby.item, charges)
            elseif g.p:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG) and (g.p.SecondaryActiveItem.Item == 0) then
                g.p:AddCollectible(baby.item, charges, false)
                g.p:SwapActiveItems()
            else
                g.p:AddCollectible(baby.item, charges, false)
            end
        else
            g.p:AddCollectible(baby.item, 0, false)
            Isaac.DebugString(
                ("Added the new baby passive item (" .. tostring(baby.item)) .. ")."
            )
        end
        Isaac.DebugString(
            "Removing collectible " .. tostring(baby.item)
        )
        g.itemPool:RemoveCollectible(baby.item)
    end
    if (baby.item ~= nil) and (baby.itemNum ~= nil) then
        do
            local i = 2
            while i <= baby.itemNum do
                g.p:AddCollectible(baby.item, 0, false)
                Isaac.DebugString(
                    "Removing collectible " .. tostring(baby.item)
                )
                i = i + 1
            end
        end
    end
    if baby.item2 ~= nil then
        g.p:AddCollectible(baby.item2, 0, false)
        Isaac.DebugString(
            "Removing collectible " .. tostring(baby.item2)
        )
        g.itemPool:RemoveCollectible(baby.item2)
    end
    local newSoulHearts = g.p:GetSoulHearts()
    local newBlackHearts = g.p:GetBlackHearts()
    if (newSoulHearts ~= soulHearts) or (newBlackHearts ~= blackHearts) then
        g.p:AddSoulHearts(-24)
        do
            local i = 1
            while i <= soulHearts do
                local bitPosition = math.floor((i - 1) / 2)
                local bit = (blackHearts & (1 << bitPosition)) >> bitPosition
                if bit == 0 then
                    g.p:AddSoulHearts(1)
                else
                    g.p:AddBlackHearts(1)
                end
                i = i + 1
            end
        end
    end
    g.p:AddCoins(-99)
    g.p:AddCoins(coins)
    g.p:AddBombs(-99)
    g.p:AddBombs(bombs)
    g.p:AddKeys(-99)
    g.p:AddKeys(keys)
    if baby.trinket ~= nil then
        g.p:AddTrinket(baby.trinket)
        g.itemPool:RemoveTrinket(baby.trinket)
    end
    if baby.seed ~= nil then
        g.seeds:AddSeedEffect(baby.seed)
    end
    if (baby.item == CollectibleType.COLLECTIBLE_PHD) or (baby.item2 == CollectibleType.COLLECTIBLE_PHD) then
        local pills = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_PILL, -1, false, false)
        for ____, pill in ipairs(pills) do
            pill:Remove()
        end
    end
    if (baby.item == CollectibleType.COLLECTIBLE_STARTER_DECK) or (baby.item2 == CollectibleType.COLLECTIBLE_STARTER_DECK) then
        local cards = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TAROTCARD, -1, false, false)
        for ____, card in ipairs(cards) do
            card:Remove()
        end
    end
    if (baby.item == CollectibleType.COLLECTIBLE_LITTLE_BAGGY) or (baby.item2 == CollectibleType.COLLECTIBLE_LITTLE_BAGGY) then
        local pills = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_PILL, -1, false, false)
        for ____, pill in ipairs(pills) do
            pill:Remove()
        end
    end
    if ((baby.item == CollectibleType.COLLECTIBLE_CHAOS) or (baby.item2 == CollectibleType.COLLECTIBLE_CHAOS)) and (stage ~= 11) then
        local pickups = Isaac.FindByType(EntityType.ENTITY_PICKUP, -1, -1, false, false)
        for ____, pickup in ipairs(pickups) do
            if pickup.Variant ~= PickupVariant.PICKUP_COLLECTIBLE then
                pickup:Remove()
            end
        end
    end
    if (baby.item == CollectibleType.COLLECTIBLE_SACK_HEAD) or (baby.item2 == CollectibleType.COLLECTIBLE_SACK_HEAD) then
        local sacks = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_GRAB_BAG, -1, false, false)
        for ____, sack in ipairs(sacks) do
            sack:Remove()
        end
    end
    if (baby.item == CollectibleType.COLLECTIBLE_LIL_SPEWER) or (baby.item2 == CollectibleType.COLLECTIBLE_LIL_SPEWER) then
        local pills = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_PILL, -1, false, false)
        for ____, pill in ipairs(pills) do
            pill:Remove()
        end
    end
    local babyFunc = babyAddFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil)
    end
    g.p:AddCacheFlags(CacheFlag.CACHE_ALL)
    g.p:EvaluateItems()
    g.p.SpriteScale = Vector(1, 1)
    Isaac.DebugString(
        (("Applied baby: " .. tostring(babyType)) .. " - ") .. baby.name
    )
end
return ____exports
end,
["babyCheckValid"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local ____enums_2Ecustom = require("types.enums.custom")
local CollectibleTypeCustom = ____enums_2Ecustom.CollectibleTypeCustom
local checkActiveItem, checkHealth, checkInventory, checkItem, checkLevel
function checkActiveItem(self, baby)
    local activeItem = g.p:GetActiveItem()
    if ((baby.item ~= nil) and (misc:getItemConfig(baby.item).Type == ItemType.ITEM_ACTIVE)) and (activeItem ~= 0) then
        local hasRacingPlusSchoolbag = g.racingPlusEnabled and g.p:HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM)
        local hasVanillaSchoolbag = (not g.racingPlusEnabled) and g.p:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG)
        if (not hasRacingPlusSchoolbag) and (not hasVanillaSchoolbag) then
            return false
        end
        local hasItemInRacingPlusSchoolbag = hasRacingPlusSchoolbag and (RacingPlusGlobals.run.schoolbag.item ~= 0)
        local hasItemInVanillaSchoolbag = hasVanillaSchoolbag and (g.p.SecondaryActiveItem.Item ~= 0)
        if hasItemInRacingPlusSchoolbag or hasItemInVanillaSchoolbag then
            return false
        end
    end
    return true
end
function checkHealth(self, baby)
    local maxHearts = g.p:GetMaxHearts()
    local soulHearts = g.p:GetSoulHearts()
    local boneHearts = g.p:GetBoneHearts()
    local totalHealth = (maxHearts + soulHearts) + boneHearts
    if (baby.numHits ~= nil) and (totalHealth < baby.numHits) then
        return false
    end
    if (baby.item == CollectibleType.COLLECTIBLE_POTATO_PEELER) and (maxHearts == 0) then
        return false
    end
    if ((baby.item == CollectibleTypeCustom.COLLECTIBLE_SOUL_JAR) or (baby.item2 == CollectibleTypeCustom.COLLECTIBLE_SOUL_JAR)) and (maxHearts == 0) then
        return false
    end
    if (baby.name == "MeatBoy Baby") and (maxHearts == 0) then
        return false
    end
    return true
end
function checkInventory(self, baby)
    local coins = g.p:GetNumCoins()
    local bombs = g.p:GetNumBombs()
    local keys = g.p:GetNumKeys()
    if (baby.requireCoins == true) and (coins == 0) then
        return false
    end
    if (baby.name == "Fancy Baby") and (coins < 10) then
        return false
    end
    if (baby.name == "Fate's Reward") and (coins < 15) then
        return false
    end
    if ((baby.item == CollectibleType.COLLECTIBLE_DOLLAR) or (baby.item2 == CollectibleType.COLLECTIBLE_DOLLAR)) and (coins >= 50) then
        return false
    end
    if baby.requireBombs and (bombs == 0) then
        return false
    end
    if (baby.name == "Rage Baby") and (bombs >= 50) then
        return false
    end
    if baby.requireKeys and (keys == 0) then
        return false
    end
    return true
end
function checkItem(self, baby)
    if baby.blindfolded and ((g.p:HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECH_5)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_LIBRA)) then
        return false
    end
    if ((baby.mustHaveTears or (baby.item == CollectibleType.COLLECTIBLE_SOY_MILK)) or (baby.item2 == CollectibleType.COLLECTIBLE_SOY_MILK)) and (((((g.p:HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X)) then
        return false
    end
    if (baby.item == CollectibleType.COLLECTIBLE_ISAACS_TEARS) and g.p:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) then
        return false
    end
    if ((((((baby.item == CollectibleType.COLLECTIBLE_COMPASS) or (baby.item2 == CollectibleType.COLLECTIBLE_COMPASS)) or (baby.item == CollectibleType.COLLECTIBLE_TREASURE_MAP)) or (baby.item2 == CollectibleType.COLLECTIBLE_TREASURE_MAP)) or (baby.item == CollectibleType.COLLECTIBLE_BLUE_MAP)) or (baby.item2 == CollectibleType.COLLECTIBLE_BLUE_MAP)) and g.p:HasCollectible(CollectibleType.COLLECTIBLE_MIND) then
        return false
    end
    if ((baby.item == CollectibleType.COLLECTIBLE_TECH_X) or (baby.item2 == CollectibleType.COLLECTIBLE_TECH_X)) and g.p:HasCollectible(CollectibleType.COLLECTIBLE_DEAD_EYE) then
        return false
    end
    if ((baby.item == CollectibleType.COLLECTIBLE_DEAD_EYE) or (baby.item2 == CollectibleType.COLLECTIBLE_DEAD_EYE)) and g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) then
        return false
    end
    if (baby.name == "Whore Baby") and g.p:HasCollectible(CollectibleType.COLLECTIBLE_SACRIFICIAL_DAGGER) then
        return false
    end
    if (baby.name == "Belial Baby") and ((g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MEGA_SATANS_BREATH)) or (RacingPlusGlobals.run.schoolbag.item == CollectibleType.COLLECTIBLE_MEGA_SATANS_BREATH)) then
        return false
    end
    if (baby.name == "Goat Baby") and (g.p:HasCollectible(CollectibleType.COLLECTIBLE_GOAT_HEAD) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_DUALITY)) then
        return false
    end
    if (baby.name == "Aether Baby") and g.p:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) then
        return false
    end
    if (baby.name == "Masked Baby") and ((((g.p:HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MAW_OF_VOID)) then
        return false
    end
    if (baby.name == "Earwig Baby") and ((g.p:HasCollectible(CollectibleType.COLLECTIBLE_COMPASS) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_TREASURE_MAP)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MIND)) then
        return false
    end
    if (baby.name == "Sloppy Baby") and (((((g.p:HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_20_20)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_THE_WIZ)) or g.p:HasPlayerForm(7)) or g.p:HasPlayerForm(10)) then
        return false
    end
    if (baby.name == "Blindfold Baby") and (g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY_2) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG)) then
        return false
    end
    if (baby.name == "Bawl Baby") and g.p:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) then
        return false
    end
    if (baby.name == "Tabby Baby") and g.p:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) then
        return false
    end
    if (baby.name == "Red Demon Baby") and (g.p:HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X)) then
        return false
    end
    if (baby.name == "Fang Demon Baby") and (((g.p:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X)) then
        return false
    end
    if (baby.name == "Lantern Baby") and g.p:HasCollectible(CollectibleType.COLLECTIBLE_TRISAGION) then
        return false
    end
    if (baby.name == "Cupcake Baby") and g.p:HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) then
        return false
    end
    if (baby.name == "Slicer Baby") and g.p:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) then
        return false
    end
    if (baby.name == "Mushroom Girl Baby") and g.p:HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS) then
        return false
    end
    if (baby.name == "Blue Ghost Baby") and g.p:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) then
        return false
    end
    if (baby.name == "Yellow Princess Baby") and g.p:HasCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) then
        return false
    end
    if (baby.name == "Dino Baby") and g.p:HasCollectible(CollectibleType.COLLECTIBLE_BOBS_BRAIN) then
        return false
    end
    if (baby.name == "Imp Baby") and g.p:HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) then
        return false
    end
    if (baby.name == "Dark Space Soldier Baby") and g.p:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) then
        return false
    end
    if (baby.name == "Blurred Baby") and (g.p:HasCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_INCUBUS)) then
        return false
    end
    if (baby.name == "Rojen Whitefox Baby") and g.p:HasCollectible(CollectibleType.COLLECTIBLE_POLAROID) then
        return false
    end
    if ((baby.name == "Cursed Pillow Baby") or (baby.name == "Abel")) and (((((((((((((((((g.p:HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_CUPIDS_ARROW)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_EYE)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_LOKIS_HORNS)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_POLYPHEMUS)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_DEATHS_TOUCH)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_20_20)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_SAGITTARIUS)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_DEAD_ONION)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_EYE_OF_BELIAL)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_LITTLE_HORN)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_TRISAGION)) or g.p:HasCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE)) or g.p:HasPlayerForm(7)) or g.p:HasPlayerForm(10)) then
        return false
    end
    return true
end
function checkLevel(self, baby)
    local stage = g.l:GetStage()
    local stageType = g.l:GetStageType()
    if baby.noEndFloors and (stage >= 9) then
        return false
    end
    if ((baby.item == CollectibleType.COLLECTIBLE_STEAM_SALE) or (baby.item2 == CollectibleType.COLLECTIBLE_STEAM_SALE)) and (stage >= 7) then
        return false
    end
    if (baby.item == CollectibleType.COLLECTIBLE_WE_NEED_GO_DEEPER) and ((stage <= 2) or (stage >= 8)) then
        return false
    end
    if ((baby.item == CollectibleType.COLLECTIBLE_SCAPULAR) or (baby.item2 == CollectibleType.COLLECTIBLE_SCAPULAR)) and (stage >= 7) then
        return false
    end
    if (baby.item == CollectibleType.COLLECTIBLE_CRYSTAL_BALL) and (stage <= 2) then
        return false
    end
    if (baby.item == CollectibleType.COLLECTIBLE_UNDEFINED) and (stage <= 2) then
        return false
    end
    if ((((((baby.item == CollectibleType.COLLECTIBLE_GOAT_HEAD) or (baby.item2 == CollectibleType.COLLECTIBLE_GOAT_HEAD)) or (baby.item == CollectibleType.COLLECTIBLE_DUALITY)) or (baby.item2 == CollectibleType.COLLECTIBLE_DUALITY)) or (baby.item == CollectibleType.COLLECTIBLE_EUCHARIST)) or (baby.item2 == CollectibleType.COLLECTIBLE_EUCHARIST)) and ((stage == 1) or (stage >= 9)) then
        return false
    end
    if ((baby.item == CollectibleType.COLLECTIBLE_THERES_OPTIONS) or (baby.item2 == CollectibleType.COLLECTIBLE_THERES_OPTIONS)) and ((stage == 6) or (stage >= 8)) then
        return false
    end
    if ((baby.item == CollectibleType.COLLECTIBLE_MORE_OPTIONS) or (baby.item2 == CollectibleType.COLLECTIBLE_MORE_OPTIONS)) and ((stage == 1) or (stage >= 7)) then
        return false
    end
    if (baby.name == "Shadow Baby") and ((stage == 1) or (stage >= 8)) then
        return false
    end
    if (baby.name == "Goat Baby") and ((stage <= 2) or (stage >= 9)) then
        return false
    end
    if (baby.name == "Bomb Baby") and (stage == 10) then
        return false
    end
    if (baby.name == "Earwig Baby") and (stage == 1) then
        return false
    end
    if (baby.name == "Tears Baby") and (stage == 2) then
        return false
    end
    if (baby.name == "Twin Baby") and (stage == 8) then
        return false
    end
    if (baby.name == "Chompers Baby") and (stage == 11) then
        return false
    end
    if (baby.name == "Ate Poop Baby") and (stage == 11) then
        return false
    end
    if (baby.name == "Shopkeeper Baby") and (stage >= 7) then
        return false
    end
    if ((baby.name == "Gem Baby") and (stage >= 7)) and (not g.p:HasCollectible(CollectibleType.COLLECTIBLE_MONEY_IS_POWER)) then
        return false
    end
    if (baby.name == "Monk Baby") and ((stage == 6) or (stage == 8)) then
        return false
    end
    if (baby.name == "Puzzle Baby") and (stage == 10) then
        return false
    end
    if (baby.name == "Scary Baby") and (stage == 6) then
        return false
    end
    if (baby.name == "Red Wrestler Baby") and (stage == 11) then
        return false
    end
    if (baby.name == "Rich Baby") and (stage >= 7) then
        return false
    end
    if (baby.name == "Folder Baby") and ((stage == 1) or (stage == 10)) then
        return false
    end
    if ((baby.name == "Hooligan Baby") and (stage == 10)) and (stageType == 0) then
        return false
    end
    if (baby.name == "Baggy Cap Baby") and (stage == 11) then
        return false
    end
    if (baby.name == "Demon Baby") and ((stage == 1) or (stage >= 9)) then
        return false
    end
    if (baby.name == "Ghost Baby") and (stage == 2) then
        return false
    end
    if (baby.name == "Fate's Reward") and (((stage <= 2) or (stage == 6)) or (stage >= 10)) then
        return false
    end
    return true
end
function ____exports.default(self, babyType)
    local baby = g.babies[babyType + 1]
    if baby == nil then
        error(
            ("Baby " .. tostring(babyType)) .. " not found."
        )
    end
    if __TS__ArrayIncludes(g.pastBabies, babyType) then
        return false
    end
    if (baby.requiresRacingPlus ~= nil) and (not g.racingPlusEnabled) then
        return false
    end
    if (baby.item ~= nil) and g.p:HasCollectible(baby.item) then
        return false
    end
    if (baby.item2 ~= nil) and g.p:HasCollectible(baby.item2) then
        return false
    end
    if not checkActiveItem(nil, baby) then
        return false
    end
    if (baby.trinket ~= nil) and (g.p:GetTrinket(0) ~= 0) then
        return false
    end
    if not checkHealth(nil, baby) then
        return false
    end
    if not checkInventory(nil, baby) then
        return false
    end
    if not checkItem(nil, baby) then
        return false
    end
    if (baby.name == "Spike Baby") and g.p:HasTrinket(TrinketType.TRINKET_LEFT_HAND) then
        return false
    end
    if not checkLevel(nil, baby) then
        return false
    end
    return true
end
return ____exports
end,
["babyRemoveFunctions"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____enums_2Ecustom = require("types.enums.custom")
local CollectibleTypeCustom = ____enums_2Ecustom.CollectibleTypeCustom
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    40,
    function()
        for ____, entity in ipairs(
            Isaac.GetRoomEntities()
        ) do
            if (entity.Type == EntityType.ENTITY_FAMILIAR) and ((entity.Variant == FamiliarVariant.BLUE_FLY) or (entity.Variant == FamiliarVariant.BLUE_SPIDER)) then
                entity:Remove()
            end
        end
    end
)
functionMap:set(
    61,
    function()
        for ____, entity in ipairs(
            Isaac.GetRoomEntities()
        ) do
            if entity:HasEntityFlags(EntityFlag.FLAG_FRIENDLY) then
                entity:Remove()
            end
        end
    end
)
functionMap:set(
    62,
    function()
        g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_GOAT_HEAD)
        g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_DUALITY)
    end
)
functionMap:set(
    157,
    function()
        for ____, entity in ipairs(
            Isaac.GetRoomEntities()
        ) do
            if entity:HasEntityFlags(EntityFlag.FLAG_FRIENDLY) then
                entity:Remove()
            end
        end
    end
)
functionMap:set(
    162,
    function()
        g.seeds:RemoveSeedEffect(SeedEffect.SEED_OLD_TV)
    end
)
functionMap:set(
    163,
    function()
        local color = g.p:GetColor()
        local newColor = Color(color.R, color.G, color.B, 1, color.RO, color.GO, color.BO)
        g.p:SetColor(newColor, 0, 0, true, true)
    end
)
functionMap:set(
    187,
    function()
        for ____, entity in ipairs(
            Isaac.GetRoomEntities()
        ) do
            if (entity.Type == EntityType.ENTITY_FAMILIAR) and (entity.Variant == FamiliarVariant.BLUE_FLY) then
                entity:Remove()
            end
        end
    end
)
functionMap:set(
    219,
    function()
        if (g.p:GetActiveItem() ~= 0) and (g.p:GetBatteryCharge() > 0) then
            g.p:DischargeActiveItem()
            g.p:FullCharge()
            g.sfx:Stop(SoundEffect.SOUND_BATTERYCHARGE)
        end
        if ((g.racingPlusEnabled and g.p:HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM)) and (RacingPlusGlobals.run.schoolbag.item ~= 0)) and (RacingPlusGlobals.run.schoolbag.chargeBattery ~= 0) then
            RacingPlusGlobals.run.schoolbag.chargeBattery = 0
        end
    end
)
functionMap:set(
    332,
    function()
        g.p.GridCollisionClass = EntityGridCollisionClass.GRIDCOLL_GROUND
    end
)
functionMap:set(
    343,
    function()
        Isaac.ExecuteCommand("debug 7")
    end
)
functionMap:set(
    375,
    function()
        g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE)
    end
)
functionMap:set(
    376,
    function()
        local brains = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.BOBS_BRAIN, -1, false, false)
        for ____, brain in ipairs(brains) do
            brain:Remove()
        end
    end
)
functionMap:set(
    393,
    function()
        g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_KEY_BUM)
    end
)
functionMap:set(
    407,
    function()
        g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE)
    end
)
functionMap:set(
    515,
    function()
        g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_HALO_OF_FLIES)
    end
)
functionMap:set(
    521,
    function()
        for ____, entity in ipairs(
            Isaac.GetRoomEntities()
        ) do
            if (entity.Type == EntityType.ENTITY_FAMILIAR) and (entity.Variant == FamiliarVariant.BLUE_SPIDER) then
                entity:Remove()
            end
        end
    end
)
functionMap:set(
    533,
    function()
        for ____, entity in ipairs(
            Isaac.GetRoomEntities()
        ) do
            if (entity.Type == EntityType.ENTITY_FAMILIAR) and (entity.Variant == FamiliarVariant.BLUE_FLY) then
                entity:Remove()
            end
        end
    end
)
return ____exports
end,
["babyRemove"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____babyRemoveFunctions = require("babyRemoveFunctions")
local babyRemoveFunctions = ____babyRemoveFunctions.default
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local ____enums_2Ecustom = require("types.enums.custom")
local CollectibleTypeCustom = ____enums_2Ecustom.CollectibleTypeCustom
function ____exports.default(self)
    local babyType, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    if baby.item ~= nil then
        g.p:RemoveCollectible(baby.item)
        if (g.racingPlusEnabled and g.p:HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM)) and (RacingPlusGlobals.run.schoolbag.item == baby.item) then
            RacingPlusSchoolbag:Remove()
        end
    end
    if baby.item2 ~= nil then
        g.p:RemoveCollectible(baby.item2)
        if (g.racingPlusEnabled and g.p:HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM)) and (RacingPlusGlobals.run.schoolbag.item == baby.item2) then
            RacingPlusSchoolbag:Remove()
        end
    end
    if (baby.item ~= nil) and (baby.itemNum ~= nil) then
        do
            local i = 1
            while i <= baby.itemNum do
                g.p:RemoveCollectible(baby.item)
                i = i + 1
            end
        end
    end
    if baby.trinket ~= nil then
        g.p:TryRemoveTrinket(baby.trinket)
    end
    if baby.item == CollectibleType.COLLECTIBLE_DEAD_EYE then
        do
            local i = 0
            while i < 100 do
                g.p:ClearDeadEyeCharge()
                i = i + 1
            end
        end
    end
    if baby.seed ~= nil then
        g.seeds:RemoveSeedEffect(baby.seed)
    end
    local babyFunc = babyRemoveFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil)
    end
end
return ____exports
end,
["debug"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
function ____exports.main(self)
end
return ____exports
end,
["isaacScriptInit"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local overwriteError, isaacScriptError
function overwriteError(self)
    if ___LUA_ERROR_BACKUP == nil then
        ___LUA_ERROR_BACKUP = error
    end
    error = isaacScriptError
end
function isaacScriptError(err, _level)
    local msg
    if (err == nil) or (err == "") then
        msg = "Lua error (with a blank error message)"
    else
        msg = "Lua error: " .. err
    end
    Isaac.DebugString(msg)
    Isaac.ConsoleOutput(msg)
    if debug ~= nil then
        local tracebackLines = __TS__StringSplit(
            debug.traceback(),
            "\n"
        )
        do
            local i = 0
            while i < #tracebackLines do
                do
                    if (i == 0) or (i == 1) then
                        goto __continue9
                    end
                    local line = tracebackLines[i + 1]
                    Isaac.DebugString(line)
                end
                ::__continue9::
                i = i + 1
            end
        end
    end
    ___LUA_ERROR_BACKUP("(See above error messages.)")
end
function ____exports.default(self)
    overwriteError(nil)
end
return ____exports
end,
["callbacks.entityTakeDmgEntity"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local functionMap
function ____exports.main(self, entity, damageAmount, damageFlags, damageSource, damageCountdownFrames)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return nil
    end
    if g.run.dealingExtraDamage then
        return nil
    end
    local babyFunc = functionMap:get(babyType)
    if babyFunc ~= nil then
        return babyFunc(nil, entity, damageAmount, damageFlags, damageSource, damageCountdownFrames)
    end
    return nil
end
functionMap = __TS__New(Map)
functionMap:set(
    101,
    function(____, entity, _damageAmount, _damageFlags, damageSource, damageCountdownFrames)
        if (damageSource.Type == EntityType.ENTITY_EFFECT) and (damageSource.Variant == EffectVariant.PLAYER_CREEP_RED) then
            local damage = g.p.Damage * 2
            entity:TakeDamage(
                damage,
                0,
                EntityRef(g.p),
                damageCountdownFrames
            )
            return false
        end
        return nil
    end
)
functionMap:set(
    281,
    function(____, entity, _damageAmount, _damageFlags, damageSource, damageCountdownFrames)
        if (damageSource.Type == EntityType.ENTITY_EFFECT) and (damageSource.Variant == EffectVariant.CRACK_THE_SKY) then
            local damage = g.p.Damage
            g.run.dealingExtraDamage = true
            entity:TakeDamage(
                damage,
                0,
                EntityRef(g.p),
                damageCountdownFrames
            )
            g.run.dealingExtraDamage = false
            return false
        end
        return nil
    end
)
functionMap:set(
    295,
    function(____, entity, _damageAmount, _damageFlags, damageSource, damageCountdownFrames)
        if (damageSource.Type == EntityType.ENTITY_PLAYER) and (damageSource.Variant == 0) then
            local damage = g.p.Damage * 4
            g.run.dealingExtraDamage = true
            entity:TakeDamage(
                damage,
                0,
                EntityRef(g.p),
                damageCountdownFrames
            )
            g.run.dealingExtraDamage = false
            return false
        end
        return nil
    end
)
functionMap:set(
    337,
    function(____, entity, _damageAmount, _damageFlags, damageSource, _damageCountdownFrames)
        if (damageSource.Type == EntityType.ENTITY_TEAR) and (damageSource.Entity.SubType == 1) then
            g.sfx:Play(
                Isaac.GetSoundIdByName("Fist"),
                1,
                0,
                false,
                1
            )
            local extraVelocity = damageSource.Entity.Velocity:__mul(5)
            entity.Velocity = entity.Velocity:__add(extraVelocity)
        end
        return nil
    end
)
functionMap:set(
    377,
    function(____, entity, _damageAmount, _damageFlags, damageSource, damageCountdownFrames)
        if (damageSource.Type == EntityType.ENTITY_EFFECT) and (damageSource.Variant == EffectVariant.SPEAR_OF_DESTINY) then
            local damage = g.p.Damage * 4
            g.run.dealingExtraDamage = true
            entity:TakeDamage(
                damage,
                0,
                EntityRef(g.p),
                damageCountdownFrames
            )
            g.run.dealingExtraDamage = false
            return false
        end
        return nil
    end
)
functionMap:set(
    406,
    function(____, _entity, _damageAmount, _damageFlags, damageSource, _damageCountdownFrames)
        if (damageSource.Type == EntityType.ENTITY_TEAR) and (damageSource.Entity.SubType == 1) then
            math.randomseed(damageSource.Entity.InitSeed)
            local chance = math.random(1, 100)
            if chance <= 5 then
                Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.BLACK_HOLE, 0, damageSource.Position, damageSource.Entity.Velocity, nil)
            end
        end
        return nil
    end
)
functionMap:set(
    507,
    function(____, entity, _damageAmount, _damageFlags, damageSource, damageCountdownFrames)
        if (damageSource.Type == EntityType.ENTITY_FAMILIAR) and (damageSource.Variant == FamiliarVariant.POINTY_RIB) then
            local damage = g.p.Damage * 3
            g.run.dealingExtraDamage = true
            entity:TakeDamage(
                damage,
                0,
                EntityRef(g.p),
                damageCountdownFrames
            )
            g.run.dealingExtraDamage = false
            return false
        end
        return nil
    end
)
return ____exports
end,
["callbacks.entityTakeDmgPlayer"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____constants = require("constants")
local ZERO_VECTOR = ____constants.ZERO_VECTOR
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local ____enums_2Ecustom = require("types.enums.custom")
local CollectibleTypeCustom = ____enums_2Ecustom.CollectibleTypeCustom
local functionMap
function ____exports.main(self, player, damageAmount, damageFlags, damageSource, damageCountdownFrames)
    local gameFrameCount = g.g:GetFrameCount()
    local babyType, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return nil
    end
    if g.run.dealingExtraDamage then
        return nil
    end
    if (g.run.invulnerabilityFrame ~= 0) and (g.run.invulnerabilityFrame >= gameFrameCount) then
        return false
    end
    if g.run.invulnerable then
        return false
    end
    if baby.explosionImmunity and ((damageFlags & DamageFlag.DAMAGE_EXPLOSION) ~= 0) then
        return false
    end
    local babyFunc = functionMap:get(babyType)
    if babyFunc ~= nil then
        return babyFunc(nil, player, damageAmount, damageFlags, damageSource, damageCountdownFrames)
    end
    return nil
end
functionMap = __TS__New(Map)
functionMap:set(
    9,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        do
            local i = 0
            while i < 10 do
                player:AddBlueSpider(player.Position)
                i = i + 1
            end
        end
        return nil
    end
)
functionMap:set(
    10,
    function(____, player, _damageAmount, _damageFlags, damageSource, damageCountdownFrames)
        g.run.dealingExtraDamage = true
        player:TakeDamage(99, 0, damageSource, damageCountdownFrames)
        g.run.dealingExtraDamage = false
        return false
    end
)
functionMap:set(
    20,
    function(____, _player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        g.run.babyCounters = 5
        return nil
    end
)
functionMap:set(
    24,
    function(____, _player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        return false
    end
)
functionMap:set(
    32,
    function(____, _player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        for ____, entity in ipairs(
            Isaac.GetRoomEntities()
        ) do
            local npc = entity:ToNPC()
            if (npc ~= nil) and npc:IsVulnerableEnemy() then
                npc.HitPoints = npc.MaxHitPoints
            end
        end
        return nil
    end
)
functionMap:set(
    33,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UsePill(PillEffect.PILLEFFECT_LEMON_PARTY, 0)
        return nil
    end
)
functionMap:set(
    41,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        local maxHearts = player:GetMaxHearts()
        if (not g.run.babyBool) and (maxHearts >= 2) then
            player:AddMaxHearts(-2, true)
            g.run.babyBool = true
            player:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false)
            g.run.babyBool = false
            return false
        end
        return nil
    end
)
functionMap:set(
    46,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        Isaac.Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TAROTCARD, Card.CARD_SUN, player.Position, ZERO_VECTOR, player)
        return nil
    end
)
functionMap:set(
    50,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        g.run.randomSeed = misc:incrementRNG(g.run.randomSeed)
        math.randomseed(g.run.randomSeed)
        local heartSubType = math.random(1, 11)
        Isaac.Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_HEART, heartSubType, player.Position, ZERO_VECTOR, player)
        return nil
    end
)
functionMap:set(
    56,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseCard(Card.RUNE_BLACK)
        return nil
    end
)
functionMap:set(
    62,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.numHits == nil then
            error(("The \"numHits\" attribute was not defined for " .. baby.name) .. ".")
        end
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        if (g.run.babyCounters >= baby.numHits) and (not g.run.babyBool) then
            g.run.babyBool = true
            g.sfx:Play(SoundEffect.SOUND_SATAN_GROW, 1, 0, false, 1)
            player:AddCollectible(CollectibleType.COLLECTIBLE_GOAT_HEAD, 0, false)
            Isaac.DebugString(
                "Removing collectible " .. tostring(CollectibleType.COLLECTIBLE_GOAT_HEAD)
            )
            player:AddCollectible(CollectibleType.COLLECTIBLE_DUALITY, 0, false)
            Isaac.DebugString(
                "Removing collectible " .. tostring(CollectibleType.COLLECTIBLE_DUALITY)
            )
        end
        return nil
    end
)
functionMap:set(
    83,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseActiveItem(CollectibleType.COLLECTIBLE_BOOK_OF_SECRETS, false, false, false, false)
        return nil
    end
)
functionMap:set(
    98,
    function(____, player, damageAmount, _damageFlags, _damageSource, damageCountdownFrames)
        if not g.run.babyBool then
            g.run.babyBool = true
            player:TakeDamage(
                damageAmount,
                0,
                EntityRef(player),
                damageCountdownFrames
            )
            g.run.babyBool = false
        end
        return nil
    end
)
functionMap:set(
    101,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        local creep = Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_RED, 0, player.Position, ZERO_VECTOR, player):ToEffect()
        if creep ~= nil then
            creep.Scale = 10
            creep.Timeout = 240
        end
        return nil
    end
)
functionMap:set(
    116,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        misc:spawnRandomPickup(player.Position)
        return nil
    end
)
functionMap:set(
    125,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        if not g.run.babyBool then
            g.run.babyBool = true
            player:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false)
            g.run.babyBool = false
            player:AddKeys(-1)
            return false
        end
        return nil
    end
)
functionMap:set(
    132,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseActiveItem(CollectibleType.COLLECTIBLE_CONVERTER, false, false, false, false)
        return nil
    end
)
functionMap:set(
    138,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        if not g.run.babyBool then
            g.run.babyBool = true
            player:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false)
            g.run.babyBool = false
            player:AddBombs(-1)
            return false
        end
        return nil
    end
)
functionMap:set(
    139,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseCard(Card.CARD_FOOL)
        return nil
    end
)
functionMap:set(
    148,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseActiveItem(CollectibleType.COLLECTIBLE_NECRONOMICON, false, false, false, false)
        return nil
    end
)
functionMap:set(
    163,
    function(____, _player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        if g.run.babyBool then
            return false
        end
        return nil
    end
)
functionMap:set(
    177,
    function(____, player, _damageAmount, _damageFlags, damageSource, damageCountdownFrames)
        local coins = player:GetNumCoins()
        if coins == 0 then
            g.run.dealingExtraDamage = true
            player:TakeDamage(99, 0, damageSource, damageCountdownFrames)
            g.run.dealingExtraDamage = false
            return nil
        end
        player:AddCoins(-99)
        do
            local i = 1
            while i <= coins do
                local velocity = player.Position:__sub(
                    Isaac.GetRandomPosition()
                )
                velocity = velocity:Normalized()
                local modifier = math.random(4, 20)
                velocity = velocity:__mul(modifier)
                local coin = Isaac.Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COIN, CoinSubType.COIN_PENNY, player.Position, velocity, player)
                local data = coin:GetData()
                data.recovery = true
                i = i + 1
            end
        end
        g.sfx:Play(SoundEffect.SOUND_GOLD_HEART, 1, 0, false, 1)
        return nil
    end
)
functionMap:set(
    186,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseActiveItem(CollectibleType.COLLECTIBLE_TELEPORT, false, false, false, false)
        return nil
    end
)
functionMap:set(
    200,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseActiveItem(CollectibleType.COLLECTIBLE_MY_LITTLE_UNICORN, false, false, false, false)
        return nil
    end
)
functionMap:set(
    204,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        g.run.randomSeed = misc:incrementRNG(g.run.randomSeed)
        g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_KEY, player.Position, ZERO_VECTOR, player, 0, g.run.randomSeed)
        return nil
    end
)
functionMap:set(
    210,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseActiveItem(CollectibleType.COLLECTIBLE_POTATO_PEELER, false, false, false, false)
        return nil
    end
)
functionMap:set(
    212,
    function(____, _player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        do
            local i = 0
            while i <= 7 do
                local door = g.r:GetDoor(i)
                if door ~= nil then
                    door:Open()
                end
                i = i + 1
            end
        end
        return nil
    end
)
functionMap:set(
    225,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        local dupeEnemy
        for ____, entity in ipairs(
            Isaac.GetRoomEntities()
        ) do
            local npc = entity:ToNPC()
            if (npc ~= nil) and (not npc:IsBoss()) then
                dupeEnemy = {type = npc.Type, variant = npc.Variant}
                break
            end
        end
        if dupeEnemy == nil then
            dupeEnemy = {type = EntityType.ENTITY_PORTAL, variant = 0}
        end
        local position = g.r:FindFreePickupSpawnPosition(player.Position, 1, true)
        Isaac.Spawn(dupeEnemy.type, dupeEnemy.variant, 0, position, ZERO_VECTOR, nil)
        return nil
    end
)
functionMap:set(
    227,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseActiveItem(CollectibleType.COLLECTIBLE_CROOKED_PENNY, false, false, false, false)
        return nil
    end
)
functionMap:set(
    258,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        g.run.randomSeed = misc:incrementRNG(g.run.randomSeed)
        g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BOMB, player.Position, ZERO_VECTOR, player, 0, g.run.randomSeed)
        return nil
    end
)
functionMap:set(
    260,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseActiveItem(CollectibleType.COLLECTIBLE_DECK_OF_CARDS, false, false, false, false)
        return nil
    end
)
functionMap:set(
    267,
    function(____, _player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        local roomIndex = misc:getRoomIndex()
        local startingRoomIndex = g.l:GetStartingRoomIndex()
        local gridSize = g.r:GetGridSize()
        if roomIndex == startingRoomIndex then
            return false
        end
        do
            local i = 1
            while i <= gridSize do
                local gridEntity = g.r:GetGridEntity(i)
                if gridEntity ~= nil then
                    local saveState = gridEntity:GetSaveState()
                    if saveState.Type == GridEntityType.GRID_TRAPDOOR then
                        return false
                    end
                end
                i = i + 1
            end
        end
        local bigChests = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BIGCHEST, -1, false, false)
        if #bigChests > 0 then
            return false
        end
        return nil
    end
)
functionMap:set(
    276,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseActiveItem(CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS, false, false, false, false)
        return nil
    end
)
functionMap:set(
    277,
    function(____, _player, _damageAmount, damageFlags, _damageSource, _damageCountdownFrames)
        do
            local i = 0
            while i <= 21 do
                local bit = (damageFlags & (1 << i)) >> i
                if (i == 20) and (bit == 1) then
                    g.sfx:Play(
                        Isaac.GetSoundIdByName("Laugh"),
                        0.75,
                        0,
                        false,
                        1
                    )
                    break
                end
                i = i + 1
            end
        end
        return nil
    end
)
functionMap:set(
    285,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseActiveItem(CollectibleType.COLLECTIBLE_FLUSH, false, false, false, false)
        return nil
    end
)
functionMap:set(
    293,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseActiveItem(CollectibleType.COLLECTIBLE_CRACK_THE_SKY, false, false, false, false)
        return nil
    end
)
functionMap:set(
    308,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseActiveItem(CollectibleType.COLLECTIBLE_MOVING_BOX, false, false, false, false)
        return nil
    end
)
functionMap:set(
    310,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        Isaac.Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TAROTCARD, Card.CARD_STARS, player.Position, ZERO_VECTOR, player)
        return nil
    end
)
functionMap:set(
    315,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseActiveItem(CollectibleType.COLLECTIBLE_D6, false, false, false, false)
        return nil
    end
)
functionMap:set(
    318,
    function(____, _player, _damageAmount, _damageFlags, damageSource, _damageCountdownFrames)
        if damageSource.Type == EntityType.ENTITY_FIREPLACE then
            return false
        end
        return nil
    end
)
functionMap:set(
    329,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        if g.run.babyCounters == 6 then
            g.run.babyCounters = 0
            g.run.randomSeed = misc:incrementRNG(g.run.randomSeed)
            local position = g.r:FindFreePickupSpawnPosition(player.Position, 1, true)
            g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, position, ZERO_VECTOR, nil, 0, g.run.randomSeed)
        end
        return nil
    end
)
functionMap:set(
    330,
    function(____, _player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        g.run.randomSeed = misc:incrementRNG(g.run.randomSeed)
        math.randomseed(g.run.randomSeed)
        local avoidChance = math.random(1, 2)
        if avoidChance == 2 then
            return false
        end
        return nil
    end
)
functionMap:set(
    322,
    function(____, player, damageAmount, _damageFlags, _damageSource, damageCountdownFrames)
        if not g.run.babyBool then
            g.run.babyBool = true
            player:TakeDamage(
                damageAmount,
                0,
                EntityRef(player),
                damageCountdownFrames
            )
            g.run.babyBool = false
        end
        return nil
    end
)
functionMap:set(
    323,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        if g.run.babyCounters == 6 then
            g.run.babyCounters = 0
            player:UseActiveItem(CollectibleTypeCustom.COLLECTIBLE_CLOCKWORK_ASSEMBLY, false, false, false, false)
        end
        return nil
    end
)
functionMap:set(
    336,
    function(____, _player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        g.run.babyBool = true
        return nil
    end
)
functionMap:set(
    346,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseActiveItem(CollectibleType.COLLECTIBLE_DATAMINER, false, false, false, false)
        return nil
    end
)
functionMap:set(
    359,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseActiveItem(CollectibleType.COLLECTIBLE_MR_ME, false, false, false, false)
        return nil
    end
)
functionMap:set(
    366,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:ShootRedCandle(ZERO_VECTOR)
        return nil
    end
)
functionMap:set(
    378,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseActiveItem(CollectibleType.COLLECTIBLE_BOOK_OF_THE_DEAD, false, false, false, false)
        return nil
    end
)
functionMap:set(
    385,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        player:AddCacheFlags(CacheFlag.CACHE_DAMAGE)
        player:EvaluateItems()
        return nil
    end
)
functionMap:set(
    408,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        for ____, entity in ipairs(
            Isaac.GetRoomEntities()
        ) do
            local npc = entity:ToNPC()
            if (npc ~= nil) and npc:IsVulnerableEnemy() then
                npc:AddConfusion(
                    EntityRef(player),
                    150,
                    false
                )
            end
        end
        return nil
    end
)
functionMap:set(
    412,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseActiveItem(CollectibleType.COLLECTIBLE_GUPPYS_PAW, false, false, false, false)
        return nil
    end
)
functionMap:set(
    435,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseCard(Card.CARD_HUMANITY)
        return nil
    end
)
functionMap:set(
    441,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.numHits == nil then
            error(("The \"numHits\" attribute was not defined for " .. baby.name) .. ".")
        end
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        if g.run.babyCounters == baby.numHits then
            g.run.babyCounters = 0
            player:UseActiveItem(CollectibleType.COLLECTIBLE_MEGA_SATANS_BREATH, false, false, false, false)
        end
        return nil
    end
)
functionMap:set(
    444,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        local ____obj, ____index = g.run, "babyCountersRoom"
        ____obj[____index] = ____obj[____index] + 1
        if g.run.babyCountersRoom >= 2 then
            player:UseActiveItem(CollectibleType.COLLECTIBLE_FORGET_ME_NOW, false, false, false, false)
        end
        return nil
    end
)
functionMap:set(
    446,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        player:UseActiveItem(CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS, false, false, false, false)
        return nil
    end
)
functionMap:set(
    456,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        player:AddBlueFlies(baby.num, player.Position, nil)
        return nil
    end
)
functionMap:set(
    472,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        for ____, entity in ipairs(
            Isaac.GetRoomEntities()
        ) do
            local npc = entity:ToNPC()
            if (npc ~= nil) and npc:IsVulnerableEnemy() then
                npc:AddFreeze(
                    EntityRef(player),
                    150
                )
            end
        end
        return nil
    end
)
functionMap:set(
    474,
    function(____, _player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        local gameFrameCount = g.g:GetFrameCount()
        if g.run.babyCounters == 0 then
            g.run.babyCounters = gameFrameCount + (60 * 30)
        end
        return nil
    end
)
functionMap:set(
    488,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        local pillEffect = -1
        repeat
            do
                g.run.randomSeed = misc:incrementRNG(g.run.randomSeed)
                math.randomseed(g.run.randomSeed)
                pillEffect = math.random(0, PillEffect.NUM_PILL_EFFECTS - 1)
            end
        until not ((pillEffect == PillEffect.PILLEFFECT_AMNESIA) or (pillEffect == PillEffect.PILLEFFECT_QUESTIONMARK))
        player:UsePill(pillEffect, 0)
        return nil
    end
)
functionMap:set(
    493,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.numHits == nil then
            error(("The \"numHits\" attribute was not defined for " .. baby.name) .. ".")
        end
        if g.run.babyBool then
            return nil
        end
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        if g.run.babyCounters == baby.numHits then
            g.run.babyBool = true
            player:UseCard(Card.CARD_EMPEROR)
        end
        return nil
    end
)
functionMap:set(
    499,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        local cardType = -1
        repeat
            do
                g.run.randomSeed = misc:incrementRNG(g.run.randomSeed)
                math.randomseed(g.run.randomSeed)
                cardType = math.random(1, 54)
            end
        until not (((cardType >= Card.RUNE_HAGALAZ) and (cardType <= Card.RUNE_BLACK)) or (cardType == Card.CARD_SUICIDE_KING))
        player:UseCard(cardType)
        return nil
    end
)
functionMap:set(
    506,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        g.run.randomSeed = misc:incrementRNG(g.run.randomSeed)
        math.randomseed(g.run.randomSeed)
        local runeSubType = math.random(Card.RUNE_HAGALAZ, Card.RUNE_BLACK)
        g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TAROTCARD, player.Position, ZERO_VECTOR, player, runeSubType, g.run.randomSeed)
        return nil
    end
)
functionMap:set(
    514,
    function(____, _player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        local roomFrameCount = g.r:GetFrameCount()
        if roomFrameCount == 0 then
            return false
        end
        return nil
    end
)
functionMap:set(
    523,
    function(____, player, _damageAmount, _damageFlags, _damageSource, _damageCountdownFrames)
        local ____obj, ____index = g.run, "babyCountersRoom"
        ____obj[____index] = ____obj[____index] + 1
        if g.run.babyCountersRoom == 2 then
            local itemToTakeAway = table.remove(g.run.passiveItems)
            if (itemToTakeAway ~= nil) and player:HasCollectible(itemToTakeAway) then
                player:RemoveCollectible(itemToTakeAway)
                Isaac.DebugString(
                    "Removing collectible " .. tostring(itemToTakeAway)
                )
            end
        end
        return nil
    end
)
return ____exports
end,
["callbacks.entityTakeDmg"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local entityTakeDmgEntity = require("callbacks.entityTakeDmgEntity")
local entityTakeDmgPlayer = require("callbacks.entityTakeDmgPlayer")
function ____exports.main(self, entity, damageAmount, damageFlags, damageSource, damageCountdownFrames)
    local ____, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return nil
    end
    local player = entity:ToPlayer()
    if player ~= nil then
        return entityTakeDmgPlayer:main(player, damageAmount, damageFlags, damageSource, damageCountdownFrames)
    end
    return entityTakeDmgEntity:main(entity, damageAmount, damageFlags, damageSource, damageCountdownFrames)
end
return ____exports
end,
["callbacks.evaluateCacheBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    11,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_DAMAGE then
            do
                local i = 1
                while i <= g.run.babyCounters do
                    player.Damage = player.Damage - 1
                    i = i + 1
                end
            end
        end
    end
)
functionMap:set(
    73,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_RANGE then
            player.TearHeight = player.TearHeight / 2
            if player.TearHeight > -5 then
                player.TearHeight = -5
            end
        end
    end
)
functionMap:set(
    78,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_DAMAGE then
            player.Damage = player.Damage * 0.5
        end
    end
)
functionMap:set(
    105,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_RANGE then
            player.TearHeight = player.TearHeight * 2
        end
    end
)
functionMap:set(
    124,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_DAMAGE then
            player.Damage = player.Damage * 2
        end
    end
)
functionMap:set(
    152,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_FIREDELAY then
            player.MaxFireDelay = 1
        end
    end
)
functionMap:set(
    164,
    function(____, player, cacheFlag)
        if cacheFlag ~= CacheFlag.CACHE_DAMAGE then
            return
        end
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        player.Damage = player.Damage + (g.run.babyFrame * baby.num)
    end
)
functionMap:set(
    187,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_FIREDELAY then
            player.MaxFireDelay = math.ceil(player.MaxFireDelay * 3)
        end
    end
)
functionMap:set(
    240,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_SHOTSPEED then
            player.ShotSpeed = 0.6
        end
    end
)
functionMap:set(
    244,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_SPEED then
            player.MoveSpeed = player.MoveSpeed * 0.5
        end
    end
)
functionMap:set(
    269,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_FIREDELAY then
            player.MaxFireDelay = math.ceil(player.MaxFireDelay * 2)
        end
    end
)
functionMap:set(
    291,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_DAMAGE then
            do
                local i = 1
                while i <= g.run.babyCounters do
                    player.Damage = player.Damage + 0.2
                    i = i + 1
                end
            end
        end
    end
)
functionMap:set(
    321,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_SHOTSPEED then
            player.ShotSpeed = 4
        end
    end
)
functionMap:set(
    322,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_DAMAGE then
            player.Damage = player.Damage * 2
        end
    end
)
functionMap:set(
    336,
    function(____, player, cacheFlag)
        local hearts = player:GetHearts()
        local soulHearts = player:GetSoulHearts()
        local eternalHearts = player:GetEternalHearts()
        local boneHearts = player:GetBoneHearts()
        local totalHearts = ((hearts + soulHearts) + eternalHearts) + (boneHearts * 2)
        if totalHearts <= 2 then
            if cacheFlag == CacheFlag.CACHE_DAMAGE then
                player.Damage = player.Damage * 3
            elseif cacheFlag == CacheFlag.CACHE_FIREDELAY then
                player.MaxFireDelay = math.ceil(player.MaxFireDelay / 3)
            end
        end
    end
)
functionMap:set(
    350,
    function(____, player, cacheFlag)
        if (cacheFlag == CacheFlag.CACHE_SPEED) and (g.g:GetFrameCount() >= g.run.babyFrame) then
            player.MoveSpeed = 0.1
        end
    end
)
functionMap:set(
    369,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_SPEED then
            player.MoveSpeed = player.MoveSpeed * 2
        end
    end
)
functionMap:set(
    370,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_FIREDELAY then
            player.MaxFireDelay = 1
        end
    end
)
functionMap:set(
    371,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_DAMAGE then
            player.Damage = player.Damage + 10
        end
    end
)
functionMap:set(
    385,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_DAMAGE then
            do
                local i = 1
                while i <= g.run.babyCounters do
                    player.Damage = player.Damage * 0.7
                    i = i + 1
                end
            end
        end
    end
)
functionMap:set(
    419,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_LUCK then
            player.Luck = player.Luck + 13
        end
    end
)
functionMap:set(
    459,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_FIREDELAY then
            do
                local i = 1
                while i <= g.run.babyCounters do
                    player.MaxFireDelay = player.MaxFireDelay - 1
                    i = i + 1
                end
            end
        end
    end
)
functionMap:set(
    462,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_FIREDELAY then
            player.MaxFireDelay = math.ceil(player.MaxFireDelay * 2)
        end
    end
)
functionMap:set(
    473,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_DAMAGE then
            do
                local i = 1
                while i <= g.run.babyCounters do
                    player.Damage = player.Damage + 1
                    i = i + 1
                end
            end
        end
    end
)
functionMap:set(
    476,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_DAMAGE then
            player.Damage = player.Damage / 2
        end
    end
)
functionMap:set(
    483,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_DAMAGE then
            do
                local i = 1
                while i <= g.run.babyCounters do
                    player.Damage = player.Damage + 1
                    i = i + 1
                end
            end
        end
    end
)
functionMap:set(
    511,
    function(____, player, cacheFlag)
        if cacheFlag == CacheFlag.CACHE_FIREDELAY then
            player.MaxFireDelay = player.MaxFireDelay + g.run.babyCounters
        end
    end
)
return ____exports
end,
["callbacks.evaluateCache"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____enums_2Ecustom = require("types.enums.custom")
local PlayerTypeCustom = ____enums_2Ecustom.PlayerTypeCustom
local ____evaluateCacheBabies = require("callbacks.evaluateCacheBabies")
local evaluateCacheBabyFunctions = ____evaluateCacheBabies.default
function ____exports.main(self, player, cacheFlag)
    local character = player:GetPlayerType()
    local babyType, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    if (character == PlayerTypeCustom.PLAYER_RANDOM_BABY) and (cacheFlag == CacheFlag.CACHE_DAMAGE) then
        player.Damage = player.Damage + 1
    end
    if baby.blindfolded and (cacheFlag == CacheFlag.CACHE_FIREDELAY) then
        player.MaxFireDelay = 100000
    end
    local babyFunc = evaluateCacheBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, player, cacheFlag)
    end
end
return ____exports
end,
["callbacks.executeCmd"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
function ____exports.main(self, cmd, params)
    local ____switch3 = cmd
    if ____switch3 == "baby" then
        goto ____switch3_case_0
    elseif ____switch3 == "baby2" then
        goto ____switch3_case_1
    elseif ____switch3 == "disable" then
        goto ____switch3_case_2
    end
    goto ____switch3_case_default
    ::____switch3_case_0::
    do
    end
    ::____switch3_case_1::
    do
        do
            local babyNum = tonumber(params)
            if babyNum == nil then
                babyNum = 0
            elseif (babyNum < 0) or (babyNum > #g.babies) then
                babyNum = 0
            end
            g.debugBabyNum = babyNum
            Isaac.ConsoleOutput(
                ("Set baby to be: " .. tostring(babyNum)) .. "\n"
            )
            if (cmd == "baby") and (params ~= "0") then
                Isaac.ExecuteCommand("restart")
            end
            goto ____switch3_end
        end
    end
    ::____switch3_case_2::
    do
        do
            g.debugBabyNum = nil
            Isaac.ExecuteCommand("restart")
            goto ____switch3_end
        end
    end
    ::____switch3_case_default::
    do
        do
            goto ____switch3_end
        end
    end
    ::____switch3_end::
end
return ____exports
end,
["callbacks.familiarInitBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____constants = require("constants")
local ZERO_VECTOR = ____constants.ZERO_VECTOR
local ____globals = require("globals")
local g = ____globals.default
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    30,
    function(____, familiar)
        if familiar.Variant == FamiliarVariant.SPRINKLER then
            familiar:GetSprite():Load("gfx/003.120_sprinkler2.anm2", true)
        end
    end
)
functionMap:set(
    47,
    function(____, familiar)
        if familiar.Variant == FamiliarVariant.SUCCUBUS then
            local sprite = familiar:GetSprite()
            sprite:Load("gfx/003.096_succubus2.anm2", true)
            sprite:Play("IdleDown", true)
        end
    end
)
functionMap:set(
    117,
    function(____, familiar)
        if (familiar.Variant == FamiliarVariant.DEAD_BIRD) and (not g.run.babyBool) then
            g.run.babyBool = true
            do
                local i = 0
                while i < 4 do
                    Isaac.Spawn(EntityType.ENTITY_FAMILIAR, FamiliarVariant.DEAD_BIRD, 0, g.p.Position, ZERO_VECTOR, nil)
                    i = i + 1
                end
            end
            g.run.babyBool = false
        end
    end
)
functionMap:set(
    164,
    function(____, familiar)
        if (familiar.Variant == FamiliarVariant.LEPROCY) and (g.run.babyCounters < 3) then
            local ____obj, ____index = g.run, "babyCounters"
            ____obj[____index] = ____obj[____index] + 1
        end
    end
)
functionMap:set(
    453,
    function(____, familiar)
        if familiar.Variant == FamiliarVariant.BUMBO then
            familiar.Coins = 25
        end
    end
)
return ____exports
end,
["callbacks.familiarInit"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____familiarInitBabies = require("callbacks.familiarInitBabies")
local familiarInitBabyFunctions = ____familiarInitBabies.default
function ____exports.main(self, familiar)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local babyFunc = familiarInitBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, familiar)
    end
end
return ____exports
end,
["callbacks.familiarUpdateBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    36,
    function(____, familiar)
        familiar.SpriteScale = Vector(0.5, 0.5)
    end
)
functionMap:set(
    37,
    function(____, familiar)
        familiar.SpriteScale = Vector(2, 2)
    end
)
functionMap:set(
    47,
    function(____, familiar)
        if familiar.Variant == FamiliarVariant.SUCCUBUS then
            familiar.Position = g.p.Position
        end
    end
)
functionMap:set(
    82,
    function(____, familiar)
        if familiar.Variant == FamiliarVariant.LIL_GURDY then
            local lilGurdies = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.LIL_GURDY, -1, false, false)
            for ____, lilGurdy in ipairs(lilGurdies) do
                if (familiar.Position:Distance(lilGurdy.Position) <= 1) and (familiar.Index < lilGurdy.Index) then
                    lilGurdy.Position = misc:getOffsetPosition(lilGurdy.Position, 7, lilGurdy.InitSeed)
                end
            end
        end
    end
)
functionMap:set(
    326,
    function(____, familiar)
        if familiar.Variant == FamiliarVariant.ROBO_BABY_2 then
            local roboBabies = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.ROBO_BABY_2, -1, false, false)
            for ____, roboBaby in ipairs(roboBabies) do
                if (familiar.Position:Distance(roboBaby.Position) <= 1) and (familiar.Index < roboBaby.Index) then
                    roboBaby.Position = misc:getOffsetPosition(roboBaby.Position, 7, roboBaby.InitSeed)
                end
            end
        end
    end
)
functionMap:set(
    376,
    function(____, familiar)
        if (familiar.Variant == FamiliarVariant.BOBS_BRAIN) and (familiar.SubType == 1) then
            familiar:Remove()
        end
    end
)
functionMap:set(
    403,
    function(____, familiar)
        if (familiar.Variant == FamiliarVariant.YO_LISTEN) and ((familiar.FrameCount % 5) == 0) then
            familiar.Velocity = familiar.Velocity:__mul(2)
        end
    end
)
functionMap:set(
    453,
    function(____, familiar)
        if (familiar.Variant == FamiliarVariant.BUMBO) and ((familiar.FrameCount % 5) == 0) then
            familiar.Velocity = familiar.Velocity:__mul(2)
        end
    end
)
functionMap:set(
    538,
    function(____, familiar)
        if familiar.Variant == FamiliarVariant.CENSER then
            familiar.Position = g.p.Position
            local sprite = familiar:GetSprite()
            sprite:Load("gfx/003.089_censer_invisible.anm2", true)
            sprite:Play("Idle", true)
        end
    end
)
return ____exports
end,
["callbacks.familiarUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____familiarUpdateBabies = require("callbacks.familiarUpdateBabies")
local familiarUpdateBabyFunctions = ____familiarUpdateBabies.default
function ____exports.main(self, familiar)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local babyFunc = familiarUpdateBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, familiar)
    end
end
return ____exports
end,
["callbacks.inputActionBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    115,
    function(____, inputHook, buttonAction)
        if (inputHook == InputHook.IS_ACTION_PRESSED) and ((((buttonAction == ButtonAction.ACTION_SHOOTLEFT) or (buttonAction == ButtonAction.ACTION_SHOOTRIGHT)) or (buttonAction == ButtonAction.ACTION_SHOOTUP)) or (buttonAction == ButtonAction.ACTION_SHOOTDOWN)) then
            local player = Game(nil):GetPlayer(0)
            if (((((player:HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) or player:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE)) or player:HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE)) or player:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG)) or player:HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE)) or player:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X)) or player:HasCollectible(CollectibleType.COLLECTIBLE_MAW_OF_VOID) then
                return nil
            end
            local threshold = 0.75
            if (((player.Velocity.X > threshold) or (player.Velocity.X < (threshold * -1))) or (player.Velocity.Y > threshold)) or (player.Velocity.Y < (threshold * -1)) then
                return false
            end
        end
        return nil
    end
)
functionMap:set(
    179,
    function(____, _inputHook, buttonAction)
        if (buttonAction == ButtonAction.ACTION_LEFT) and (misc:isButtonPressed(ButtonAction.ACTION_UP) or misc:isButtonPressed(ButtonAction.ACTION_DOWN)) then
            return 0
        end
        if (buttonAction == ButtonAction.ACTION_RIGHT) and (misc:isButtonPressed(ButtonAction.ACTION_UP) or misc:isButtonPressed(ButtonAction.ACTION_DOWN)) then
            return 0
        end
        if (buttonAction == ButtonAction.ACTION_UP) and (misc:isButtonPressed(ButtonAction.ACTION_LEFT) or misc:isButtonPressed(ButtonAction.ACTION_RIGHT)) then
            return 0
        end
        if (buttonAction == ButtonAction.ACTION_DOWN) and (misc:isButtonPressed(ButtonAction.ACTION_LEFT) or misc:isButtonPressed(ButtonAction.ACTION_RIGHT)) then
            return 0
        end
        return nil
    end
)
functionMap:set(
    386,
    function(____, _inputHook, buttonAction)
        local direction = g.run.babyCounters
        if direction == ButtonAction.ACTION_SHOOTRIGHT then
            direction = ButtonAction.ACTION_SHOOTUP
        elseif direction == ButtonAction.ACTION_SHOOTUP then
            direction = ButtonAction.ACTION_SHOOTRIGHT
        end
        if buttonAction == direction then
            return 1
        end
        return nil
    end
)
return ____exports
end,
["callbacks.inputAction"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____inputActionBabies = require("callbacks.inputActionBabies")
local inputActionBabyFunctions = ____inputActionBabies.default
function ____exports.main(self, _entityPlayer, inputHook, buttonAction)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return nil
    end
    local babyFunc = inputActionBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        return babyFunc(nil, inputHook, buttonAction)
    end
    return nil
end
return ____exports
end,
["callbacks.NPCUpdateBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    61,
    function(____, npc)
        if npc:HasEntityFlags(EntityFlag.FLAG_FRIENDLY) then
            local color = npc:GetColor()
            local fadeAmount = 0.25
            local newColor = Color(color.R, color.G, color.B, fadeAmount, 0, 0, 0)
            npc:SetColor(newColor, 0, 0, true, true)
        end
    end
)
functionMap:set(
    514,
    function(____, npc)
        local data = npc:GetData()
        if (((((((((((((((((((npc.FrameCount ~= 0) or (data.duplicated ~= nil)) or (npc.Type == EntityType.ENTITY_SHOPKEEPER)) or (npc.Type == EntityType.ENTITY_CHUB)) or (npc.Type == EntityType.ENTITY_FIREPLACE)) or (npc.Type == EntityType.ENTITY_STONEHEAD)) or (npc.Type == EntityType.ENTITY_POKY)) or (npc.Type == EntityType.ENTITY_MOM)) or (npc.Type == EntityType.ENTITY_MOMS_HEART)) or ((npc.Type == EntityType.ENTITY_GEMINI) and (npc.Variant >= 10))) or (npc.Type == EntityType.ENTITY_ETERNALFLY)) or (npc.Type == EntityType.ENTITY_ISAAC)) or (npc.Type == EntityType.ENTITY_CONSTANT_STONE_SHOOTER)) or (npc.Type == EntityType.ENTITY_BRIMSTONE_HEAD)) or ((npc.Type == EntityType.ENTITY_SWINGER) and (npc.Variant > 0))) or (npc.Type == EntityType.ENTITY_WALL_HUGGER)) or (npc.Type == EntityType.ENTITY_GAPING_MAW)) or (npc.Type == EntityType.ENTITY_BROKEN_GAPING_MAW)) or (npc.Type == EntityType.ENTITY_SWARM)) or (npc.Type == EntityType.ENTITY_PITFALL) then
            return
        end
        if not g.run.babyBool then
            g.run.babyBool = true
            local position = g.r:FindFreePickupSpawnPosition(npc.Position, 1, true)
            if position:Distance(g.p.Position) > 40 then
                local newNPC = g.g:Spawn(npc.Type, npc.Variant, position, npc.Velocity, npc, npc.SubType, npc.InitSeed)
                newNPC:GetData().duplicated = true
            end
            g.run.babyBool = false
        end
    end
)
return ____exports
end,
["callbacks.NPCUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____NPCUpdateBabies = require("callbacks.NPCUpdateBabies")
local NPCUpdateBabyFunctions = ____NPCUpdateBabies.default
function ____exports.main(self, npc)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local babyFunc = NPCUpdateBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, npc)
    end
end
return ____exports
end,
["callbacks.postBombInitBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local misc = require("misc")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    36,
    function(____, bomb)
        bomb.SpriteScale = Vector(0.5, 0.5)
    end
)
functionMap:set(
    37,
    function(____, bomb)
        bomb.SpriteScale = Vector(2, 2)
    end
)
functionMap:set(
    463,
    function(____, bomb)
        misc:setRandomColor(bomb)
    end
)
return ____exports
end,
["callbacks.postBombInit"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____postBombInitBabies = require("callbacks.postBombInitBabies")
local postBombInitBabyFunctions = ____postBombInitBabies.default
function ____exports.main(self, bomb)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local babyFunc = postBombInitBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, bomb)
    end
end
return ____exports
end,
["callbacks.postBombUpdateBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    75,
    function(____, bomb)
        if (bomb.SpawnerType == EntityType.ENTITY_PLAYER) and (bomb.FrameCount == 51) then
            g.run.room.RNG = misc:incrementRNG(g.run.room.RNG)
            math.randomseed(g.run.room.RNG)
            local d6chance = math.random(1, 2)
            if d6chance == 2 then
                g.p:UseActiveItem(CollectibleType.COLLECTIBLE_D6, false, false, false, false)
            end
        end
    end
)
functionMap:set(
    97,
    function(____, bomb)
        if (bomb.SpawnerType == EntityType.ENTITY_PLAYER) and (bomb.FrameCount == 51) then
            misc:addCharge()
            if g.racingPlusEnabled then
                RacingPlusSchoolbag:AddCharge(true)
            end
        end
    end
)
functionMap:set(
    211,
    function(____, bomb)
        local gameFrameCount = g.g:GetFrameCount()
        if (bomb.SpawnerType == EntityType.ENTITY_PLAYER) and (bomb.FrameCount == 51) then
            do
                local i = 0
                while i < 4 do
                    local velocity
                    if i == 0 then
                        velocity = Vector(1, 0)
                    elseif i == 1 then
                        velocity = Vector(0, 1)
                    elseif i == 2 then
                        velocity = Vector(-1, 0)
                    elseif i == 3 then
                        velocity = Vector(0, -1)
                    else
                        error("velocity was never defined.")
                    end
                    __TS__ArrayPush(
                        g.run.room.tears,
                        {
                            frame = gameFrameCount,
                            position = bomb.Position,
                            velocity = velocity:__mul(30),
                            num = 0
                        }
                    )
                    i = i + 1
                end
            end
        end
    end
)
functionMap:set(
    284,
    function(____, bomb)
        local data = bomb:GetData()
        if (bomb.FrameCount == 1) and (data.doubled == nil) then
            local position = misc:getOffsetPosition(bomb.Position, 15, bomb.InitSeed)
            local doubledBomb = g.g:Spawn(bomb.Type, bomb.Variant, position, bomb.Velocity, bomb.SpawnerEntity, bomb.SubType, bomb.InitSeed):ToBomb()
            if doubledBomb ~= nil then
                doubledBomb.Flags = bomb.Flags
                doubledBomb.IsFetus = bomb.IsFetus
                if bomb.IsFetus then
                    doubledBomb:SetExplosionCountdown(28)
                end
                doubledBomb.ExplosionDamage = bomb.ExplosionDamage
                doubledBomb.RadiusMultiplier = bomb.RadiusMultiplier
                doubledBomb:GetData().doubled = true
            end
        end
    end
)
functionMap:set(
    344,
    function(____, bomb)
        if (bomb.SpawnerType == EntityType.ENTITY_PLAYER) and (bomb.FrameCount == 51) then
            g.r:MamaMegaExplossion()
        end
    end
)
functionMap:set(
    373,
    function(____, bomb)
        if (bomb.FrameCount == 1) and (bomb.Variant ~= BombVariant.BOMB_SUPERTROLL) then
            g.g:Spawn(bomb.Type, BombVariant.BOMB_SUPERTROLL, bomb.Position, bomb.Velocity, bomb.SpawnerEntity, bomb.SubType, bomb.InitSeed)
            bomb:Remove()
        end
    end
)
return ____exports
end,
["callbacks.postBombUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____postBombUpdateBabies = require("callbacks.postBombUpdateBabies")
local postBombUpdateBabyFunctions = ____postBombUpdateBabies.default
function ____exports.main(self, bomb)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local babyFunc = postBombUpdateBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, bomb)
    end
end
return ____exports
end,
["callbacks.postEffectInitBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    30,
    function(____, effect)
        if (effect.Variant == EffectVariant.POOF01) and g.run.babyBool then
            g.run.babyBool = false
            effect:Remove()
        end
    end
)
functionMap:set(
    281,
    function(____, effect)
        if effect.Variant == EffectVariant.TARGET then
            effect.Visible = false
        end
    end
)
functionMap:set(
    463,
    function(____, effect)
        misc:setRandomColor(effect)
    end
)
return ____exports
end,
["callbacks.postEffectInit"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____postEffectInitBabies = require("callbacks.postEffectInitBabies")
local postEffectInitBabyFunctions = ____postEffectInitBabies.default
function ____exports.main(self, effect)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local babyFunc = postEffectInitBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, effect)
    end
end
return ____exports
end,
["callbacks.postEffectUpdateBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____constants = require("constants")
local ZERO_VECTOR = ____constants.ZERO_VECTOR
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local ____enums_2Ecustom = require("types.enums.custom")
local EffectVariantCustom = ____enums_2Ecustom.EffectVariantCustom
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    66,
    function(____, effect)
        if effect.Variant == EffectVariant.BOOMERANG then
            local entities = Isaac.FindInRadius(effect.Position, 30, EntityPartition.ENEMY)
            if #entities > 0 then
                local closestEntity = entities[1]
                closestEntity:TakeDamage(
                    g.p.Damage,
                    0,
                    EntityRef(effect),
                    2
                )
                effect:Remove()
            end
            local players = Isaac.FindInRadius(effect.Position, 30, EntityPartition.PLAYER)
            if (#players > 0) and (effect.FrameCount > 20) then
                effect:Remove()
            end
            if effect.FrameCount >= 26 then
                local initialSpeed = effect.Velocity:LengthSquared()
                effect.Velocity = g.p.Position:__sub(effect.Position)
                effect.Velocity = effect.Velocity:Normalized()
                while effect.Velocity:LengthSquared() < initialSpeed do
                    effect.Velocity = effect.Velocity:__mul(1.1)
                end
            end
        end
    end
)
functionMap:set(
    146,
    function(____, effect)
        if (((((((effect.Variant == EffectVariant.TARGET) and (effect.FrameCount == 1)) and (not g.p:HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE))) and (not g.p:HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER))) and (not g.p:HasCollectible(CollectibleType.COLLECTIBLE_20_20))) and (not g.p:HasCollectible(CollectibleType.COLLECTIBLE_THE_WIZ))) and (not g.p:HasPlayerForm(7))) and (not g.p:HasPlayerForm(10)) then
            effect.Timeout = 10
        end
    end
)
functionMap:set(
    281,
    function(____, effect)
        if effect.Variant ~= EffectVariant.TARGET then
            return
        end
        local gameFrameCount = g.g:GetFrameCount()
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.cooldown == nil then
            error(("The \"cooldown\" attribute was not defined for " .. baby.name) .. ".")
        end
        if effect.FrameCount == 1 then
            effect.Position = g.p.Position
            effect.Visible = true
        elseif gameFrameCount >= g.run.babyFrame then
            local entities = Isaac.FindInRadius(effect.Position, 30, EntityPartition.ENEMY)
            if #entities > 0 then
                g.run.babyFrame = gameFrameCount + baby.cooldown
                Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.CRACK_THE_SKY, 0, effect.Position, ZERO_VECTOR, g.p)
            end
        end
    end
)
functionMap:set(
    485,
    function(____, effect)
        if (effect.Variant == EffectVariantCustom.FETUS_BOSS_TARGET) and (effect.FrameCount == 30) then
            local rocket = Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariantCustom.FETUS_BOSS_ROCKET, 0, effect.Position, ZERO_VECTOR, nil)
            local rocketHeightOffset = Vector(0, -300)
            rocket.SpriteOffset = rocket.SpriteOffset:__add(rocketHeightOffset)
        elseif effect.Variant == EffectVariantCustom.FETUS_BOSS_ROCKET then
            local rocketFallSpeed = Vector(0, 30)
            effect.SpriteOffset = effect.SpriteOffset:__add(rocketFallSpeed)
            if effect.SpriteOffset.Y >= 0 then
                Isaac.Explode(effect.Position, nil, 50)
                effect:Remove()
                local targets = Isaac.FindByType(EntityType.ENTITY_EFFECT, EffectVariantCustom.FETUS_BOSS_TARGET, -1, false, false)
                if #targets > 0 then
                    local target = targets[1]
                    target:Remove()
                end
            end
        end
    end
)
return ____exports
end,
["callbacks.postEffectUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____postEffectUpdateBabies = require("callbacks.postEffectUpdateBabies")
local postEffectUpdateBabyFunctions = ____postEffectUpdateBabies.default
function ____exports.main(self, effect)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local babyFunc = postEffectUpdateBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, effect)
    end
end
return ____exports
end,
["callbacks.postEntityKillBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____constants = require("constants")
local ZERO_VECTOR = ____constants.ZERO_VECTOR
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    27,
    function(____, _npc)
        g.run.room.clearDelayFrame = g.g:GetFrameCount() + 1
    end
)
functionMap:set(
    38,
    function(____, npc)
        Isaac.GridSpawn(GridEntityType.GRID_POOP, 0, npc.Position, false)
    end
)
functionMap:set(
    43,
    function(____, npc)
        local roomIndex = misc:getRoomIndex()
        __TS__ArrayPush(g.run.room.NPCs, {roomIndex = roomIndex, position = npc.Position})
    end
)
functionMap:set(
    61,
    function(____, npc)
        if ((not npc:IsBoss()) and (npc.Type ~= EntityType.ENTITY_MOVABLE_TNT)) and (not npc:HasEntityFlags(EntityFlag.FLAG_FRIENDLY)) then
            local friend = g.g:Spawn(npc.Type, npc.Variant, npc.Position, ZERO_VECTOR, nil, npc.SubType, npc.InitSeed)
            friend:AddEntityFlags(EntityFlag.FLAG_CHARM)
            friend:AddEntityFlags(EntityFlag.FLAG_FRIENDLY)
            friend:AddEntityFlags(EntityFlag.FLAG_PERSISTENT)
            local color = friend:GetColor()
            local fadeAmount = 0.25
            local newColor = Color(color.R, color.G, color.B, fadeAmount, color.RO, color.GO, color.BO)
            friend:SetColor(newColor, 0, 0, true, true)
        end
    end
)
functionMap:set(
    90,
    function(____, _npc)
        g.run.room.clearDelayFrame = g.g:GetFrameCount() + 1
    end
)
functionMap:set(
    92,
    function(____, npc)
        g.g:Fart(npc.Position, 80, npc, 1, 0)
    end
)
functionMap:set(
    249,
    function(____, npc)
        if g.run.babyBool then
            return
        end
        g.run.babyBool = true
        g.run.babyNPC = {type = npc.Type, variant = npc.Variant, subType = npc.SubType}
        for ____, entity2 in ipairs(
            Isaac.GetRoomEntities()
        ) do
            local npc2 = entity2:ToNPC()
            if (npc2 ~= nil) and (npc2.Index ~= npc.Index) then
                g.g:Spawn(npc.Type, npc.Variant, npc2.Position, npc2.Velocity, nil, npc.SubType, npc2.InitSeed)
                npc2:Remove()
            end
        end
    end
)
functionMap:set(
    291,
    function(____, _npc)
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        g.p:AddCacheFlags(CacheFlag.CACHE_DAMAGE)
        g.p:EvaluateItems()
    end
)
functionMap:set(
    376,
    function(____, _npc)
        local brains = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.BOBS_BRAIN, -1, false, false)
        if #brains >= 6 then
            return
        end
        local brain = Isaac.Spawn(EntityType.ENTITY_FAMILIAR, FamiliarVariant.BOBS_BRAIN, 0, g.p.Position, ZERO_VECTOR, nil)
        local brainSprite = brain:GetSprite()
        brainSprite:Load("gfx/003.059_bobs brain2.anm2", true)
        brainSprite:Play("Idle", true)
    end
)
functionMap:set(
    388,
    function(____, npc)
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        __TS__ArrayPush(g.run.room.tears, {frame = 0, position = npc.Position, velocity = ZERO_VECTOR, num = baby.num})
    end
)
functionMap:set(
    390,
    function(____, npc)
        Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.HOT_BOMB_FIRE, 0, npc.Position, ZERO_VECTOR, nil)
    end
)
functionMap:set(
    451,
    function(____, npc)
        Isaac.GridSpawn(GridEntityType.GRID_POOP, 5, npc.Position, false)
    end
)
functionMap:set(
    491,
    function(____, npc)
        Isaac.Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_SUPERTROLL, 0, npc.Position, ZERO_VECTOR, nil)
    end
)
functionMap:set(
    530,
    function(____, npc)
        g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_CHEST, npc.Position, ZERO_VECTOR, nil, 0, npc.InitSeed)
    end
)
return ____exports
end,
["callbacks.postEntityKill"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____postEntityKillBabies = require("callbacks.postEntityKillBabies")
local postEntityKillBabyFunctions = ____postEntityKillBabies.default
function ____exports.main(self, entity)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local npc = entity:ToNPC()
    if npc == nil then
        return
    end
    local babyFunc = postEntityKillBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, npc)
    end
end
return ____exports
end,
["types.TearData"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
end,
["callbacks.postFireTearBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    2,
    function(____, tear)
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        if g.run.babyCounters == baby.num then
            g.run.babyCounters = 0
            tear:ChangeVariant(TearVariant.NEEDLE)
            tear.TearFlags = tear.TearFlags | TearFlags.TEAR_NEEDLE
        end
    end
)
functionMap:set(
    8,
    function(____, tear)
        if g.run.babyBool then
            return
        end
        local seed = tear:GetDropRNG():GetSeed()
        math.randomseed(seed)
        local rotation = math.random(1, 359)
        local vel = tear.Velocity:Rotated(rotation)
        g.run.babyBool = true
        g.p:FireTear(g.p.Position, vel, false, true, false)
        g.run.babyBool = false
    end
)
functionMap:set(
    18,
    function(____, tear)
        tear:ChangeVariant(TearVariant.METALLIC)
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_CONFUSION
    end
)
functionMap:set(
    30,
    function(____, tear)
        tear.Position = g.p.Position
    end
)
functionMap:set(
    34,
    function(____, tear)
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_FLAT
    end
)
functionMap:set(
    35,
    function(____, tear)
        tear:ChangeVariant(TearVariant.BOOGER)
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_BOOGER
    end
)
functionMap:set(
    54,
    function(____, tear)
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_MIDAS
    end
)
functionMap:set(
    55,
    function(____, tear)
        tear.SubType = 1
    end
)
functionMap:set(
    59,
    function(____, tear)
        local knockbackVelocity = tear.Velocity:__mul(-0.75)
        g.p.Velocity = g.p.Velocity:__add(knockbackVelocity)
    end
)
functionMap:set(
    66,
    function(____, tear)
        g.g:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.BOOMERANG, tear.Position, tear.Velocity, tear.SpawnerEntity, 0, tear.InitSeed)
        tear:Remove()
    end
)
functionMap:set(
    77,
    function(____, tear)
        tear:ChangeVariant(TearVariant.BALLOON)
    end
)
functionMap:set(
    81,
    function(____, tear)
        g.p:UseActiveItem(CollectibleType.COLLECTIBLE_SHOOP_DA_WHOOP, false, false, false, false)
        tear:Remove()
    end
)
functionMap:set(
    94,
    function(____, tear)
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_SQUARE
    end
)
functionMap:set(
    100,
    function(____, tear)
        tear.SubType = 1
    end
)
functionMap:set(
    106,
    function(____, tear)
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 45
        if g.run.babyCounters < 360 then
            local vel = tear.Velocity:Rotated(g.run.babyCounters)
            g.p:FireTear(g.p.Position, vel, false, true, false)
        else
            g.run.babyCounters = 0
        end
    end
)
functionMap:set(
    111,
    function(____, tear)
        local gameFrameCount = g.g:GetFrameCount()
        local ____obj, ____index = g.run.babyTears, "numFired"
        ____obj[____index] = ____obj[____index] + 1
        if g.run.babyTears.numFired >= 4 then
            g.run.babyTears.numFired = 0
            g.run.babyTears.frame = gameFrameCount + 1
            g.run.babyTears.velocity = Vector(tear.Velocity.X, tear.Velocity.Y)
        end
    end
)
functionMap:set(
    113,
    function(____, tear)
        g.p:FireTechXLaser(tear.Position, tear.Velocity, 5)
        tear:Remove()
    end
)
functionMap:set(
    114,
    function(____, tear)
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_WIGGLE
    end
)
functionMap:set(
    130,
    function(____, tear)
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_PULSE
    end
)
functionMap:set(
    133,
    function(____, tear)
        tear.Velocity = tear.Velocity:Rotated(-15)
    end
)
functionMap:set(
    152,
    function(____, tear)
        local angleModifier = math.random(0, 90) - 45
        tear.Velocity = tear.Velocity:Rotated(angleModifier)
        local yellow = Color(2, 2, 0, 0.7, 1, 1, 1)
        tear:SetColor(yellow, 10000, 10000, false, false)
    end
)
functionMap:set(
    165,
    function(____, tear)
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        if g.run.babyCounters == baby.num then
            g.run.babyCounters = 0
            tear.TearFlags = tear.TearFlags | TearFlags.TEAR_LIGHT_FROM_HEAVEN
        end
    end
)
functionMap:set(
    185,
    function(____, tear)
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_SLOW
    end
)
functionMap:set(
    187,
    function(____, tear)
        g.g:Spawn(EntityType.ENTITY_FAMILIAR, FamiliarVariant.BLUE_FLY, tear.Position, tear.Velocity, tear.SpawnerEntity, 1, tear.InitSeed)
        tear:Remove()
    end
)
functionMap:set(
    194,
    function(____, tear)
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_FREEZE
        local blue = Color(0, 0, 2, 0.7, 1, 1, 1)
        tear:SetColor(blue, 10000, 10000, false, false)
    end
)
functionMap:set(
    197,
    function(____, tear)
        g.p:FireBrimstone(tear.Velocity)
        tear:Remove()
    end
)
functionMap:set(
    202,
    function(____, tear)
        tear:Remove()
    end
)
functionMap:set(
    206,
    function(____, tear)
        tear.Scale = tear.Scale * 3
    end
)
functionMap:set(
    213,
    function(____, tear)
        tear.SubType = 1
    end
)
functionMap:set(
    230,
    function(____, tear)
        tear.Velocity = tear.Velocity:Rotated(15)
    end
)
functionMap:set(
    231,
    function(____, tear)
        tear.CollisionDamage = g.p.Damage / 2
    end
)
functionMap:set(
    246,
    function(____, tear)
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.distance == nil then
            error(("The \"distance\" attribute was not defined for " .. baby.name) .. ".")
        end
        tear.SubType = 1
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_SPECTRAL
        tear.Position = Vector(0, baby.distance * -1)
        tear.Velocity = Vector(baby.distance / 4, 0)
        tear.FallingSpeed = 0
    end
)
functionMap:set(
    279,
    function(____, tear)
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        if g.run.babyCounters == 2 then
            g.run.babyCounters = 0
            tear:ChangeVariant(TearVariant.EXPLOSIVO)
            tear.TearFlags = tear.TearFlags | TearFlags.TEAR_STICKY
        end
    end
)
functionMap:set(
    288,
    function(____, _tear)
        g.p:UseActiveItem(CollectibleType.COLLECTIBLE_BEAN, false, false, false, false)
    end
)
functionMap:set(
    316,
    function(____, tear)
        if not g.run.babyBool then
            tear.SubType = 1
        end
    end
)
functionMap:set(
    331,
    function(____, tear)
        tear.CollisionDamage = g.p.Damage * 3
    end
)
functionMap:set(
    337,
    function(____, tear)
        local sprite = tear:GetSprite()
        local tearSize = "RegularTear6"
        do
            local i = 0
            while i < 13 do
                local animationName = "RegularTear" .. tostring(i)
                if sprite:IsPlaying(animationName) then
                    tearSize = animationName
                    break
                end
                i = i + 1
            end
        end
        sprite:Load("gfx/fist_tears.anm2", true)
        sprite:Play(tearSize, false)
        local tearAngle = tear.Velocity:GetAngleDegrees()
        if ((tearAngle > 90) and (tearAngle <= 180)) or ((tearAngle >= -180) and (tearAngle < -90)) then
            sprite.FlipY = true
            sprite.Rotation = tearAngle * -1
        else
            sprite.Rotation = tearAngle
        end
        tear.SubType = 1
    end
)
functionMap:set(
    339,
    function(____, tear)
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        tear.Velocity = tear.Velocity:Rotated(45)
        if g.run.babyCounters < 4 then
            g.p:FireTear(
                g.p.Position,
                tear.Velocity:Rotated(45),
                false,
                true,
                false
            )
        else
            g.run.babyCounters = 0
        end
    end
)
functionMap:set(
    340,
    function(____, tear)
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_SPIRAL
    end
)
functionMap:set(
    345,
    function(____, tear)
        tear:ChangeVariant(TearVariant.BOOGER)
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_BOOGER
    end
)
functionMap:set(
    347,
    function(____, tear)
        tear.Velocity = tear.Velocity:Rotated(180)
    end
)
functionMap:set(
    361,
    function(____, tear)
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        if g.run.babyCounters == baby.num then
            g.run.babyCounters = 0
            g.g:Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_NORMAL, tear.Position, tear.Velocity, tear.SpawnerEntity, 0, tear.InitSeed)
            tear:Remove()
        end
    end
)
functionMap:set(
    364,
    function(____, tear)
        local angle = tear.Velocity:GetAngleDegrees()
        local normalizedVelocity = Vector.FromAngle(angle)
        g.p:ShootRedCandle(normalizedVelocity)
        tear:Remove()
    end
)
functionMap:set(
    368,
    function(____, tear)
        tear:ChangeVariant(TearVariant.RAZOR)
        tear.CollisionDamage = g.p.Damage * 3
    end
)
functionMap:set(
    372,
    function(____, tear)
        local hotPink = Color(2, 0.05, 1, 0.7, 1, 1, 1)
        tear:SetColor(hotPink, 10000, 10000, false, false)
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_CHARM
    end
)
functionMap:set(
    380,
    function(____, tear)
        tear.SubType = 1
    end
)
functionMap:set(
    398,
    function(____, tear)
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        if g.run.babyCounters == baby.num then
            g.run.babyCounters = 0
            tear:ChangeVariant(TearVariant.CHAOS_CARD)
        end
    end
)
functionMap:set(
    406,
    function(____, tear)
        tear.SubType = 1
    end
)
functionMap:set(
    410,
    function(____, tear)
        local lightCyan = Color(0.7, 1.5, 2, 0.7, 1, 1, 1)
        tear:SetColor(lightCyan, 10000, 10000, false, false)
        tear.SubType = 1
    end
)
functionMap:set(
    429,
    function(____, tear)
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        if g.run.babyCounters == baby.num then
            g.run.babyCounters = 0
            tear.TearFlags = tear.TearFlags | TearFlags.TEAR_HORN
        end
    end
)
functionMap:set(
    442,
    function(____, tear)
        tear:ChangeVariant(TearVariant.TOOTH)
        tear.CollisionDamage = g.p.Damage * 3.2
    end
)
functionMap:set(
    455,
    function(____, tear)
        local sprite = tear:GetSprite()
        sprite:Load("gfx/shell_green_tears.anm2", true)
        sprite:Play("RegularTear1", false)
        tear.TearFlags = TearFlags.TEAR_BOUNCE | TearFlags.TEAR_POP
        tear.Height = -5
        tear.SubType = 1
        local data = tear:GetData()
        data.Height = tear.Height
        data.Velocity = tear.Velocity
    end
)
functionMap:set(
    458,
    function(____, tear)
        local sprite = tear:GetSprite()
        sprite:Load("gfx/shell_red_tears.anm2", true)
        sprite:Play("RegularTear1", false)
        tear.TearFlags = (TearFlags.TEAR_HOMING | TearFlags.TEAR_BOUNCE) | TearFlags.TEAR_POP
        tear.Height = -5
        tear.SubType = 1
        local data = tear:GetData()
        data.Height = tear.Height
    end
)
functionMap:set(
    459,
    function(____, tear)
        tear.SubType = 1
    end
)
functionMap:set(
    462,
    function(____, tear)
        local gameFrameCount = g.g:GetFrameCount()
        __TS__ArrayPush(
            g.run.room.tears,
            {
                frame = gameFrameCount,
                position = tear.Position,
                velocity = tear.Velocity:Normalized():__mul(30),
                num = 0
            }
        )
        tear:Remove()
    end
)
functionMap:set(
    466,
    function(____, tear)
        tear.Visible = false
    end
)
functionMap:set(
    469,
    function(____, tear)
        tear:ChangeVariant(TearVariant.GODS_FLESH)
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_PIERCING
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_SPLIT
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_WIGGLE
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_PULSE
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_BONE
    end
)
functionMap:set(
    470,
    function(____, tear)
        tear:ChangeVariant(TearVariant.PUPULA)
        tear.Scale = tear.Scale * 10
    end
)
functionMap:set(
    480,
    function(____, tear)
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_ACID
    end
)
functionMap:set(
    487,
    function(____, tear)
        tear.SubType = 1
    end
)
functionMap:set(
    494,
    function(____, tear)
        tear:ChangeVariant(TearVariant.GODS_FLESH)
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_GODS_FLESH
    end
)
functionMap:set(
    498,
    function(____, tear)
        tear:ChangeVariant(TearVariant.BOBS_HEAD)
    end
)
functionMap:set(
    500,
    function(____, tear)
        local gameFrameCount = g.g:GetFrameCount()
        local ____obj, ____index = g.run.babyTears, "numFired"
        ____obj[____index] = ____obj[____index] + 1
        if g.run.babyTears.numFired >= 2 then
            g.run.babyTears.numFired = 0
            g.run.babyTears.frame = gameFrameCount + 1
            g.run.babyTears.velocity = Vector(tear.Velocity.X, tear.Velocity.Y)
        end
    end
)
functionMap:set(
    504,
    function(____, tear)
        if (g.r:GetFrameCount() < 900) and (g.r:GetRoomShape() < RoomShape.ROOMSHAPE_2x2) then
            local abels = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.ABEL, -1, false, false)
            if #abels > 0 then
                local abel = abels[1]
                tear.Position = abel.Position
            else
                Isaac.DebugString("Error. Abel was not found.")
            end
        end
    end
)
functionMap:set(
    517,
    function(____, tear)
        tear:ChangeVariant(TearVariant.EGG)
        tear.TearFlags = tear.TearFlags | TearFlags.TEAR_EGG
    end
)
functionMap:set(
    521,
    function(____, tear)
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        if g.run.babyCounters == 2 then
            g.run.babyCounters = 0
            g.p:ThrowBlueSpider(g.p.Position, g.p.Position)
            tear:Remove()
        end
    end
)
functionMap:set(
    531,
    function(____, tear)
        tear.SubType = 1
    end
)
functionMap:set(
    533,
    function(____, tear)
        tear:Remove()
        g.p:AddBlueFlies(1, g.p.Position, nil)
    end
)
functionMap:set(
    539,
    function(____, tear)
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 90
        if g.run.babyCounters < 360 then
            local vel = tear.Velocity:Rotated(g.run.babyCounters)
            g.p:FireTear(g.p.Position, vel, false, true, false)
        else
            g.run.babyCounters = 0
        end
    end
)
return ____exports
end,
["callbacks.postFireTear"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____postFireTearBabies = require("callbacks.postFireTearBabies")
local postFireTearBabyFunctions = ____postFireTearBabies.default
function ____exports.main(self, tear)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local babyFunc = postFireTearBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, tear)
    end
end
return ____exports
end,
["callbacks.postNewRoomBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____constants = require("constants")
local ZERO_VECTOR = ____constants.ZERO_VECTOR
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local ____enums_2Ecustom = require("types.enums.custom")
local CollectibleTypeCustom = ____enums_2Ecustom.CollectibleTypeCustom
local functionMap = __TS__New(Map)
____exports.default = functionMap
local function noHealth(self)
    local roomType = g.r:GetType()
    local roomDesc = g.l:GetCurrentRoomDesc()
    local roomVariant = roomDesc.Data.Variant
    if ((((((((roomType == RoomType.ROOM_DEVIL) or (roomType == RoomType.ROOM_BLACK_MARKET)) and (roomVariant ~= 2300)) and (roomVariant ~= 2301)) and (roomVariant ~= 2302)) and (roomVariant ~= 2303)) and (roomVariant ~= 2304)) and (roomVariant ~= 2305)) and (roomVariant ~= 2306) then
        g.l:RemoveCurse(LevelCurse.CURSE_OF_THE_UNKNOWN)
    else
        g.l:AddCurse(LevelCurse.CURSE_OF_THE_UNKNOWN, false)
    end
end
functionMap:set(10, noHealth)
functionMap:set(
    13,
    function()
        local roomType = g.r:GetType()
        if (roomType == RoomType.ROOM_DEVIL) or (roomType == RoomType.ROOM_ANGEL) then
            g.l.LeaveDoor = -1
            g.g:StartRoomTransition(GridRooms.ROOM_BLACK_MARKET_IDX, Direction.NO_DIRECTION, 0)
        end
    end
)
functionMap:set(
    14,
    function()
        local laser = g.p:FireTechXLaser(g.p.Position, ZERO_VECTOR, 66):ToLaser()
        if laser == nil then
            return
        end
        if laser.Variant ~= 2 then
            laser.Variant = 2
            laser.SpriteScale = Vector(0.5, 1)
        end
        laser.TearFlags = laser.TearFlags | TearFlags.TEAR_CONTINUUM
        laser.CollisionDamage = laser.CollisionDamage * 0.66
        local data = laser:GetData()
        data.ring = true
    end
)
functionMap:set(
    15,
    function()
        g.r:TurnGold()
    end
)
functionMap:set(
    30,
    function()
        g.run.babyBool = true
        g.p:UseActiveItem(CollectibleType.COLLECTIBLE_SPRINKLER, false, false, false, false)
    end
)
functionMap:set(
    61,
    function()
        for ____, entity in ipairs(
            Isaac.GetRoomEntities()
        ) do
            if entity:HasEntityFlags(EntityFlag.FLAG_FRIENDLY) then
                if entity.Type == EntityType.ENTITY_BOIL then
                    entity:Remove()
                else
                    entity.Position = g.p.Position
                end
            end
        end
    end
)
functionMap:set(
    90,
    function()
        if not g.r:IsClear() then
            return
        end
        do
            local i = 0
            while i <= 7 do
                local door = g.r:GetDoor(i)
                if ((door ~= nil) and (door.TargetRoomType == RoomType.ROOM_DEFAULT)) and door:IsLocked() then
                    door:TryUnlock(true)
                end
                i = i + 1
            end
        end
    end
)
functionMap:set(
    118,
    function()
        local roomType = g.r:GetType()
        local isFirstVisit = g.r:IsFirstVisit()
        local center = g.r:GetCenterPos()
        if (roomType ~= RoomType.ROOM_SECRET) or (not isFirstVisit) then
            return
        end
        do
            local i = 0
            while i < 4 do
                local position = g.r:FindFreePickupSpawnPosition(center, 1, true)
                g.run.randomSeed = misc:incrementRNG(g.run.randomSeed)
                g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, position, ZERO_VECTOR, nil, 0, g.run.randomSeed)
                i = i + 1
            end
        end
    end
)
functionMap:set(125, noHealth)
functionMap:set(138, noHealth)
functionMap:set(
    141,
    function()
        if g.run.level.roomsEntered == 0 then
            return
        end
        if g.run.babyBool then
            g.run.babyBool = false
        else
            g.run.babyBool = true
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_TELEPORT_2, false, false, false, false)
        end
    end
)
functionMap:set(
    149,
    function()
        local roomType = g.r:GetType()
        local isFirstVisit = g.r:IsFirstVisit()
        local center = g.r:GetCenterPos()
        if (roomType ~= RoomType.ROOM_SUPERSECRET) or (not isFirstVisit) then
            return
        end
        do
            local i = 0
            while i < 5 do
                local position = g.r:FindFreePickupSpawnPosition(center, 1, true)
                g.run.randomSeed = misc:incrementRNG(g.run.randomSeed)
                g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, position, ZERO_VECTOR, nil, 0, g.run.randomSeed)
                i = i + 1
            end
        end
    end
)
functionMap:set(
    181,
    function()
        if (g.r:GetType() == RoomType.ROOM_DUNGEON) and (g.run.room.lastRoomIndex ~= GridRooms.ROOM_BLACK_MARKET_IDX) then
            g.l.LeaveDoor = -1
            g.g:StartRoomTransition(GridRooms.ROOM_BLACK_MARKET_IDX, Direction.NO_DIRECTION, 0)
        end
    end
)
functionMap:set(
    216,
    function()
        local currentRoomIndex = g.l:GetCurrentRoomIndex()
        local startingRoomIndex = g.l:GetStartingRoomIndex()
        local isFirstVisit = g.r:IsFirstVisit()
        if (currentRoomIndex ~= startingRoomIndex) or (not isFirstVisit) then
            return
        end
        local positions = {{3, 1}, {9, 1}, {3, 5}, {9, 5}, {1, 1}, {11, 1}, {1, 5}, {11, 5}}
        local positionIndex = 0
        local rooms = g.l:GetRooms()
        do
            local i = 0
            while i < rooms.Size do
                do
                    local roomDesc = rooms:Get(i)
                    if roomDesc == nil then
                        goto __continue35
                    end
                    local roomData = roomDesc.Data
                    local roomType = roomData.Type
                    local itemID = CollectibleType.COLLECTIBLE_NULL
                    local price = 0
                    local ____switch37 = roomType
                    if ____switch37 == RoomType.ROOM_SHOP then
                        goto ____switch37_case_0
                    elseif ____switch37 == RoomType.ROOM_TREASURE then
                        goto ____switch37_case_1
                    elseif ____switch37 == RoomType.ROOM_MINIBOSS then
                        goto ____switch37_case_2
                    elseif ____switch37 == RoomType.ROOM_ARCADE then
                        goto ____switch37_case_3
                    elseif ____switch37 == RoomType.ROOM_CURSE then
                        goto ____switch37_case_4
                    elseif ____switch37 == RoomType.ROOM_CHALLENGE then
                        goto ____switch37_case_5
                    elseif ____switch37 == RoomType.ROOM_LIBRARY then
                        goto ____switch37_case_6
                    elseif ____switch37 == RoomType.ROOM_SACRIFICE then
                        goto ____switch37_case_7
                    elseif ____switch37 == RoomType.ROOM_ISAACS then
                        goto ____switch37_case_8
                    elseif ____switch37 == RoomType.ROOM_BARREN then
                        goto ____switch37_case_9
                    elseif ____switch37 == RoomType.ROOM_CHEST then
                        goto ____switch37_case_10
                    elseif ____switch37 == RoomType.ROOM_DICE then
                        goto ____switch37_case_11
                    end
                    goto ____switch37_case_default
                    ::____switch37_case_0::
                    do
                        do
                            itemID = CollectibleTypeCustom.COLLECTIBLE_SHOP_TELEPORT
                            price = 10
                            goto ____switch37_end
                        end
                    end
                    ::____switch37_case_1::
                    do
                        do
                            itemID = CollectibleTypeCustom.COLLECTIBLE_TREASURE_ROOM_TELEPORT
                            price = 10
                            goto ____switch37_end
                        end
                    end
                    ::____switch37_case_2::
                    do
                        do
                            itemID = CollectibleTypeCustom.COLLECTIBLE_MINIBOSS_ROOM_TELEPORT
                            price = 10
                            goto ____switch37_end
                        end
                    end
                    ::____switch37_case_3::
                    do
                        do
                            itemID = CollectibleTypeCustom.COLLECTIBLE_ARCADE_TELEPORT
                            price = 10
                            goto ____switch37_end
                        end
                    end
                    ::____switch37_case_4::
                    do
                        do
                            itemID = CollectibleTypeCustom.COLLECTIBLE_CURSE_ROOM_TELEPORT
                            price = 10
                            goto ____switch37_end
                        end
                    end
                    ::____switch37_case_5::
                    do
                        do
                            itemID = CollectibleTypeCustom.COLLECTIBLE_CHALLENGE_ROOM_TELEPORT
                            price = 10
                            goto ____switch37_end
                        end
                    end
                    ::____switch37_case_6::
                    do
                        do
                            itemID = CollectibleTypeCustom.COLLECTIBLE_LIBRARY_TELEPORT
                            price = 15
                            goto ____switch37_end
                        end
                    end
                    ::____switch37_case_7::
                    do
                        do
                            itemID = CollectibleTypeCustom.COLLECTIBLE_SACRIFICE_ROOM_TELEPORT
                            price = 10
                            goto ____switch37_end
                        end
                    end
                    ::____switch37_case_8::
                    do
                        do
                            itemID = CollectibleTypeCustom.COLLECTIBLE_BEDROOM_CLEAN_TELEPORT
                            price = 10
                            goto ____switch37_end
                        end
                    end
                    ::____switch37_case_9::
                    do
                        do
                            itemID = CollectibleTypeCustom.COLLECTIBLE_BEDROOM_DIRTY_TELEPORT
                            price = 20
                            goto ____switch37_end
                        end
                    end
                    ::____switch37_case_10::
                    do
                        do
                            itemID = CollectibleTypeCustom.COLLECTIBLE_TREASURE_CHEST_ROOM_TELEPORT
                            price = 15
                            goto ____switch37_end
                        end
                    end
                    ::____switch37_case_11::
                    do
                        do
                            itemID = CollectibleTypeCustom.COLLECTIBLE_DICE_ROOM_TELEPORT
                            price = 10
                            goto ____switch37_end
                        end
                    end
                    ::____switch37_case_default::
                    do
                        do
                            goto ____switch37_end
                        end
                    end
                    ::____switch37_end::
                    if itemID ~= 0 then
                        positionIndex = positionIndex + 1
                        if positionIndex > #positions then
                            Isaac.DebugString("Error. This floor has too many special rooms for Fancy Baby.")
                            return
                        end
                        local xy = positions[positionIndex + 1]
                        local position = misc:gridToPos(xy[1], xy[2])
                        local pedestal = g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, position, ZERO_VECTOR, nil, itemID, g.run.room.RNG):ToPickup()
                        if pedestal ~= nil then
                            pedestal.AutoUpdatePrice = false
                            pedestal.Price = price
                        end
                    end
                end
                ::__continue35::
                i = i + 1
            end
        end
    end
)
functionMap:set(
    242,
    function()
        local currentRoomIndex = g.l:GetCurrentRoomIndex()
        local startingRoomIndex = g.l:GetStartingRoomIndex()
        if currentRoomIndex ~= startingRoomIndex then
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_D10, false, false, false, false)
        end
    end
)
functionMap:set(
    249,
    function()
        local roomType = g.r:GetType()
        if ((not g.run.babyBool) or (roomType == RoomType.ROOM_BOSS)) or (roomType == RoomType.ROOM_DEVIL) then
            return
        end
        for ____, entity in ipairs(
            Isaac.GetRoomEntities()
        ) do
            local npc = entity:ToNPC()
            if ((npc ~= nil) and (npc.Type ~= EntityType.ENTITY_SHOPKEEPER)) and (npc.Type ~= EntityType.ENTITY_FIREPLACE) then
                g.g:Spawn(g.run.babyNPC.type, g.run.babyNPC.variant, npc.Position, npc.Velocity, nil, g.run.babyNPC.subType, npc.InitSeed)
                npc:Remove()
            end
        end
    end
)
functionMap:set(
    261,
    function()
        if g.r:GetType() ~= RoomType.ROOM_SECRET then
            return
        end
        local rooms = g.l:GetRooms()
        do
            local i = 0
            while i < rooms.Size do
                do
                    local roomDesc = rooms:Get(i)
                    if roomDesc == nil then
                        goto __continue62
                    end
                    local index = roomDesc.SafeGridIndex
                    local roomData = roomDesc.Data
                    local roomType = roomData.Type
                    if roomType == RoomType.ROOM_SUPERSECRET then
                        g.l.LeaveDoor = -1
                        g.g:StartRoomTransition(index, Direction.NO_DIRECTION, 3)
                        break
                    end
                end
                ::__continue62::
                i = i + 1
            end
        end
    end
)
functionMap:set(
    282,
    function()
        g.p:SpawnMawOfVoid((30 * 60) * 60)
    end
)
functionMap:set(
    287,
    function()
        local roomType = g.r:GetType()
        local isFirstVisit = g.r:IsFirstVisit()
        local maxHearts = g.p:GetMaxHearts()
        if ((((((((not isFirstVisit) or (roomType == RoomType.ROOM_DEFAULT)) or (roomType == RoomType.ROOM_ERROR)) or (roomType == RoomType.ROOM_BOSS)) or (roomType == RoomType.ROOM_DEVIL)) or (roomType == RoomType.ROOM_ANGEL)) or (roomType == RoomType.ROOM_DUNGEON)) or (roomType == RoomType.ROOM_BOSSRUSH)) or (roomType == RoomType.ROOM_BLACK_MARKET) then
            return
        end
        g.run.room.RNG = misc:incrementRNG(g.run.room.RNG)
        local item = g.itemPool:GetCollectible(ItemPoolType.POOL_DEVIL, true, g.run.room.RNG)
        local position = misc:gridToPos(6, 4)
        local pedestal = g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, position, ZERO_VECTOR, nil, item, g.run.room.RNG):ToPickup()
        if pedestal ~= nil then
            pedestal.AutoUpdatePrice = false
            if maxHearts == 0 then
                pedestal.Price = -3
            else
                local itemConfig = misc:getItemConfig(item)
                pedestal.Price = itemConfig.DevilPrice * -1
            end
        end
        g.r:SpawnGridEntity(52, GridEntityType.GRID_STATUE, 0, 0, 0)
        do
            local i = 0
            while i < 2 do
                local pos
                if i == 0 then
                    pos = misc:gridToPos(3, 1)
                else
                    pos = misc:gridToPos(9, 1)
                end
                g.run.room.RNG = misc:incrementRNG(g.run.room.RNG)
                g.g:Spawn(EntityType.ENTITY_FIREPLACE, 0, pos, ZERO_VECTOR, nil, 0, g.run.room.RNG)
                i = i + 1
            end
        end
    end
)
functionMap:set(
    297,
    function()
        local currentRoomIndex = g.l:GetCurrentRoomIndex()
        local startingRoomIndex = g.l:GetStartingRoomIndex()
        if currentRoomIndex == startingRoomIndex then
            return
        end
        do
            local i = 0
            while i <= 7 do
                local door = g.r:GetDoor(i)
                if door ~= nil then
                    door:Open()
                end
                i = i + 1
            end
        end
    end
)
functionMap:set(
    351,
    function()
        local roomClear = g.r:IsClear()
        if not roomClear then
            return
        end
        do
            local i = 0
            while i <= 7 do
                local door = g.r:GetDoor(i)
                if ((door ~= nil) and (door.TargetRoomType == RoomType.ROOM_DEFAULT)) and door:IsLocked() then
                    door:TryUnlock(true)
                end
                i = i + 1
            end
        end
    end
)
functionMap:set(
    431,
    function()
        local maws = Isaac.FindByType(EntityType.ENTITY_GAPING_MAW, -1, -1, false, false)
        for ____, maw in ipairs(maws) do
            maw:Remove()
        end
        local brokenMaws = Isaac.FindByType(EntityType.ENTITY_BROKEN_GAPING_MAW, -1, -1, false, false)
        for ____, brokenMaw in ipairs(brokenMaws) do
            brokenMaw:Remove()
        end
    end
)
functionMap:set(
    492,
    function()
        local currentRoomIndex = g.l:GetCurrentRoomIndex()
        local startingRoomIndex = g.l:GetStartingRoomIndex()
        if currentRoomIndex ~= startingRoomIndex then
            g.p:UsePill(PillEffect.PILLEFFECT_RETRO_VISION, PillColor.PILL_NULL)
        end
    end
)
functionMap:set(
    504,
    function()
        local abels = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.ABEL, -1, false, false)
        for ____, abel in ipairs(abels) do
            local familiar = abel:ToFamiliar()
            if familiar ~= nil then
                familiar.FireCooldown = 1000000
            end
        end
    end
)
functionMap:set(
    516,
    function()
        local currentRoomIndex = g.l:GetCurrentRoomIndex()
        local startingRoomIndex = g.l:GetStartingRoomIndex()
        if currentRoomIndex ~= startingRoomIndex then
            g.p:UsePill(PillEffect.PILLEFFECT_IM_EXCITED, PillColor.PILL_NULL)
        end
    end
)
functionMap:set(
    522,
    function()
        local godheadTear = g.p:FireTear(g.p.Position, ZERO_VECTOR, false, true, false)
        godheadTear.TearFlags = TearFlags.TEAR_GLOW
        godheadTear.SubType = 1
        local sprite = godheadTear:GetSprite()
        sprite:Load("gfx/tear_blank.anm2", true)
        sprite:Play("RegularTear6", false)
    end
)
return ____exports
end,
["timer"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local sprites, loadSprites, convertSecondsToStrings
function loadSprites(self)
    sprites.clock = Sprite()
    sprites.clock:Load("gfx/timer/clock.anm2", true)
    sprites.clock:SetFrame("Default", 0)
    do
        local i = 0
        while i < 2 do
            local colonSprite = Sprite()
            colonSprite:Load("gfx/timer/colon.anm2", true)
            colonSprite:SetFrame("Default", 0)
            __TS__ArrayPush(sprites.colons, colonSprite)
            i = i + 1
        end
    end
    do
        local i = 0
        while i < 5 do
            local digitSprite = Sprite()
            digitSprite:Load("gfx/timer/timer.anm2", true)
            digitSprite:SetFrame("Default", 0)
            __TS__ArrayPush(sprites.digits, digitSprite)
            i = i + 1
        end
    end
    sprites.digitMini = Sprite()
    sprites.digitMini:Load("gfx/timer/timerMini.anm2", true)
    sprites.digitMini:SetFrame("Default", 0)
end
function convertSecondsToStrings(self, totalSeconds)
    local hours = math.floor(totalSeconds / 3600)
    local minutes = math.floor(totalSeconds / 60)
    if hours > 0 then
        minutes = minutes - (hours * 60)
    end
    local minutesString
    if minutes < 10 then
        minutesString = "0" .. tostring(minutes)
    else
        minutesString = tostring(minutes)
    end
    local minute1String = string.sub(minutesString, 1, 1)
    local minute1 = __TS__ParseInt(minute1String, 10)
    local minute2String = string.sub(minutesString, 2, 2)
    local minute2 = __TS__ParseInt(minute2String, 10)
    local seconds = math.floor(totalSeconds % 60)
    local secondsString
    if seconds < 10 then
        secondsString = "0" .. tostring(seconds)
    else
        secondsString = tostring(seconds)
    end
    local second1String = string.sub(secondsString, 1, 1)
    local second1 = __TS__ParseInt(second1String, 10)
    local second2String = string.sub(secondsString, 2, 2)
    local second2 = __TS__ParseInt(second2String, 10)
    local rawSeconds = totalSeconds % 60
    local decimals = rawSeconds - math.floor(rawSeconds)
    local tenths = math.floor(decimals * 10)
    return {hours, minute1, minute2, second1, second2, tenths}
end
sprites = {
    clock = Sprite(),
    colons = {},
    digits = {},
    digitMini = Sprite()
}
function ____exports.display(self)
    local gameFrameCount = g.g:GetFrameCount()
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local finishTime
    if ((baby.name == "Noose Baby") or (baby.name == "Vomit Baby")) or (baby.name == "Scoreboard Baby") then
        finishTime = g.run.babyCounters
    end
    if (finishTime == nil) or (finishTime == 0) then
        return
    end
    if #sprites.digits == 0 then
        loadSprites(nil)
    end
    local remainingFrames = finishTime - gameFrameCount
    local remainingSeconds = remainingFrames / 30
    local hours, minute1, minute2, second1, second2, tenths = table.unpack(
        convertSecondsToStrings(nil, remainingSeconds)
    )
    local digitLength = 7.25
    local hourAdjustment = 2
    local hourAdjustment2 = 0
    local startingX = 65
    local startingY = 79
    local posClock = Vector(startingX + 34, startingY + 45)
    sprites.clock:RenderLayer(0, posClock)
    if hours > 0 then
        hourAdjustment2 = 2
        startingX = (startingX + digitLength) + hourAdjustment
        local posHours = Vector((startingX - digitLength) - hourAdjustment, startingY)
        local hoursDigitSprite = sprites.digits[5]
        hoursDigitSprite:SetFrame("Default", hours)
        hoursDigitSprite:RenderLayer(0, posHours)
        local posColon = Vector((startingX - digitLength) + 7, startingY + 19)
        local colonHoursSprite = sprites.colons[2]
        colonHoursSprite:RenderLayer(0, posColon)
    end
    local posMinute1 = Vector(startingX, startingY)
    local minute1Sprite = sprites.digits[1]
    minute1Sprite:SetFrame("Default", minute1)
    minute1Sprite:RenderLayer(0, posMinute1)
    local posMinute2 = Vector(startingX + digitLength, startingY)
    local minute2Sprite = sprites.digits[2]
    minute2Sprite:SetFrame("Default", minute2)
    minute2Sprite:RenderLayer(0, posMinute2)
    local posColon1 = Vector((startingX + digitLength) + 10, startingY + 19)
    local colonMinutesSprite = sprites.colons[1]
    colonMinutesSprite:RenderLayer(0, posColon1)
    local posSecond1 = Vector((startingX + digitLength) + 11, startingY)
    local second1Sprite = sprites.digits[3]
    second1Sprite:SetFrame("Default", second1)
    second1Sprite:RenderLayer(0, posSecond1)
    local posSecond2 = Vector(((((startingX + digitLength) + 11) + digitLength) + 1) - hourAdjustment2, startingY)
    local second2Sprite = sprites.digits[4]
    second2Sprite:SetFrame("Default", second2)
    second2Sprite:RenderLayer(0, posSecond2)
    local posTenths = Vector((((((startingX + digitLength) + 11) + digitLength) + 1) - hourAdjustment2) + digitLength, startingY + 1)
    sprites.digitMini:SetFrame("Default", tenths)
    sprites.digitMini:RenderLayer(0, posTenths)
end
return ____exports
end,
["callbacks.postRenderBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____constants = require("constants")
local ZERO_VECTOR = ____constants.ZERO_VECTOR
local ____globals = require("globals")
local g = ____globals.default
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    48,
    function()
        if g.run.babySprite ~= nil then
            local opacity = g.run.babyCounters / 90
            if opacity > 1 then
                opacity = 1
            end
            g.run.babySprite.Color = Color(1, 1, 1, opacity, 0, 0, 0)
            g.run.babySprite:RenderLayer(0, ZERO_VECTOR)
        end
    end
)
functionMap:set(
    125,
    function()
        if g.run.babySprite == nil then
            return
        end
        local roomType = g.r:GetType()
        local roomDesc = g.l:GetCurrentRoomDesc()
        local roomVariant = roomDesc.Data.Variant
        if ((((((((roomType ~= RoomType.ROOM_DEVIL) and (roomType ~= RoomType.ROOM_BLACK_MARKET)) and (roomVariant ~= 2300)) and (roomVariant ~= 2301)) and (roomVariant ~= 2302)) and (roomVariant ~= 2303)) and (roomVariant ~= 2304)) and (roomVariant ~= 2305)) and (roomVariant ~= 2306) then
            local keys = g.p:GetNumKeys()
            local x = 65
            g.run.babySprite:RenderLayer(
                0,
                Vector(x, 12)
            )
            local text = "x" .. tostring(keys)
            Isaac.RenderText(text, x + 5, 12, 2, 2, 2, 2)
        end
    end
)
functionMap:set(
    138,
    function()
        if g.run.babySprite == nil then
            return
        end
        local roomType = g.r:GetType()
        local roomDesc = g.l:GetCurrentRoomDesc()
        local roomVariant = roomDesc.Data.Variant
        if ((((((((roomType ~= RoomType.ROOM_DEVIL) and (roomType ~= RoomType.ROOM_BLACK_MARKET)) and (roomVariant ~= 2300)) and (roomVariant ~= 2301)) and (roomVariant ~= 2302)) and (roomVariant ~= 2303)) and (roomVariant ~= 2304)) and (roomVariant ~= 2305)) and (roomVariant ~= 2306) then
            local bombs = g.p:GetNumBombs()
            local x = 65
            g.run.babySprite:RenderLayer(
                0,
                Vector(x, 12)
            )
            local text = "x" .. tostring(bombs)
            Isaac.RenderText(text, x + 5, 12, 2, 2, 2, 2)
        end
    end
)
functionMap:set(
    377,
    function()
        local spears = Isaac.FindByType(EntityType.ENTITY_EFFECT, EffectVariant.SPEAR_OF_DESTINY, -1, false, false)
        for ____, spear in ipairs(spears) do
            if spear:GetSprite():GetFilename() == "gfx/1000.083_Spear Of Destiny.anm2" then
                local sprite = spear:GetSprite()
                sprite:Load("gfx/1000.083_spear of destiny2.anm2", true)
                sprite:Play("Idle", true)
            end
        end
    end
)
return ____exports
end,
["callbacks.postRender"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____constants = require("constants")
local DEFAULT_KCOLOR = ____constants.DEFAULT_KCOLOR
local VERSION = ____constants.VERSION
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local timer = require("timer")
local ____enums_2Ecustom = require("types.enums.custom")
local CollectibleTypeCustom = ____enums_2Ecustom.CollectibleTypeCustom
local ____postRenderBabies = require("callbacks.postRenderBabies")
local postRenderBabyFunctions = ____postRenderBabies.default
local clockSprite, checkPlayerSprite, trackPlayerAnimations, drawBabyIntro, drawBabyNumber, drawVersion, drawTempIcon, getScreenCenterPosition, drawBabyEffects
function checkPlayerSprite(self)
    local gameFrameCount = g.g:GetFrameCount()
    local roomFrameCount = g.r:GetFrameCount()
    if gameFrameCount == 0 then
        g.p:ClearCostumes()
    end
    if g.p:HasCollectible(CollectibleType.COLLECTIBLE_MAW_OF_VOID) then
        g.p:RemoveCostume(
            misc:getItemConfig(CollectibleType.COLLECTIBLE_MAW_OF_VOID)
        )
    end
    if roomFrameCount == 0 then
        if g.p:HasCollectible(CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON) then
            g.p:RemoveCostume(
                misc:getItemConfig(CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON)
            )
        end
        if g.p:HasCollectible(CollectibleType.COLLECTIBLE_EMPTY_VESSEL) then
            g.p:TryRemoveNullCostume(NullItemID.ID_EMPTY_VESSEL)
        end
    end
    trackPlayerAnimations(nil)
end
function trackPlayerAnimations(self)
    local playerSprite = g.p:GetSprite()
    local animations = {"Pickup", "Hit", "Sad", "Happy", "PickupWalkDown", "PickupWalkLeft", "PickupWalkUp", "PickupWalkRight"}
    local currentlyPlayingAnimation = ""
    for ____, animation in ipairs(animations) do
        if playerSprite:IsPlaying(animation) then
            currentlyPlayingAnimation = animation
            break
        end
    end
    local pickupWalkLength = #"PickupWalk"
    local prefix1 = string.sub(currentlyPlayingAnimation, 0, pickupWalkLength)
    local prefix2 = string.sub(g.run.animation, 0, pickupWalkLength)
    if prefix1 ~= prefix2 then
        g.run.animation = currentlyPlayingAnimation
        if currentlyPlayingAnimation ~= "" then
            ____exports.setPlayerSprite(nil)
            playerSprite:Play(currentlyPlayingAnimation, false)
        end
    end
end
function ____exports.setPlayerSprite(self)
    local playerSprite = g.p:GetSprite()
    local hearts = g.p:GetHearts()
    local effects = g.p:GetEffects()
    local effectsList = effects:GetEffectsList()
    local babyType, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    g.p:ClearCostumes()
    if g.p:HasCollectible(CollectibleType.COLLECTIBLE_DADS_RING) then
        g.p:AddCostume(
            misc:getItemConfig(CollectibleType.COLLECTIBLE_DADS_RING),
            false
        )
    end
    if (g.p.CanFly or (g.p:HasCollectible(CollectibleType.COLLECTIBLE_EMPTY_VESSEL) and (hearts == 0))) and (baby.name ~= "Butterfly Baby 2") then
        g.p:AddCostume(
            misc:getItemConfig(CollectibleType.COLLECTIBLE_FATE),
            false
        )
    end
    do
        local i = 1
        while i <= effectsList.Size do
            local effect = effectsList:Get(i - 1)
            if (effect ~= nil) and (effect.Item.ID == CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS) then
                g.p:AddCostume(
                    misc:getItemConfig(CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS),
                    false
                )
                break
            end
            i = i + 1
        end
    end
    playerSprite:Load(
        ("gfx/co-op/" .. tostring(babyType)) .. ".anm2",
        true
    )
end
function drawBabyIntro(self)
    local gameFrameCount = g.g:GetFrameCount()
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    if misc:isButtonPressed(ButtonAction.ACTION_MAP) then
        g.run.showIntroFrame = gameFrameCount + 60
    end
    if gameFrameCount > g.run.showIntroFrame then
        return
    end
    local center = getScreenCenterPosition(nil)
    local scale = 1.75
    local text
    local x
    local y
    text = baby.name
    x = center.X - ((3 * scale) * #text)
    y = center.Y - 80
    Isaac.RenderScaledText(text, x, y, scale, scale, 2, 2, 2, 2)
    text = baby.description
    x = center.X - (3 * #text)
    y = center.Y - 55
    Isaac.RenderText(text, x, y, 2, 2, 2, 2)
    if baby.description2 ~= nil then
        text = baby.description2
        x = center.X - (3 * #text)
        y = center.Y - 40
        Isaac.RenderText(text, x, y, 2, 2, 2, 2)
    end
end
function drawBabyNumber(self)
    local babyType, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local text = "#" .. tostring(babyType)
    local x = 55 + misc:getHeartXOffset()
    if (baby.name == "Hopeless Baby") or (baby.name == "Mohawk Baby") then
        x = x + 20
    end
    local y = 10
    g.font:DrawString(text, x, y, DEFAULT_KCOLOR, 0, true)
end
function drawVersion(self)
    local gameFrameCount = g.g:GetFrameCount()
    if Input.IsButtonPressed(Keyboard.KEY_V, 0) then
        g.run.showVersionFrame = gameFrameCount + 60
    end
    if (g.run.showVersionFrame == 0) or (gameFrameCount > g.run.showVersionFrame) then
        return
    end
    local center = getScreenCenterPosition(nil)
    local text
    local scale
    local x
    local y
    text = "The Babies Mod"
    scale = 1
    x = center.X - ((3 * scale) * #text)
    y = center.Y
    Isaac.RenderScaledText(text, x, y, scale, scale, 2, 2, 2, 2)
    text = VERSION
    scale = 1
    x = center.X - ((3 * scale) * #text)
    y = center.Y + 15
    Isaac.RenderScaledText(text, x, y, scale, scale, 2, 2, 2, 2)
end
function drawTempIcon(self)
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    if baby.item == nil then
        return
    end
    local itemConfig = misc:getItemConfig(baby.item)
    if itemConfig.Type ~= ItemType.ITEM_ACTIVE then
        return
    end
    if clockSprite == nil then
        clockSprite = Sprite()
        clockSprite:Load("gfx/clock.anm2", true)
        clockSprite:SetFrame("Default", 0)
    end
    local clockX = 30
    local clockY = 30
    if g.p:HasCollectible(baby.item) then
        clockSprite:RenderLayer(
            0,
            Vector(clockX, clockY)
        )
    elseif (g.racingPlusEnabled and g.p:HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM)) and (RacingPlusGlobals.run.schoolbag.item == baby.item) then
        local pos = Vector(clockX + 27, clockY + 32)
        clockSprite:RenderLayer(0, pos)
    end
end
function getScreenCenterPosition(self)
    local shape = g.r:GetRoomShape()
    local centerPos = g.r:GetCenterPos()
    local topLeftPos = g.r:GetTopLeftPos()
    local centerOffset = centerPos:__sub(topLeftPos)
    local pos = centerPos
    if centerOffset.X > 260 then
        pos.X = pos.X - 260
    end
    if (shape == RoomShape.ROOMSHAPE_LBL) or (shape == RoomShape.ROOMSHAPE_LTL) then
        pos.X = pos.X - 260
    end
    if centerOffset.Y > 140 then
        pos.Y = pos.Y - 140
    end
    if (shape == RoomShape.ROOMSHAPE_LTR) or (shape == RoomShape.ROOMSHAPE_LTL) then
        pos.Y = pos.Y - 140
    end
    return Isaac.WorldToRenderPosition(pos)
end
function drawBabyEffects(self)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local babyFunc = postRenderBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil)
    end
end
clockSprite = nil
function ____exports.main(self)
    g.l = g.g:GetLevel()
    g.r = g.g:GetRoom()
    g.p = g.g:GetPlayer(0)
    g.seeds = g.g:GetSeeds()
    g.itemPool = g.g:GetItemPool()
    local ____, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    checkPlayerSprite(nil)
    drawBabyIntro(nil)
    drawBabyNumber(nil)
    drawVersion(nil)
    drawTempIcon(nil)
    drawBabyEffects(nil)
    timer:display()
end
return ____exports
end,
["callbacks.postNewRoom"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local ____GlobalsRunBabyTears = require("types.GlobalsRunBabyTears")
local GlobalsRunBabyTears = ____GlobalsRunBabyTears.default
local ____GlobalsRunRoom = require("types.GlobalsRunRoom")
local GlobalsRunRoom = ____GlobalsRunRoom.default
local ____postNewRoomBabies = require("callbacks.postNewRoomBabies")
local postNewRoomBabyFunctions = ____postNewRoomBabies.default
local postRender = require("callbacks.postRender")
local applyTemporaryEffects
function ____exports.newRoom(self)
    local roomIndex = misc:getRoomIndex()
    local startingRoomIndex = g.l:GetStartingRoomIndex()
    local roomClear = g.r:IsClear()
    local roomSeed = g.r:GetSpawnSeed()
    local ____obj, ____index = g.run.level, "roomsEntered"
    ____obj[____index] = ____obj[____index] + 1
    if (roomIndex == startingRoomIndex) and (g.run.level.roomsEntered == 1) then
        g.run.level.roomsEntered = 0
    end
    g.run.room = __TS__New(GlobalsRunRoom, roomIndex, roomClear, roomSeed)
    g.run.babyCountersRoom = 0
    g.run.babyTears = __TS__New(GlobalsRunBabyTears)
    local ____, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    postRender:setPlayerSprite()
    if g.run.drawIntro then
        g.run.drawIntro = false
    end
    applyTemporaryEffects(nil)
end
function applyTemporaryEffects(self)
    local effects = g.p:GetEffects()
    local canFly = g.p.CanFly
    local babyType, baby = table.unpack(
        misc:getCurrentBaby()
    )
    if baby.flight and (not canFly) then
        effects:AddCollectibleEffect(CollectibleType.COLLECTIBLE_BIBLE, true)
    end
    local babyFunc = postNewRoomBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil)
    end
end
function ____exports.main(self)
    g.l = g.g:GetLevel()
    g.r = g.g:GetRoom()
    g.p = g.g:GetPlayer(0)
    g.seeds = g.g:GetSeeds()
    g.itemPool = g.g:GetItemPool()
    local gameFrameCount = g.g:GetFrameCount()
    local stage = g.l:GetStage()
    local stageType = g.l:GetStageType()
    if ((gameFrameCount == 0) or (g.run.level.stage ~= stage)) or (g.run.level.stageType ~= stageType) then
        return
    end
    ____exports.newRoom(nil)
end
return ____exports
end,
["callbacks.postNewLevel"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____babyAdd = require("babyAdd")
local babyAdd = ____babyAdd.default
local ____babyCheckValid = require("babyCheckValid")
local babyCheckValid = ____babyCheckValid.default
local ____babyRemove = require("babyRemove")
local babyRemove = ____babyRemove.default
local ____constants = require("constants")
local R7_SEASON_5 = ____constants.R7_SEASON_5
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local ____GlobalsRunLevel = require("types.GlobalsRunLevel")
local GlobalsRunLevel = ____GlobalsRunLevel.default
local postNewRoom = require("callbacks.postNewRoom")
local getNewBaby
function ____exports.newLevel(self)
    local gameFrameCount = g.g:GetFrameCount()
    local stage = g.l:GetStage()
    local stageType = g.l:GetStageType()
    local challenge = Isaac.GetChallenge()
    if (gameFrameCount ~= 0) and (gameFrameCount == g.run.level.stageFrame) then
        return
    end
    g.run.level = __TS__New(GlobalsRunLevel, stage, stageType, gameFrameCount)
    g.run.babyBool = false
    g.run.babyCounters = 0
    g.run.babyFrame = 0
    g.run.babyNPC = {type = 0, variant = 0, subType = 0}
    g.run.babySprite = nil
    g.run.showIntroFrame = gameFrameCount + 60
    if challenge == Isaac.GetChallengeIdByName(R7_SEASON_5) then
        g.l:RemoveCurse(LevelCurse.CURSE_OF_THE_UNKNOWN)
    end
    babyRemove(nil)
    getNewBaby(nil)
    babyAdd(nil)
    postNewRoom:newRoom()
end
function getNewBaby(self)
    local seed = g.l:GetDungeonPlacementSeed()
    if not g.run.enabled then
        g.run.babyType = 0
        return
    end
    if #g.pastBabies > 500 then
        g.pastBabies = {}
    end
    local babyType
    local i = 0
    repeat
        do
            i = i + 1
            seed = misc:incrementRNG(seed)
            math.randomseed(seed)
            babyType = math.random(1, #g.babies)
            if g.debugBabyNum ~= nil then
                babyType = g.debugBabyNum
                break
            end
        end
    until babyCheckValid(nil, babyType)
    g.run.babyType = babyType
    __TS__ArrayPush(g.pastBabies, babyType)
    local ____, baby = table.unpack(
        misc:getCurrentBaby()
    )
    Isaac.DebugString(
        (((("Randomly chose co-op baby. " .. tostring(babyType)) .. " - ") .. baby.name) .. " - ") .. baby.description
    )
    Isaac.DebugString(
        (("Tries: " .. tostring(i)) .. ", total past babies: ") .. tostring(#g.pastBabies)
    )
end
function ____exports.main(self)
    local gameFrameCount = g.g:GetFrameCount()
    if gameFrameCount == 0 then
        return
    end
    ____exports.newLevel(nil)
end
return ____exports
end,
["callbacks.postGameStarted"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____constants = require("constants")
local R7_SEASON_5 = ____constants.R7_SEASON_5
local ____globals = require("globals")
local g = ____globals.default
local ____enums_2Ecustom = require("types.enums.custom")
local CollectibleTypeCustom = ____enums_2Ecustom.CollectibleTypeCustom
local ____GlobalsRun = require("types.GlobalsRun")
local GlobalsRun = ____GlobalsRun.default
local postNewLevel = require("callbacks.postNewLevel")
function ____exports.main(self, isContinued)
    local character = g.p:GetPlayerType()
    local challenge = Isaac.GetChallenge()
    local randomSeed = g.l:GetDungeonPlacementSeed()
    if isContinued then
        return
    end
    g.run = __TS__New(GlobalsRun, randomSeed)
    local resetPastBabies = true
    if ((challenge == Isaac.GetChallengeIdByName(R7_SEASON_5)) and g.racingPlusEnabled) and (RacingPlusSpeedrun.charNum >= 2) then
        resetPastBabies = false
    end
    if resetPastBabies then
        g.pastBabies = {}
    end
    for ____, baby in ipairs(g.babies) do
        if baby.seed ~= nil then
            if g.seeds:HasSeedEffect(baby.seed) then
                g.seeds:RemoveSeedEffect(baby.seed)
            end
        end
    end
    if g.seeds:HasSeedEffect(SeedEffect.SEED_OLD_TV) then
        g.seeds:RemoveSeedEffect(SeedEffect.SEED_OLD_TV)
    end
    if character == Isaac.GetPlayerTypeByName("Random Baby") then
        g.run.enabled = true
    else
        return
    end
    if not g.racingPlusEnabled then
        g.p:AddCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG, 0, false)
        g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG)
    else
        g.p:AddCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM, 0, false)
        g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG)
        g.itemPool:RemoveCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM)
    end
    g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_GUILLOTINE)
    g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_SCISSORS)
    g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_CLICKER)
    g.itemPool:RemoveTrinket(TrinketType.TRINKET_BAT_WING)
    postNewLevel:newLevel()
end
return ____exports
end,
["callbacks.postKnifeInitBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    522,
    function(____, knife)
        knife.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE
        knife.Visible = false
    end
)
return ____exports
end,
["callbacks.postKnifeInit"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____postKnifeInitBabies = require("callbacks.postKnifeInitBabies")
local postKnifeInitBabyFunctions = ____postKnifeInitBabies.default
function ____exports.main(self, knife)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local babyFunc = postKnifeInitBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, knife)
    end
end
return ____exports
end,
["callbacks.postLaserInitBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    51,
    function(____, laser)
        if laser:GetSprite():GetFilename() == "gfx/007.001_Thick Red Laser.anm2" then
            laser.Visible = false
        end
    end
)
return ____exports
end,
["callbacks.postLaserInit"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____postLaserInitBabies = require("callbacks.postLaserInitBabies")
local postLaserInitBabyFunctions = ____postLaserInitBabies.default
function ____exports.main(self, laser)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local babyFunc = postLaserInitBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, laser)
    end
end
return ____exports
end,
["callbacks.postLaserUpdateBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    14,
    function(____, laser)
        local data = laser:GetData()
        if data.ring == true then
            laser.Position = g.p.Position
        end
    end
)
functionMap:set(
    51,
    function(____, laser)
        if (laser.SpawnerType == EntityType.ENTITY_PLAYER) and (laser.FrameCount == 0) then
            laser:SetMaxDistance(75.125)
            g.sfx:Play(SoundEffect.SOUND_BLOOD_LASER_LARGE, 0.75, 0, false, 1)
        end
        if (laser:GetSprite():GetFilename() == "gfx/007.001_Thick Red Laser.anm2") and (laser.FrameCount == 1) then
            laser.Visible = true
        end
    end
)
functionMap:set(
    463,
    function(____, laser)
        if laser.FrameCount == 0 then
            misc:setRandomColor(laser)
        end
    end
)
return ____exports
end,
["callbacks.postLaserUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____postLaserUpdateBabies = require("callbacks.postLaserUpdateBabies")
local postLaserUpdateBabyFunctions = ____postLaserUpdateBabies.default
function ____exports.main(self, laser)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local babyFunc = postLaserUpdateBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, laser)
    end
end
return ____exports
end,
["callbacks.postNPCInitBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local misc = require("misc")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    36,
    function(____, npc)
        npc.Scale = 0.5
    end
)
functionMap:set(
    37,
    function(____, npc)
        npc.Scale = 2
    end
)
functionMap:set(
    463,
    function(____, npc)
        misc:setRandomColor(npc)
    end
)
return ____exports
end,
["callbacks.postNPCInit"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____postNPCInitBabies = require("callbacks.postNPCInitBabies")
local postNPCInitBabyFunctions = ____postNPCInitBabies.default
function ____exports.main(self, npc)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local babyFunc = postNPCInitBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, npc)
    end
end
return ____exports
end,
["callbacks.postPickupInitBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    36,
    function(____, pickup)
        pickup.SpriteScale = Vector(0.5, 0.5)
    end
)
functionMap:set(
    37,
    function(____, pickup)
        if (g.l:GetStage() ~= 11) or (g.l:GetCurrentRoomIndex() ~= g.l:GetStartingRoomIndex()) then
            pickup.SpriteScale = Vector(2, 2)
        end
    end
)
functionMap:set(
    215,
    function(____, pickup)
        if pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE then
            local roomType = g.r:GetType()
            if (roomType == RoomType.ROOM_SHOP) or (roomType == RoomType.ROOM_ERROR) then
                pickup.Price = 0
            end
        end
    end
)
functionMap:set(
    253,
    function(____, pickup)
        if pickup.Variant ~= PickupVariant.PICKUP_TAROTCARD then
            return
        end
        if (((((((pickup.SubType >= Card.CARD_FOOL) and (pickup.SubType <= Card.RUNE_ALGIZ)) or (pickup.SubType == Card.CARD_CHAOS)) or (pickup.SubType == Card.CARD_RULES)) or (pickup.SubType == Card.CARD_SUICIDE_KING)) or (pickup.SubType == Card.CARD_GET_OUT_OF_JAIL)) or (pickup.SubType == Card.CARD_QUESTIONMARK)) or ((pickup.SubType >= Card.CARD_HUGE_GROWTH) and (pickup.SubType <= Card.CARD_ERA_WALK)) then
            local sprite = pickup:GetSprite()
            sprite:ReplaceSpritesheet(
                0,
                ("gfx/cards/" .. tostring(pickup.SubType)) .. ".png"
            )
            sprite:LoadGraphics()
        end
    end
)
functionMap:set(
    317,
    function(____, pickup)
        if pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE then
            pickup.AutoUpdatePrice = false
            pickup.Price = misc:getItemHeartPrice(pickup.SubType)
        end
    end
)
functionMap:set(
    463,
    function(____, pickup)
        misc:setRandomColor(pickup)
    end
)
functionMap:set(
    527,
    function(____, pickup)
        if pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE then
            local roomType = g.r:GetType()
            if (roomType == RoomType.ROOM_DEVIL) or (roomType == RoomType.ROOM_BLACK_MARKET) then
                pickup.Price = 0
            end
        end
    end
)
functionMap:set(
    537,
    function(____, pickup)
        if pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE then
            local roomType = g.r:GetType()
            if (roomType == RoomType.ROOM_DEVIL) or (roomType == RoomType.ROOM_BLACK_MARKET) then
                pickup.AutoUpdatePrice = false
            end
            if pickup.Price <= 0 then
                pickup.Price = 15
            end
        end
    end
)
return ____exports
end,
["callbacks.postPickupInit"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____enums_2Ecustom = require("types.enums.custom")
local CollectibleTypeCustom = ____enums_2Ecustom.CollectibleTypeCustom
local ____postPickupInitBabies = require("callbacks.postPickupInitBabies")
local postPickupInitBabyFunctions = ____postPickupInitBabies.default
function ____exports.main(self, pickup)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    if (pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE) and (pickup.SubType == CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT) then
        return
    end
    local babyFunc = postPickupInitBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, pickup)
    end
end
return ____exports
end,
["callbacks.postPickupSelectionBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    237,
    function(____, _pickup, variant, subType)
        if (variant == PickupVariant.PICKUP_COIN) and (subType == CoinSubType.COIN_PENNY) then
            return {PickupVariant.PICKUP_COIN, CoinSubType.COIN_NICKEL}
        end
        return nil
    end
)
functionMap:set(
    342,
    function(____, _pickup, variant, subType)
        if variant == PickupVariant.PICKUP_KEY then
            return {PickupVariant.PICKUP_BOMB, subType}
        end
        return nil
    end
)
functionMap:set(
    395,
    function(____, _pickup, variant, subType)
        if variant == PickupVariant.PICKUP_BOMB then
            if subType == 5 then
                subType = 1
            end
            return {PickupVariant.PICKUP_KEY, subType}
        end
        return nil
    end
)
return ____exports
end,
["callbacks.postPickupSelection"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____postPickupSelectionBabies = require("callbacks.postPickupSelectionBabies")
local postPickupSelectionBabyFunctions = ____postPickupSelectionBabies.default
function ____exports.main(self, pickup, variant, subType)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return nil
    end
    local babyFunc = postPickupSelectionBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        return babyFunc(nil, pickup, variant, subType)
    end
    return nil
end
return ____exports
end,
["pickupTouchedFunctions"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    11,
    function()
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        g.p:AddCacheFlags(CacheFlag.CACHE_DAMAGE)
        g.p:EvaluateItems()
    end
)
functionMap:set(
    147,
    function()
        g.p:UsePill(PillEffect.PILLEFFECT_PARALYSIS, PillColor.PILL_NULL)
    end
)
functionMap:set(
    167,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        if g.run.babyFrame == 0 then
            g.run.babyFrame = gameFrameCount + baby.num
        end
    end
)
functionMap:set(
    307,
    function()
        g.p:TakeDamage(
            1,
            0,
            EntityRef(g.p),
            0
        )
    end
)
functionMap:set(
    473,
    function()
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        g.p:AddCacheFlags(CacheFlag.CACHE_DAMAGE)
        g.p:EvaluateItems()
    end
)
return ____exports
end,
["callbacks.postPickupUpdateBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____constants = require("constants")
local ZERO_VECTOR = ____constants.ZERO_VECTOR
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    131,
    function(____, pickup)
        if ((((((pickup.FrameCount == 1) and (pickup.Variant ~= PickupVariant.PICKUP_COLLECTIBLE)) and (pickup.Variant ~= PickupVariant.PICKUP_SHOPITEM)) and (pickup.Variant ~= PickupVariant.PICKUP_BIGCHEST)) and (pickup.Variant ~= PickupVariant.PICKUP_TROPHY)) and (pickup.Variant ~= PickupVariant.PICKUP_BED)) and (pickup.Price == 0) then
            pickup:Remove()
            do
                local i = 0
                while i < 3 do
                    local position = Vector(pickup.Position.X + (15 * i), pickup.Position.X + (15 * i))
                    g.p:ThrowBlueSpider(position, g.p.Position)
                    i = i + 1
                end
            end
        end
    end
)
functionMap:set(
    140,
    function(____, pickup)
        if ((((pickup.Variant ~= PickupVariant.PICKUP_COLLECTIBLE) and (pickup.Variant ~= PickupVariant.PICKUP_SHOPITEM)) and (pickup.Variant ~= PickupVariant.PICKUP_BIGCHEST)) and (pickup.Variant ~= PickupVariant.PICKUP_TROPHY)) and (pickup.Variant ~= PickupVariant.PICKUP_BED) then
            if pickup.EntityCollisionClass ~= EntityCollisionClass.ENTCOLL_NONE then
                pickup.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE
            end
            if g.p.Position:Distance(pickup.Position) <= 25 then
                local x = pickup.Position.X - g.p.Position.X
                local y = pickup.Position.Y - g.p.Position.Y
                pickup.Velocity = Vector(x / 2, y / 2)
            end
        end
    end
)
functionMap:set(
    154,
    function(____, pickup)
        if ((((((pickup.Variant ~= PickupVariant.PICKUP_COLLECTIBLE) and (pickup.Variant ~= PickupVariant.PICKUP_SHOPITEM)) and (pickup.Variant ~= PickupVariant.PICKUP_BIGCHEST)) and (pickup.Variant ~= PickupVariant.PICKUP_TROPHY)) and (pickup.Variant ~= PickupVariant.PICKUP_BED)) and (pickup.Price == 0)) and (pickup.Position:Distance(g.p.Position) <= 80) then
            local velocity = pickup.Position:__sub(g.p.Position)
            velocity = velocity:Normalized()
            velocity = velocity:__mul(8)
            pickup.Velocity = velocity
        end
    end
)
functionMap:set(
    166,
    function(____, pickup)
        local data = pickup:GetData()
        if ((pickup.FrameCount == 2) and (((((pickup.Variant == PickupVariant.PICKUP_CHEST) or (pickup.Variant == PickupVariant.PICKUP_BOMBCHEST)) or (pickup.Variant == PickupVariant.PICKUP_ETERNALCHEST)) or (pickup.Variant == PickupVariant.PICKUP_LOCKEDCHEST)) or (pickup.Variant == PickupVariant.PICKUP_REDCHEST))) and (data.unavoidableReplacement == nil) then
            g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_MIMICCHEST, pickup.Position, pickup.Velocity, pickup.Parent, 0, pickup.InitSeed)
            pickup:Remove()
        elseif (pickup.Variant == PickupVariant.PICKUP_SPIKEDCHEST) and (pickup.SubType == 0) then
            g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, pickup.Position, ZERO_VECTOR, nil, 0, pickup.InitSeed)
            pickup:Remove()
        end
    end
)
functionMap:set(
    177,
    function(____, pickup)
        if pickup.Variant ~= PickupVariant.PICKUP_COIN then
            return
        end
        local data = pickup:GetData()
        if (data.touched ~= nil) or (data.recovery == nil) then
            return
        end
        local sprite = pickup:GetSprite()
        if pickup.FrameCount <= 60 then
            if pickup.EntityCollisionClass ~= EntityCollisionClass.ENTCOLL_NONE then
                pickup.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE
            end
            if g.p.Position:Distance(pickup.Position) <= 25 then
                local x = pickup.Position.X - g.p.Position.X
                local y = pickup.Position.Y - g.p.Position.Y
                pickup.Velocity = Vector(x / 2, y / 2)
            end
            if not sprite:IsPlaying("Blink") then
                sprite:Play("Blink", true)
            end
        else
            if pickup.EntityCollisionClass ~= EntityCollisionClass.ENTCOLL_ALL then
                pickup.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL
            end
            if not sprite:IsPlaying("Idle") then
                sprite:Play("Idle", true)
            end
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
)
functionMap:set(
    216,
    function(____, pickup)
        local currentRoomIndex = g.l:GetCurrentRoomIndex()
        local startingRoomIndex = g.l:GetStartingRoomIndex()
        if (((pickup.Variant == PickupVariant.PICKUP_HEART) and (pickup.SubType == HeartSubType.HEART_FULL)) and (pickup.Price == 3)) and (currentRoomIndex == startingRoomIndex) then
            pickup:Remove()
        end
    end
)
functionMap:set(
    277,
    function(____, pickup)
        local sprite = pickup:GetSprite()
        if (pickup.Variant == PickupVariant.PICKUP_SPIKEDCHEST) and (sprite:GetFilename() ~= "gfx/005.052_spikedchest2.anm2") then
            sprite:Load("gfx/005.052_spikedchest2.anm2", true)
            if pickup.FrameCount == 0 then
                sprite:Play("Appear", false)
            else
                sprite:Play("Idle", false)
            end
        elseif (pickup.Variant == PickupVariant.PICKUP_MIMICCHEST) and (sprite:GetFilename() ~= "gfx/005.054_mimic chest2.anm2") then
            sprite:Load("gfx/005.054_mimic chest2.anm2", true)
            sprite:Play("Appear", false)
        end
    end
)
functionMap:set(
    287,
    function(____, pickup)
        local roomType = g.r:GetType()
        if (((((((roomType == RoomType.ROOM_DEFAULT) or (roomType == RoomType.ROOM_ERROR)) or (roomType == RoomType.ROOM_BOSS)) or (roomType == RoomType.ROOM_DEVIL)) or (roomType == RoomType.ROOM_ANGEL)) or (roomType == RoomType.ROOM_DUNGEON)) or (roomType == RoomType.ROOM_BOSSRUSH)) or (roomType == RoomType.ROOM_BLACK_MARKET) then
            return
        end
        if pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE then
            local price = misc:getItemHeartPrice(pickup.SubType)
            if pickup.Price ~= price then
                pickup.AutoUpdatePrice = false
                pickup.Price = price
            end
        elseif ((pickup.Variant == PickupVariant.PICKUP_HEART) and (pickup.SubType == HeartSubType.HEART_FULL)) and (pickup.Price == 3) then
            g.run.room.RNG = misc:incrementRNG(g.run.room.RNG)
            local item = g.itemPool:GetCollectible(ItemPoolType.POOL_DEVIL, true, g.run.room.RNG)
            local pedestal = g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, pickup.Position, ZERO_VECTOR, nil, item, pickup.InitSeed):ToPickup()
            if pedestal ~= nil then
                pedestal.AutoUpdatePrice = false
                pedestal.Price = misc:getItemHeartPrice(pedestal.SubType)
            end
            pickup:Remove()
        end
    end
)
functionMap:set(
    317,
    function(____, pickup)
        local roomType = g.r:GetType()
        if pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE then
            local price = misc:getItemHeartPrice(pickup.SubType)
            if pickup.Price ~= price then
                pickup.AutoUpdatePrice = false
                pickup.Price = price
            end
        elseif (((pickup.Variant == PickupVariant.PICKUP_HEART) and (pickup.SubType == HeartSubType.HEART_FULL)) and (pickup.Price == 3)) and (roomType ~= RoomType.ROOM_SHOP) then
            local pedestal = g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, pickup.Position, ZERO_VECTOR, nil, 0, pickup.InitSeed):ToPickup()
            if pedestal ~= nil then
                pedestal.AutoUpdatePrice = false
                pedestal.Price = misc:getItemHeartPrice(pedestal.SubType)
            end
            pickup:Remove()
        end
    end
)
functionMap:set(
    381,
    function(____, pickup)
        local gameFrameCount = g.g:GetFrameCount()
        local isFirstVisit = g.r:IsFirstVisit()
        if ((((pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE) and isFirstVisit) and (pickup.FrameCount == 2)) and (pickup.State ~= 2)) and ((g.run.babyCountersRoom == 0) or (g.run.babyCountersRoom == gameFrameCount)) then
            local position = g.r:FindFreePickupSpawnPosition(pickup.Position, 1, true)
            g.run.randomSeed = misc:incrementRNG(g.run.randomSeed)
            local pedestal = g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, position, ZERO_VECTOR, nil, 0, g.run.randomSeed):ToPickup()
            if pedestal ~= nil then
                pedestal.Price = pickup.Price
                pedestal.TheresOptionsPickup = pickup.TheresOptionsPickup
                pedestal.State = 2
            end
            g.run.babyCountersRoom = gameFrameCount
        end
    end
)
functionMap:set(
    394,
    function(____, pickup)
        if ((pickup.FrameCount % 35) == 0) and (not pickup:GetSprite():IsPlaying("Collect")) then
            local velocity = g.p.Position:__sub(pickup.Position)
            velocity = velocity:Normalized()
            velocity = velocity:__mul(7)
            Isaac.Spawn(EntityType.ENTITY_PROJECTILE, ProjectileVariant.PROJECTILE_NORMAL, 0, pickup.Position, velocity, pickup)
        end
    end
)
functionMap:set(
    537,
    function(____, pickup)
        local roomType = g.r:GetType()
        if ((((roomType ~= RoomType.ROOM_SHOP) and (roomType ~= RoomType.ROOM_ERROR)) and (pickup.Variant == PickupVariant.PICKUP_HEART)) and (pickup.SubType == HeartSubType.HEART_FULL)) and (pickup.Price == 3) then
            g.run.room.RNG = misc:incrementRNG(g.run.room.RNG)
            local pedestal = g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, pickup.Position, ZERO_VECTOR, nil, 0, g.run.room.RNG):ToPickup()
            if pedestal ~= nil then
                pedestal.Price = 15
            end
            pickup:Remove()
        end
    end
)
return ____exports
end,
["callbacks.postPickupUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local ____pickupTouchedFunctions = require("pickupTouchedFunctions")
local pickupTouchedFunctions = ____pickupTouchedFunctions.default
local ____enums_2Ecustom = require("types.enums.custom")
local CollectibleTypeCustom = ____enums_2Ecustom.CollectibleTypeCustom
local ____postPickupUpdateBabies = require("callbacks.postPickupUpdateBabies")
local postPickupUpdateBabyFunctions = ____postPickupUpdateBabies.default
function ____exports.main(self, pickup)
    local data = pickup:GetData()
    local sprite = pickup:GetSprite()
    local babyType, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    if (pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE) and (pickup.SubType == CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT) then
        return
    end
    if (((((baby.trinket ~= nil) and (pickup.Variant == PickupVariant.PICKUP_TRINKET)) and (pickup.SubType ~= baby.trinket)) and (pickup.FrameCount == 1)) and (not g.p:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_PURSE))) and (not g.p:HasCollectible(CollectibleType.COLLECTIBLE_BELLY_BUTTON)) then
        misc:spawnRandomPickup(pickup.Position, pickup.Velocity, true)
        pickup:Remove()
        return
    end
    if sprite:IsPlaying("Collect") and (data.touched == nil) then
        data.touched = true
        Isaac.DebugString(
            ((((("Touched pickup. " .. tostring(pickup.Type)) .. ".") .. tostring(pickup.Variant)) .. ".") .. tostring(pickup.SubType)) .. " (BM)"
        )
        local babyFunc = pickupTouchedFunctions:get(babyType)
        if babyFunc ~= nil then
            babyFunc(nil)
        end
    end
    local babyFunc = postPickupUpdateBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, pickup)
    end
end
return ____exports
end,
["callbacks.postPlayerInit"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
function ____exports.main(self, player)
    if player.Variant ~= 0 then
        return
    end
    g.p = player
end
return ____exports
end,
["callbacks.postProjectileUpdateBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    61,
    function(____, projectile)
        if (projectile.Parent ~= nil) and projectile.Parent:HasEntityFlags(EntityFlag.FLAG_FRIENDLY) then
            local color = projectile:GetColor()
            local fadeAmount = 0.25
            local newColor = Color(color.R, color.G, color.B, fadeAmount, 0, 0, 0)
            projectile:SetColor(newColor, 0, 0, true, true)
        end
    end
)
functionMap:set(
    109,
    function(____, projectile)
        if (projectile.SpawnerType ~= EntityType.ENTITY_MOMS_HEART) and (projectile.SpawnerType ~= EntityType.ENTITY_ISAAC) then
            projectile:AddProjectileFlags(ProjectileFlags.SMART)
        end
    end
)
functionMap:set(
    153,
    function(____, projectile)
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.distance == nil then
            error(("The \"distance\" attribute was not defined for " .. baby.name) .. ".")
        end
        if projectile.Position:Distance(g.p.Position) <= baby.distance then
            Isaac.Spawn(
                EntityType.ENTITY_BOMBDROP,
                BombVariant.BOMB_NORMAL,
                0,
                projectile.Position,
                projectile.Velocity:__mul(-1),
                nil
            )
            projectile:Remove()
        end
    end
)
functionMap:set(
    224,
    function(____, projectile)
        local data = projectile:GetData()
        if ((data.spedUp == nil) and (projectile.SpawnerType ~= EntityType.ENTITY_MOMS_HEART)) and (projectile.SpawnerType ~= EntityType.ENTITY_ISAAC) then
            data.spedUp = true
            projectile.Velocity = projectile.Velocity:__mul(2)
        end
    end
)
functionMap:set(
    280,
    function(____, projectile)
        local data = projectile:GetData()
        if data.modified == nil then
            data.modified = true
            projectile:AddProjectileFlags(ProjectileFlags.CONTINUUM)
            projectile.Height = projectile.Height * 2
        end
    end
)
functionMap:set(
    318,
    function(____, projectile)
        if (projectile.FrameCount == 1) and (projectile.SpawnerType == EntityType.ENTITY_FIREPLACE) then
            projectile:Remove()
        end
    end
)
functionMap:set(
    463,
    function(____, projectile)
        if projectile.FrameCount == 1 then
            misc:setRandomColor(projectile)
        end
    end
)
return ____exports
end,
["callbacks.postProjectileUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____postProjectileUpdateBabies = require("callbacks.postProjectileUpdateBabies")
local postProjectileUpdateBabyFunctions = ____postProjectileUpdateBabies.default
function ____exports.main(self, projectile)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local babyFunc = postProjectileUpdateBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, projectile)
    end
end
return ____exports
end,
["callbacks.postTearInitBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    36,
    function(____, tear)
        tear.SpriteScale = Vector(0.5, 0.5)
    end
)
functionMap:set(
    37,
    function(____, tear)
        tear.SpriteScale = Vector(2, 2)
    end
)
return ____exports
end,
["callbacks.postTearInit"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____postTearInitBabies = require("callbacks.postTearInitBabies")
local postTearInitBabyFunctions = ____postTearInitBabies.default
function ____exports.main(self, tear)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local babyFunc = postTearInitBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, tear)
    end
end
return ____exports
end,
["callbacks.postTearUpdateBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____constants = require("constants")
local ZERO_VECTOR = ____constants.ZERO_VECTOR
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    100,
    function(____, tear)
        if (tear.SubType == 1) and ((tear.FrameCount % 2) == 0) then
            local fire = Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.HOT_BOMB_FIRE, 0, tear.Position, ZERO_VECTOR, nil)
            fire.SpriteScale = Vector(0.5, 0.5)
            local color = fire:GetColor()
            local fadeAmount = 0.5
            local newColor = Color(color.R, color.G, color.B, fadeAmount, color.RO, color.GO, color.BO)
            fire:SetColor(newColor, 0, 0, true, true)
        end
    end
)
functionMap:set(
    213,
    function(____, tear)
        if (tear.SubType == 1) and (tear.FrameCount >= 10) then
            local distance = 40000
            local closestNPC
            for ____, entity in ipairs(
                Isaac.GetRoomEntities()
            ) do
                local npc = entity:ToNPC()
                if (((npc ~= nil) and npc:IsVulnerableEnemy()) and (not npc:IsDead())) and (g.p.Position:Distance(npc.Position) < distance) then
                    distance = g.p.Position:Distance(npc.Position)
                    closestNPC = npc
                end
            end
            if closestNPC == nil then
                return
            end
            local initialSpeed = tear.Velocity:LengthSquared()
            tear.Velocity = closestNPC.Position:__sub(tear.Position)
            tear.Velocity = tear.Velocity:Normalized()
            while tear.Velocity:LengthSquared() < initialSpeed do
                tear.Velocity = tear.Velocity:__mul(1.1)
            end
        end
    end
)
functionMap:set(
    228,
    function(____, tear)
        if ((tear.FrameCount == 1) and (tear.SpawnerType == EntityType.ENTITY_FAMILIAR)) and (tear.SpawnerVariant == FamiliarVariant.ABEL) then
            if g.r:GetFrameCount() >= 30 then
                g.g:Spawn(EntityType.ENTITY_PROJECTILE, ProjectileVariant.PROJECTILE_NORMAL, tear.Position, tear.Velocity, nil, 0, tear.InitSeed)
            end
            tear:Remove()
        end
    end
)
functionMap:set(
    246,
    function(____, tear)
        if tear.SubType ~= 1 then
            return
        end
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.distance == nil then
            error(("The \"distance\" attribute was not defined for " .. baby.name) .. ".")
        end
        local positionMod = Vector(0, baby.distance * -1)
        local degrees = tear.FrameCount * 8
        positionMod = positionMod:Rotated(degrees)
        tear.Position = g.p.Position:__add(positionMod)
        tear.Velocity = Vector(baby.distance / 4, 0)
        tear.Velocity = tear.Velocity:Rotated(degrees)
        if tear.FrameCount < 150 then
            tear.FallingSpeed = 0
        end
    end
)
functionMap:set(
    292,
    function(____, tear)
        if (tear.Parent ~= nil) and (tear.Parent.Type == EntityType.ENTITY_PLAYER) then
            tear.Position = Vector(g.p.Position.X, g.p.Position.Y + 10)
            tear:GetSprite():Reset()
        end
    end
)
functionMap:set(
    316,
    function(____, tear)
        if (tear.SubType == 1) and (tear.FrameCount >= 20) then
            local rotation = 45
            do
                local i = 0
                while i < 4 do
                    rotation = rotation + 90
                    local rotatedVelocity = tear.Velocity:Rotated(rotation)
                    g.run.babyBool = true
                    local xTear = g.p:FireTear(g.p.Position, rotatedVelocity, false, true, false)
                    g.run.babyBool = false
                    xTear.Position = tear.Position
                    xTear.Height = tear.Height
                    i = i + 1
                end
            end
            tear:Remove()
        end
    end
)
functionMap:set(
    380,
    function(____, tear)
        if (tear.SubType == 1) and ((g.g:GetFrameCount() % 5) == 0) then
            local creep = Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_BLACK, 0, tear.Position, ZERO_VECTOR, tear):ToEffect()
            if creep ~= nil then
                creep.Timeout = 240
            end
        end
    end
)
functionMap:set(
    434,
    function(____, tear)
        tear.SpriteScale = Vector(tear.SpriteScale.X + 0.1, tear.SpriteScale.Y + 0.1)
    end
)
functionMap:set(
    455,
    function(____, tear)
        if tear.SubType ~= 1 then
            return
        end
        if tear.FrameCount <= 120 then
            local data = tear:GetData()
            if (data.Height == nil) or (data.Velocity == nil) then
                return
            end
            local tearData = data
            if ((((tear.Velocity.X > 0) and (tearData.Velocity.X < 0)) or ((tear.Velocity.X < 0) and (tearData.Velocity.X > 0))) or ((tear.Velocity.Y > 0) and (tearData.Velocity.Y < 0))) or ((tear.Velocity.Y < 0) and (tearData.Velocity.Y > 0)) then
                tearData.Velocity = tear.Velocity
            end
            tear.Height = tearData.Height
            tear.Velocity = tearData.Velocity
        else
            tear:Remove()
        end
    end
)
functionMap:set(
    458,
    function(____, tear)
        if tear.SubType ~= 1 then
            return
        end
        if tear.FrameCount <= 120 then
            local data = tear:GetData()
            if data.Height == nil then
                return
            end
            local tearData = data
            tear.Height = tearData.Height
            tear.Velocity = tear.Velocity:Normalized()
            tear.Velocity = tear.Velocity:__mul(10)
        else
            tear:Remove()
        end
    end
)
functionMap:set(
    459,
    function(____, tear)
        if (tear.SubType == 1) and tear:IsDead() then
            g.run.babyCounters = 0
            g.p:AddCacheFlags(CacheFlag.CACHE_FIREDELAY)
            g.p:EvaluateItems()
        end
    end
)
functionMap:set(
    463,
    function(____, tear)
        if tear.FrameCount == 0 then
            misc:setRandomColor(tear)
        end
    end
)
functionMap:set(
    487,
    function(____, tear)
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        if (tear.SubType == 1) and tear:IsDead() then
            local ____obj, ____index = g.run, "babyCounters"
            ____obj[____index] = ____obj[____index] + 1
            if g.run.babyCounters == baby.num then
                g.run.babyCounters = 0
                g.p:TakeDamage(
                    1,
                    0,
                    EntityRef(g.p),
                    0
                )
            end
        end
    end
)
functionMap:set(
    522,
    function(____, tear)
        if tear.SubType ~= 1 then
            return
        end
        local knives = Isaac.FindByType(EntityType.ENTITY_KNIFE, -1, -1, false, false)
        if #knives > 0 then
            local knife = knives[1]
            tear.Height = -10
            tear.Position = knife.Position
            tear.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE
            tear.GridCollisionClass = EntityGridCollisionClass.GRIDCOLL_NONE
        end
    end
)
functionMap:set(
    531,
    function(____, tear)
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        if (tear.SubType == 1) and tear:IsDead() then
            local ____obj, ____index = g.run, "babyCounters"
            ____obj[____index] = ____obj[____index] + 1
            if g.run.babyCounters == baby.num then
                g.run.babyCounters = 0
                g.p:UsePill(PillEffect.PILLEFFECT_PARALYSIS, PillColor.PILL_NULL)
            end
        end
    end
)
return ____exports
end,
["callbacks.postTearUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____postTearUpdateBabies = require("callbacks.postTearUpdateBabies")
local postTearUpdateBabyFunctions = ____postTearUpdateBabies.default
function ____exports.main(self, tear)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local babyFunc = postTearUpdateBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil, tear)
    end
end
return ____exports
end,
["roomClearedBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____constants = require("constants")
local ZERO_VECTOR = ____constants.ZERO_VECTOR
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    1,
    function()
        local roomSeed = g.r:GetSpawnSeed()
        math.randomseed(roomSeed)
        local heartSubType = math.random(1, 11)
        Isaac.Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_HEART, heartSubType, g.p.Position, ZERO_VECTOR, g.p)
    end
)
functionMap:set(
    88,
    function()
        local roomType = g.r:GetType()
        local roomSeed = g.r:GetSpawnSeed()
        if roomType == RoomType.ROOM_BOSS then
            return
        end
        local position = g.r:FindFreePickupSpawnPosition(g.p.Position, 1, true)
        g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, position, ZERO_VECTOR, g.p, 0, roomSeed)
    end
)
functionMap:set(
    192,
    function()
        misc:addCharge()
        if g.racingPlusEnabled then
            RacingPlusSchoolbag:AddCharge(true)
        end
    end
)
functionMap:set(
    384,
    function()
        local roomSeed = g.r:GetSpawnSeed()
        g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BOMB, g.p.Position, ZERO_VECTOR, g.p, 0, roomSeed)
    end
)
return ____exports
end,
["pseudoRoomClear"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local initializeDoors, checkPseudoClear, getNumAliveNPCs, isAttachedNPC, checkAllPressurePlatesPushed, clearRoom
function initializeDoors(self)
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    g.r:SetClear(true)
    g.run.room.pseudoClear = false
    do
        local i = 0
        while i <= 7 do
            local door = g.r:GetDoor(i)
            if (door ~= nil) and (((door.TargetRoomType == RoomType.ROOM_DEFAULT) or (door.TargetRoomType == RoomType.ROOM_MINIBOSS)) or (door.TargetRoomType == RoomType.ROOM_SACRIFICE)) then
                __TS__ArrayPush(g.run.room.doorsModified, i)
                if baby.name == "Black Baby" then
                    door:SetRoomTypes(door.CurrentRoomType, RoomType.ROOM_CURSE)
                    door:Open()
                elseif baby.name == "Nerd Baby" then
                    door:SetLocked(true)
                elseif baby.name == "Mouse Baby" then
                    door:SetRoomTypes(door.CurrentRoomType, RoomType.ROOM_SHOP)
                    door:SetLocked(true)
                end
            end
            i = i + 1
        end
    end
end
function checkPseudoClear(self)
    local gameFrameCount = g.g:GetFrameCount()
    if g.run.room.pseudoClear then
        return
    end
    if (g.run.room.clearDelayFrame ~= 0) and (gameFrameCount >= g.run.room.clearDelayFrame) then
        g.run.room.clearDelayFrame = 0
    end
    if (((getNumAliveNPCs(nil) == 0) and (g.run.room.clearDelayFrame == 0)) and checkAllPressurePlatesPushed(nil)) and (gameFrameCount > 1) then
        clearRoom(nil)
    end
end
function getNumAliveNPCs(self)
    local numAliveEnemies = 0
    for ____, entity in ipairs(
        Isaac.GetRoomEntities()
    ) do
        local npc = entity:ToNPC()
        if ((((npc ~= nil) and npc.CanShutDoors) and (not npc:IsDead())) and (((npc.Type ~= EntityType.ENTITY_RAGLING) or (npc.Variant ~= 1)) or (npc.State ~= NpcState.STATE_UNIQUE_DEATH))) and (not isAttachedNPC(nil, npc)) then
            numAliveEnemies = numAliveEnemies + 1
        end
    end
    return numAliveEnemies
end
function isAttachedNPC(self, npc)
    return (((((((((((npc.Type == EntityType.ENTITY_CHARGER) and (npc.Variant == 0)) and (npc.SubType == 1)) or ((npc.Type == EntityType.ENTITY_VIS) and (npc.Variant == 22))) or ((npc.Type == EntityType.ENTITY_DEATH) and (npc.Variant == 10))) or ((npc.Type == EntityType.ENTITY_PEEP) and (npc.Variant == 10))) or ((npc.Type == EntityType.ENTITY_PEEP) and (npc.Variant == 11))) or ((npc.Type == EntityType.ENTITY_BEGOTTEN) and (npc.Variant == 10))) or ((npc.Type == EntityType.ENTITY_MAMA_GURDY) and (npc.Variant == 1))) or ((npc.Type == EntityType.ENTITY_MAMA_GURDY) and (npc.Variant == 2))) or ((npc.Type == EntityType.ENTITY_BIG_HORN) and (npc.Variant == 1))) or ((npc.Type == EntityType.ENTITY_BIG_HORN) and (npc.Variant == 2))
end
function checkAllPressurePlatesPushed(self)
    if (not g.r:HasTriggerPressurePlates()) or g.run.room.buttonsPushed then
        return true
    end
    local gridSize = g.r:GetGridSize()
    do
        local i = 1
        while i <= gridSize do
            local gridEntity = g.r:GetGridEntity(i)
            if gridEntity ~= nil then
                local saveState = gridEntity:GetSaveState()
                if (saveState.Type == GridEntityType.GRID_PRESSURE_PLATE) and (saveState.State ~= 3) then
                    return false
                end
            end
            i = i + 1
        end
    end
    g.run.room.buttonsPushed = true
    return true
end
function clearRoom(self)
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    g.run.room.pseudoClear = true
    Isaac.DebugString("Room is now pseudo-cleared.")
    g.r:SpawnClearAward()
    for ____, doorNum in ipairs(g.run.room.doorsModified) do
        do
            local door = g.r:GetDoor(doorNum)
            if door == nil then
                goto __continue28
            end
            if baby.name == "Black Baby" then
                door:SetRoomTypes(door.CurrentRoomType, RoomType.ROOM_DEFAULT)
            elseif baby.name == "Nerd Baby" then
                door:TryUnlock(true)
            elseif baby.name == "Mouse Baby" then
                door:TryUnlock(true)
            end
        end
        ::__continue28::
    end
    do
        local i = 1
        while i <= g.g:GetNumPlayers() do
            local player = Isaac.GetPlayer(i - 1)
            local activeItem = player:GetActiveItem()
            local activeCharge = player:GetActiveCharge()
            local batteryCharge = player:GetBatteryCharge()
            if player:NeedsCharge() == true then
                local chargesToAdd = 1
                local shape = g.r:GetRoomShape()
                if shape >= 8 then
                    chargesToAdd = 2
                elseif player:HasTrinket(TrinketType.TRINKET_AAA_BATTERY) and (activeCharge == (misc:getItemMaxCharges(activeItem) - 2)) then
                    chargesToAdd = 2
                elseif ((player:HasTrinket(TrinketType.TRINKET_AAA_BATTERY) and (activeCharge == misc:getItemMaxCharges(activeItem))) and player:HasCollectible(CollectibleType.COLLECTIBLE_BATTERY)) and (batteryCharge == (misc:getItemMaxCharges(activeItem) - 2)) then
                    chargesToAdd = 2
                end
                local currentCharge = player:GetActiveCharge()
                player:SetActiveCharge(currentCharge + chargesToAdd)
            end
            i = i + 1
        end
    end
    if g.r:GetType() ~= RoomType.ROOM_DUNGEON then
        g.sfx:Play(SoundEffect.SOUND_DOOR_HEAVY_OPEN, 1, 0, false, 1)
    end
end
function ____exports.postUpdate(self)
    local roomType = g.r:GetType()
    local roomFrameCount = g.r:GetFrameCount()
    local roomClear = g.r:IsClear()
    if ((((((roomType == RoomType.ROOM_BOSS) or (roomType == RoomType.ROOM_CHALLENGE)) or (roomType == RoomType.ROOM_DEVIL)) or (roomType == RoomType.ROOM_ANGEL)) or (roomType == RoomType.ROOM_DUNGEON)) or (roomType == RoomType.ROOM_BOSSRUSH)) or (roomType == RoomType.ROOM_BLACK_MARKET) then
        return
    end
    if roomFrameCount == 0 then
        return
    end
    if (roomFrameCount == 1) and (not roomClear) then
        initializeDoors(nil)
        return
    end
    checkPseudoClear(nil)
end
return ____exports
end,
["callbacks.postUpdateBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____constants = require("constants")
local TELEPORT_TO_ROOM_TYPE_MAP = ____constants.TELEPORT_TO_ROOM_TYPE_MAP
local ZERO_VECTOR = ____constants.ZERO_VECTOR
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local pseudoRoomClear = require("pseudoRoomClear")
local ____enums_2Ecustom = require("types.enums.custom")
local EffectVariantCustom = ____enums_2Ecustom.EffectVariantCustom
local postRender = require("callbacks.postRender")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    6,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (gameFrameCount % 90) == 0 then
            Isaac.Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_TROLL, 0, g.p.Position, ZERO_VECTOR, nil)
        end
    end
)
functionMap:set(
    17,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        local bigChests = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BIGCHEST, -1, false, false)
        if #bigChests > 0 then
            return
        end
        if (gameFrameCount % 30) == 0 then
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_BUTTER_BEAN, false, false, false, false)
        end
    end
)
functionMap:set(
    19,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        if (gameFrameCount % baby.num) == 0 then
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_ANARCHIST_COOKBOOK, false, false, false, false)
        end
    end
)
functionMap:set(
    20,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if ((gameFrameCount % 3) == 0) and (g.run.babyCounters > 0) then
            local ____obj, ____index = g.run, "babyCounters"
            ____obj[____index] = ____obj[____index] - 1
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_KAMIKAZE, false, false, false, false)
        end
    end
)
functionMap:set(
    27,
    function()
        pseudoRoomClear:postUpdate()
    end
)
functionMap:set(
    36,
    function()
        if (g.p.SpriteScale.X > 0.5) or (g.p.SpriteScale.Y > 0.5) then
            g.p.SpriteScale = Vector(0.5, 0.5)
        end
    end
)
functionMap:set(
    37,
    function()
        if (g.p.SpriteScale.X < 2) or (g.p.SpriteScale.Y < 2) then
            g.p.SpriteScale = Vector(2, 2)
        end
    end
)
functionMap:set(
    39,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.time == nil then
            error(("The \"time\" attribute was not defined for " .. baby.name) .. ".")
        end
        local remainingTime = g.run.babyCounters - gameFrameCount
        if remainingTime <= 0 then
            g.run.babyCounters = gameFrameCount + baby.time
            do
                local i = 0
                while i <= 3 do
                    if ((misc:isButtonPressed(ButtonAction.ACTION_SHOOTLEFT) or misc:isButtonPressed(ButtonAction.ACTION_SHOOTRIGHT)) or misc:isButtonPressed(ButtonAction.ACTION_SHOOTUP)) or misc:isButtonPressed(ButtonAction.ACTION_SHOOTDOWN) then
                        g.p:TakeDamage(
                            1,
                            0,
                            EntityRef(g.p),
                            0
                        )
                        return
                    end
                    i = i + 1
                end
            end
        end
    end
)
functionMap:set(
    43,
    function()
        local roomIndex = misc:getRoomIndex()
        do
            local i = #g.run.babyExplosions - 1
            while i >= 0 do
                local explosion = g.run.babyExplosions[i + 1]
                if explosion.roomIndex == roomIndex then
                    Isaac.Explode(explosion.position, nil, 50)
                    __TS__ArraySplice(g.run.babyExplosions, i, 1)
                end
                i = i - 1
            end
        end
    end
)
functionMap:set(
    48,
    function()
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        if not g.run.babyBool then
            local ____obj, ____index = g.run, "babyCounters"
            ____obj[____index] = ____obj[____index] + 1
            if g.run.babyCounters == baby.num then
                g.run.babyBool = true
            end
        else
            local ____obj, ____index = g.run, "babyCounters"
            ____obj[____index] = ____obj[____index] - 1
            if g.run.babyCounters == 0 then
                g.run.babyBool = false
            end
        end
    end
)
functionMap:set(
    58,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (gameFrameCount % 210) == 0 then
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_MONSTER_MANUAL, false, false, false, false)
        end
    end
)
functionMap:set(
    63,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (gameFrameCount % 150) == 0 then
            g.run.randomSeed = misc:incrementRNG(g.run.randomSeed)
            math.randomseed(g.run.randomSeed)
            local poopVariant = math.random(0, 6)
            if (poopVariant == 1) or (poopVariant == 2) then
                g.run.invulnerabilityFrame = gameFrameCount + 25
            end
            Isaac.GridSpawn(GridEntityType.GRID_POOP, poopVariant, g.p.Position, false)
            g.sfx:Play(SoundEffect.SOUND_FART, 1, 0, false, 1)
        end
    end
)
functionMap:set(
    64,
    function()
        Isaac.GridSpawn(GridEntityType.GRID_SPIKES, 0, g.p.Position, false)
    end
)
functionMap:set(
    81,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        local activeCharge = g.p:GetActiveCharge()
        local batteryCharge = g.p:GetBatteryCharge()
        if ((g.run.babyFrame ~= 0) and (gameFrameCount <= (g.run.babyFrame + 1))) and ((activeCharge ~= g.run.babyCounters) or (batteryCharge ~= g.run.babyNPC.type)) then
            g.p:SetActiveCharge(g.run.babyCounters + g.run.babyNPC.type)
            g.sfx:Stop(SoundEffect.SOUND_BATTERYCHARGE)
            g.sfx:Stop(SoundEffect.SOUND_BEEP)
            Isaac.DebugString("Reset the active item charge.")
        end
    end
)
functionMap:set(
    90,
    function()
        pseudoRoomClear:postUpdate()
    end
)
functionMap:set(
    96,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (gameFrameCount % 150) == 0 then
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_BEST_FRIEND, false, false, false, false)
        end
    end
)
functionMap:set(
    107,
    function()
        if g.run.babyBool then
            return
        end
        g.run.babyBool = true
        Isaac.Spawn(EntityType.ENTITY_FAMILIAR, FamiliarVariant.CUBE_OF_MEAT_4, 0, g.p.Position, ZERO_VECTOR, nil)
        Isaac.Spawn(EntityType.ENTITY_FAMILIAR, FamiliarVariant.BALL_OF_BANDAGES_4, 0, g.p.Position, ZERO_VECTOR, nil)
    end
)
functionMap:set(
    110,
    function()
        local rooms = g.l:GetRooms()
        local roomClear = g.r:IsClear()
        if g.run.babyBool then
            return
        end
        if not roomClear then
            return
        end
        local allCleared = true
        do
            local i = 0
            while i < rooms.Size do
                do
                    local roomDesc = rooms:Get(i)
                    if roomDesc == nil then
                        goto __continue47
                    end
                    local roomData = roomDesc.Data
                    local roomType2 = roomData.Type
                    if ((roomType2 == RoomType.ROOM_DEFAULT) or (roomType2 == RoomType.ROOM_MINIBOSS)) and (not roomDesc.Clear) then
                        allCleared = false
                        break
                    end
                end
                ::__continue47::
                i = i + 1
            end
        end
        if allCleared then
            g.run.babyBool = true
            return
        end
        do
            local i = 0
            while i <= 7 do
                local door = g.r:GetDoor(i)
                if (door ~= nil) and door:IsRoomType(RoomType.ROOM_BOSS) then
                    door:Bar()
                end
                i = i + 1
            end
        end
    end
)
functionMap:set(
    111,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (g.run.babyTears.frame ~= 0) and (gameFrameCount >= g.run.babyTears.frame) then
            g.run.babyTears.frame = 0
            g.p:FireTear(g.p.Position, g.run.babyTears.velocity, false, true, false)
        end
    end
)
functionMap:set(
    125,
    function()
        local keys = g.p:GetNumKeys()
        if keys == 0 then
            g.run.dealingExtraDamage = true
            g.p:TakeDamage(
                99,
                0,
                EntityRef(g.p),
                0
            )
            g.run.dealingExtraDamage = false
        end
    end
)
functionMap:set(
    128,
    function()
        local startingRoomIndex = g.l:GetStartingRoomIndex()
        local rooms = g.l:GetRooms()
        local centerPos = g.r:GetCenterPos()
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        if g.run.babyBool then
            return
        end
        g.run.babyBool = true
        local floorIndexes = {}
        do
            local i = 0
            while i < rooms.Size do
                local room = rooms:Get(i)
                if room ~= nil then
                    __TS__ArrayPush(floorIndexes, room.SafeGridIndex)
                end
                i = i + 1
            end
        end
        local randomIndexes = {}
        do
            local i = 1
            while i <= baby.num do
                while true do
                    do
                        g.run.randomSeed = misc:incrementRNG(g.run.randomSeed)
                        math.randomseed(g.run.randomSeed)
                        local randomIndex = floorIndexes[math.random(1, #floorIndexes) + 1]
                        if __TS__ArrayIncludes(randomIndexes, randomIndex) then
                            goto __continue63
                        end
                        if randomIndex == startingRoomIndex then
                            goto __continue63
                        end
                        __TS__ArrayPush(randomIndexes, randomIndex)
                        break
                    end
                    ::__continue63::
                end
                i = i + 1
            end
        end
        for ____, randomIndex in ipairs(randomIndexes) do
            g.l.LeaveDoor = -1
            g.l:ChangeRoom(randomIndex)
            g.sfx:Stop(SoundEffect.SOUND_CASTLEPORTCULLIS)
        end
        g.l.LeaveDoor = -1
        g.l:ChangeRoom(startingRoomIndex)
        g.p.Position = centerPos
    end
)
functionMap:set(
    138,
    function()
        local bombs = g.p:GetNumBombs()
        if bombs == 0 then
            g.run.dealingExtraDamage = true
            g.p:TakeDamage(
                99,
                0,
                EntityRef(g.p),
                0
            )
            g.run.dealingExtraDamage = false
        end
    end
)
functionMap:set(
    147,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (g.run.babyFrame ~= 0) and (gameFrameCount >= g.run.babyFrame) then
            g.run.babyFrame = 0
        end
        if (not g.p:IsItemQueueEmpty()) and (g.run.babyFrame == 0) then
            g.run.babyFrame = gameFrameCount + 45
            g.p:UsePill(PillEffect.PILLEFFECT_PARALYSIS, PillColor.PILL_NULL)
        end
    end
)
functionMap:set(
    155,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (gameFrameCount % 30) == 0 then
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_TELEKINESIS, false, false, false, false)
        end
    end
)
functionMap:set(
    156,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        local hearts = g.p:GetHearts()
        local soulHearts = g.p:GetSoulHearts()
        local boneHearts = g.p:GetBoneHearts()
        local bigChests = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BIGCHEST, -1, false, false)
        if #bigChests > 0 then
            return
        end
        if ((hearts + soulHearts) + boneHearts) == 0 then
            return
        end
        if (gameFrameCount % 150) == 0 then
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_MEGA_BEAN, false, false, false, false)
        end
    end
)
functionMap:set(
    158,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (gameFrameCount % 150) == 0 then
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_MONSTER_MANUAL, false, false, false, false)
            g.sfx:Stop(SoundEffect.SOUND_SATAN_GROW)
        end
    end
)
functionMap:set(
    162,
    function()
        local roomFrameCount = g.r:GetFrameCount()
        if (not g.run.babyBool) and (roomFrameCount <= 1) then
            g.run.babyBool = true
            g.seeds:AddSeedEffect(SeedEffect.SEED_OLD_TV)
        end
    end
)
functionMap:set(
    163,
    function()
        local leftPressed = misc:isButtonPressed(ButtonAction.ACTION_LEFT)
        local rightPressed = misc:isButtonPressed(ButtonAction.ACTION_RIGHT)
        local upPressed = misc:isButtonPressed(ButtonAction.ACTION_UP)
        local downPressed = misc:isButtonPressed(ButtonAction.ACTION_DOWN)
        if ((((not g.run.babyBool) and (not leftPressed)) and (not rightPressed)) and (not upPressed)) and (not downPressed) then
            g.run.babyBool = true
            local color = g.p:GetColor()
            local fadeAmount = 0.5
            local newColor = Color(color.R, color.G, color.B, fadeAmount, color.RO, color.GO, color.BO)
            g.p:SetColor(newColor, 0, 0, true, true)
        elseif g.run.babyBool and (((leftPressed or rightPressed) or upPressed) or downPressed) then
            g.run.babyBool = false
            local color = g.p:GetColor()
            local fadeAmount = 1
            local newColor = Color(color.R, color.G, color.B, fadeAmount, color.RO, color.GO, color.BO)
            g.p:SetColor(newColor, 0, 0, true, true)
        end
    end
)
functionMap:set(
    164,
    function()
        local leprocyChunks = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.LEPROCY, -1, false, false)
        if #leprocyChunks < g.run.babyCounters then
            local ____obj, ____index = g.run, "babyCounters"
            ____obj[____index] = ____obj[____index] - 1
            local ____obj, ____index = g.run, "babyFrame"
            ____obj[____index] = ____obj[____index] + 1
            g.p:AddCacheFlags(CacheFlag.CACHE_DAMAGE)
            g.p:EvaluateItems()
        end
    end
)
functionMap:set(
    167,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        if (g.run.babyFrame == 0) and (not g.p:IsItemQueueEmpty()) then
            g.run.babyFrame = gameFrameCount + baby.num
        end
        if (g.run.babyFrame == 0) or (gameFrameCount < g.run.babyFrame) then
            return
        end
        g.run.babyFrame = 0
        g.p:UseActiveItem(CollectibleType.COLLECTIBLE_TELEPORT, false, false, false, false)
    end
)
functionMap:set(
    171,
    function()
        local slots = Isaac.FindByType(EntityType.ENTITY_SLOT, -1, -1, false, false)
        for ____, slot in ipairs(slots) do
            local sprite = slot:GetSprite()
            local data = slot:GetData()
            if (data.destroyed == nil) and (sprite:IsPlaying("Broken") or sprite:IsPlaying("Death")) then
                data.destroyed = true
                g.run.randomSeed = misc:incrementRNG(g.run.randomSeed)
                g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, slot.Position, ZERO_VECTOR, nil, 0, g.run.randomSeed)
            end
        end
    end
)
functionMap:set(
    211,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        do
            local i = #g.run.room.tears - 1
            while i >= 0 do
                local tear = g.run.room.tears[i + 1]
                if ((gameFrameCount - tear.frame) % 2) == 0 then
                    local explosion = Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.ROCK_EXPLOSION, 0, tear.position, ZERO_VECTOR, g.p)
                    local index = g.r:GetGridIndex(tear.position)
                    g.r:DestroyGrid(index, true)
                    tear.position = tear.position:__add(tear.velocity)
                    g.sfx:Play(SoundEffect.SOUND_ROCK_CRUMBLE, 0.5, 0, false, 1)
                    if tear.position:Distance(g.p.Position) <= 40 then
                        g.p:TakeDamage(
                            1,
                            DamageFlag.DAMAGE_EXPLOSION,
                            EntityRef(explosion),
                            2
                        )
                    end
                    local entities = Isaac.FindInRadius(tear.position, 40, EntityPartition.ENEMY)
                    for ____, entity in ipairs(entities) do
                        local damageAmount = g.p.Damage * 1.5
                        entity:TakeDamage(
                            damageAmount,
                            DamageFlag.DAMAGE_EXPLOSION,
                            EntityRef(explosion),
                            2
                        )
                    end
                end
                if not g.r:IsPositionInRoom(tear.position, 0) then
                    __TS__ArraySplice(g.run.room.tears, i, 1)
                end
                i = i - 1
            end
        end
    end
)
functionMap:set(
    216,
    function()
        local rooms = g.l:GetRooms()
        local item = g.p.QueuedItem.Item
        if item == nil then
            return
        end
        local teleportRoomType = TELEPORT_TO_ROOM_TYPE_MAP:get(item.ID)
        if teleportRoomType == nil then
            return
        end
        do
            local i = 0
            while i < rooms.Size do
                do
                    local roomDesc = rooms:Get(i)
                    if roomDesc == nil then
                        goto __continue103
                    end
                    local index = roomDesc.SafeGridIndex
                    local roomData = roomDesc.Data
                    local roomType = roomData.Type
                    if roomType == teleportRoomType then
                        g.l.LeaveDoor = -1
                        g.g:StartRoomTransition(index, Direction.NO_DIRECTION, 3)
                        break
                    end
                end
                ::__continue103::
                i = i + 1
            end
        end
    end
)
functionMap:set(
    221,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        local roomClear = g.r:IsClear()
        if (g.run.babyFrame ~= 0) and (gameFrameCount >= g.run.babyFrame) then
            if roomClear then
                g.run.babyCounters = 0
                g.run.babyFrame = 0
            else
                g.p:UseActiveItem(CollectibleType.COLLECTIBLE_MONSTROS_TOOTH, false, false, false, false)
            end
        end
    end
)
functionMap:set(
    231,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        local hearts = g.p:GetHearts()
        local soulHearts = g.p:GetSoulHearts()
        local boneHearts = g.p:GetBoneHearts()
        local bigChests = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BIGCHEST, -1, false, false)
        if #bigChests > 0 then
            return
        end
        if ((hearts + soulHearts) + boneHearts) == 0 then
            return
        end
        if (gameFrameCount % 3) == 0 then
            g.run.babyBool = true
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_ISAACS_TEARS, false, false, false, false)
            g.run.babyBool = false
        end
    end
)
functionMap:set(
    250,
    function()
        local bombs = g.p:GetNumBombs()
        local keys = g.p:GetNumKeys()
        local coins = g.p:GetNumCoins()
        if (bombs == 0) and (coins > 0) then
            g.p:AddCoins(-1)
            g.p:AddBombs(1)
        end
        local newCoins = g.p:GetNumCoins()
        if (keys == 0) and (newCoins > 0) then
            g.p:AddCoins(-1)
            g.p:AddKeys(1)
        end
    end
)
functionMap:set(
    256,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        if (gameFrameCount % baby.num) == 0 then
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_VENTRICLE_RAZOR, false, false, false, false)
        end
    end
)
functionMap:set(
    263,
    function()
        local roomFrameCount = g.r:GetFrameCount()
        local isFirstVisit = g.r:IsFirstVisit()
        if (roomFrameCount == 1) and isFirstVisit then
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_D12, false, false, false, false)
        end
    end
)
functionMap:set(
    267,
    function()
        local playerSprite = g.p:GetSprite()
        local hasInvincibility = g.p:HasInvincibility()
        if (not hasInvincibility) and (((playerSprite:IsPlaying("Trapdoor") or playerSprite:IsPlaying("Trapdoor2")) or playerSprite:IsPlaying("Jump")) or playerSprite:IsPlaying("LightTravel")) then
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false)
            g.sfx:Stop(SoundEffect.SOUND_ISAAC_HURT_GRUNT)
        end
    end
)
functionMap:set(
    270,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (gameFrameCount % 150) == 0 then
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_WAIT_WHAT, false, false, false, false)
        end
    end
)
functionMap:set(
    290,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (gameFrameCount % 150) == 0 then
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false)
            g.sfx:Stop(SoundEffect.SOUND_ISAAC_HURT_GRUNT)
        end
    end
)
functionMap:set(
    295,
    function()
        local activeItem = g.p:GetActiveItem()
        if (activeItem == CollectibleType.COLLECTIBLE_PONY) and g.p:NeedsCharge() then
            g.p:FullCharge()
            g.sfx:Stop(SoundEffect.SOUND_BATTERYCHARGE)
        end
    end
)
functionMap:set(
    303,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.delay == nil then
            error(("The \"delay\" attribute was not defined for " .. baby.name) .. ".")
        end
        if (g.run.babyFrame ~= 0) and (gameFrameCount >= g.run.babyFrame) then
            local ____obj, ____index = g.run, "babyCounters"
            ____obj[____index] = ____obj[____index] + 1
            g.run.babyFrame = gameFrameCount + baby.delay
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_BROWN_NUGGET, false, false, false, false)
            if g.run.babyCounters == 19 then
                g.run.babyCounters = 0
                g.run.babyFrame = 0
            end
        end
    end
)
functionMap:set(
    304,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        local hearts = g.p:GetHearts()
        local soulHearts = g.p:GetSoulHearts()
        local boneHearts = g.p:GetBoneHearts()
        local bigChests = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BIGCHEST, -1, false, false)
        if #bigChests > 0 then
            return
        end
        if ((hearts + soulHearts) + boneHearts) == 0 then
            return
        end
        if (gameFrameCount % 3) == 0 then
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_BEAN, false, false, false, false)
        end
    end
)
functionMap:set(
    307,
    function()
        if not g.p:IsItemQueueEmpty() then
            g.p:TakeDamage(
                1,
                0,
                EntityRef(g.p),
                0
            )
        end
    end
)
functionMap:set(
    320,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (g.run.babyFrame ~= 0) and (gameFrameCount >= g.run.babyFrame) then
            g.run.babyFrame = 0
        end
    end
)
functionMap:set(
    332,
    function()
        g.p.GridCollisionClass = EntityGridCollisionClass.GRIDCOLL_NONE
    end
)
functionMap:set(
    336,
    function()
        if g.run.babyBool then
            g.run.babyBool = false
            g.p:AddCacheFlags(CacheFlag.CACHE_DAMAGE)
            g.p:AddCacheFlags(CacheFlag.CACHE_FIREDELAY)
            g.p:EvaluateItems()
        end
    end
)
functionMap:set(
    341,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.time == nil then
            error(("The \"time\" attribute was not defined for " .. baby.name) .. ".")
        end
        local remainingTime = g.run.babyCounters - gameFrameCount
        if remainingTime <= 0 then
            g.run.babyCounters = gameFrameCount + baby.time
            local cutoff = 0.2
            if (((g.p.Velocity.X > cutoff) or (g.p.Velocity.X < (cutoff * -1))) or (g.p.Velocity.Y > cutoff)) or (g.p.Velocity.Y < (cutoff * -1)) then
                g.p:TakeDamage(
                    1,
                    0,
                    EntityRef(g.p),
                    0
                )
            end
        end
    end
)
functionMap:set(
    348,
    function()
        local activeItem = g.p:GetActiveItem()
        if (activeItem == CollectibleType.COLLECTIBLE_CANDLE) and g.p:NeedsCharge() then
            g.p:FullCharge()
            g.sfx:Stop(SoundEffect.SOUND_BATTERYCHARGE)
        end
    end
)
functionMap:set(
    349,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (gameFrameCount % 300) == 0 then
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_DELIRIOUS, false, false, false, false)
            postRender:setPlayerSprite()
        end
    end
)
functionMap:set(
    350,
    function()
        g.p:AddCacheFlags(CacheFlag.CACHE_SPEED)
        g.p:EvaluateItems()
    end
)
functionMap:set(
    351,
    function()
        pseudoRoomClear:postUpdate()
    end
)
functionMap:set(
    374,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (gameFrameCount % 120) == 0 then
            Isaac.Spawn(
                EntityType.ENTITY_EFFECT,
                EffectVariant.MOM_FOOT_STOMP,
                0,
                Isaac.GetRandomPosition(),
                ZERO_VECTOR,
                nil
            )
        end
    end
)
functionMap:set(
    382,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (gameFrameCount % 150) == 0 then
            Isaac.Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_SUPERTROLL, 0, g.p.Position, ZERO_VECTOR, nil)
        end
    end
)
functionMap:set(
    386,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        if gameFrameCount < g.run.babyFrame then
            return
        end
        local ____obj, ____index = g.run, "babyFrame"
        ____obj[____index] = ____obj[____index] + baby.num
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        if g.run.babyCounters >= 8 then
            g.run.babyCounters = 4
        end
    end
)
functionMap:set(
    388,
    function()
        do
            local i = #g.run.room.tears - 1
            while i >= 0 do
                local tear = g.run.room.tears[i + 1]
                local velocity = g.p.Position:__sub(tear.position)
                velocity = velocity:Normalized()
                velocity = velocity:__mul(12)
                Isaac.Spawn(EntityType.ENTITY_PROJECTILE, ProjectileVariant.PROJECTILE_NORMAL, 0, tear.position, velocity, nil)
                tear.num = tear.num - 1
                if tear.num == 0 then
                    __TS__ArraySplice(g.run.room.tears, i, 1)
                end
                i = i - 1
            end
        end
    end
)
functionMap:set(
    396,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (gameFrameCount % 5) == 0 then
            local creep = Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_RED, 0, g.p.Position, ZERO_VECTOR, g.p):ToEffect()
            if creep ~= nil then
                creep.Timeout = 240
            end
        end
    end
)
functionMap:set(
    401,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (gameFrameCount % 45) == 0 then
            Isaac.Spawn(EntityType.ENTITY_FLY, 0, 0, g.p.Position, ZERO_VECTOR, nil)
        end
    end
)
functionMap:set(
    428,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (gameFrameCount % 30) == 0 then
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_KIDNEY_BEAN, false, false, false, false)
        end
    end
)
functionMap:set(
    449,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (gameFrameCount % 210) == 0 then
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_SPRINKLER, false, false, false, false)
        end
    end
)
functionMap:set(
    462,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        do
            local i = #g.run.room.tears
            while i >= 0 do
                local tear = g.run.room.tears[i + 1]
                if ((gameFrameCount - tear.frame) % 2) == 0 then
                    local explosion = Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.ROCK_EXPLOSION, 0, tear.position, ZERO_VECTOR, g.p)
                    local index = g.r:GetGridIndex(tear.position)
                    g.r:DestroyGrid(index, true)
                    tear.position = tear.position:__add(tear.velocity)
                    g.sfx:Play(SoundEffect.SOUND_ROCK_CRUMBLE, 0.5, 0, false, 1)
                    local damage = g.p.Damage * 1.5
                    local entities = Isaac.FindInRadius(tear.position, 40, EntityPartition.ENEMY)
                    for ____, entity in ipairs(entities) do
                        entity:TakeDamage(
                            damage,
                            DamageFlag.DAMAGE_EXPLOSION,
                            EntityRef(explosion),
                            2
                        )
                    end
                end
                if not g.r:IsPositionInRoom(tear.position, 0) then
                    __TS__ArraySplice(g.run.room.tears, i, 1)
                end
                i = i - 1
            end
        end
    end
)
functionMap:set(
    474,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if g.run.babyCounters ~= 0 then
            local remainingTime = g.run.babyCounters - gameFrameCount
            if remainingTime <= 0 then
                g.run.babyCounters = 0
                g.run.dealingExtraDamage = true
                g.p:TakeDamage(
                    99,
                    0,
                    EntityRef(g.p),
                    0
                )
                g.run.dealingExtraDamage = false
            end
        end
    end
)
functionMap:set(
    485,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (gameFrameCount % 30) == 0 then
            local target = Isaac.Spawn(
                EntityType.ENTITY_EFFECT,
                EffectVariantCustom.FETUS_BOSS_TARGET,
                0,
                Isaac.GetRandomPosition(),
                ZERO_VECTOR,
                nil
            )
            local sprite = target:GetSprite()
            sprite:Play("Blink", true)
        end
    end
)
functionMap:set(
    500,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        if (g.run.babyTears.frame ~= 0) and (gameFrameCount >= g.run.babyTears.frame) then
            g.run.babyTears.frame = 0
            g.p:FireTear(g.p.Position, g.run.babyTears.velocity, false, true, false)
        end
    end
)
functionMap:set(
    508,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        local roomClear = g.r:IsClear()
        if ((gameFrameCount % 150) == 0) and (not roomClear) then
            g.p:UseActiveItem(CollectibleType.COLLECTIBLE_MONSTROS_TOOTH, false, false, false, false)
        end
    end
)
functionMap:set(
    519,
    function()
        local roomClear = g.r:IsClear()
        if roomClear then
            return
        end
        do
            local i = 0
            while i <= 7 do
                local door = g.r:GetDoor(i)
                if (door ~= nil) and door:IsOpen() then
                    door:Close(true)
                end
                i = i + 1
            end
        end
    end
)
functionMap:set(
    511,
    function()
        local gameFrameCount = g.g:GetFrameCount()
        local ____, baby = table.unpack(
            misc:getCurrentBaby()
        )
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        if gameFrameCount >= g.run.babyFrame then
            local ____obj, ____index = g.run, "babyFrame"
            ____obj[____index] = ____obj[____index] + baby.num
            if g.run.babyBool then
                local ____obj, ____index = g.run, "babyCounters"
                ____obj[____index] = ____obj[____index] + 1
                if g.run.babyCounters == baby.max then
                    g.run.babyBool = false
                end
            else
                local ____obj, ____index = g.run, "babyCounters"
                ____obj[____index] = ____obj[____index] - 1
                if g.run.babyCounters == baby.min then
                    g.run.babyBool = true
                end
            end
            g.p:AddCacheFlags(CacheFlag.CACHE_FIREDELAY)
            g.p:EvaluateItems()
        end
    end
)
functionMap:set(
    541,
    function()
        local roomFrameCount = g.r:GetFrameCount()
        if roomFrameCount == 1 then
            g.p.Visible = false
        end
    end
)
return ____exports
end,
["callbacks.postUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____constants = require("constants")
local ZERO_VECTOR = ____constants.ZERO_VECTOR
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local ____roomClearedBabies = require("roomClearedBabies")
local roomClearedBabyFunctions = ____roomClearedBabies.default
local postRender = require("callbacks.postRender")
local ____postUpdateBabies = require("callbacks.postUpdateBabies")
local postUpdateBabyFunctions = ____postUpdateBabies.default
local checkTrinket, checkRoomCleared, roomCleared, checkSoftlockDestroyPoops, checkSoftlockIsland, checkGridEntities, checkTrapdoor
function checkTrinket(self)
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    if baby.trinket == nil then
        return
    end
    if g.p:HasTrinket(baby.trinket) then
        return
    end
    if g.run.level.trinketGone then
        return
    end
    local trinkets = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TRINKET, baby.trinket, false, false)
    if #trinkets > 0 then
        local trinket = trinkets[1]
        trinket:Remove()
        local position = g.r:FindFreePickupSpawnPosition(g.p.Position, 1, true)
        g.p:DropTrinket(position, true)
        g.p:AddTrinket(baby.trinket)
        Isaac.DebugString("Dropped trinket detected; manually giving it back.")
        return
    end
    g.run.level.trinketGone = true
    Isaac.DebugString("Trinket has been destroyed!")
    if baby.name == "Squirrel Baby" then
        do
            local i = 0
            while i < 5 do
                local position = g.r:FindFreePickupSpawnPosition(g.p.Position, 1, true)
                g.run.randomSeed = misc:incrementRNG(g.run.randomSeed)
                g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, position, ZERO_VECTOR, nil, 0, g.run.randomSeed)
                i = i + 1
            end
        end
    end
end
function checkRoomCleared(self)
    local roomClear = g.r:IsClear()
    if roomClear == g.run.room.clearState then
        return
    end
    g.run.room.clearState = roomClear
    if not roomClear then
        return
    end
    roomCleared(nil)
end
function roomCleared(self)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local babyFunc = roomClearedBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil)
    end
end
function checkSoftlockDestroyPoops(self)
    local roomFrameCount = g.r:GetFrameCount()
    local gridSize = g.r:GetGridSize()
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    if baby.softlockPreventionDestroyPoops == nil then
        return
    end
    if g.run.room.softlock then
        return
    end
    if roomFrameCount < 450 then
        return
    end
    g.run.room.softlock = true
    do
        local i = 1
        while i <= gridSize do
            local gridEntity = g.r:GetGridEntity(i)
            if gridEntity ~= nil then
                local saveState = gridEntity:GetSaveState()
                if (saveState.Type == GridEntityType.GRID_TNT) or (saveState.Type == GridEntityType.GRID_POOP) then
                    gridEntity:Destroy(true)
                end
            end
            i = i + 1
        end
    end
    Isaac.DebugString("Destroyed all poops & TNT barrels to prevent a softlock.")
end
function checkSoftlockIsland(self)
    local roomFrameCount = g.r:GetFrameCount()
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    if baby.softlockPreventionIsland == nil then
        return
    end
    if g.run.room.softlock then
        return
    end
    if roomFrameCount < 900 then
        return
    end
    g.run.room.softlock = true
    g.r:SetClear(true)
    do
        local i = 0
        while i <= 7 do
            local door = g.r:GetDoor(i)
            if door ~= nil then
                door:Open()
            end
            i = i + 1
        end
    end
end
function checkGridEntities(self)
    local roomIndex = misc:getRoomIndex()
    local gameFrameCount = g.g:GetFrameCount()
    local gridSize = g.r:GetGridSize()
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    do
        local i = 1
        while i <= gridSize do
            local gridEntity = g.r:GetGridEntity(i)
            if gridEntity ~= nil then
                local saveState = gridEntity:GetSaveState()
                if ((baby.name == "Gold Baby") and (saveState.Type == GridEntityType.GRID_POOP)) and (saveState.Variant ~= 3) then
                    gridEntity:SetVariant(3)
                elseif ((baby.name == "Ate Poop Baby") and (saveState.Type == GridEntityType.GRID_POOP)) and (gridEntity.State == 4) then
                    local found = false
                    for ____, killedPoop in ipairs(g.run.level.killedPoops) do
                        if (killedPoop.roomIndex == roomIndex) and (killedPoop.gridIndex == i) then
                            found = true
                            break
                        end
                    end
                    if not found then
                        local entities = Isaac.FindInRadius(gridEntity.Position, 25, EntityPartition.PICKUP)
                        if #entities == 0 then
                            misc:spawnRandomPickup(gridEntity.Position)
                            __TS__ArrayPush(g.run.level.killedPoops, {roomIndex = roomIndex, gridIndex = i})
                        end
                    end
                elseif (((baby.name == "Exploding Baby") and (g.run.babyFrame == 0)) and (((((((((saveState.Type == GridEntityType.GRID_ROCK) and (saveState.State == 1)) or ((saveState.Type == GridEntityType.GRID_ROCKT) and (saveState.State == 1))) or ((saveState.Type == GridEntityType.GRID_ROCK_BOMB) and (saveState.State == 1))) or ((saveState.Type == GridEntityType.GRID_ROCK_ALT) and (saveState.State == 1))) or ((saveState.Type == GridEntityType.GRID_SPIDERWEB) and (saveState.State == 0))) or ((saveState.Type == GridEntityType.GRID_TNT) and (saveState.State ~= 4))) or ((saveState.Type == GridEntityType.GRID_POOP) and (saveState.State ~= 4))) or ((saveState.Type == GridEntityType.GRID_ROCK_SS) and (saveState.State ~= 3)))) and (g.p.Position:Distance(gridEntity.Position) <= 36) then
                    g.run.invulnerable = true
                    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_KAMIKAZE, false, false, false, false)
                    g.run.invulnerable = false
                    g.run.babyFrame = gameFrameCount + 10
                end
            end
            i = i + 1
        end
    end
end
function checkTrapdoor(self)
    local playerSprite = g.p:GetSprite()
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    if ((not playerSprite:IsPlaying("Trapdoor")) and (not playerSprite:IsPlaying("Trapdoor2"))) and (not playerSprite:IsPlaying("LightTravel")) then
        return
    end
    if (baby.item == CollectibleType.COLLECTIBLE_COMPASS) or (baby.item2 == CollectibleType.COLLECTIBLE_COMPASS) then
        g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_COMPASS)
    end
    if (baby.item == CollectibleType.COLLECTIBLE_TREASURE_MAP) or (baby.item2 == CollectibleType.COLLECTIBLE_TREASURE_MAP) then
        g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_TREASURE_MAP)
    end
    if (baby.item == CollectibleType.COLLECTIBLE_BLUE_MAP) or (baby.item2 == CollectibleType.COLLECTIBLE_BLUE_MAP) then
        g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_BLUE_MAP)
    end
    if (baby.item == CollectibleType.COLLECTIBLE_MIND) or (baby.item2 == CollectibleType.COLLECTIBLE_MIND) then
        g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_MIND)
    end
end
function ____exports.main(self)
    local babyType, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    if (not g.run.level.blindfoldedApplied) and g.p.ControlsEnabled then
        g.run.level.blindfoldedApplied = true
        if baby.blindfolded then
            g.p.FireDelay = 1000000
        else
            if g.p.FireDelay > 900 then
                g.p.FireDelay = 0
            end
            local incubi = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.INCUBUS, -1, false, false)
            for ____, entity in ipairs(incubi) do
                local incubus = entity:ToFamiliar()
                if (incubus ~= nil) and (incubus.FireCooldown > 900) then
                    incubus.FireCooldown = 0
                end
            end
        end
    end
    if g.run.reloadSprite then
        g.run.reloadSprite = false
        postRender:setPlayerSprite()
    end
    if ((not g.p:IsItemQueueEmpty()) and (not g.run.queuedItems)) and (g.p.QueuedItem.Item ~= nil) then
        g.run.queuedItems = true
        if (g.p.QueuedItem.Item.Type == ItemType.ITEM_PASSIVE) or (g.p.QueuedItem.Item.Type == ItemType.ITEM_FAMILIAR) then
            __TS__ArrayPush(g.run.passiveItems, g.p.QueuedItem.Item.ID)
        end
    elseif g.p:IsItemQueueEmpty() and g.run.queuedItems then
        g.run.queuedItems = false
        g.run.reloadSprite = true
    end
    checkTrinket(nil)
    checkRoomCleared(nil)
    local babyFunc = postUpdateBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil)
    end
    checkSoftlockDestroyPoops(nil)
    checkSoftlockIsland(nil)
    checkGridEntities(nil)
    checkTrapdoor(nil)
end
return ____exports
end,
["callbacks.preEntitySpawn"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
function ____exports.main(self, entityType, variant, subType, _position, _velocity, _spawner, initSeed)
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return nil
    end
    if (entityType == EntityType.ENTITY_SLOT) and g.run.clockworkAssembly then
        g.run.clockworkAssembly = false
        return {entityType, 10, subType, initSeed}
    end
    if ((baby.name == "Purple Baby") and (entityType == EntityType.ENTITY_FIREPLACE)) and (variant ~= 2) then
        return {entityType, 2, subType, initSeed}
    end
    return nil
end
return ____exports
end,
["callbacks.preGetCollectibleBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    430,
    function()
        local roomType = g.r:GetType()
        local ____switch3 = roomType
        if ____switch3 == RoomType.ROOM_SHOP then
            goto ____switch3_case_0
        elseif ____switch3 == RoomType.ROOM_TREASURE then
            goto ____switch3_case_1
        elseif ____switch3 == RoomType.ROOM_DEVIL then
            goto ____switch3_case_2
        elseif ____switch3 == RoomType.ROOM_ANGEL then
            goto ____switch3_case_3
        end
        goto ____switch3_case_default
        ::____switch3_case_0::
        do
            do
                return misc:getRandomItemFromPool(ItemPoolType.POOL_TREASURE)
            end
        end
        ::____switch3_case_1::
        do
            do
                return misc:getRandomItemFromPool(ItemPoolType.POOL_SHOP)
            end
        end
        ::____switch3_case_2::
        do
            do
                return misc:getRandomItemFromPool(ItemPoolType.POOL_ANGEL)
            end
        end
        ::____switch3_case_3::
        do
            do
                return misc:getRandomItemFromPool(ItemPoolType.POOL_DEVIL)
            end
        end
        ::____switch3_case_default::
        do
            do
                return nil
            end
        end
        ::____switch3_end::
    end
)
functionMap:set(
    525,
    function()
        return misc:getRandomItemFromPool(ItemPoolType.POOL_CURSE)
    end
)
functionMap:set(
    528,
    function()
        return misc:getRandomItemFromPool(ItemPoolType.POOL_SHOP)
    end
)
functionMap:set(
    535,
    function()
        return misc:getRandomItemFromPool(ItemPoolType.POOL_ANGEL)
    end
)
functionMap:set(
    536,
    function()
        return misc:getRandomItemFromPool(ItemPoolType.POOL_DEVIL)
    end
)
return ____exports
end,
["callbacks.preGetCollectible"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local ____preGetCollectibleBabies = require("callbacks.preGetCollectibleBabies")
local preGetCollectibleBabyFunctions = ____preGetCollectibleBabies.default
function ____exports.main(self, _itemPoolType, _decrease, _seed)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return nil
    end
    if g.run.babyBool then
        return nil
    end
    local babyFunc = preGetCollectibleBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        return babyFunc(nil)
    end
    return nil
end
return ____exports
end,
["callbacks.preRoomEntitySpawnBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    143,
    function(____, entityType)
        if (((g.r:IsFirstVisit() and (entityType >= 1000)) and (entityType ~= 4500)) and (entityType ~= 9000)) and (entityType ~= 9100) then
            return {1490, 0, 0}
        end
        return nil
    end
)
functionMap:set(
    287,
    function(____, _entityType)
        local roomType = g.r:GetType()
        if (((((((roomType ~= RoomType.ROOM_DEFAULT) and (roomType ~= RoomType.ROOM_ERROR)) and (roomType ~= RoomType.ROOM_BOSS)) and (roomType ~= RoomType.ROOM_DEVIL)) and (roomType ~= RoomType.ROOM_ANGEL)) and (roomType ~= RoomType.ROOM_DUNGEON)) and (roomType ~= RoomType.ROOM_BOSSRUSH)) and (roomType ~= RoomType.ROOM_BLACK_MARKET) then
            return {999, 0, 0}
        end
        return nil
    end
)
functionMap:set(
    389,
    function(____, entityType)
        if (((g.r:IsFirstVisit() and (entityType >= 1000)) and (entityType ~= 4500)) and (entityType ~= 9000)) and (entityType ~= 9100) then
            return {1300, 0, 0}
        end
        return nil
    end
)
return ____exports
end,
["callbacks.preRoomEntitySpawn"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local ____preRoomEntitySpawnBabies = require("callbacks.preRoomEntitySpawnBabies")
local preRoomEntitySpawnBabyFunctions = ____preRoomEntitySpawnBabies.default
function ____exports.main(self, entityType, _variant, _subType, _gridIndex, _seed)
    local roomFrameCount = g.r:GetFrameCount()
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return nil
    end
    if roomFrameCount ~= -1 then
        return nil
    end
    local babyFunc = preRoomEntitySpawnBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        return babyFunc(nil, entityType)
    end
    return nil
end
return ____exports
end,
["callbacks.preTearCollisionBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____constants = require("constants")
local ZERO_VECTOR = ____constants.ZERO_VECTOR
local ____globals = require("globals")
local g = ____globals.default
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    55,
    function(____, tear, _collider)
        if tear.SubType == 1 then
            g.p:AddBlueFlies(1, g.p.Position, nil)
        end
        return nil
    end
)
functionMap:set(
    410,
    function(____, tear, collider)
        if tear.SubType == 1 then
            local creep = Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_HOLYWATER, 0, collider.Position, ZERO_VECTOR, g.p):ToEffect()
            if creep ~= nil then
                creep.Timeout = 120
            end
        end
        return nil
    end
)
functionMap:set(
    459,
    function(____, tear, _collider)
        if tear.SubType == 1 then
            local ____obj, ____index = g.run, "babyCounters"
            ____obj[____index] = ____obj[____index] + 1
            g.p:AddCacheFlags(CacheFlag.CACHE_FIREDELAY)
            g.p:EvaluateItems()
        end
        return nil
    end
)
return ____exports
end,
["callbacks.preTearCollision"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____preTearCollisionBabies = require("callbacks.preTearCollisionBabies")
local preTearCollisionBabyFunctions = ____preTearCollisionBabies.default
function ____exports.main(self, tear, collider)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return nil
    end
    local babyFunc = preTearCollisionBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        return babyFunc(nil, tear, collider)
    end
    return nil
end
return ____exports
end,
["callbacks.preUseItem"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
function ____exports.poop(self, _collectibleType, _rng)
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return false
    end
    if baby.name ~= "Panda Baby" then
        return false
    end
    Isaac.GridSpawn(GridEntityType.GRID_POOP, 6, g.p.Position, false)
    g.sfx:Play(SoundEffect.SOUND_FART, 1, 0, false, 1)
    return true
end
function ____exports.lemonMishap(self, _collectibleType, _rng)
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return false
    end
    if baby.name ~= "Lemon Baby" then
        return false
    end
    g.p:UsePill(PillEffect.PILLEFFECT_LEMON_PARTY, PillColor.PILL_NULL)
    g.p:AnimateCollectible(CollectibleType.COLLECTIBLE_LEMON_MISHAP, "UseItem", "PlayerPickup")
    return true
end
function ____exports.isaacsTears(self, _collectibleType, _rng)
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return false
    end
    if baby.name ~= "Water Baby" then
        return false
    end
    local velocity = Vector(10, 0)
    do
        local i = 0
        while i < 8 do
            velocity = velocity:Rotated(45)
            local tear = g.p:FireTear(g.p.Position, velocity, false, false, false)
            tear.CollisionDamage = g.p.Damage * 2
            tear.Scale = 2
            tear.KnockbackMultiplier = 20
            i = i + 1
        end
    end
    g.p:AnimateCollectible(CollectibleType.COLLECTIBLE_ISAACS_TEARS, "UseItem", "PlayerPickup")
    return true
end
function ____exports.smelter(self, _collectibleType, _rng)
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return false
    end
    if baby.trinket == nil then
        return false
    end
    local trinket1 = g.p:GetTrinket(0)
    local trinket2 = g.p:GetTrinket(1)
    if (trinket1 == baby.trinket) or (trinket2 == baby.trinket) then
        g.run.level.trinketGone = true
    end
    return false
end
function ____exports.brownNugget(self, _collectibleType, _rng)
    local gameFrameCount = g.g:GetFrameCount()
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return false
    end
    if baby.name ~= "Pizza Baby" then
        return false
    end
    if baby.delay == nil then
        error(("The \"delay\" attribute was not defined for " .. baby.name) .. ".")
    end
    if g.run.babyCounters == 0 then
        g.run.babyCounters = 1
        g.run.babyFrame = gameFrameCount + baby.delay
    end
    return false
end
return ____exports
end,
["callbacks.useCard"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local postRender = require("callbacks.postRender")
function ____exports.empress(self)
    postRender:setPlayerSprite()
end
function ____exports.hangedMan(self)
    postRender:setPlayerSprite()
end
return ____exports
end,
["callbacks.useItem"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local misc = require("misc")
local ____enums_2Ecustom = require("types.enums.custom")
local CollectibleTypeCustom = ____enums_2Ecustom.CollectibleTypeCustom
function ____exports.main(self, _collectibleType, _RNG)
    local ____, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return false
    end
    g.run.reloadSprite = true
    return false
end
function ____exports.shoopDaWhoop(self, _collectibleType, _RNG)
    local gameFrameCount = g.g:GetFrameCount()
    local activeCharge = g.p:GetActiveCharge()
    local batteryCharge = g.p:GetBatteryCharge()
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return false
    end
    if baby.name == "Scream Baby" then
        g.run.babyFrame = gameFrameCount
        g.run.babyCounters = activeCharge
        g.run.babyNPC.type = batteryCharge
    end
    return false
end
function ____exports.monstrosTooth(self, _collectibleType, _RNG)
    local gameFrameCount = g.g:GetFrameCount()
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return false
    end
    if baby.name == "Drool Baby" then
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        if g.run.babyCounters == baby.num then
            g.run.babyCounters = 0
            g.run.babyFrame = 0
        else
            g.run.babyFrame = gameFrameCount + 15
        end
    end
    return false
end
function ____exports.howToJump(self, _collectibleType, _RNG)
    local gameFrameCount = g.g:GetFrameCount()
    local ____, baby, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return false
    end
    if baby.name == "Rabbit Baby" then
        if baby.num == nil then
            error(("The \"num\" attribute was not defined for " .. baby.name) .. ".")
        end
        g.run.babyFrame = gameFrameCount + baby.num
    end
    return false
end
function ____exports.clockworkAssembly(self, _collectibleType, _RNG)
    g.run.clockworkAssembly = true
    g.p:UseCard(Card.CARD_WHEEL_OF_FORTUNE)
    g.p:AnimateCollectible(CollectibleTypeCustom.COLLECTIBLE_CLOCKWORK_ASSEMBLY, "UseItem", "PlayerPickup")
    return false
end
function ____exports.flockOfSuccubi(self, _collectibleType, _RNG)
    local effects = g.p:GetEffects()
    do
        local i = 0
        while i < 7 do
            effects:AddCollectibleEffect(CollectibleType.COLLECTIBLE_SUCCUBUS, false)
            i = i + 1
        end
    end
    g.p:AnimateCollectible(CollectibleTypeCustom.COLLECTIBLE_FLOCK_OF_SUCCUBI, "UseItem", "PlayerPickup")
    return false
end
function ____exports.chargingStation(self, _collectibleType, _RNG)
    local numCoins = g.p:GetNumCoins()
    if (((numCoins == 0) or (not g.racingPlusEnabled)) or (not g.p:HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM))) or (RacingPlusGlobals.run.schoolbag.item == 0) then
        return false
    end
    g.p:AddCoins(-1)
    RacingPlusSchoolbag:AddCharge(true)
    g.p:AnimateCollectible(CollectibleTypeCustom.COLLECTIBLE_CHARGING_STATION, "UseItem", "PlayerPickup")
    g.sfx:Play(SoundEffect.SOUND_BEEP, 1, 0, false, 1)
    return false
end
return ____exports
end,
["callbacks.usePillBabies"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    483,
    function()
        local ____obj, ____index = g.run, "babyCounters"
        ____obj[____index] = ____obj[____index] + 1
        g.p:AddCacheFlags(CacheFlag.CACHE_DAMAGE)
        g.p:EvaluateItems()
    end
)
return ____exports
end,
["callbacks.usePill"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local misc = require("misc")
local ____usePillBabies = require("callbacks.usePillBabies")
local usePillBabyFunctions = ____usePillBabies.default
function ____exports.main(self, _pillEffect)
    local babyType, ____, valid = table.unpack(
        misc:getCurrentBaby()
    )
    if not valid then
        return
    end
    local babyFunc = usePillBabyFunctions:get(babyType)
    if babyFunc ~= nil then
        babyFunc(nil)
    end
end
return ____exports
end,
["main"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local entityTakeDmg = require("callbacks.entityTakeDmg")
local evaluateCache = require("callbacks.evaluateCache")
local executeCmd = require("callbacks.executeCmd")
local familiarInit = require("callbacks.familiarInit")
local familiarUpdate = require("callbacks.familiarUpdate")
local inputAction = require("callbacks.inputAction")
local NPCUpdate = require("callbacks.NPCUpdate")
local postBombInit = require("callbacks.postBombInit")
local postBombUpdate = require("callbacks.postBombUpdate")
local postEffectInit = require("callbacks.postEffectInit")
local postEffectUpdate = require("callbacks.postEffectUpdate")
local postEntityKill = require("callbacks.postEntityKill")
local postFireTear = require("callbacks.postFireTear")
local postGameStarted = require("callbacks.postGameStarted")
local postKnifeInit = require("callbacks.postKnifeInit")
local postLaserInit = require("callbacks.postLaserInit")
local postLaserUpdate = require("callbacks.postLaserUpdate")
local postNewLevel = require("callbacks.postNewLevel")
local postNewRoom = require("callbacks.postNewRoom")
local postNPCInit = require("callbacks.postNPCInit")
local postPickupInit = require("callbacks.postPickupInit")
local postPickupSelection = require("callbacks.postPickupSelection")
local postPickupUpdate = require("callbacks.postPickupUpdate")
local postPlayerInit = require("callbacks.postPlayerInit")
local postProjectileUpdate = require("callbacks.postProjectileUpdate")
local postRender = require("callbacks.postRender")
local postTearInit = require("callbacks.postTearInit")
local postTearUpdate = require("callbacks.postTearUpdate")
local postUpdate = require("callbacks.postUpdate")
local preEntitySpawn = require("callbacks.preEntitySpawn")
local preGetCollectible = require("callbacks.preGetCollectible")
local preRoomEntitySpawn = require("callbacks.preRoomEntitySpawn")
local preTearCollision = require("callbacks.preTearCollision")
local preUseItem = require("callbacks.preUseItem")
local useCard = require("callbacks.useCard")
local useItem = require("callbacks.useItem")
local usePill = require("callbacks.usePill")
local ____constants = require("constants")
local VERSION = ____constants.VERSION
local ____globals = require("globals")
local g = ____globals.default
local ____isaacScriptInit = require("isaacScriptInit")
local isaacScriptInit = ____isaacScriptInit.default
local misc = require("misc")
local ____enums_2Ecustom = require("types.enums.custom")
local CollectibleTypeCustom = ____enums_2Ecustom.CollectibleTypeCustom
isaacScriptInit(nil)
local babiesMod = RegisterMod("The Babies Mod", 1)
g.babiesMod = babiesMod
babiesMod:AddCallback(ModCallbacks.MC_NPC_UPDATE, NPCUpdate.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_UPDATE, postUpdate.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_RENDER, postRender.main)
babiesMod:AddCallback(ModCallbacks.MC_FAMILIAR_UPDATE, familiarUpdate.main)
babiesMod:AddCallback(ModCallbacks.MC_FAMILIAR_INIT, familiarInit.main)
babiesMod:AddCallback(ModCallbacks.MC_EVALUATE_CACHE, evaluateCache.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_PLAYER_INIT, postPlayerInit.main)
babiesMod:AddCallback(ModCallbacks.MC_USE_PILL, usePill.main)
babiesMod:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG, entityTakeDmg.main)
babiesMod:AddCallback(ModCallbacks.MC_INPUT_ACTION, inputAction.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_GAME_STARTED, postGameStarted.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_NEW_LEVEL, postNewLevel.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_NEW_ROOM, postNewRoom.main)
babiesMod:AddCallback(ModCallbacks.MC_EXECUTE_CMD, executeCmd.main)
babiesMod:AddCallback(ModCallbacks.MC_PRE_ENTITY_SPAWN, preEntitySpawn.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, postNPCInit.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_PICKUP_INIT, postPickupInit.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_PICKUP_SELECTION, postPickupSelection.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_PICKUP_UPDATE, postPickupUpdate.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_TEAR_INIT, postTearInit.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_TEAR_UPDATE, postTearUpdate.main)
babiesMod:AddCallback(ModCallbacks.MC_PRE_TEAR_COLLISION, preTearCollision.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, postProjectileUpdate.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_LASER_INIT, postLaserInit.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_LASER_UPDATE, postLaserUpdate.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_KNIFE_INIT, postKnifeInit.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_EFFECT_INIT, postEffectInit.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_EFFECT_UPDATE, postEffectUpdate.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_BOMB_INIT, postBombInit.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_BOMB_UPDATE, postBombUpdate.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_FIRE_TEAR, postFireTear.main)
babiesMod:AddCallback(ModCallbacks.MC_PRE_GET_COLLECTIBLE, preGetCollectible.main)
babiesMod:AddCallback(ModCallbacks.MC_POST_ENTITY_KILL, postEntityKill.main)
babiesMod:AddCallback(ModCallbacks.MC_PRE_ROOM_ENTITY_SPAWN, preRoomEntitySpawn.main)
babiesMod:AddCallback(ModCallbacks.MC_USE_ITEM, useItem.main)
babiesMod:AddCallback(ModCallbacks.MC_USE_ITEM, useItem.shoopDaWhoop, CollectibleType.COLLECTIBLE_SHOOP_DA_WHOOP)
babiesMod:AddCallback(ModCallbacks.MC_USE_ITEM, useItem.monstrosTooth, CollectibleType.COLLECTIBLE_MONSTROS_TOOTH)
babiesMod:AddCallback(ModCallbacks.MC_USE_ITEM, useItem.howToJump, CollectibleType.COLLECTIBLE_HOW_TO_JUMP)
babiesMod:AddCallback(ModCallbacks.MC_USE_ITEM, useItem.clockworkAssembly, CollectibleTypeCustom.COLLECTIBLE_CLOCKWORK_ASSEMBLY)
babiesMod:AddCallback(ModCallbacks.MC_USE_ITEM, useItem.flockOfSuccubi, CollectibleTypeCustom.COLLECTIBLE_FLOCK_OF_SUCCUBI)
babiesMod:AddCallback(ModCallbacks.MC_USE_ITEM, useItem.chargingStation, CollectibleTypeCustom.COLLECTIBLE_CHARGING_STATION)
babiesMod:AddCallback(ModCallbacks.MC_USE_CARD, useCard.empress, Card.CARD_EMPRESS)
babiesMod:AddCallback(ModCallbacks.MC_USE_CARD, useCard.hangedMan, Card.CARD_HANGED_MAN)
babiesMod:AddCallback(ModCallbacks.MC_PRE_USE_ITEM, preUseItem.poop, CollectibleType.COLLECTIBLE_POOP)
babiesMod:AddCallback(ModCallbacks.MC_PRE_USE_ITEM, preUseItem.lemonMishap, CollectibleType.COLLECTIBLE_LEMON_MISHAP)
babiesMod:AddCallback(ModCallbacks.MC_PRE_USE_ITEM, preUseItem.isaacsTears, CollectibleType.COLLECTIBLE_ISAACS_TEARS)
babiesMod:AddCallback(ModCallbacks.MC_PRE_USE_ITEM, preUseItem.smelter, CollectibleType.COLLECTIBLE_SMELTER)
babiesMod:AddCallback(ModCallbacks.MC_PRE_USE_ITEM, preUseItem.brownNugget, CollectibleType.COLLECTIBLE_BROWN_NUGGET)
local modName = "The Babies Mod"
local welcomeText = ((modName .. " ") .. VERSION) .. " initialized."
local hyphens = string.rep(
    "-",
    math.floor(#welcomeText)
)
local welcomeTextBorder = ("+-" .. hyphens) .. "-+"
Isaac.DebugString(welcomeTextBorder)
Isaac.DebugString(("| " .. welcomeText) .. " |")
Isaac.DebugString(welcomeTextBorder)
local nameMap = __TS__New(Map)
do
    local i = 0
    while i < #g.babies do
        local baby = g.babies[i + 1]
        if nameMap:has(baby.name) then
            Isaac.DebugString(
                (("ERROR. Baby #" .. tostring(i)) .. " has a duplicate name: ") .. baby.name
            )
        else
            nameMap:set(baby.name, true)
        end
        i = i + 1
    end
end
local itemMap = __TS__New(Map)
local itemExceptions = {CollectibleType.COLLECTIBLE_POOP, CollectibleType.COLLECTIBLE_MOMS_KNIFE, CollectibleType.COLLECTIBLE_BRIMSTONE, CollectibleType.COLLECTIBLE_PONY, CollectibleType.COLLECTIBLE_CANDLE, CollectibleType.COLLECTIBLE_EPIC_FETUS, CollectibleType.COLLECTIBLE_SACRIFICIAL_DAGGER, CollectibleType.COLLECTIBLE_ABEL, CollectibleType.COLLECTIBLE_SAD_BOMBS, CollectibleType.COLLECTIBLE_FIRE_MIND, CollectibleType.COLLECTIBLE_HOW_TO_JUMP, CollectibleType.COLLECTIBLE_GODHEAD, CollectibleType.COLLECTIBLE_THE_WIZ, CollectibleType.COLLECTIBLE_INCUBUS, CollectibleType.COLLECTIBLE_MARKED}
do
    local i = 0
    while i < #g.babies do
        local baby = g.babies[i + 1]
        if baby.item ~= nil then
            if itemMap:has(baby.item) then
                if not __TS__ArrayIncludes(itemExceptions, baby.item) then
                    Isaac.DebugString(
                        (("ERROR. Baby #" .. tostring(i)) .. " has a duplicate item: ") .. tostring(baby.item)
                    )
                end
            else
                nameMap:set(baby.name, true)
            end
        end
        if baby.item2 ~= nil then
            if itemMap:has(baby.item2) then
                if not __TS__ArrayIncludes(itemExceptions, baby.item2) then
                    Isaac.DebugString(
                        (("ERROR. Baby #" .. tostring(i)) .. " has a duplicate item: ") .. tostring(baby.item2)
                    )
                end
            else
                nameMap:set(baby.name, true)
            end
            if misc:getItemConfig(baby.item2).Type == ItemType.ITEM_ACTIVE then
                Isaac.DebugString(
                    ("ERROR. Baby #" .. tostring(i)) .. " has an active item in the second slot."
                )
            end
        end
        i = i + 1
    end
end
local trinketMap = __TS__New(Map)
do
    local i = 0
    while i < #g.babies do
        local baby = g.babies[i + 1]
        if baby.trinket ~= nil then
            if trinketMap:has(baby.trinket) then
                Isaac.DebugString(
                    (("ERROR. Baby #" .. tostring(i)) .. " has a duplicate trinket: ") .. tostring(baby.trinket)
                )
            else
                trinketMap:set(baby.trinket, true)
            end
        end
        i = i + 1
    end
end
return ____exports
end,
["types.RacingPlusSpeedrun"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
end,
}
return require("main")
