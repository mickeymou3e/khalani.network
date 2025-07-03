// In T-Axi, there are two independent manifestations of classical logic:
// - At the propositional level, it is reasoning by contradiction (and its
//   corresponding primitive `by-contradiction`) as well as its consequences
//   like the law of excluded middle and double negation elimination.
// - Axiom of Choice, which ties logical existence with the programming layer.

// In this file, we will explore how the Axiom of Choice works in T-Axi.

// First, let's recall how `pick-witness` (the usual elimination of the
// existential quantifier) works.
theorem pick-witness-example
  forall {A} (P : A -> Prop),
    (exists x : A, P x) --> exists x : A, P x
proof                                  // |- forall {A} (P : A -> Prop), (exists x : A, P x) --> exists x : A, P x
  pick-any A P                         // A : Type, P : A -> Prop |- (exists x : A, P x) --> exists x : A, P x
  assume e                             // A : Type, P : A -> Prop, e : (exists x : A, P x) |- exists x : A, P x
  pick-witness a p for e               // A : Type, P : A -> Prop, e : (exists x : A, P x), a : A, p : P a |- exists x : A, P x
  witness a                            // A : Type, P : A -> Prop, e : (exists x : A, P x), a : A, p : P a |- P a
  assumption                           // Theorem proved!
qed

// Axiom of Choice is realized with `choose` and `choose-spec`,
// two primitives which are an alternative way of eliminating
// the existential quantifier. The rules are as follows:

// `choose e` is a term of type `A`
// provided that
// `e` proves `exists x : A, P x`

// `choose-spec e` proves `P (choose e)`
// provided that
// `e` proves `exists x : A, P x`

// The first thing to notice is that `choose` and `choose-spec`
// are equivalent to `pick-witness` as far as logical reasoning
// is concerned. In the proof below, we use `choose` to obtain
// the needed witness and then `choose-spec` to prove that it
// satisfies `P`.
theorem choice-example :
  forall {A} (P : A -> Prop),
    (exists x : A, P x) --> exists x : A, P x
proof                                  // |- forall {A} (P : A -> Prop), (exists x : A, P x) --> exists x : A, P x
  pick-any A P                         // A : Type, P : A -> Prop |- (exists x : A, P x) --> exists x : A, P x
  assume e                             // A : Type, P : A -> Prop, e : (exists x : A, P x) |- exists x : A, P x
  witness choose e                     // A : Type, P : A -> Prop, e : (exists x : A, P x) |- P (choose e)
  choose-spec e                        // Theorem proved!
qed

// However, they are NOT equivalent to `pick-witness` when we
// take the programming layer into account. The distinction:
// - `pick-witness` happens entirely in the logic and has nothing
//   to do with any programming.
// - `choose` turns a proof into a term, i.e. it connects the logic
//   layer with the programming layer.

// However, `choose` does not produce a program like the ones we have
// seen so far. In fact, it produces a term which is not a program at
// all, because it does not have any computational content. The reason
// is that our logic is classical, and thus proofs of existence can be
// nonconstructive, i.e. they don't need to show a concrete witness -
// it suffices they show it's impossible for a witness not to exist.
// Therefore, it is not possible to retrieve a (computational) witness
// from a proof of existence.

// To put the above more clearly: we can use the terms produced
// by `choose` only for the purposes of logical reasoning. We
// cannot use them for programming.

// However, since `choose` produces terms, it makes sense to have
// a special syntax sugar for using it as if it were an ordinary
// programming construct. This is achieved with the keyword
// `noncomputable`, which allows us to use `choose` inside terms,
// but terms marked with this keyword are only usable inside proofs
// and other `noncomputable` terms. We can use this keyword both
// in with `let` and on the top-level.

theorem let-noncomputable-example :
  forall {A} (P : A -> Prop),
    (exists x : A, P x) --> exists x : A, P x
proof                                  // |- forall {A} (P : A -> Prop), (exists x : A, P x) --> exists x : A, P x
  pick-any A P                         // A : Type, P : A -> Prop |- (exists x : A, P x) --> exists x : A, P x
  assume e                             // A : Type, P : A -> Prop, e : (exists x : A, P x) |- exists x : A, P x
  let noncomputable x : A = choose e   // A : Type, P : A -> Prop, e : (exists x : A, P x), x : A = choose e |- exists x : A, P x
  witness x                            // A : Type, P : A -> Prop, e : (exists x : A, P x), x : A = choose e |- P x
  choose-spec e                        // Theorem proved!
qed

