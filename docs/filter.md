# Filter

A filter can be used to search the local Jarm cache. All filtering is done against the locally
modified version of the instance.

The arguments are all optional, as follows:

| Key | Values | Description |
| --- | --- | --- |
| `type` | `"type"` | Filter by model type. |
| `id` | `"id"` | Exact id match. |
| `modified` | `true` _or_ `false` | Whether or not this instance has been changed locally. |
| `new` | `true` _or_ `false` | Whether or not this instance exists on the server. |
| `committed` | `true` _or_ `false` | If any changes to the instance have been committed. |
| `pending` | `true` _or_ `false` | If any changes to the instance are currently pending. |
| `attributes` | `{key: value}` | Exact attribute matches. |
| `relationships` | `{key: value}` | Exact relationship matches. |
