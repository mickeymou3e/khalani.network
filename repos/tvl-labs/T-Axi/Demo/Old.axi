// Basic kinds of objects: types, terms, propositions, proofs

// Term definition
answer : Nat = 42

answer : Nat
answer = 42

answer : Nat
_ = 42

// Function definition (lambda)
id : Nat -> Nat = \ n -> n

// Function definition (short)
id (n : Nat) : Nat = n

// (Implicitly) Polymorphic function (should we overload forall?)
id : forall {a}, a -> a
id x = x

// (Explicitly) Polymorphic function
id : forall a, a -> a
id a x = x

id : forall a, a -> a = \ a x -> x

// Very implicit arguments (auto-generalise free type variables)
id : a -> a
id x = x

comp : (b -> c) -> (a -> b) -> a -> c
_ f g x = f (g x)

// Named axiom
axiom why-not-lol : False

// Theorem ('by' notation)
theorem comp_id_r : forall a b (f : a -> b), (comp id f = f) by
  assume a b f
  funext x
  refl

theorem hyp-distrib : (a -> b -> c) -> (a -> b) -> a -> c by
  assume (G : a -> b -> c) (H : a -> b) I
  apply G I (H I)

// Type declaration
type T

// Type definition (synonym)
type NatToNat = Nat -> Nat

// Type definition (record)
record type Point where
  x of Nat
  y of Nat

// Type definition (variant)
data Bool where
  no
  yes

// Type definition (polymorphic variant)
data Option a where
  no
  yes of a

data Sum a b where
  no of a
  yes of b

// Type definition (inductive)
data List a where
  nil
  cons of a, List a

// Type definition (inductive)
data type Expr a where
  var of a
  lam of Expr (Option a)
  app of Expr a, Expr a

// Relation declaration (kinding)
declaration R : Nat -> Nat -> Prop

// Recursive functions
map (f : a -> b) : List a -> List b
_ nil = nil
_ (cons h t) = cons (f h) (map f t)

app : List a -> List a -> List a
_ nil l = l
_ (cons h t) l = cons h (app t l)

app (l1 l2 : List a) : List a = case l1 where
  nil -> l2
  cons h t -> cons h (app t l2)

// Proof by induction
theorem map_id : (forall a l, map id l = l) by
  assume a l
  induction l with
  | nil => refl
  | cons h (t & ind iht) =>
      rewrite iht
      refl
