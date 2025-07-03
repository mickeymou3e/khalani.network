// This is a comment.

// The basic objects in the language are types, terms, propositions and proofs.
// Top-level commands can be used to either define or declare these.
// Definitions assign names to expressions.
// Declarations introduce new constants that don't have computational content.
// Type and proposition declarations are safe, whereas term declarations and
// axioms (i.e. "proof declarations") are unsafe, i.e. may lead to contradiction.
// Whether declarations should be present in the final language is unclear,
// but they are present in comparable languages, so they are included for now.
// In any case, we will only use declarations before introducing the various
// forms of bindings and quantifiers that render them unnecessary.

// The syntax of definitions and declarations is as follows.

// Type definition, i.e. type synonym/alias.
type NameOfType = DefBody

// `type` is a keyword. `=` means "is defined as".
// By convention, names of types must start with an upper case letter
// and are written in PascalCase (i.e. UpperCamelCase).

// Type declaration.
type NameOfType

// Record type definition.
record type NameOfType where
  fieldName1 : TypeOfField1
  // ⋮
  fieldNameN : TypeOfFieldN

// `record type` and `where` are keywords.
// `:` means "is of type".
// By convention, names of fields must start with a lower case letter
// and are written in camelCase.

// Data type (i.e. inductive type/algebraic type) definition.
data type NameOfType where
  ConstructorName1 : ArgType1_1 -> /* ... -> */ ArgType1_M1 -> NameOfType
  // ⋮
  ConstructorNameN : ArgTypeN_1 -> /* ... -> */ ArgTypeN1_MN -> NameOfType

// `data type` is a keyword.
// By convention, names of constructors must start with an upper case letter
// and are written in PascalCase.
// Note that this convention is not strictly followed in the demo 🙂

// Term definition.
nameOfTerm : TypeOfTerm = defBody

// There is no leading keyword, because definitions are super common.
// By convention, names of terms must start with a lower case letter
// and are written in camelCase.

// Term declaration.
// `declaration` is a keyword.
declaration nameOfTerm : TypeOfTerm

// Definition of a logical entity (these are things like propositions,
// predicates and relations).
NameOfLogicalEntity : SomeLogicalKind = DefBody

// Names of propositions, predicates and other logical entities follow
// the same conventions as names of types, i.e. PascalCase/UpperCamelCase.

// Declaration of a logical entity.
declaration NameOfLogicalEntity : SomeLogicalKind

// Theorem, i.e. a "proof definition".
theorem someFunction-satisfies-SomePredicate : SomeProposition
proof
  // the actual proof goes here
  simpl
qed

// `theorem`, `proof` and `qed` are keywords.
// By convention, names of theorems consist of parts separated with `-`,
// where the parts are either names of functions, names of types,
// names of propositions/predicates/relations, or ordinary words.
// Preferably, the name should reflect the theorem statement, with
// the name of the head symbol being the first part of the theorem
// name, for example the theorem `map id === id` should be named `map-id`.

// Theorem in the so-called proofterm style.
theorem someFunction-satisfies-SomePredicate-term-style : SomeProposition =
  someProofterm

// Note that theorems in proofterm style look more like term definitions,
// including the formatting of the proofterm (this will be explained later).

// Axiom, i.e. a "proof declaration".
axiom name-of-axiom : SomeProposition

// `axiom` is a keyword.
// Axiom names follow the same conventions as theorem names.

// Some additional naming conventions:
// - Type variables start with an upper case letter and follow PascalCase.
// - Local variables start with a lower case letter and follow camelCase.
// - If we have structural variants, an apostrophe `'` will disambiguate
//   between a constructor and something else which overshadows its name.