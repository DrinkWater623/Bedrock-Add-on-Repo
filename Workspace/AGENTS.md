# Minecraft Bedrock add-on workspace

This workspace contains Minecraft Bedrock add-on projects. Regolith is used
to generate the add-ons by processing their source files.

## Source folders and generated files

- Ignore dot-prefixed filenames when reviewing project source, searching for
  usage, or reporting source/dependency problems. These are excluded files,
  not active add-on source. Project metadata such as .gitignore can still be
  read when needed to understand the project.
- Consult repository and nested .gitignore files for additional exclusions.
  Respect those patterns in routine searches; do not include ignored source
  unless explicitly asked to inspect it.

- Ignore all Regolith caches, including .regolith/cache, during searches,
  code reviews, duplicate checks, and dependency or usage checks. They record
  the last Regolith run and are not current source or evidence of active usage.
- filters: Per-add-on Regolith filters that process the add-on.
- packs: Actual behavior pack (BP) and resource pack (RP) source files.
  Some files are processed by filters; a data subfolder may be filter input.
  Inspect the relevant filter before assuming how those files are used.
- build: Saved generated add-on builds, when present. Use packs and filters
  to determine current behavior; inspect saved builds only when relevant
  to an explicitly requested build or output investigation.
