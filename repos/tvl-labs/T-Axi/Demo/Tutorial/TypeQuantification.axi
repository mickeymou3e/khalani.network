// The syntax of quantifiers over types is as follows.
// Note that, by convention, type variables start with upper case letters.
// P, Q ::= ... | forall {A}, P | exists {A}, P

// To prove a proposition that universally quantifies over types, we use
// `pick-any`, just like for first-order quantifiers.
// `pick-any A in e` proves `forall {A}, P A` provided that
// `e` proves `P` in the context extended with `A : Type`.
// Note that the braces are mandatory and match the syntax used in the
// programming layer.
theorem forall-type-intro-example :
  forall {A}, forall x : A, x === x
proof                                // |- forall {A}, forall x : A, x === x
  pick-any A                         // A : Type |- forall x : A, x === x
  pick-any x                         // A : Type, x : A |- x === x
  refl                               // Theorem proved!
qed

// We can write the `forall`s and the `pick-any`s together.
theorem forall-type-intro-example' :
  forall {A} (x : A), x === x
proof
  pick-any A x
  refl
qed

// In proofterm style, the above proof looks as follows.
theorem forall-type-intro-example-term-style :
  (forall {A} (x : A), x === x) =
    pick-any A x in refl

// We eliminate the universal quantifier using `instantiate`, just like for
// the first-order universal quantifier.
// `instantiate e with T` proves `P T` provided that
// `e` proves `forall {A}, P A`.
theorem forall-type-elim-example :
  (forall {A} (x : A), x === x) -->
    forall n : Nat, n === n
proof                                // |- (forall {A} (x : A), x === x) --> forall n : Nat, n === n
  assume all                         // all : (forall {A} (x : A), x === x) |- forall n : Nat, n === n
  instantiate all with Nat           // Theorem proved!
qed

// The syntax for the existential quantifier over types is `exists {A}, P A`.
// `exists T such that e` proves `exists {A}, P A` provided that
// `e` proves `P T`.
theorem exists-type-intro-example :
  exists {A}, forall x : A, x === x
proof                                // |- exists {A}, forall x : A, x === x
  witness Nat                        // |- forall x : Nat, x === x
  pick-any x                         // x : Nat |- x === x
  refl                               // Theorem proved!
qed

// The example will be silly, let's declare `R` to be a proposition.
declaration R : Prop

// `pick-witness T p for e1 in e2` proves `Q` provided that
// `e1 proves `exists {A}, P A` and that
// `e2` proves `Q` in the context extended with `T : Type` and `p : P T`.
// In our silly example, we prove that if the proposition `R` holds for
// some type, then it just holds.
theorem exists-type-elim-example :
  (exists {A}, R) --> R
proof                                // |- (exists {A}, R) --> R
  assume ex                          // ex : (exists {A}, R) |- R
  pick-witness A r for ex            // ex : (exists {A}, R), A : Type, r : R |- R
  assumption                         // Theorem proved!
qed

// Of course we can also fuse the `pick-witness` with the preceding `assume`.
theorem exists-type-elim-example :
  (exists {A}, R) --> R
proof                                // |- (exists {A}, R) --> R
  assume (witness A such-that r)     // A : Type, r : R |- R
  assumption                         // Theorem proved!
qed