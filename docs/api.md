# API

- `store` refers to the top level of your redux store.
- `pointer` is an object with an `id` and `type`. Any function that takes a `pointer` also would
  accept an `instance`.
- `instance` is a fully complete object with `id`, `type`, `attributes`, and `relationships`.
- `filter` is a filter object as defined by the [filter specification here](filter.md).

## General

| Method | Arguments | Description |
| --- | --- | --- |
| `fetch` | `url`, `config`, `data` | Performs a web request using your custom `fetch` command specified in the [config](config.md), automatically adding any returned data to the local cache. |

## Annotations

| Method | Arguments | Description |
| --- | --- | --- |
| `annotate_status` | `store`, `pointer` _or_ `[]pointer` | Annotates the current [status](status.md) onto a given pointer or set of pointers. Returns the pointer/pointers with an additional `status` key as defined in your [Jarm Config](config.md). |
| `fill_pointers` | `store`, `pointer` _or_ `[]pointer` | Returns the corresponding instances for a given set of pointer/pointers. These will reflect the local modified changes, if any local changes exist. |
| `retree` | `store`, `instance` _or_ `instances` | Returns the given instance/instances will fully filled `relationship` sets, including anything that is known about in the cache. This will recurse downwards to include any known `relationships` of those `relationships`, until model type repetition is hit. |

## Cache

| Method | Arguments | Description |
| --- | --- | --- |
| `find` | `store`, `filter` | Returns the first `pointer` that matches the given `filter`. |
| `filter` | `store`, `filter` | Returns a set of `[]pointer` that match the given `filter`. |
| `get` | `store`, `filter` | Returns the first `instance` that matches the given `filter`. |
| `list` | `store`, `filter` | Returns a set of `[]instance` that match the given `filter`. |
| `populate` | `instance` _or_ `[]instance` | Updates the cache of known instances to include any given data. |
| `flush_local` | | Deletes all local `drafts`, `modifications`, `deletions`. Use with caution. |

## Crud

| Method | Arguments | Description |
| --- | --- | --- |
| `commit` | `type`, `id` | Commits any local modifications or deletion to be pushed the next time a save is called. |
| `create` | `instance` | Creates a new instance (requiring a `type`), applying the given instance values on top of the [schema's newTemplate](config.md). |
| `delete` | `type`, `id` | Marks a remote instance as flagged for deletion. Note: this change will still need to be committed. |
| `discard` | `type`, `id` | Discards any local modications or deletion flag for given instance. |
| `update` | `type`, `id`, `changes` | Saves the given changes locally to any instance. Note: these changes will still need to be committed. |

## Sync

| Method | Arguments | Description |
| --- | --- | --- |
| `get_error` | `type`, `id` | Gets the most recent sync error associated with a given instance. |
| `save` | `type`, `id` | Pushes any local changes for a given instance up to the remote. This will automatically `commit` the changes if they are uncommitted. |
| `save_all` | | Pushes all `committed` modifications / deletions up to the remote server. |
