// writing
import populate from './populate.js'
import create from './create.js'
import update from './update.js'
import discard from './discard.js'
import deleteMethod from './delete.js'
import commit from './commit.js'
import save from './save.js'
// save_all
import flush_remote from './flush_remote.js'
import flush_local from './flush_local.js'
export {
  populate,
  create,
  update,
  discard,
  deleteMethod as delete,
  commit,
  save,
  flush_remote,
  flush_local,
}

// reading
import get from './get.js'
import get_local from './get_local.js'
import get_remote from './get_remote.js'
import get_error from './get_error.js'
import find from './find.js'
import find_local from './find_local.js'
import find_remote from './find_remote.js'
// list_drafts [{id, type},]
// list_modified [{id, type},]
// list_local [{id, type},]
// list_pending [{id, type},]
import annotate_status from './annotate_status.js'
// annotate_drafts - REQUIRES SCHEMA
import retree_local from './retree_local.js'
import retree_remote from './retree_remote.js'
export {
  get,
  get_local,
  get_remote,
  get_error,
  find,
  find_local,
  find_remote,
  annotate_status,
  retree_local,
  retree_remote,
}
