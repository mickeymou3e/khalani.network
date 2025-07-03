// The syntax of quantifiers and equality is as follows.
// Note that, by convention, type variables start with upper case letters.
// P, Q ::= ... | forall x : A, P | exists x : A, P | t1 === t2

// In the rest of the file, we will need a type `A`, a term `a` of type `A`,
// and some predicates `P` and `Q` on type `A`.
type A
declaration a : A
declaration P Q : A -> Prop

// The universal quantifier is written `forall x : A, P x`.
// `pick-any x : A in e` proves `forall x : A, P x` provided that
// `e` proves `P x` in the context extended with `x : A`.
theorem forall-intro-example :
  forall x : A,
    P x \/ True
proof                    // |- forall x : A, P x \/ True
  pick-any x : A         // x : A |- P x \/ True
  or-right               // x : A |- True
  trivial                // Theorem proved!
qed

// In proofterm style, the above proof looks as follows.
theorem forall-intro-example-term-style : (forall x : A, P x \/ True) =
  pick-any x : A in
    or-right trivial

// We can omit the type annotation in the quantifiers if it can be inferred
// from the context. Below, it can be inferred from the type of `P`.
theorem forall-no-annotation-example : forall x, P x \/ True
proof
  pick-any x : A
  or-right
  trivial
qed

// We can also omit the type annotation on the variable in `pick-any`,
// irrespective of whether it appears on the quantifier or not.
theorem pick-any-no-annotation : forall x, P x \/ True
proof
  pick-any x
  or-right
  trivial
qed

// `instantiate e with a` proves `P a` provided that
// `e` proves `forall x : A, P x`.
theorem forall-elim-example :
  (forall x : A, P x) --> P a
proof                                       // |- (forall x : A, P x) --> P a
  assume all : forall x : A, P x            // all : forall x : A, P x |- P a
  instantiate all with a                    // Theorem proved!
qed

// In proofterm style, the above proof looks as follows.
theorem forall-elim-example-term-style : (forall x : A, P x) --> P a =
  assume all : forall x : A, P x in
    instantiate all with a

// Note that it can often be inferred from context what term
// the quantifier should be instantiated with. In such a case
// we can omit the `with` clause. If we also omit the annotation,
// the proof gets much shorter.
theorem forall-elim-example' : (forall x : A, P x) --> P a
proof
  assume all
  instantiate all
qed

// The existential quantifier is written `exists x : A, P x`.
// `witness t such-that e` proves `exists x : A, P x`
// provided that `e` proves `P t`.
// In tactic style, it is written simply `exists`.
theorem exists-intro-example :
  exists x : A,
    P x \/ True
proof                    // |- exists x : A, P x \/ True
  witness a              // |- P a \/ True
  or-right               // |- True
  trivial                // Theorem proved!
qed

// In proofterm style, the above proof looks as follows.
theorem exists-intro-example-term-style : (exists x : A, P x \/ True) =
  witness a such-that
    or-right trivial

// Similarly to the universal quantifier, the annotation on the variable
// can be omitted if it can be inferred from context, like from `P` below.
theorem exists-no-annotation-example : exists x, P x \/ True
proof
  witness a
  or-right
  trivial
qed

// We can also put a type annotation on the term in `exists`,
// irrespective of whether it appears on the quantifier or not.
theorem exists-annotation : exists x, P x \/ True
proof
  witness a : A
  or-right
  trivial
qed

// `pick-witness x p for e1 in e2` proves `Q` provided that
// `e1` proves `exists x : A, P x` and that
// `e2` proves `Q` in the context extended with `x : A` and `p : P x`.
theorem exists-elim-example :
  (exists x : A, P x /\ Q x) --> exists x : A, P x
proof                                               // |- (exists x : A, P x /\ Q x) --> exists x : A, P x
  assume ex : exists x : A, P x /\ Q x              // ex : exists x : A, P x /\ Q x |- exists x : A, P x
  pick-witness x pq for ex                          // ex : exists x : A, P x /\ Q x, x : A, pq : P x /\ Q x |- exists x : A, P x
  witness x                                         // ex : exists x : A, P x /\ Q x, x : A, pq : P x /\ Q x |- P x
  and-left pq                                       // Theorem proved!
qed

// In proofterm style, the above proof looks as follows.
theorem exists-elim-example-term-style : (exists x : A, P x /\ Q x) --> (exists x : A, P x) =
  assume ex : exists x : A, P x /\ Q x in
    pick-witness x pq for ex in
      witness x such-that
        and-left pq

