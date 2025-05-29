#### Background Info
- **Lua uses "Mechanism over Policies"** meaning instead of having  special keyword for things like classes it uses simple building block to express complex ideas.
- Lua is embedded meaning it can run within programs, system etc. We can execute Lua directly inside neovim.
#### Comments
```lua
-- This is a single line comment. it starts with two dashed.
--[[
	This is a multi-line comment
--]]
```
---
#### Variables : Simple Literals
```lua
local number = 5
local string = "hello world"
local single = 'also works'
local multi = [[ This is
multi line and literal ]]
local truth, lies = true, false
local nothing = nil
```
---
#### Variables : Functions
```lua
local function hello(name)
	print("Hello!",name)
end
local greet = function(name)
	-- .. is string concatination
	print("Greetings, " .. name .. "!")
end
```
- function are `first class` meaning we can make them values and assign them to a variable.
```lua
local higher_order_function = function(first)
	return another_function(second_values)
		return first + second
	end
end
local another_func = higher_order_function(1)
print("value : " .. another_func(2))
```
```Output
value : 3
```
- function can also return multiple values
```lua
local function returna_four_value() 
	return 1, 2, 3, 4
end
first, second, last = return_four_value()
print("first: ", first)
print("second: ", second)
print("last: ", last)
-- 4th value is discarded
```
- We can accept multiple arguments using `...`.
```lua
local variable_arguments = function(...)
  local arguments = { ... }
  for i, v in ipairs({...}) do print(i, v) end
  return unpack(arguments)
end

print("===================")
print("1:", variable_arguments("hello", "world", "!"))
print("===================")
print("2:", variable_arguments("hello", "world", "!"), "<lost>")
```
- in the second print statement where we call `variable_arguments`, while printing only `hello` would be printed because we don't have enough slot for other because we are printing `<lost>`.
---
#### Variables : Tables
- We only have one data structure which is used for map and lists
- As a list ..
```lua
local list = { "first", 2, true, function() print("fourth") end }
print("One based indexing :", list[1])
print("Fourth : ", list[4]())
```
---
- As a map ..
```lua
local map = {
	literal_key = "a string",
	["an expression"] = "also works",
	[function() end] = true
}

print("literal_key", map.literal_key)
print("an expression", map["an expression"])
print("function() end", t[function() end])
```
- we use `[]` to make any expression as a key 
- we can even make functions as key but the output of the third print statement will be different.
- The output is nothing literally nothing gets printed because the function we define in the `print` statement is different from the function we defined in the `map` table. they point to different places.
==Not Covered : Threads and Userdata==
---
#### Functions : Calling 
- String shorthand
```lua
local single_string = function(s)
  return s .. " - WOW!"
end

local x = single_string("hi")
local y = single_string "hi"
print(x, y)
```
- for literal strings we can just omit the parenthesis
- Table shorthand
```lua
local setup = function(opts)
  if opts.default == nil then
    opts.default = 17
  end

  print(opts.default, opts.other)
end

setup { default = 12, other = false}
setup { other = true}
```
---
#### Functions : Colon function
```lua
local MyTable = {}

function MyTable.something(self, ...) end
function MyTable:something(...) end
```
- this is more of syntactic sugar that lua offers.
#### Control Flow : for
- we have two ways through which we can iterate overs lists
```lua
local fruits = { "apple", "orange", "strawberry" }
for index = 1, #fruits do 
	print(index, fruits[index])
end

for index, value in ipairs(fruits) do 
	print(index, value)
end
```
- `#` is used to determine the length of the list
- `ipairs` returns us two values index and value.
- `#` doesn't works with maps and returns the length as `0`.
- we can use `ipairs` to iterate over the map.
```lua
local t = { js = "JavaScript", go = "golang" }
for key, value in ipairs(t) od 
	print(key, value)
end
```
---
#### Control Flow : If Statement
```lua
local function action(prime)
	if prime then 
		print("Prime no")
	else
		print("Not Prime")
	end
end

-- falsey values : nil, false
action() --same as action(nil)
action(false)
-- truthy values
action(true)
action(0)
action({})
```
---
#### Modules
- Modules are just files
```lua
-- foo.lua
local M = {}
M.some_function = function() end
return M
```

```lua
-- bar.lua
local foo = require('foo')
foo.some_function()
```

- `local M = {}` is a convention that is generally followed, as in M for modules.
- Returning a table gives us flexibility that in the future if we want to add some other things we can do that and still export them without any hassle.
- 