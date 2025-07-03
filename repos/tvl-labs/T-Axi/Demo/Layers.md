# Layers in T-Axi

T-Axi is a language with two layers: the programming layer and the logic layer. The interaction between these layers is supposed to be in one direction only: logic can talk about programs (after all, if it couldn't, it would be pointless to have it), but programs cannot manipulate logical entities (like propositions, predicates or relations) at runtime, nor can they use them for compile-time purposes (an example of which would be restricting the input to a function only to values satisfying a logical condition). Thus we can form an easy and memorable slogan: programs don't know about logic, but logic knows about programs.

The goal of this document is to describe the workings of this division into layers that is more precise than the above vague paragraph, but less precise than what we could have achieved by writing down the exact theory.

## Methodology

We'll use the notion of a **kind**, which is a "higher" analogue to the notions of **type** and **proposition**. We can think that:
- Types classify programs. "What does this program compute?" - "An integer, a boolean, a string, etc."
- Propositions classify proofs. "What does this proof prove?" - "`True`, `False`, a conjunction/disjunction of `P` and `Q`, etc."

In a similar manner:
- In the programming layer, (programming) kinds classify type-level entities. "What's this?" - "A type, a type parameterized by a type, etc."
- In the logic layer, (logical) kinds classify logical entities. "What's this?" - "A proposition, a predicate, a relation, a logical connective, etc."

To explain the stratification of T-Axi into programming and logic layers, we need to describe what entities can be formed and which kinds they inhabit. However, we are not interested in all entities, as most of them are somewhat easy. We are interested only in "functional" entities, like function types, implications and various flavours of universal quantifiers.

We won't explain the entire formalism used here. It suffices to say that a **PTS rule** of the form `(A, B, C)` means that given entities that inhabit kind `A` (the domain) and kind `B` (the codomain), we can form an entity which inhabits kind `C`.

For example, the rule `(Type, Type, Type)` means that given two types (`A` and `B`), we can form another type, which we interpret as the function type `A -> B`.

## Programming layer

The universe in which all programming happens is called `PKind` (which stands for "programming kind").

It's most important inhabitant is `Type` (i.e. `Type : PKind`). The inhabitants of `Type` (i.e. things `A` such that `A : Type`) are types. Some example types include:
- Base types, like `Int` and `String`.
- Compound types, like products `Int * Bool` or sums `String + Int`.

However, in this document we are not concerned with these - we only care about the interesting compound types, which are function types and polymorphic types.

Note: in the table, `A`, `B` are types and `K` is a programming kind.

| Name                | Demo?  | Syntax            | PTS rule            |
| ------------------- | ------ | ----------------- | ------------------- |
| Function type       | ✅ yes | `A -> B`          | (Type, Type, Type)  |
| Polymorphism        | ✅ yes | `forall T : K, A` | (PKind, Type, Type) |

Let's read the table:
- First row: given types `A` and `B`, we can form the type `A -> B`, which is the type of functions from `A` to `B`. An example is `Int -> Int`, the type of functions from integers to integers. An example term of this type is `fun x : Int => x`, the identity function on integers.
- Second row: given a kind `K` and a type `A` (which can depend on `T` of kind `K`), we can form the type `forall T : K, A`. An example is `forall A : Type, A -> A`, the type of polymorphic endofunctions. An example term of this type is `fun A : Type => fun x : A => x`.

Are there any other entities besides types that inhabit `PKind`? In the current version of the demo there are none, but in the final version of T-Axi there could be entities called "type operators".

| Name                | Demo? | Syntax     | PTS rule              |
| ------------------- | ----- | ---------- | --------------------- |
| Type operators      | ❌ no | `K1 -> K2` | (PKind, PKind, PKind) |

Let's read it: given (programming) kinds `K1` and `K2`, we can form the kind `K1 -> K2`. An example is `Type -> Type`, the kind of unary type operators, i.e. the kind of functions from types to types. An example entity of this kind is `fun A : Type => List (A * Nat)`, which is a function tha takes a type `A` and returns the type of lists of pairs of `A`s and natural numbers.

## Logic layer

The universe in which all logic happens is called `LKind` (which stands for "logical kind").

It's most important inhabitant is `Prop` (i.e. `Prop : LKind`). The inhabitants of `Prop` (i.e. things `P` such that `P : Prop`) are propositions. Some example propositions:
- The propositional constants `True` and `False`.
- Propositions built with propositional connectives, like `P /\ Q`, `P \/ Q`, `P <--> Q`, `~ P`, etc.
- Equalities like `2 = 2` or `42 = 666`.

However, in this document we are not concerned with these - we only care about the interesting propositions, which are implications and various flavours of universal quantifiers.

| Name                        | Demo?  | Syntax            | PTS rule            |
| --------------------------- | ------ | ----------------- | ------------------- |
| Implication                 | ✅ yes | `P --> Q`         | (Prop, Prop, Prop)  |
| First-order quantification  | ✅ yes | `forall x : A, P` | (Type, Prop, Prop)  |
| Type quantification         | ✅ yes | `forall T : K, P` | (PKind, Prop, Prop) |
| Higher-order quantification | ✅ yes | `forall R : L, P` | (LKind, Prop, Prop) |

Let's read the table:
- First row: given propositions `P` and `Q`, we can form the proposition `P --> Q`, which is the implication from `P` to `Q`. An example is `True --> True`, the proposition which says that `True` implies `True`. An example proof of this proposition is `assume t : True in t`.
- Second row: given a type `A` and a proposition `P` (which can depend on `x` of type `A`), we can form the proposition `forall x : A, P`. An example is `forall x : Int, x === x`, the proposition which says that every integer is equal to itself. An example proof of this proposition is `pick-any x : A in refl x`.
- Third row: given a programming kind `K` and a proposition `P` (which can depend on `T` of kind `K`), we can form the proposition `forall T : K, P`. An example is `forall A : Type, forall x : A, x === x`, the proposition which says that every term of every type is equal to itself. An example proof of this proposition is `pick-any A : Type in pick-any x : A in refl x`.
- Fourth row: given a logical kind `L` and a proposition `P` (which can depend on `R` of kind `L`), we can form the proposition `forall R : L, P`. An example is `forall P : Prop, P --> P`, the proposition which says that every proposition implies itself. An example proof of this proposition is `pick-any P : Prop in assume p : P in p`.

Are there any other logical entities besides propositions that inhabit `LKind`? Yes! There are at least predicates and relations (which are present in the demo), but there can be even more, including polymorphic predicates and "logical operators" (which include logical connectives and much more).

| Name                        | Demo?  | Syntax              | PTS rule              |
| --------------------------- | ------ | ------------------- | --------------------- |
| Predicates and relations    | ✅ yes | `A -> L`            | (Type, LKind, LKind)  |
| Polymorphic predicates      | ✅ yes | `forall T : K, L` | (PKind, LKind, LKind) |
| "Logical" operators         | ❌ no  | `L1 -> L2`          | (LKind, LKind, LKind) |

Let's read the table:
- First row: given a type `A` and a logical kind `L`, we can form the logical kind `A -> L`. An example is `Int -> Prop`, the logical kind of predicates on the integers. An example entity of this kind is `fun i : Int => i === 42`.
- Second row: given a programming kind `K` and a logical kind `L` (which can depend on `T` of kind `K`), we can form the logical kind `forall T : K, L`. An example is `forall A : Type, A -> A -> Prop`, the logical kind of polymorphic homogenous binary relations. An example entity of this kind is `fun A : Type => fun x y : A => x === y \/ ~ x === y`. Another example is `forall (_ : Type), Prop`, which can also be written as `Type -> Prop`, the logical kind of predicates on types. An example entity of this kind is `fun A : Type => forall x y : A, x === y`.
- Third row: given logical kinds `L1` and `L2`, we can form the logical kind `L1 -> L2`. An example is `Prop -> Prop -> Prop`, the logical kind of binary propositional connectives. Example entitities of this kind are conjunction `/\` and disjunction `\/`. Another example is `(Nat -> Prop) -> Prop`, the logical kind of quantifiers on the natural numbers. An example entity of this kind is `fun P => forall x : Nat, P x`.

## What's the metatheory?

You may wonder whether our logic is consistent (i.e. non-contradictory) and whether the programming language has desirable properties. The answer: **yes**! Well, maybe not the entire language, but a core calculus on which it is based is indeed well-behaved.

In short: our programming and logic layers, when viewed **separately** from each other, correspond to the following well-known systems:
- The programming layer corresponds to **System F** (see the first table in the programming section). If we include type operators, which are missing in the demo, then it's **System Fω** (see the second table in the programming section).
- The logic layer also corresponds to **System F**, and if we include logical operators, then it's **System Fω** (see the second table in the logic section).

Both System F and System Fω can be viewed as Pure Type Systems (PTSes for short). All PTSes enjoy some nice metatheoretical properties:
- Confluence - every program has at most one final result.
- Type preservation - the result of every program is of the same type as the program itself.

Additionally, some PTSes enjoy another desired metatheoretical property called **strong normalization**. A PTS has strong normalization when every program terminates in finite time, no matter in which order computation proceeds. It is well-known that both System F and System Fω (viewed as programming languages) enjoy strong normalization.

From these three properties it follows that, when viewed as logics, both System F and System Fω are consistent. This is because if there was a proof of `False`, there would be a proof of `False` in normal form, but there is no such thing.

Okay, but in T-Axi the programming and logic layers are combined, not separated! To the rescue comes a nice paper called [The Structural Theory of Pure Type Systems](https://florisvandoorn.com/papers/struct_pts.pdf) which can help us see both layers as one. For an approachable overview, see [its accompanying slides](https://florisvandoorn.com/talks/TLCA2014.pdf).

The paper defines a construction, which takes two PTSes **P** and **Q** and creates a PTS **Q over P** that corresponds to the **Q**-logic which can quantify over **P**-terms.

It so happens that this construction corresponds exactly to the core of T-Axi. This is true irrespective of which variant of T-Axi we consider: the demo is **System F over System F**, but if we include everything from both tables, then it's **System Fω over System Fω**.

Now, the paper proves some nice theorem about this **Q over P** construction:
- If **P** and **Q** are weakly normalizing, then so is **Q over P**.
- **Q over P** is a conservative extension of **Q**, i.e. a theorem is provable in **Q over P** if and only if it is provable in **Q**.

Together these theorems guarantee that the core of T-Axi is weakly normalizing, from which follows that its logic is consistent. Moreover, it's easy to understand what its logic is like, since it's a conservative extension of System F/System Fω.

However, we must reiterate that these results apply only to the **core** of T-Axi:
- The programming layer of **T-Axi Core** supports function types and polymorphism (and possibly type operators, if they're present), but not inductive types, records or type classes.
- The logic layer of **T-Axi Core** supports everything except classical logic.

Proving consistency and other nice properties for full T-Axi will require more work. Each programming feature, like inductive types, records, type classes, etc., will require a separate argument. Luckily, it is well known that these features are well-behaved when constrained in certain ways. Extending the proof of consistency to full classical logic might be harder, since it might not be possible to just extend the proof for the logical layer of T-Axi core.