// Similarly to conjunction and biconditional, the existential quantifier can
// be eliminated by pattern matching fused with `assume`. In the proof below,
// we match not only to eliminate the existential, but also the conjunction,
// which makes the proof much shorter.
theorem exists-elim-example' :
  (exists x : A, P x /\ Q x) --> exists x : A, P x
proof                                               // |- (exists x : A, P x /\ Q x) --> exists x : A, P x
  assume (witness x such-that both p q)             // x : A, p : P x, q : Q x |- exists x : A, P x
  witness x such-that p                             // Theorem proved!
qed

// Equality is written `t1 === t2`.
// We can prove `t === t` for any `t` using `refl`.
theorem eq-refl :
  forall x : A,
    x === x
proof                        // |- forall x : A, x === x
  pick-any x                 // x : A |- x === x
  refl                       // Theorem proved!
qed

// In proofterm style, the above proof looks as follows.
// Note that difference between the single `=` and the
// triple `===`: the first is just a symbol used when
// defining things (a term style proof in this case),
// and the second one is used to form a proposition that
// expresses the equality of two terms.
theorem eq-refl-term-style : (forall x : A, x === x) =
  pick-any x in
    refl

// Equality elimination is `rewrite e1 in e2`.
// `rewrite e1 in e2` proves `P l` provided that
// `e1` proves `l === r` and that `e2` proves `P r`.
theorem eq-sym :
  forall x y : A,
    x === y --> y === x
proof                                 // |- forall x y : A, x === y --> y === x
  pick-any x y                        // x y : A |- x === y --> y === x
  assume heq : x === y                // x y : A, heq : x === y |- y === x
  rewrite heq                         // x y : A, heq : x === y |- y === y
  refl                                // Theorem proved!
qed

// In proofterm style, the above proof looks as follows.
theorem eq-sym-term-style : (forall x y : A, x === y --> y === x) =
  pick-any x y in
    assume eq : x === y in
      rewrite eq in
        refl

// By default, the left-hand side of the equation is replaced with
// the right-hand side. We can do the opposite by attaching the
// modifier `<-` to the equation.
theorem eq-sym' :
  forall x y : A,
    x === y --> y === x
proof                                 // |- forall x y : A, x === y --> y === x
  pick-any x y                        // x y : A |- x === y --> y === x
  assume heq : x === y                // x y : A, heq : x === y |- y === x
  rewrite <-heq                       // x y : A, heq : x === y |- x === x
  refl                                // Theorem proved!
qed

// Although there is no need to do so, we can also mark the default
// left-to-right rewriting direction with the modifier `->`.
theorem eq-sym'' :
  forall x y : A,
    x === y --> y === x
proof                                 // |- forall x y : A, x === y --> y === x
  pick-any x y                        // x y : A |- x === y --> y === x
  assume heq : x === y                // x y : A, heq : x === y |- y === x
  rewrite ->heq                       // x y : A, heq : x === y |- y === y
  refl                                // Theorem proved!
qed

// When we need to do two or more rewrites in a row, we can condense
// them into a single one.
theorem eq-trans :
  forall x y z : A,
    x === y --> y === z --> x === z
proof                                       // |- forall x y z : A, x === y --> y === z --> x === z
  pick-any x y z                            // x y z : A |- x === y --> y === z --> x === z
  assume (xy : x === y) (yz : y === z)      // x y z : A, xy : x === y, yz : y === z |- x === z
  rewrite xy, yz                            // x y z : A, xy : x === y, yz : y === z |- z === z
  refl                                      // Theorem proved!
qed

// The `<-` and `->` modifiers are still valid in these bunched rewrites.
theorem rewrite-modifiers :
  forall x y z : A,
    x === y --> y === z --> x === z
proof                                       // |- forall x y z : A, x === y --> y === z --> x === z
  pick-any x y z                            // x y z : A |- x === y --> y === z --> x === z
  assume (xy : x === y) (yz : y === z)      // x y z : A, xy : x === y, yz : y === z |- x === z
  rewrite <-xy, <-yz                        // x y z : A, xy : x === y, yz : y === z |- x === x
  refl                                      // Theorem proved!
qed

// Similarly to conjunction, biconditional and existential quantifier,
// we can eliminate equality by pattern matching fused with `assume`.
// The patterns to do this are `===>` (for left-to-right rewriting)
// and `<===` (for right-to-left rewriting).
theorem eq-elim-pattern-matching :
  forall x y z : A,
    x === y --> y === z --> x === z
