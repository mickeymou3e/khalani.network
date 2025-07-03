// Higher-order logic.

theorem xor-not-iff-conv :
  forall {P Q : Prop},
    ~ ((P /\ ~ Q) \/ (~ P /\ Q)) --> P <--> Q
proof
  pick-any P Q
  assume nxor
  both
  . assume p
    by-contradiction nq : ~ Q
    apply nxor
    or-left
    both p nq
  . assume q
    by-contradiction np : ~ P
    apply nxor
    or-right
    both np q
qed

theorem classic-funny-contraposition :
  forall {P Q : Prop},
    (~ P --> Q) --> (~ Q --> P)
proof
  pick-any P Q
  assume (npq : ~ P --> Q) (nq : ~ Q)
  by-contradiction np : ~ P
  apply nq, npq
  assumption
qed

theorem xor-not-iff :
  forall {P Q : Prop},
    ~ (P <--> Q) --> (P /\ ~ Q) \/ (~ P /\ Q)
proof
  pick-any P Q
  classic-funny-contraposition
  xor-not-iff-conv
qed

theorem xor-not-iff-manually-instantiated :
  forall {P Q : Prop},
    ~ (P <--> Q) --> (P /\ ~ Q) \/ (~ P /\ Q)
proof
  pick-any P Q
  classic-funny-contraposition {(P /\ ~ Q) \/ (~ P /\ Q)} {P <--> Q}
  xor-not-iff-conv {P} {Q}
qed

theorem xor-not-iff-term-style :
  (forall {P Q : Prop},
    ~ (P <--> Q) --> (P /\ ~ Q) \/ (~ P /\ Q)) =
  pick-any P Q in
    classic-funny-contraposition
      {(P /\ ~ Q) \/ (~ P /\ Q)} {P <--> Q}
      xor-not-iff-conv

// Instantiating polymorphic theorems.

theorem forall-and :
  forall {A} (P Q : A -> Prop),
    (forall x : A, P x /\ Q x) --> (forall x : A, P x) /\ (forall x : A, Q x)
proof
  pick-any (A : Type) (P Q : A -> Prop)
  assume allpq
  both
  . pick-any x : A
    and-left (instantiate allpq with x)
  . pick-any x : A
    and-right (instantiate allpq with x)
qed

theorem forall-and-Nat-True-Q :
  forall (Q : Nat -> Prop),
    (forall x : Nat, True /\ Q x) --> (forall x : Nat, True) /\ (forall x : Nat, Q x)
proof
  pick-any Q
  forall-and {Nat} (\ (n : Nat) -> True) Q
qed

// Existential quantification on types.

data type Unit where
  unit

theorem exists-funny-type :
  exists {A}, forall {B} (f g : B -> A), f === g
proof
  witness Unit
  pick-any B f g
  funext x : B
  proving f x === g x
  cases f x, g x with
  | unit, unit => refl
qed

// Logical entities.

// Prop - propositions
// Nat -> Prop - predicates on `Nat`
// Nat -> Nat -> Prop // Binary relations on `Nat`
// forall A, A -> A -> Prop - Polymorphic binary relations
// Type -> Prop - Predicate types

// Existential higher-order quantification.

theorem ex1 :
  exists F : Prop -> Prop,
    forall P : Prop, F P <--> ~ P
proof
  witness (\ (P : Prop) -> ~ P)
  proving forall P : Prop, (\ (P : Prop) -> ~ P) P <--> ~ P
  simpl
  proving forall P : Prop, ~ P <--> ~ P
  pick-any P
  both
  . assume np
    assumption
  . assume np
    assumption
qed

// Defining connectives and equality.

myeq A (x y : A) : Prop =
  forall P : A -> Prop, P x --> P y

my-type-eq (A B : Type) : Prop =
  forall P : Type -> Prop, P A --> P B

theorem myeq-spec :
  forall {A} (x y : A),
    myeq x y <--> x === y
proof
  pick-any A x y
  both
  . unfold myeq
    assume h : (forall P : A -> Prop, P x --> P y)
    proving x === y
    apply (instantiate h with (\ (a : A) -> x === a))
    // P y is the same thing as (\ (a : A) -> x === a) y
    proving x === x
    refl
  . assume h : x === y
    unfold myeq
    proving forall P : A -> Prop, P x --> P y
    pick-any P
    assume px : P x
    proving P y
    rewrite <-h
    proving P x
    assumption
qed

// Classical logic - the Axiom of Choice.

theorem choice :
  forall {A B} (R : A -> B -> Prop),
    (forall a : A, exists b : B, R a b) -->
      exists f : A -> B, forall a : A, R a (f a)
proof
  pick-any A B R
  assume total : forall a : A, exists b : B, R a b
  let noncomputable f (a : A) : B =
    pick-witness b _ for total a in b
  proving exists f : A -> B, forall a : A, R a (f a)
  witness f
  proving forall a : A, R a (f a)
  pick-any a
  unfold f
  proving R a ((\ (a : A) -> pick-witness b _ for total a in b) a)
  pick-witness (b : B) (rab : R a b) for total a
  simpl
  proving R a b
  assumption
qed

// Comparison of T-Axi and A-Axi -- see directory Demo/Workshop/Comparison.

// AI Proving - see directory Demo/AI.

// Records - see Demo/Tutorial/Programming.axi (lines 256-382).