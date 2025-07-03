// First-order logic benchmark for AIs.

type A
declaration R : Prop
declaration P Q : A -> Prop

// Universal quantifier.

// claude-3.7-sonnet-thinking: one shot.
theorem forall-or :
  (forall x : A, P x) \/ (forall x : A, Q x) -->
    forall x : A, P x \/ Q x

// claude-3.7-sonnet-thinking: one shot.
theorem forall-nondep :
  (forall x : A, R)
    <-->
  ((exists x : A, True) --> R)

// claude-3.7-sonnet-thinking: one shot.
theorem forall-or-nondep-l :
  R \/ (forall x : A, P x) -->
    forall x : A, R \/ P x

// claude-3.7-sonnet-thinking: he gets it wrong every time,
// and in the same way.
theorem forall-or-nondep-l-conv :
  (forall x : A, R \/ P x) -->
    R \/ (forall x : A, P x)

// claude-3.7-sonnet-thinking: almost got it, one bad `apply`
// at the end.
theorem forall-impl-nondep-l :
  (forall x : A, R --> P x)
    <-->
  (R --> forall x : A, P x)

// claude-3.7-sonnet-thinking: good idea, problems
// with using `instantiate`.
theorem forall-impl-nondep-r :
  (forall x : A, P x --> R)
    -->
  ((forall x : A, P x) --> (exists x : A, True) --> R)

// claude-3.7-sonnet-thinking: almost got it, constructive reasoning,
// but fails at the end.
theorem forall-not-not :
  ~ ~ (forall x : A, P x) --> (forall x : A, ~ ~ P x)

// Existential quantifier.

// claude-3.7-sonnet-thinking: one shot.
theorem exists-intro :
  forall x : A, P x --> exists y : A, P y

// claude-3.7-sonnet-thinking: almost got it, but stumbles at the final
// `instantiate`.
theorem exists-elim :
  (forall x : A, P x --> R) --> (exists x : A, P x) --> R

// claude-3.7-sonnet-thinking: two shot, with a minor error
// in the context in the comment.
theorem exists-nondep :
  (exists x : A, R) <--> (exists x : A, True) /\ R

// claude-3.7-sonnet-thinking: one shot (it's in the training data).
theorem exists-or :
  (exists x : A, P x \/ Q x)
    <-->
  (exists x : A, P x) \/ (exists x : A, Q x)

// claude-3.7-sonnet-thinking: one shot.
theorem exists-or-nondep-l :
  (exists x : A, R \/ Q x)
    <-->
  ((exists x : A, True) /\ R) \/ (exists x : A, Q x)

// claude-3.7-sonnet-thinking: one shot.
theorem exists-or-nondep-r :
  (exists x : A, P x \/ R)
    <-->
  (exists x : A, P x) \/ ((exists x : A, True) /\ R)

// claude-3.7-sonnet-thinking: one shot.
theorem ex-and :
  (exists x : A, P x /\ Q x) -->
    (exists y : A, P y) /\ (exists z : A, Q z)

// claude-3.7-sonnet-thinking: one shot.
theorem ex-and-nondep-l :
  (exists x : A, R /\ P x)
    <-->
  R /\ (exists x : A, P x)

// claude-3.7-sonnet-thinking: one shot.
theorem ex-and-nondep-r :
  (exists x : A, P x /\ R)
    <-->
  (exists x : A, P x) /\ R

// claude-3.7-sonnet-thinking: one shot.
theorem not-not-exists :
  (exists x : A, ~ ~ P x) --> ~ ~ (exists x : A, P x)

// `forall` and `exists`

// claude-3.7-sonnet-thinking: one shot.
theorem exists-forall-inhabited :
  (forall x : A, P x) --> (exists x : A, True) --> exists x : A, P x

// Barber's paradox.

// claude-3.7-sonnet-thinking: good idea, bad realization.
theorem barbers-paradox :
  forall {Man} (barber : Man) (shaves : Man -> Man -> Prop),
      (forall x : Man, shaves barber x <--> ~ shaves x x) --> False