// Higher-order logic benchmark for AIs.

declaration F G : Prop -> Prop

// claude-3.7-sonnet-thinking: two shot.
theorem interesting :
  exists F : Prop -> Prop,
    forall P : Prop, F P

theorem all-eq :
  (forall P : Prop, F P) -->
  (forall P : Prop, G P) -->
    forall P : Prop, F P <--> G P

// claude-3.7-sonnet-thinking: one shot.
theorem ex1 :
  exists F : Prop -> Prop,
    forall P : Prop, F P <--> ~ P

// claude-3.7-sonnet-thinking: one shot.
theorem ex2 :
  exists F : Prop -> Prop,
    forall P : Prop, F P <--> F (~ P)

// claude-3.7-sonnet-thinking: almost one shot,
// but has trouble using `double-negation` from
// the standard library.
theorem ex3 :
  exists F : Prop -> Prop,
    forall P : Prop, F P <--> ~ F (~ P)

// claude-3.7-sonnet-thinking: complete failure,
// uses non-existent `let` in proofs.
theorem not-all-ex :
  ~ forall F : Prop -> Prop, exists P : Prop, F P
