// The syntax of higher-order quantifiers is as follows.
// Note that `L` stands for a logical kind.
// P, Q ::= ... | forall R : L, P | exists R : L, P

theorem forall-prop-intro-example :
  forall P : Prop, P --> P
proof                                // |- forall P : Prop, P --> P
  pick-any P                         // P : Prop |- P --> P
  assume p : P                       // P : Prop, p : P |- P
  assumption                         // Theorem proved!
qed

theorem forall-prop-intro-example' :
  forall P Q : Prop, P --> P \/ Q
proof                                // |- forall P Q : Prop, P --> P \/ Q
  pick-any P Q                       // P Q : Prop |- P --> P \/ Q
  assume p : P                       // P Q : Prop, p : P |- P \/ Q
  or-left                            // P Q : Prop, p : P |- P
  assumption                         // Theorem proved!
qed

theorem forall-prop-elim-example :
  (forall P : Prop, P) --> False
proof                                // |- (forall P : Prop, P) --> False
  assume all                         // all : (forall P : Prop, P) |- False
  instantiate all with False         // Theorem proved!
qed

// Defining logical connectives using higher-order quantification.

// We can define our custom equivalent of `False` as a proposition which
// says that all propositions hold.
myfalse : Prop =
  forall R : Prop, R

// `myfalse` is equivalent to `False`.
theorem myfalse-spec :
  myfalse <--> False
proof                                // |- myfalse <--> False
  both
                                     // |- myfalse --> False
  . unfold myfalse                   // (forall R : Prop, R) |- False
    assume mf                        // mf : (forall R : Prop, R) |- False
    instantiate mf with False        // Goal solved!
                                     // |- False --> myfalse
  . assume e : False                 // e : False |- myfalse
    absurd e                         // Theorem proved!
qed

// The impredicative encoding of `True`.
mytrue : Prop =
  forall R : Prop, R --> R

theorem mytrue-spec :
  mytrue <--> True
proof                               // |- mytrue <--> True
  both
                                    // |- mytrue --> True
  . assume _                        // |- True
    trivial                         // Goal solved!
                                    // |- True --> mytrue
  . unfold mytrue                   // |- True --> forall R : Prop, R --> R
    assume _                        // |- forall R : Prop, R --> R
    pick-any R                      // R : Prop |- R --> R
    assume r : R                    // R : Prop, r : R |- R
    assumption                      // Theorem proved!
qed

// Impredicative encoding of conjunction.
myand (P Q : Prop) : Prop =
  forall R : Prop, (P --> Q --> R) --> R

theorem myand-spec :
  forall P Q : Prop,
    myand P Q <--> P /\ Q
proof                                // |- forall P Q : Prop, myand P Q <--> P /\ Q
  pick-any P Q                       // P Q : Prop |- myand P Q <--> P /\ Q
  unfold myand                       // P Q : Prop |- (forall R : Prop, (P --> Q --> R) --> R) <--> P /\ Q
  both
                                     // P Q : Prop |- (forall R : Prop, (P --> Q --> R) --> R) --> P /\ Q
  . assume pq : myand P Q            // P Q : Prop, pq : (forall R : Prop, (P --> Q --> R) --> R) |- P /\ Q
    both
                                     // P Q : Prop, pq : (forall R : Prop, (P --> Q --> R) --> R) |- P
    . apply (instantiate pq with P)  // P Q : Prop, pq : (forall R : Prop, (P --> Q --> R) --> R) |- P --> Q --> P
      assume p _                     // P Q : Prop, pq : (forall R : Prop, (P --> Q --> R) --> R), p : P |- P
      assumption                     // Goal solved!
                                     // P Q : Prop, pq : (forall R : Prop, (P --> Q --> R) --> R) |- Q
    . apply (instantiate pq with Q)  // P Q : Prop, pq : (forall R : Prop, (P --> Q --> R) --> R) |- P --> Q --> Q
      assume _ q                     // P Q : Prop, pq : (forall R : Prop, (P --> Q --> R) --> R), q : Q |- Q
      assumption                     // Goal solved!
                                     // P Q : Prop |- P /\ Q --> (forall R : Prop, (P --> Q --> R) --> R)
  . assume (both p q)                // P Q : Prop, p : P, q : Q |- forall R : Prop, (P --> Q --> R) --> R
    pick-any R                       // P Q : Prop, p : P, q : Q, R : Prop |- (P --> Q --> R) --> R
    assume pqr : P --> Q --> R       // P Q : Prop, p : P, q : Q, R : Prop, pqr : P --> Q --> R |- R
    apply pqr
                                     // P Q : Prop, p : P, q : Q, R : Prop, pqr : P --> Q --> R |- P
    . assumption                     // Goal solved!
                                     // P Q : Prop, p : P, q : Q, R : Prop, pqr : P --> Q --> R |- Q
    . assumption                     // Theorem proved!
qed

// Impredicative encoding of disjunction.
myor (P Q : Prop) : Prop =
  forall R : Prop, (P --> R) --> (Q --> R) --> R

theorem myor-spec :
  forall P Q : Prop,
    myor P Q <--> P \/ Q
