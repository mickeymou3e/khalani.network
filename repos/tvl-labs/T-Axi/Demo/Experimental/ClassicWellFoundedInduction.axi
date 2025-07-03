// A classically equivalent characterization:
// a relation is well-founded when every non-empty set has a minimal element.
classic-well-founded {A} (R : A -> A -> Prop) : Prop =
  forall P : A -> Prop,
    (exists x : A, P x) --> exists m : A, P m /\ forall x : A, P x --> ~ R x m

theorem antireflexive-wf :
  forall {A} (R : A -> A -> Prop),
    classic-well-founded R --> forall x : A, ~ R x x
proof                                  // |- forall {A} (R : A -> A -> Prop), classic-well-founded R --> forall x : A, ~ R x x
  pick-any A R
  assume wf
  pick-any x
  assume rxx                           // A : Type, R : A -> A -> Prop, wf : classic-well-founded R, x : A, rxx : R x x |- False
  pick-witness m (both pm all) for wf (\a -> R a a) (witness x such that rxx)
                                       // ..., m : A, pm : R m m, all : forall x : A, R x x --> ~ R x m |- False
  apply all m
                                       // ... |- R m m
  . pm                                 // Goal solved!
                                       // ... |- R m m
  . pm                                 // Theorem proved!
qed

theorem classic-well-founded-induction :
  forall {A} (R : A -> A -> Prop) (P : A -> Prop)
    classic-well-founded R -->
    (forall x : A, (forall y : A, R y x --> P y) --> P x) --> forall x : A, P x
proof
  pick-any A R P
  assume wf
  classic-contraposition // abuse :)
  proving (exists x : A, ~ P x) --> exists x : A, (exists y : A, ~ R y x /\ ~ P y) /\ ~ P x
  assume (witness x : A such-that npx : ~ P x)
  pick-witness (m : A) (both (npm : ~ P m) (all : forall x : A, P x --> ~ R x m)) for wf (\a -> ~ P a) (witness x such-that npx)
  proving exists x : A, (exists y : A, ~ R y x /\ ~ P y) /\ ~ P x
  witness m
  proving (exists y : A, ~ R y m /\ ~ P y) /\ ~ P m
  both
  . proving exists y : A, ~ R y m /\ ~ P y
    witness m
    both
    . apply antireflexive-wf R
      assumption
    . proving ~ P m
      assumption
  . npm
qed

theorem classic-well-founded-spec :
  forall {A} (R : A -> A -> Prop),
    classic-well-founded R <--> well-founded R
proof
  pick-any A R
  both
  . classic-well-founded-induction R
  . 
  // This can be proven with some inline rewriting, but I'm too lazy.
qed