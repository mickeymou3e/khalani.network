declaration P Q R : Prop

// Implication. Example: impl-trans


// theorem impl-trans : (P --> Q) /\ (Q --> R) --> (P --> R)

theorem impl-trans : (P --> Q) --> (Q --> R) --> (P --> R) =
  assume (pq : P --> Q) (qr : Q --> R) (p : P) in
    apply qr (apply pq p)

theorem impl-trans : (P --> Q) --> (Q --> R) --> (P --> R)
proof
  assume (pq : P --> Q) (qr : Q --> R) (p : P)
  apply qr
  apply pq
  assumption
qed

theorem suffices-example : (P --> Q) --> (Q --> R) --> P --> R
proof
  assume (pq : P --> Q) (qr : Q --> R) (p : P)
  proving R
  suffices Q by qr
  suffices P by pq
  assumption
qed

// `True`. Example: true intro.

theorem true-example : True
proof
  trivial
qed



// `False`. Example: absurd, contradiction.

theorem false-elim-example : False --> P
proof
  assume e : False
  proving P
  absurd
  assumption
qed

// Negation, `~ P` is notation for `P --> False`

theorem contradiction : ~ P --> P --> False
proof
  assume np : ~ P
  assumption
qed

// Conjunction. Example: and-comm, and-assoc

theorem and-comm : P /\ Q --> Q /\ P
proof
  assume (both (p : P) (q : Q))
  both q p
qed


theorem and-assoc : (P /\ Q) /\ R --> P /\ (Q /\ R)
proof
  assume (both (both p q) r)
  both p (both q r)
qed

// Biconditional. `P <--> Q` is notation for `(P --> Q) /\ (Q --> P)`

theorem iff-intro : (P --> Q) /\ (Q --> P) --> P <--> Q
proof
  assume h
  assumption
qed

theorem iff-comm : (P <--> Q) --> (Q <--> P)
proof
  assume (both pq qp)
  both qp pq
qed



// Disjunction. Example: or-comm, or-assoc

theorem or-comm : P \/ Q --> Q \/ P
proof
  assume pq : P \/ Q
  cases pq or-right or-left
qed

// Proving
// theorem or-assoc : (P \/ Q) \/ R --> P \/ (Q \/ R)




// Lemma, bigger example.

theorem resolution :
  (P \/ Q) /\ (~ P \/ R) --> Q \/ R
proof
  assume (both pq npr)
  cases pq ?pcase ?qcase
  lemma qcase : Q --> Q \/ R by
    assume q : Q
    or-left
    assumption
  lemma pcase : P --> Q \/ R by
    assume p : P
    cases npr
    . assume np : ~ P
      absurd
      contradiction np p
    . proving R --> Q \/ R
      assume r : R
      or-right
      assumption
qed



// Classical logic: double-negation, lem.

theorem double-negation : ~ ~ P --> P
proof
  assume nnp : ~ ~ P
  by-contradiction np : ~ P
  contradiction nnp np
qed


theorem lem : P \/ ~ P
proof
  by-contradiction h : ~ (P \/ ~ P)
  apply h
  or-right
  assume p : P
  apply h
  or-left
  assumption
qed


// forall

type A
declaration P Q : A -> Prop

theorem rename-forall :
  (forall x : A, P x) --> (forall y : A, P y)
proof
  assume allp
  assumption
qed




theorem forall-and :
  (forall x : A, P x /\ Q x) --> (forall x : A, P x) /\ (forall x : A, Q x)
proof
  assume allpq
  both
  . pick-any x : A
    and-left (instantiate allpq with x)
  . pick-any x : A
    and-right (instantiate allpq with x)
qed



// exists

theorem exists-and :
  (exists x : A, P x /\ Q x) --> (exists x : A, P x) /\ (exists x : A, Q x)
proof
  assume (witness (a : A) such-that both pa qa)
  both
  . witness a
    assumption
  . witness a
    assumption
qed


// not-all-exists

theorem not-all-exists :
  ~ (forall x : A, P x) --> exists x : A, ~ P x
proof
  assume nall : ~ (forall x : A, P x)
  by-contradiction nex : ~ (exists x : A, ~ P x)
  apply nall
  proving forall x : A, P x
  pick-any x : A
  by-contradiction npx : ~ P x
  apply nex
  proving exists x : A, ~ P x
  witness x
  assumption
qed

// Equality

theorem eq-refl :
  forall x : A, x === x
proof
  pick-any x
  refl
qed

theorem eq-sym :
  forall x y : A, x === y --> y === x
proof
  pick-any x y : A
  assume eq : x === y
  proving y === x
  rewrite <-eq
  proving x === x
  refl
qed

theorem eq-trans :
  forall x y z : A, x === y --> y === z --> x === z
proof
  pick-any x y z : A
  assume (xy : x === y) (yz : y === z)
  chaining
    === x
    === y  by xy
    === z  by yz
qed