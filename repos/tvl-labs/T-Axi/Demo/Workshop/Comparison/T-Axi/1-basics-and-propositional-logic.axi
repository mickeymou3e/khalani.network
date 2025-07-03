// T-Axi supports reasoning in natural deduction style.

// We will declare some opaque propositions to reason about.
// `Prop` is the (logical) kind in which all propositions live.

declaration A B C D : Prop

// All declared and defined objects, as well as all theorems proved so far,
// live in the global environment.

// On the other hand, during a proof the most important thing is the context.
// The context is an ordered list of all assumptions that were made during
// the current proof effort. Together with the goal that is currently being
// proven, they form the current proof state.

// In symbols: p1 : P1, ..., pn : Pn |- Q

// Here each `pi : Pi` is an assumption (`pi` being the assumption name,
// `Pi` its statement), all the `pi : Pi` together make up the context,
// and `Q` is the goal. The symbol `|-` (called "turnstile") separates the
// context from the goal.

// Contexts, goals and proof states are immensely useful. We will use them to
// semi-formally describe the semantics of T-Axi's logic. Sometimes we might
// also write them in comments to show what's going on in a proof.

// A theorem starts with the keyword `theorem`, then comes the theorem name
// (all theorems must be named), a colon `:`, the theorem statement, an equals
// sign `=`, and then the proof, more precisely called the proofterm.
// This is the first of two styles of proofs, called the "proofterm style"
// or just "term style" for short.
theorem warm-up-term-style : True =
  trivial

// There's also another, alternative proof style, called the "tactic style".
// In this tyle, the theorem starts the same, but the proof comes enclosed
// in a block that starts with `proof` and ends with `qed`.
// Term style and tactic style proofs correspond one-to-one and each proof
// can be automatically converted to the other style. We'll see the details soon.
theorem warm-up : True
proof
  trivial
qed

// Implication is written `P --> Q`.

// `assume p : P in q` proves `P --> Q` provided that
// `q` proves `Q` in the context extended with `p : P`.

// `apply pq p` proves `q` provided that
// `pq` proves `P --> Q` and `p` proves `P`.

// When we have `p : P` in the context, we might use it
// by simply writing `p`, or when we are too lazy to look
// up the name, just `assumption`.

theorem impl-refl : P --> P =
  assume p : P in p

theorem impl-refl' : P --> P
proof
  assume p : P
  p
qed

theorem assumption-example : P --> P
proof
  assume p : P
  assumption
qed

theorem apply-example : (P --> Q) --> (P --> Q)
proof
  assume (pq : P --> Q) (p : P)
  apply pq
  assumption
qed

// Classical logic is introduced with `by-contradiction`.

// `by-contradiction x : ~ P in e` proves `P` provided that
// `e` proves `False` in the context extended with `x : ~ P`.

// `contradiction` is a synonym for `apply` that is more readable
// when we're dealing with contradictions.

theorem double-negation : ~ ~ P --> P
proof
  assume nnp : ~ ~ P
  by-contradiction np : ~ P
  contradiction nnp np
qed

// Conjunction is written `P /\ Q`.

// `both p q` proves `P /\ Q` provided that
// `p` proves `P` and `q` proves `Q`.

// `and-left e` proves `P` provided that `e` proves `P /\ Q`.
// `and-right e` proves `Q` provided that `e` proves `P /\ Q`.

theorem and-intro : P --> Q --> P /\ Q
proof
  assume (p : P) (q : Q)
  both p q
qed

theorem and-comm : P /\ Q --> Q /\ P
proof
  assume pq : P /\ Q
  both (and-right pq) (and-left pq)
qed

theorem and-comm-bullets : P /\ Q --> Q /\ P
proof
  assume pq : P /\ Q
  both
  . and-right pq
  . and-left pq
qed

theorem and-comm-bullets-assumption : P /\ Q --> Q /\ P
proof
  assume pq : P /\ Q
  both
  . and-right
    assumption
  . and-left
    assumption
qed

theorem and-comm-pattern : P /\ Q --> Q /\ P
proof
  assume (both p q)
  both q p
qed 

// Disjunction is written `P \/ Q`.

// `or-left e` proves `P \/ Q` provided that `e` proves `P`.
// `or-right e` proves `P \/ Q` provided that `e` proves `Q`.

// `cases pq pr qr` proves `R` provided that
// `pq` proves `P \/ Q`
// `pr` proves `P --> R`
// `qr` proves `Q --> R`

theorem or-comm : P \/ Q --> Q \/ P
proof
  assume pq
  cases pq
  . assume p
    or-right
    assumption
  . assume q
    or-left
    assumption
qed

theorem or-comm-short : P \/ Q --> Q \/ P
proof
  assume pq
  cases pq or-right or-left
qed

theorem idk : (P \/ R --> S) --> P /\ Q --> S
proof
  assume prs (both p q)
  apply prs
  or-left p
qed

// Biconditional is written `P <--> Q`, but this is merely a notation
// for `(P --> Q) /\ (Q --> P)`. Therefore biconditionals are used
// just like conjunction, with `both`, `and-left` and `and-right`.

theorem iff-intro : (P --> Q) --> (Q --> P) --> P <--> Q
proof
  assume pq qp
  both pq qp
qed

theorem iff-comm : (P <--> Q) --> (Q <--> P)
proof
  assume (both pq qp)
  both qp pq
qed

theorem iff-unfolded :
  (P <--> Q) --> (P --> Q) /\ (Q --> P)
proof
  assume pq
  assumption
qed