// There exists a natural number satisfying some property `P`.
declaration P : Nat -> Prop
axiom ex : exists n : Nat, P n

// We can use `noncomputable` at the top-level.
noncomputable magic-number : Nat =
  choose ex

// We can prove that `magic-number` satisfies `P`.
theorem magic-number-spec :
  P magic-number
proof                                  // |- P magic-number
  unfold magic-number                  // |- P (choose ex)      // `noncomputable` definitions can be `unfold`ed like ordinary ones.
  choose-spec                          // |- exists x : A, P x  // Just use `choose-spec`.
  ex                                   // Theorem proved!       // We can't use `assumption` because `ex` is a top-level axiom.
qed

// We can write another noncomputable program using `magic-number`.
noncomputable magic-number-squared : Nat =
  magic-number * magic-number

// However, if we try to write an ordinary program that uses `magic-number`,
// we will get an error.
ordinary-number : Nat =
  magic-number - magic-number
// ERROR: `ordinary-number` is not marked `noncomputable`, but uses `magic-number`,
// which is `noncomputable`.

// Remember that `pick-witness` has nothing to do with `choose` -
// we can't use it to define `noncomputable` programs.
noncomputable another-magic-number : Nat =
  pick-witness n _ for ex in n
// ERROR: Can't use `pick-witness` inside programs.

// This is a bit sad, because `pick-witness` is nicer to use than
// `choose` and `choose-spec`, not to mention pattern-matching
// directly in `assume` using `assume (witness a such-that p)`.

// Don't worry, however! We introduce a syntax sugar `choose-witness`
// which behaves almost the same as `pick-witness`, but also keeps
// track of the fact that the witness comes from `choose`.

theorem choose-witness-example
  forall {A} (P : A -> Prop),
    (exists x : A, P x) --> exists x : A, P x
proof                                  // |- forall {A} (P : A -> Prop), (exists x : A, P x) --> exists x : A, P x
  pick-any A P                         // A : Type, P : A -> Prop |- (exists x : A, P x) --> exists x : A, P x
  assume e                             // A : Type, P : A -> Prop, e : (exists x : A, P x) |- exists x : A, P x
  choose-witness a p for e             // A : Type, P : A -> Prop, e : (exists x : A, P x), a : A = choose e, p : P a |- exists x : A, P x
  witness a                            // A : Type, P : A -> Prop, e : (exists x : A, P x), a : A = choose e, p : P a |- P a
  assumption                           // Theorem proved!
qed

// There's also a way to turn `choose-witness` into pattern-matching
// in `assume`. The syntax is `assume (e choosing a such-that p)`.
// Note that this is slightly different from the pattern-matching
// corresponding to `pick-witness` - we also need to name the entire
// existence proof (here `e`).

theorem choosing-example
  forall {A} (P : A -> Prop),
    (exists x : A, P x) --> exists x : A, P x
proof                                  // |- forall {A} (P : A -> Prop), (exists x : A, P x) --> exists x : A, P x
  pick-any A P                         // A : Type, P : A -> Prop |- (exists x : A, P x) --> exists x : A, P x
  assume (e choosing a such-that p)    // A : Type, P : A -> Prop, e : (exists x : A, P x), a : A = choose e, p : P a |- exists x : A, P x
  witness a                            // A : Type, P : A -> Prop, e : (exists x : A, P x), a : A = choose e, p : P a |- P a
  assumption                           // Theorem proved!
qed

// Let's see how we can prove the standard version of the Axiom of Choice,
// which says that, if for all `a : A` there exists `b : B` such that they
// are in a relation `R`, then there exists a function `f : A -> B` such
// that every `a : A` is in relation `R` with `f a`. To paraphrase: given
// a relation `R` that is total, there exists a function whose graph is a
// subrelation of `R`.
theorem standard-axiom-of-choice :
  forall {A B} (R : A -> B -> Prop),
    (forall a : A, exists b : B, R a b) -->
      exists f : A -> B, forall a : A, R a (f a)