proof                                       // |- forall x y z : A, x === y --> y === z --> x === z
  pick-any x y z                            // x y z : A |- x === y --> y === z --> x === z
  assume ===> ===>                          // x y z : A, _ : x === y, _ : y === z |- z === z
  refl                                      // Theorem proved!
qed

// We will finish by describing some convenience tactics for working with
// various kinds of relations (reflexive, symmetric, transitive, etc.).
// First we declare `R` to be a relation and `b`, `c` to be of type `A`.
declaration R : A -> A -> Prop
declaration b c : A

// We can use `reflexivity` to prove `R x x` when `R` is a reflexive relation.
theorem reflexivity-example :
  (forall x : A, R x x) --> R a a
proof                              // |- (forall x : A, R x x) --> R a a
  assume rfl                       // rfl : forall x : A, R x x |- R a a
  reflexivity                      // Theorem proved!
qed

// The above proof is desugared as follows.
theorem reflexivity-example-desugared : (forall x : A, R x x) --> R a a
proof
  assume rfl
  instantiate rfl
qed

// Optionally, `reflexivity` can take an argument.
theorem reflexivity-arg-example : (forall x : A, R x x) --> R a a
proof
  assume rfl
  reflexivity a
qed

// The above proof is desugared as follows.
theorem reflexivity-arg-example-desugared : (forall x : A, R x x) --> R a a
proof
  assume rfl
  instantiate rfl with a
qed

// There's also `symmetry`.
// `symmetry e` proves `R b a` provided that `e` proves `R a b`.
theorem symmetry-example :
  (forall x y : A, R x y --> R y x) --> R a b --> R b a
proof                                                    // |- (forall x y : A, R x y --> R y x) --> R a b --> R b a
  assume sym (ab : R a b)                                // sym : forall x y : A, R x y --> R y x, ab : R a b |- R b a
  symmetry                                               // sym : forall x y : A, R x y --> R y x, ab : R a b |- R a b
  assumption                                             // Theorem proved!
qed

// The above proof is desugared as follows.
theorem symmetry-example-desugared :
  (forall x y : A, R x y --> R y x) --> R a b --> R b a
proof
  assume sym (ab : R a b)
  apply (instantiate sym with _ _)
  assumption
qed

// Optionally, `symmetry` takes arguments which help the instantiation.
theorem symmetry-example :
  (forall x y : A, R x y --> R y x) --> R a b --> R b a
proof
  assume sym (ab : R a b)
  symmetry {b} {a}
  assumption
qed

// The above proof is desugared as follows.
theorem symmetry-example-desugared :
  (forall x y : A, R x y --> R y x) --> R a b --> R b a
proof
  assume sym (ab : R a b)
  apply (instantiate symm with a b)
  assumption
qed

// There's also `transitivity`. This time, the first argument is mandatory,
// because the middle element cannot be easily guessed.
theorem transitivity-example :
  (forall x y z, R x y --> R y z --> R x z) -->
    R a b --> R b c --> R a c
proof                                     // |- (forall x y z : R x y --> R y z --> R x z) --> R a b --> R b c --> R a c
  assume trans (ab : R a b) (bc : R b c)  // trans : forall x y z : R x y --> R y z --> R x z, ab : R a b, bc : R b c |- R a c
  transitivity b
                                          // trans : forall x y z : R x y --> R y z --> R x z, ab : R a b, bc : R b c |- R a b
  . assumption                            // Goal solved!
                                          // trans : forall x y z : R x y --> R y z --> R x z, ab : R a b, bc : R b c |- R b c
  . assumption                            // Theorem proved!
qed

// The above proof is desugared as follows.
theorem transitivity-example-desugared :
  (forall x y z, R x y --> R y z --> R x z) -->
    R a b --> R b c --> R a c
proof
  assume trans (ab : R a b) (bc : R b c)
  apply (instantiate trans with a b c)
  . assumption
  . assumption
qed

// Some examples.

theorem forall-impl :
  (forall x : A, P x --> Q x) -->
    (forall x : A, P x) --> (forall x : A, Q x)
proof                                            // |- (forall x : A, P x --> Q x) --> (forall x : A, P x) --> (forall x : A, Q x)
  assume pq p                                    // pq : forall x : A, P x --> Q x, p : forall x : A, P x |- forall x : A, Q x
  pick-any x                                     // pq : forall x : A, P x --> Q x, p : forall x : A, P x, x : A |- Q x
  apply (instantiate pq with x)                  // pq : forall x : A, P x --> Q x, p : forall x : A, P x, x : A |- P x
  instantiate p                                  // Theorem proved!
qed

