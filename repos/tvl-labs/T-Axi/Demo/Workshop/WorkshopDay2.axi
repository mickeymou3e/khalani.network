// Agenda:

// Show parser.

// Show proof checking with AI.

// Talk about chaining again, in a bit more detail.

declaration P Q R S : Prop

theorem chaining-example :
  (P --> Q) --> (Q --> R) --> (R --> S) --> P --> S
proof
  assume pq qr rs
  proving P --> S
  chaining
    --> P
    --> Q  by pq
    --> R  by qr
    --> S  by rs
qed

theorem chaining-example-desugared :
  (P --> Q) --> (Q --> R) --> (R --> S) --> P --> S
proof
  assume pq qr rs
  apply impl-trans P Q S pq
  apply impl-trans Q R S qr
  rs
qed

theorem chaining-example :
  (P <--> Q) --> (Q <--> R) --> (R <--> S) --> P <--> S
proof
  assume pq qr rs
  chaining
    <--> P
    <--> Q  by pq
    <--> R  by qr
    <--> S  by rs
qed

type A
declaration R : A -> A -> Prop
axiom transitive-R : forall x y z : A, R x y --> R y z --> R x z

theorem chaining-R :
  forall a b c d : A,
    R a b --> R b c --> R c d --> R a d
proof
  pick-any a b c d
  assume ab bc cd
  chaining
    R a
    R b  by ab
    R c  by bc
    R d  by cd
qed

// Programming - mention base types.

number : Int32 = 42
uint-example : Uint8 = 5

string : String = "what?"

float-example : Float16 = 1.0e-8

// Functions.

id A (x : A) : A = x

comp A B C (f : A -> B) (g : B -> C) (x : A) : C =
  g (f x)

// (==) : forall A [Eq A], A -> A -> Bool

// 5 == 6 // computes to no

// (===) : forall A, A -> A -> Prop

// 5 === 6 : Prop

theorem id-spec :
  forall {A : Type} (x : A),
    id x === x
proof
  pick-any A x
  proving id x === x
  proving x === x
  refl
qed

theorem definitional-extensionality :
  forall {A B} (f : A -> B),
    f === \ (x : A) -> f x
proof
  pick-any A B f
  refl
qed

theorem propositional-extensionality :
  forall {A B} (f g : A -> B),
    (forall x : A, f x === g x) --> f === g
                                           // No instance of Eq for (A -> B)
                                           // Expected: Prop, Actual: Bool
proof
  pick-any A B f g
  assume eq : forall x : A, f x === g x
  proving f === g
  funext x : A
  proving f x === g x
  instantiate eq with x
qed



// Computation, unfold, simpl, funext.

// Polymorphism and type quantification.

// Simple inductive types: Bool, Option, Sum.
// Functions definition by pattern matching.
// Talk a bit more about missing and overlapping cases.
// Proofs by cases and chaining.

data type Bool where
  false
  true

// Bool : Type
// false : Bool
// true : Bool

// False : Prop
// True  : Prop

//notb (b : Bool) : Bool =
//  match b with
//  | false => true
//  | true  => false

notb : Bool -> Bool
| false => true
| true  => false

andb : Bool -> Bool -> Bool
| true, true => true
| _   , _    => false

andb : Bool * Bool -> Bool
| (true, true) => true
| (_   , _   ) => false

andb : Bool -> Bool -> Bool
| true, true => true
| false, true => false
| true, false => false
| false, false => false
| false, false => true  // ERROR: case | false, false appears twice

// ERROR: missing case | false, false

theorem andb-comm :
  forall b1 b2 : Bool,
    andb b1 b2 === andb b2 b1
proof
  pick-any b1 b2
  cases b1, b2 with
  | true, true   => refl
  | true, false  => refl
  | false, true  => refl
  | false, false => refl
qed

data type Option A where
  none : Option A
  some : A -> Option A

//data type Option A where
//  none
//  some of A

//data type Option A where
//  none : Option A
//  some (x : A) : Option A

data Sum A B where
  inl : A -> Sum A B
  inr : B -> Sum A B


// Lists, recursive functions: app, rev, map, filter.

data type Nat where
  zero
  succ : Nat -> Nat

data type List A where
  nil : List A
  cons : A -> List A -> List A

append A : List A -> List A -> List A
| nil, l2 => l2
| cons h t, l2 => cons h (append t l2)

theorem append-assoc :
  forall {A} (l1 l2 l3 : List A),
    append (append l1 l2) l3 === append l1 (append l2 l3)
proof
  pick-any A l1 l2 l3
  induction l1 with
  | nil =>
    chaining
      === append (append nil l2) l3
      === append l2 l3
      === append nil (append l2 l3)
  | cons h (t & ind (IH : append (append t l2) l3 === append t (append l2 l3))) =>
    chaining
      === append (append (cons h t) l2) l3
      === append (cons h (append t l2)) l3
      === cons h (append (append t l2) l3)
      === cons h (append t (append l2 l3))  by rewrite IH
      === append (cons h t) (append l2 l3)
qed

filter A (p : A -> Bool) : List A -> List A
| nil => nil
| cons h t => if p h then cons h (filter p t) else filter p t

theorem filter-append :
  forall {A} (p : A -> Bool) (l1 l2 : List A),
    filter p (append l1 l2) === append (filter p l1) (filter p l2)
proof
  pick-any A p l1 l2
  induction l1 with
  | nil => refl
  | cons h (t & ind (IH : filter p (append t l2) === append (filter p t) (filter p l2))) =>
    cases p h with
    | true =>
      chaining
        === filter p (append (cons h t) l2)
        === filter p (cons h (append t l2))
        === if p h then cons h (filter p (append t l2)) else (filter p (append t l2))
        === cons h (filter p (append t l2))
        === cons h (append (filter p t) (filter p l2)) by rewrite IH
        === append (cons h (filter p t)) (filter p l2)
        === append (filter p (cons h t)) (filter p l2)
    | false =>
      chaining
        === filter p (append (cons h t) l2)
        === filter p (cons h (append t l2))
        === if p h then cons h (filter p (append t l2)) else (filter p (append t l2))
        === filter p (append t l2)
        === append (filter p t) (filter p l2) by rewrite IH
        === append (filter p (cons h t)) (filter p l2)
qed

// Classes and instances. Example: Eq, LawfulEq.