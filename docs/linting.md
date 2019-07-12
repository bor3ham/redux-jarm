# Linting Setup

## Javascript

Install eslint and its dependencies to your system with npm:

```
npm install -g \
  eslint-config-standard \
  eslint \
  eslint-plugin-import \
  eslint-plugin-node \
  eslint-plugin-promise \
  eslint-plugin-standard
```

This is not included in `package.json` as it is assumed your text editor environment is separate
from the docker container.

### Sublime Text 3

Add `SublimeLinter` and `SublimeLinter-eslint` using Package Control.
