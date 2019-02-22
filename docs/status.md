# Status

A Jarm object must be in any one of the following states:

- `unchanged`: the instance has no local modifications.
- `draft`: the instance does not exist on the server, and is not yet ready to be pushed.
- `draft-committed`: the instance does not yet exist on the server, but has been committed and
  will be pushed the next time a `save` is called.
- `draft-pending`: the instance does not yet exist on the server, but a request to create it is
  currently pending.
- `modified`: the instance exists on the server, but local changes have been made that are not
  committed to.
- `modified-committed`: the instance exists on the server, but local changes have been committed and
  will be pushed the next time a `save` is called.
- `modified-pending`: the instance exists on the server, but a request to modify it is currently
  pending.
- `deleted`: the instance exists on the server, but it is tentatively marked for deletion.
- `deleted-committed`: the instance exists on the server, but it has been marked for deletion and
  will be deleted the next time a `save` is called.
- `deleted-pending`: the instance exists on the server, but a request to delete it is currently
  pending.
