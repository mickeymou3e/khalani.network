# T-Axi: A Logiced-Enhanced Functional Programming Language

T-Axi (short for "type-theoretical Axi") is a purely functional programming language that supports formal reasoning about its programs in classical higher-order logic. It features a unique two-layer architecture that strictly separates the programming layer from the logical layer.

## Core Features

### Two-Layer Architecture
- **Programming Layer**: A purely functional language based on System F with inductive types, records and type classes.
- **Logical Layer**: A classical higher-order logic.
- **One-way Interaction**: Logic can reason about programs, but programs cannot manipulate logical entities at runtime.

### Programming Layer
- Strong static type system.
- First-class functions, including support for higher-order functions.
- Polymorphism (parametric, impredicative).
- Inductive data types (like `Bool`, `List` or `Tree`), with functions defined by pattern matching.
- Records.
- Haskell-like type classes.

### Logical Layer
- Propositional logic with standard connectives and constants (`-->`, `/\`, `\/`, `<-->`, `~`, `True`, `False`).
- Quantification (`forall`, `exists`) over programs and types from the programming layer, as well as over logical entities like propositions, predicates and relations.
- Equality (`===`) and reasoning by rewriting.
- Classical logic via reasoning `by-contradiction` and convenient syntax for reasoning requiring the Axiom of Choice.
- Chaining, a unique way of representing reasoning based on long chains of equations, implications and biconditionals, which makes many proofs more readable.

## Repo Structure

The structure of this repo is as follows:
- In [Demo/](Demo/), you will find a demo of the language in the form of commented pseudocode with semi-formal syntax and semantics.
  - You can learn the language from the [tutorial](Demo/Tutorial/). See [Demo/README.md](Demo/README.md) for a reading plan.
  - [Demo/Examples](Demo/Examples) has a few examples.
  - [Demo/AI](Demo/AI) has a few files that can serve as a benchmark for AI. Hint: AI can prove a lot of the simpler theorems!
  - [Demo/Workshop/Comparison](Demo/Workshop/Comparison) contains a brief comparison between T-Axi and A-Axi, in the form of A-Axi's tutorial rewritten in T-Axi.
- In [tree-sitter-axi/](tree-sitter-axi/) you will find a prototype grammar, parser and syntax highlighting tools.
- In [Slides/](Slides/) you will find a bunch of slide decks which are either more formal presentations of a simpler version of T-Axi, or incomplete research notes.