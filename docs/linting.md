# Linting Setup

## Javascript

Install eslint and its dependencies to your system with npm:

```
npm install -g \
  eslint-config-standard \
  eslint \
  eslint-babel \
  eslint-plugin-import \
  eslint-plugin-node \
  eslint-plugin-promise \
  eslint-plugin-standard
```

These are included in the `package.json` for Travis, but it is assumed your text editor environment
is separate from the local project directory.

### Sublime Text 3

Add `SublimeLinter` and `SublimeLinter-eslint` using Package Control.
