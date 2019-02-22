# Jarm Config

- `baseUrl`: Your base api url.
- `getJarmState`: Optional function override for getting your Jarm substate from the top level of
  your redux state.
- `storeKey`: The key for your Jarm state as reached from the top level of your redux state, when
  using the default `getJarmState`.
- `schema`: Dictionary of `type` to schema settings:
  - `url`: The path to the object as appended to the top level `baseUrl`.
  - `createIncludes`: Any included relationship names that should be requested on creation.
  - `updateIncludes`: Any included relationship names that should be requested upon update.
  - `newTemplate`: Default values for created instances. If you need more complex default values,
    consider creating instances via your own thunk actions that wrap
    `dispatch(Jarm.create(yourDefaults))`.
- `fetch`: Optional function override for wrapping any authentication / other middleware around
  fetch requests that Jarm makes.
