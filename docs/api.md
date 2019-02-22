# API

- `store` refers to the top level of your redux store.
- `pointer` is an object with an `id` and `type`. Any function that takes a `pointer` also would
  accept an `instance`.
- `instance` is a fully complete object with `id`, `type`, `attributes`, and `relationships`.

## Annotations

| Method | Arguments | Description |
| --- | --- | --- |
| `annotate_status` | `store`, `pointer` _or_ `[]pointer` | Annotates the current CRUD status onto
a given pointer or set of pointers. Returns the pointer/pointers with an additional `status` key as
defined in your [Jarm Config](docs/config.md). A list of potential statuses can be found
[here](docs/status.md) |
| `fill_pointers` | `store`, `pointer` _or_ `[]pointer` | Returns the corresponding instances for a
given set of pointer/pointers. These will reflect the local modified changes, if any local changes
exist. |
| `retree` | `store`, `instance` _or_ `instances` | Returns the given instance/instances will fully
filled `relationship` sets, including anything that is known about in the cache. This will recurse
downwards to include any known `relationships` of those `relationships`, until model type repetition
is hit. |

## Cache

| Method | Arguments | Description |
| --- | --- | --- |
| `filter` |||
| `find` |||
| `flush_local` |||
| `get` |||
| `list` |||
| `populate` |||

## Crud

| Method | Arguments | Description |
| --- | --- | --- |
| `commit` |||
| `create` |||
| `delete` |||
| `discard` |||
| `update` |||

## Sync

| Method | Arguments | Description |
| --- | --- | --- |
| `get_error` |||
| `save` |||
| `save_all` |||
