# Axi Language

axi is a language for writing self-certifying, composable programs. The primary use case of axi is the construction of autonomous and goal oriented state machines that run on top of a permissionless blockchain.

## Crates

- `axi-parser`: Located in `crates/parse`. This crate contains the lexer, the parser and the node types for the abstract syntax of axi.
- `axi-core-semantics`: Located in `crates/core`. This crate contains the interpreter (proof verifier) for logical proofs over core axi (core axi does not provide custom proof method definitions, nor lambda functions). 