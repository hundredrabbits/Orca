Orca language is a "library" of operators (everything that is not a command) that together define its behavior. Orca has the ability to dynamically load and combine multiple operator libraries at runtime, effectively allowing you to reconfigure the language. For example, you may want this for playing older compositions that are no longer compatible with the current Orca, or to experiment with alternative operators without affecting mainline Orca. Language reconfiguration lets you tailor the language to your individual composition.

Orca starts with a `default` library, additional libraries can be loaded and combined via the `lang` command. Library loading is incremental, that is, operators defined in the new library are added to runtime, replacing existing operators. A given library may define all operators or only some. To completely clear the runtime library and start with the blank slate use the `clr` library.

## Available libraries

"Complete" means you get a fully functioning Orca by loading just that library, "incremental" means it only defines a subset of operators and you need something loaded before that to get a full Orca (usually `default`).

* `clr`: a special library that unloads all definitions
* `default`: mainline Orca language, loaded at startup (complete)
* `orca157`: Orca before the BFL breaking change (complete) (TODO)
* `base`: not a very useful library by itself, defines the basics such as comments and numbers
* `sb*`: Sborca collection of alternative operators (see `sborca.md`)

## Usage examples