theorem forall-or :
  (forall x : A, P x) \/ (forall x : A, Q x) -->
    forall x : A, P x \/ Q x
proof                            // |- (forall x : A, P x) \/ (forall x : A, Q x) --> forall x : A, P x \/ Q x
  assume orall                   // orall : (forall x : A, P x) \/ (forall x : A, Q x) |- forall x : A, P x \/ Q x
  pick-any x                     // orall : (forall x : A, P x) \/ (forall x : A, Q x), x : A |- P x \/ Q x
  cases orall
                                 // orall : (forall x : A, P x) \/ (forall x : A, Q x), x : A |- (forall x : A, P x) --> P x \/ Q x
  . assume allp                  // orall : (forall x : A, P x) \/ (forall x : A, Q x), x : A, allp : forall x : A, P x |- P x \/ Q x
    or-left                      // orall : (forall x : A, P x) \/ (forall x : A, Q x), x : A, allp : forall x : A, P x |- P x
    instantiate allp             // Goal solved!
                                 // orall : (forall x : A, P x) \/ (forall x : A, Q x), x : A |- (forall x : A, Q x) --> P x \/ Q x
  . assume allq                  // orall : (forall x : A, P x) \/ (forall x : A, Q x), x : A, allq : forall x : A, Q x |- P x \/ Q x
    or-right                     // orall : (forall x : A, P x) \/ (forall x : A, Q x), x : A, allq : forall x : A, Q x |- Q x
    instantiate allq             // Theorem proved!
qed

theorem forall-and :
  (forall x : A, P x /\ Q x)
    <-->
  (forall x : A, P x) /\ (forall x : A, Q x)
proof                                     // |- (forall x : A, P x /\ Q x) <--> (forall x : A, P x) /\ (forall x : A, Q x)
  both
                                          // |- (forall x : A, P x /\ Q x) --> (forall x : A, P x) /\ (forall x : A, Q x)
  . assume all                            // all : forall x : A, P x /\ Q x |- (forall x : A, P x) /\ (forall x : A, Q x)
    both
                                          // all : forall x : A, P x /\ Q x |- forall x : A, P x
    . pick-any x                          // all : forall x : A, P x /\ Q x, x : A |- P x
      and-left (instantiate all with x)   // Goal solved!
                                          // all : forall x : A, P x /\ Q x |- forall x : A, Q x
    . pick-any x                          // all : forall x : A, P x /\ Q x, x : A |- Q x
      and-right (instantiate all with x)  // Goal solved!
                                          // |- (forall x : A, P x) /\ (forall x : A, Q x) --> (forall x : A, P x /\ Q x)
  . assume (both allp allq)               // allp : forall x : A, P x, allq : forall x : A, Q x |- forall x : A, P x /\ Q x
    pick-any x                            // allp : forall x : A, P x, allq : forall x : A, Q x, x : A |- P x /\ Q x
    both
                                          // allp : forall x : A, P x, allq : forall x : A, Q x, x : A |- P x
    . instantiate allp                    // Goal solved!
                                          // allp : forall x : A, P x, allq : forall x : A, Q x, x : A |- Q x
    . instantiate allq                    // Theorem proved!
qed

theorem ex-or :
  (exists x : A, P x \/ Q x)
    <-->
  (exists x : A, P x) \/ (exists x : A, Q x)