proof                                  // |- forall {A B} (R : A -> B -> Prop), (forall a : A, exists b : B, R a b) --> exists f : A -> B, forall a : A, R a (f a)
  pick-any A B R                       // A B : Type, R : A -> B -> Prop |- (forall a : A, exists b : B, R a b) --> exists f : A -> B, forall a : A, R a (f a)
  assume allex                         // ..., allex : (forall a : A, exists b : B, R a b) |- exists f : A -> B, forall a : A, R a (f a)
  let noncomputable g (x : A) : B =
    choose (instantiate allex with x)  // ..., g : A -> B = fun x : A => choose (instantiate allex with x) |- exists f : A -> B, forall a : A, R a (f a)
  witness g                            // ... |- forall a : A, R a (g a)
  pick-any a : A                       // ..., a : A |- R a (g a)
  unfold g                             // ... |- R a ((fun (x : A) => choose (instantiate allex with x) a)
  simpl                                // ... |- R a (choose (instantiate allex with a))
  choose-spec (allex a)                // Theorem proved!
qed

// Let's see some manifestations of classical logic.
// We will prove that being a bijection and having
// an inverse are logically equivalent notions.

// A function is injective when equal outputs must come from equal inputs.
// In other words, if the inputs are different, the outputs are also different.
injective {A B} (f : A -> B) : Prop =
  forall x y : A, f x === f y --> x === y

// A function is surjective when every element of the codomain is an output
// for some input.
surjective {A B} (f : A -> B) : Prop =
  forall y : B, exists x : A, f x === y

// A function is bijective when it's both injective and surjective.
bijective {A B} (f : A -> B) : Prop =
  surjective f /\ injective f

// A function `f` has an inverse when there exists a function `g`
// whose composition with `f` gives the identity.
has-inverse {A B} (f : A -> B) : Prop =
  exists g : B -> A,
    (forall a : A, g (f a) === a)
      /\
    (forall b : B, f (g b) === b)

// If a function has an inverse, then it's bijective.
// This theorem is constructively valid, so no classical
// logic going on here.
theorem bijective-from-has-inverse :
  forall {A B} (f : A -> B),
    has-inverse f --> bijective f
proof                                      // |- forall {A B} (f : A -> B), has-inverse f --> bijective f
  pick-any A B f                           // A B : Type, f : A -> B |- has-inverse f --> bijective f
  assume (witness g such-that both gf fg)  // ..., g : B -> A, gf : (forall a : A, g (f a) === a), fg : (forall b : B, f (g b) === b) |- bijective f
  both
                                           // ... |- surjective f
  . unfold surjective                      // ... |- forall y : B, exists x : A, f x === y
    pick-any b                             // ..., b : B |- exists x : A, f x === b
    witness (g b)                          // ..., b : B |- f (g b) === b
    instantiate fg with b                  // Goal solved!
                                           // ... |- injective f
  . unfold injective                       // ... |- forall x y : A, f x === f y --> x === y
    pick-any x y : A                       // ..., x y : A |- f x === f y --> x === y
    assume eq : f x === f y                // ..., eq : f x === f y |- x === y
    chaining
      === x
      === g (f x)   by rewrite <-(instantiate gf with x)
      === g (f y)   by rewrite eq
      === y         by rewrite (instantiate gf with y)
qed

// If a function is bijective, then it has an inverse.
// This direction of the theorem is classical.
theorem has-inverse-from-bijective :
  forall {A B} (f : A -> B),
    bijective f --> has-inverse f
proof                                                    // |- forall {A B} (f : A -> B), bijective f --> has-inverse f
  pick-any A B f                                         // A B : Type, f : A -> B |- bijective f --> has-inverse f
  assume (both sur inj)                                  // ..., sur : forall y : B, exists x : A, f x === y, inj : forall x y : A, f x === f y --> x === y |- has-inverse f
  let noncomputable g (y : B) : A =
    choose (instantiate sur with y)                      // ..., g : B -> A = fun (y : B) => choose (instantiate sur with y) |- has-inverse f
  witness g                                              // ... |- (forall a : A, g (f a) === a) /\ (forall b : B, f (g b) === b)
  both
                                                         // ... |- forall a : A, g (f a) === a
  . pick-any a                                           // ..., a : A |- g (f a) === a
    unfold g                                             // ... |- (fun (y : B) => choose (instantiate sur with y)) (f a) === a
    simpl                                                // ... |- choose (instantiate sur with (f a)) === a
    apply (instantiate inj with _ a)                     // ... |- f (choose (instantiate sur with (f a))) === f a
    choose-spec (instantiate sur with (f a))             // Goal solved!
                                                         // ... |- forall b : B, f (g b) === b
  . pick-any b                                           // ..., b : B |- f (g b) === b
    unfold g                                             // ... |- f ((fun (y : B) => choose (instantiate sur with y)) b) === b
    simpl                                                // ... |- f (choose (instantiate sur with b)) === b
    choose-spec (instantiate sur with b)                 // Theorem proved!
qed