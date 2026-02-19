# honotan

this repo generates code to be used by human.

# this project structure

## generated content structure

generate monorepo project or chunk of it.
apps/ -> actual apps that will be used by user
packages/ -> utilities/adapters to be used in apps/

each app should contain dockerfile.

packages/env -> always generated. contain backend env and frontend env.

## rules

- dockerfile must output minimal size bundle to save space
- every packages or apps that are using env must use packages/env. you can decide if it's need backend env or frontend env or both. keep security in mind.

## terms

standalone-api -> (src/templates/standalone-api) user can generate new backend app. meant to be generated into apps/ folder. parent of hexagonal tempates. support user's selected language.

hexagonal -> (src/templates/hexagonal) templates for hexagonal pattern. exposes in/out adapter. meant to be used inside of apps/<some-app-name>/. NEVER use this template on its own without parent standalone-api

client -> frontend of the project. use tanstack.

monorepo -> generate a whole project. parent of apps/ and packages/

tests should actually run the generator and assert on the files written to .generated/, not on template function strings in memory.
