// We declare some propositions that will be used in this file.
declaration P Q R S T : Prop

// When we want to prove some goal using a long chain of implications,
// we can do it with chaining. In the example below we showcase backward
// chaining, i.e. we start with the conclusion and then list a bunch of
// intermediate goals together with proofs (after `by`) that the current
// goal follows from them.
theorem implication-chaining-backwards :
  (P --> Q) --> (Q --> R) --> (R --> S) --> (S --> T) --> P --> T
proof
  // Let Γ = pq : P --> Q, qr : Q --> R, rs : R --> S, st : S --> T, p : P
  assume pq qr rs st p       // Γ |- T  // After making all the assumptions, the goal is `T`.
  chaining
    <-- T                    // Γ |- T  // We start the chain. `<--` means it's backward chaining for implication. The goal is still `T`.
    <-- S         by st      // Γ |- S  // The goal changes to `S` because `S` implies `T`, as proven in the `by` clause.
    <-- R         by rs      // Γ |- R
    <-- Q         by qr      // Γ |- Q
    <-- P         by pq      // Γ |- P  // After the final step, the goal that we are left with is `P`.
  assumption                 // We now solve `P`, the goal produced by chaining.
qed

// In proofterm style, the above proof looks as follows.
theorem implication-chaining-backwards-term-style :
  (P --> Q) --> (Q --> R) --> (R --> S) --> (S --> T) --> P --> T =
  assume pq qr rs st p in
    chaining
      <-- T
      <-- S         by st
      <-- R         by rs
      <-- Q         by qr
      <-- P         by pq
    in
      assumption

// The chaining gets desugared to a bunch of uses of `apply`.
theorem implication-chaining-backwards-desugared :
  (P --> Q) --> (Q --> R) --> (R --> S) --> (S --> T) --> P --> T
proof
  assume pq qr rs st p in
  apply st
  apply rs
  apply qr
  apply pq
  assumption
qed

// The expression after `by` can be any proofterm, for example it can be `assumption`.
theorem implication-chaining-backwards-assumption :
  (P --> Q) --> (Q --> R) --> (R --> S) --> (S --> T) --> P --> T
proof
  assume pq qr rs st p
  chaining
    <-- T
    <-- S         by assumption
    <-- R         by assumption
    <-- Q         by assumption
    <-- P         by assumption
  assumption
qed

// I imagine that when we have a mildly powerful automation tactic
// akin to Coq's `auto`, it would be the default thing passed to `by`,
// so that the `by` could be omitted.
theorem implication-chaining-backwards-default :
  (P --> Q) --> (Q --> R) --> (R --> S) --> (S --> T) --> P --> T
proof
  assume pq qr rs st p
  chaining
    <-- T
    <-- S
    <-- R
    <-- Q
    <-- P
  assumption
qed

// There's also a different style of backwards chaining. The last time
// we introduced all assumptions into the context, used chaining to
// change the goal from `T` to `P` and then proved `P` with `assumption`.
// This time we'll use chaining to prove `P --> T` directly.
theorem implication-chaining-backwards-direct :
  (P --> Q) --> (Q --> R) --> (R --> S) --> (S --> T) --> P --> T
proof
  // Let Γ = pq : P --> Q, qr : Q --> R, rs : R --> S, st : S --> T
  assume pq qr rs st         // Γ |- P --> T  // Let's assume everything EXCEPT the last `P`, so that the goal is `P --> T`.
  chaining
    <-- T                    // Γ |- P --> T  // We start the chain. The goal is still `P --> T`.
    <-- S         by st      // Γ |- P --> S  // The goal changes to `P --> S` because `S` implies `T`, as proven in the `by` clause.
    <-- R         by rs      // Γ |- P --> R
    <-- Q         by qr      // Γ |- P --> Q
    <-- P         by pq      // In the last step we prove `P --> Q`, which is precisely our goal, so we're done.
qed

// The above proof is desugared as follows, where `impl-trans'` is
// this theorem: `forall Q R P : Prop, (Q --> R) --> (P --> Q) --> (P --> R)`
theorem implication-chaining-backwards-direct-desugared :
  (P --> Q) --> (Q --> R) --> (R --> S) --> (S --> T) --> P --> T
