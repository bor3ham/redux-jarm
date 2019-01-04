// writing
import populate from './populate.js'
import create from './create.js'
import update from './update.js'
import discard from './discard.js'
import deleteMethod from './delete.js'
import commit from './commit.js'
import save from './save.js'
export {
  populate,
  create,
  update,
  discard,
  deleteMethod as delete,
  commit,
  save,
}

// reading
import get from './get.js'
import get_local from './get_local.js'
import get_remote from './get_remote.js'
import get_error from './get_error.js'
import annotate_status from './annotate_status.js'
import retree_local from './retree_local.js'
import retree_remote from './retree_remote.js'
export {
  get,
  get_local,
  get_remote,
  get_error,
  annotate_status,
  retree_local,
  retree_remote,
}