proof                                     // |-  forall P Q : Prop, myor P Q <--> P \/ Q
  pick-any P Q                            // P Q : Prop |- myor P Q <--> P \/ Q
  unfold myor                             // P Q : Prop |- (forall R : Prop, (P --> R) --> (Q --> R) --> R) <--> P \/ Q
  both
                                          // P Q : Prop |- (forall R : Prop, (P --> R) --> (Q --> R) --> R) --> P \/ Q
  . assume pq                             // P Q : Prop, pq : (forall R : Prop, (P --> R) --> (Q --> R) --> R) |- P \/ Q
    apply (instantiate pq with (P \/ Q))
                                          // P Q : Prop, pq : (forall R : Prop, (P --> R) --> (Q --> R) --> R) |- P --> P \/ Q
    . or-left                             // Goal solved!
                                          // P Q : Prop, pq : (forall R : Prop, (P --> R) --> (Q --> R) --> R) |- Q --> P \/ Q
    . or-right                            // Goal solved!
                                          // P Q : Prop |- P \/ Q --> (forall R : Prop, (P --> R) --> (Q --> R) --> R)
  . assume pq : P \/ Q                    // P Q : Prop, pq : P \/ Q |- forall R : Prop, (P --> R) --> (Q --> R) --> R
    pick-any R                            // P Q : Prop, pq : P \/ Q, R : Prop |- (P --> R) --> (Q --> R) --> R
    assume (pr : P --> R) (qr : Q --> R)  // P Q : Prop, pq : P \/ Q, R : Prop, pr : P --> R, qr : Q --> R |- R
    cases pq pr qr                        // Theorem proved!
qed

// Impredicative encoding of the existential quantifier.
myex {A} (P : A -> Prop) : Prop =
  forall R : Prop, (forall x : A, P x --> R) --> R

theorem myex-spec :
  forall {A} (P : A -> Prop),
    myex A P <--> exists x : A, P x
proof                                                // |- forall {A} (P : A -> Prop), myex A P <--> exists x : A, P x
  pick-any A P                                       // A : Type, P : A -> Prop |- myex A P <--> exists x : A, P x
  unfold myex                                        // A : Type, P : A -> Prop |- (forall R : Prop, (forall x : A, P x --> R) --> R) <--> exists x : A, P x
  both
                                                     // A : Type, P : A -> Prop |- (forall R : Prop, (forall x : A, P x --> R) --> R) --> exists x : A, P x
  . assume mx                                        // A : Type, P : A -> Prop, ex : (forall R : Prop, (forall x : A, P x --> R) --> R) |- exists x : A, P x
    apply (instantiate mx with (exists x : A, P x))  // A : Type, P : A -> Prop, ex : (forall R : Prop, (forall x : A, P x --> R) --> R) |- forall x : A, P x --> exists x : A, P x
    pick-any x : A                                   // A : Type, P : A -> Prop, ex : (forall R : Prop, (forall x : A, P x --> R) --> R), x : A |- P x --> exists x : A, P x
    assume px : P x                                  // A : Type, P : A -> Prop, ex : (forall R : Prop, (forall x : A, P x --> R) --> R), x : A, px : P x |- exists x : A, P x
    witness x                                        // A : Type, P : A -> Prop, ex : (forall R : Prop, (forall x : A, P x --> R) --> R), x : A, px : P x |- P x
    assumption                                       // Goal solved!
                                                     // A : Type, P : A -> Prop |- (exists x : A, P x) --> forall R : Prop, (forall x : A, P x --> R) --> R
  . assume (witness x such-that px)                  // A : Type, P : A -> Prop, x : A px : P x |- forall R : Prop, (forall x : A, P x --> R) --> R
    pick-any R                                       // A : Type, P : A -> Prop, x : A px : P x, R : Prop |- (forall x : A, P x --> R) --> R
    assume all                                       // A : Type, P : A -> Prop, x : A px : P x, R : Prop, all : (forall x : A, P x --> R) |- R
    apply (instantiate all with x)                   // A : Type, P : A -> Prop, x : A px : P x, R : Prop, all : (forall x : A, P x --> R) |- P x
    assumption                                       // Theorem proved!
qed

// Impredicative encoding of equality.
myeq {A} (x y : A) : Prop =
  forall P : A -> Prop, P x --> P y

theorem myeq-spec :
  forall {A} (x y : A),
    myeq x y <--> x === y
proof                                                      // |- forall {A} (x y : A), myeq x y <--> x === y
  pick-any A (x y : A)                                     // A : Type, x y : A |- myeq x y <--> x === y
  unfold myeq                                              // A : Type, x y : A |- (forall P : A -> Prop, P x --> P y) <--> x === y
  both
                                                           // A : Type, x y : A |- (forall P : A -> Prop, P x --> P y) --> x === y
  . assume all                                             // A : Type, x y : A, all : (forall P : A -> Prop, P x --> P y) |- x === y
    apply (instantiate all with (\ (a : A) -> x === a))    // A : Type, x y : A, all : (forall P : A -> Prop, P x --> P y) |- x === x
    refl                                                   // Goal solved!
                                                           // A : Type, x y : A |- x === y --> forall P : A -> Prop, P x --> P y
  . assume ===>                                            // A : Type, x y : A, _ : x === y |- forall P : A -> Prop, P y --> P y
    pick-any P : A -> Prop                                 // A : Type, x y : A, _ : x === y, P : A -> Prop |- P y --> P y
    assume py : P y                                        // A : Type, x y : A, _ : x === y, P : A -> Prop, py : P y |- P y
    assumption                                             // Theorem proved!
qed