proof                                 // |- (exists x : A, P x \/ Q x) <--> (exists x : A, P x) \/ (exists x : A, Q x)
  both
                                      // |- (exists x : A, P x \/ Q x) --> (exists x : A, P x) \/ (exists x : A, Q x)
  . assume (witness x such-that exor) // x : A, exor : P x \/ Q x |- (exists x : A, P x) \/ (exists x : A, Q x)
    cases exor
                                      // x : A, exor : P x \/ Q x |- P x --> (exists x : A, P x) \/ (exists x : A, Q x)
    . assume p                        // x : A, exor : P x \/ Q x, p : P x |- (exists x : A, P x) \/ (exists x : A, Q x)
      or-left                         // x : A, exor : P x \/ Q x, p : P x |- exists x : A, P x
      witness x                       // x : A, exor : P x \/ Q x, p : P x |- P x
      assumption                      // Goal solved!
                                      // x : A, exor : P x \/ Q x |- Q x --> (exists x : A, P x) \/ (exists x : A, Q x)
    . assume q                        // x : A, exor : P x \/ Q x, q : Q x |- (exists x : A, P x) \/ (exists x : A, Q x)
      or-right                        // x : A, exor : P x \/ Q x, q : Q x |- exists x : A, Q x
      witness x                       // x : A, exor : P x \/ Q x, q : Q x |- Q x
      assumption                      // Goal solved!
                                      // |- (exists x : A, P x) \/ (exists x : A, Q x) --> exists x : A, P x \/ Q x
  . assume orex                       // orex : (exists x : A, P x) \/ (exists x : A, Q x) |- exists x : A, P x \/ Q x
    cases orex
                                      // orex : (exists x : A, P x) \/ (exists x : A, Q x) |- (exists x : A, P x) --> exists x : A, P x \/ Q x
    . assume (witness x such-that p)  // orex : (exists x : A, P x) \/ (exists x : A, Q x), x : A, p : P x |- exists x : A, P x \/ Q x
      witness x                       // orex : (exists x : A, P x) \/ (exists x : A, Q x), x : A, p : P x |- P x \/ Q x
      or-left                         // orex : (exists x : A, P x) \/ (exists x : A, Q x), x : A, p : P x |- P x
      assumption                      // Goal solved!
                                      // orex : (exists x : A, P x) \/ (exists x : A, Q x) |- (exists x : A, Q x) --> exists x : A, P x \/ Q x
    . assume (witness x such-that q)  // orex : (exists x : A, P x) \/ (exists x : A, Q x), x : A, q : Q x |- exists x : A, P x \/ Q x
      witness x                       // orex : (exists x : A, P x) \/ (exists x : A, Q x), x : A, q : Q x |- P x \/ Q x
      or-right                        // orex : (exists x : A, P x) \/ (exists x : A, Q x), x : A, q : Q x |- Q x
      assumption                      // Theorem proved!
qed

theorem not-exists :
  ~ (exists x : A, P x)
    <-->
  (forall x : A, ~ P x)
proof                                    // |- ~ (exists x : A, P x) <--> (forall x : A, ~ P x)
  both
  .                                      // |- ~ (exists x : A, P x) --> (forall x : A, ~ P x)
    assume nex                           // nex : ~ (exists x : A, P x) |- (forall x : A, ~ P x)
    pick-any x                           // nex : ~ (exists x : A, P x), x : A |- ~ P x
    assume p                             // nex : ~ (exists x : A, P x), x : A, p : P x |- False
    apply nex                            // nex : ~ (exists x : A, P x), x : A, p : P x |- exists x : A, P x
    witness x                            // nex : ~ (exists x : A, P x), x : A, p : P x |- P x
    assumption                           // Goal solved!
  .                                      // |- (forall x : A, ~ P x) --> ~ (exists x : A, P x)
    assume allnp (witness x such-that p) // allnp : forall x : A, ~ P x, x : A, p : P x |- False
    apply (instantiate allnp with x)     // allnp : forall x : A, ~ P x, x : A, p : P x |- P x
    assumption                           // Theorem proved!
qed

theorem not-forall :
  ~ (forall x : A, P x)
    <-->
  exists x : A, ~ P x
proof                                              // |- ~ (forall x : A, P x) <--> exists x : A, ~ P x
  both
  .                                                // |- ~ (forall x : A, P x) --> exists x : A, ~ P x
    assume nall                                    // nall : ~ (forall x : A, P x) |- exists x : A, ~ P x
    by-contradiction nexn : ~ exists x : A, ~ P x  // nall : ~ (forall x : A, P x), nexn : ~ (exists x : A, ~ P x) |- False
    apply nall                                     // nall : ~ (forall x : A, P x), nexn : ~ (exists x : A, ~ P x) |- forall x : A, P x
    pick-any x                                     // nall : ~ (forall x : A, P x), nexn : ~ (exists x : A, ~ P x), x : A |- P x
    by-contradiction np : ~ P x                    // nall : ~ (forall x : A, P x), nexn : ~ (exists x : A, ~ P x), x : A, np : ~ P x |- False
    apply nexn                                     // nall : ~ (forall x : A, P x), nexn : ~ (exists x : A, ~ P x), x : A, np : ~ P x |- exists x : A, ~ P x
    witness x                                      // nall : ~ (forall x : A, P x), nexn : ~ (exists x : A, ~ P x), x : A, np : ~ P x |- ~ P x
    assumption                                     // Goal solved!
  .                                                // |- (exists x : A, ~ P x) --> ~ (forall x : A, P x)
    assume (witness x such-that np) all            // x : A, np : ~ P x, all : forall x : A, P x |- False
    apply np                                       // x : A, np : ~ P x, all : forall x : A, P x |- P x
    instantiate all                                // Theorem proved!
qed