proof
  assume pq qr rs st
  apply (instantiate impl-trans' with S T P) st
  apply (instantiate impl-trans' with R S P) rs
  apply (instantiate impl-trans' with Q R P) qr pq
qed

// Besides backward chaining, there's also forward chaining. This time
// we start with a premise and draw intermediate conclusions from it,
// justifying each step, until we reach the goal.
theorem implication-chaining-forwards :
  (P --> Q) --> (Q --> R) --> (R --> S) --> (S --> T) --> P --> T
proof
  // Let Γ = pq : P --> Q, qr : Q --> R, rs : R --> S, st : S --> T
  assume pq qr rs st         // Γ |- P --> T  // After making all the assumptions, the goal is `P --> T`.
  chaining
    --> P                    // Γ |- P --> T  // We start the chain. `-->` means it's forward chaining for implication. The goal is still `P --> T`.
    --> Q         by pq      // Γ |- Q --> T  // The goal changes to `Q --> T` because `P` implies `Q`, as proven in the `by` clause.
    --> R         by qr      // Γ |- R --> T
    --> S         by rs      // Γ |- S --> T
    --> T         by st      // In the last step we prove `S --> T`, which is precisely our goal, so we're done.
qed

// The above proof is desugared as follows, where `impl-trans` is
// this theorem: `forall P Q R : Prop, (P --> Q) --> (Q --> R) --> (P --> R)`.
theorem implication-chaining-forwards-desugared :
  (P --> Q) --> (Q --> R) --> (R --> S) --> (S --> T) --> P --> T
proof
  assume pq qr rs st
  apply (instantiate impl-trans with P Q T) pq
  apply (instantiate impl-trans with Q R T) qr
  apply (instantiate impl-trans with R S T) rs st
qed

// We can also use chaining for biconditionals. The only "mode" of chaining
// here is forward (although I think backwards would also be possible).
theorem biconditional-chaining :
  (P <--> Q) --> (Q <--> R) --> (R <--> S) --> (S <--> T) --> P <--> T
proof
  // Let Γ = pq : P <--> Q, qr : Q <--> R, rs : R <--> S, st : S <--> T
  assume pq qr rs st          // Γ |- P <--> T  // After making all the assumptions, the goal is `P <--> T`.
  chaining
    <--> P                   // Γ |- P <--> T  // We start the chain. `<-->` means it's chaining for biconditional. The goal is still `P <--> T`.
    <--> Q        by pq      // Γ |- Q <--> T  // The goal changes to `Q <--> T` because `P <--> Q`, as proven in the `by` clause.
    <--> R        by qr      // Γ |- R <--> T
    <--> S        by rs      // Γ |- S <--> T
    <--> T        by st      // In the last step we prove `S <--> T`, which is precisely our goal, so we're done.
qed

// The above proof is desugared as follows, where `iff-trans` is
// this theorem: `forall P Q R : Prop, (P <--> Q) --> (Q <--> R) --> (P <--> R)`.
theorem biconditional-chaining-desugared :
  (P <--> Q) --> (Q <--> R) --> (R <--> S) --> (S <--> T) --> P <--> T
proof
  assume pq qr rs st
  apply (instantiate iff-trans with P Q T) pq
  apply (instantiate iff-trans with Q R T) qr
  apply (instantiate iff-trans with R S T) rs st
qed

// Let's declare a type `A` and a predicate `P`. Note that up to this point `P`
// referred to a proposition, but from now on it will refer to a predicate.
type A
declaration P : A -> Prop

// There's also equational chaining for proving equalities in a more readable
// way than by using `rewrite`.
theorem equational-chaining-direct :
  forall x y z w : A,
    x === y --> y === z --> z === w --> x === w
proof
  pick-any x y z w
  // Let Γ = x y z w : A, xy : x === y, yz : y === z, zw : z === w
  assume xy yz zw            // Γ |- x === w  // After making all the assumptions, the goal is `x === w`.
  chaining
    === x                    // Γ |- x === w  // We start the chain. `===` means it's chaining for equality. The goal is still `x === w`.
    === y        by xy       // Γ |- y === w  // The goal changes to `y === w` because `x === y`, as proven in the `by` clause.
    === z        by yz       // Γ |- z === w
    === w        by zw       // In the last step we prove `z === w`, which is precisely our goal, so we're done.
qed

// The above proof is desugared as follows, where `eq-trans` is
// this theorem: `forall {A} (x y z : A), x === y --> y === z --> x === z`.
theorem equational-chaining-desugared :
  forall x y z w : A,
    x === y --> y === z --> z === w --> x === w
proof
  pick-any x y z w
  assume xy yz zw
  apply (instantiate eq-trans with A x y w) xy
  apply (instantiate eq-trans with A y z w) yz zw
qed

// Let's declare a transitive relation on `A`. Note that up to this point `R`
// referred to a proposition, but from now on it will refer to a relation.
declaration R : A -> A -> Prop
axiom trans : forall x y z : A, R x y --> R y z --> R x z

// Chaining can be used for proofs about any transitive relation.
theorem relational-chaining :
  forall a b c d e : A,
    R a b --> R b c --> R c d --> R d e --> R a e
proof
  pick-any a b c d e
  // Let Γ = ab : R a b, bc : R b c, cd : R c d, de : R d e
  assume ab bc cd de         // Γ |- R a e // After making all the assumptions, the goal is `R a e`.
  chaining
    R a                      // Γ |- R a e // We start the chain. `R` means it's chaining for the relation `R`. The goal is still `R a e`.
    R b           by ab      // Γ |- R b e // The goal changes to `R b e` because `R a b`, as proven in the `by` clause, and because `R` is transitive.
    R c           by bc      // Γ |- R c e
    R d           by cd      // Γ |- R d e
    R e           by de      // In the last step we prove `R d e`, which is precisely our goal, so we're done.
qed

// The above proof is desugared as follows, where `trans` is
// the assumption that establishes the transitivity of `R`.
theorem relational-chaining-desugared :
  forall a b c d e : A,
    R a b --> R b c --> R c d --> R d e --> R a e
proof
  pick-any a b c d e
  assume ab bc cd de
  apply (instantiate trans with a b e) ab
  apply (instantiate trans with b c e) bc
  apply (instantiate trans with c d e) cd de
qed

// TODO: mixed chaining, like x <= y < z or x < y === z