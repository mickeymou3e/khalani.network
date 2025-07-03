// A relation is well-founded when we can do well-founded induction with it.
well-founded {A} (R : A -> A -> Prop) : Prop =
  forall P : A -> Prop,
    (forall x : A, (forall y : A, R y x --> P y) --> P x) --> forall x : A, P x

theorem antireflexive-wf :
  forall {A} (R : A -> A -> Prop),
    well-founded R --> forall x : A, ~ R x x
proof                                  // |- forall {A} (R : A -> A -> Prop), well-founded R --> forall x : A, ~ R x x
  pick-any A R
  assume wf                            // A : Type, R : A -> A -> Prop, wf : well-founded R |- forall x : A, ~ R x x
  apply wf (\x -> ~ R x x)             // A : Type, R : A -> A -> Prop, wf : well-founded R |- forall x : A, (forall y : A, R y x --> ~ R y y) --> ~ R x x
  pick-any x
  assume IH rxx                        // A : Type, R : A -> A -> Prop, wf : well-founded R, x : A, IH : (forall y : A, R y x --> ~ R y y), rxx : R x x |- False
  apply IH
  . rxx
  . rxx
qed

theorem well-founded-induction :
  forall {A} (R : A -> A -> Prop),
    well-founded R --> forall P : A -> Prop, (forall x : A, (forall y : A, R y x --> P y) --> P x) --> forall x : A, P x
proof
  pick-any A R
  assume wf
  assumption
qed

lt : Nat -> Nat -> Prop
| n   , zero     => False
| zero, succ _   => True
| succ n, succ m => lt n m

theorem lt-trans :
  forall x y z : Nat, lt x y --> lt y z --> lt x z
proof
  pick-any x y z                       // x y z : Nat |- lt x y --> lt y z --> lt x z
  induction x, z with
  | x, zero =>                         // x y z : Nat |- lt x y --> lt y zero --> lt x zero
    assume _                           // x y z : Nat |- lt y zero --> lt x zero
    simpl                              // x y z : Nat |- False --> lt x zero
    absurd                             // Goal solved!
  | zero, succ z' =>                   // x y z z' : Nat |- lt zero y --> lt y (succ z') --> lt zero (succ z')
    assume _ _                         // x y z z' : Nat |- lt zero (succ z')
    simpl                              // x y z z' : Nat |- True
    trivial                            // Goal solved!
  | succ x', succ (z' & IH) =>         // x y z x' z' : Nat, IH : forall y : Nat, lt x' y --> lt y z' --> lt x' z' |- lt (succ x') y --> lt y (succ z') --> lt (succ x') (succ z')
    cases y with
    | zero =>                          // ... |- lt (succ x') zero --> lt zero (succ z') --> lt (succ x') (succ z')
      simpl                            // ... |- False --> True --> lt x' z'
      absurd                           // Goal solved!
    | succ y' =>                       // ..., y' : Nat |- lt (succ x') (succ y') --> lt (succ y') (succ z') --> lt (succ x') (succ z')
      simpl                            // ... |- lt x' y' --> lt y' z' --> lt x' z'
      instantiate IH with y'           // Theorem proved!
qed

theorem lt-succ :
  forall x y : Nat, lt x (succ y) --> x === y \/ lt x y
proof
  pick-any x
  induction x with
  | zero =>
    cases y with
    | zero => or-left refl
    | succ y' => or-right trivial
  | succ x' =>
    pick-any y
    or-right
qed

theorem lt-trans' :
  forall x y z : Nat, lt x y --> lt y (succ z) --> lt x z
proof
  pick-any x y z
  assume xy yz
  cases (lt-succ y z yz)
  . assume heq : y === z
    rewrite <- heq
    assumption
  . assume hlt : lt y z
    apply lt-trans x y z
    . xy
    . yz
qed

theorem well-founded-lt :
  well-founded lt
proof                                  // |- well-founded lt
  unfold well-founded                  // |- forall P : Nat -> Prop, (forall x : Nat, (forall y : Nat, lt y x --> P y) --> P x) --> forall x : Nat, P x
  pick-any P
  assume H
  pick-any x                           // P : Nat -> Prop, H : (forall x : Nat, (forall y : Nat, lt y x --> P y) --> P x), x : Nat |- P x
  apply H                              // ... |- forall y : Nat, lt y x --> P y
  induction x with                     // Termination by syntactic check.
  | zero =>                            // ... |- forall y : Nat, lt y zero --> P y
    pick-any y                         // ..., y : Nat |- lt y zero --> P y
    simpl                              // ..., y : Nat |- False --> P y
    absurd
  | succ (n & ind IH) =>               // ..., n : Nat, IH : forall y : Nat, lt y n --> P y |- forall y : Nat, lt y (succ n) --> P y
    pick-any y
    assume hlt                         // ..., y : Nat, hlt : lt y (succ n) |- P y
    apply H                            // ... |- forall z : Nat, lt z y --> P z
    pick-any z
    assume hlt'                        // ..., z : Nat, hlt' : lt z y |- P z
    apply IH z                         // ... |- lt z n
    apply lt-trans' z y n
                                       // ... |- lt z y
    . hlt'                             // Goal solved!
                                       // ... |- lt y (succ n)
    . hlt                              // Theorem proved!
qed