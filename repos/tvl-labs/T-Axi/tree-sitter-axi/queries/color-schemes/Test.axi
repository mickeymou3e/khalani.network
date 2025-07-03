theorem some-lengthy-name :
  P --> Q /\ Q --> R \/ R --> S <--> S --> ~ T --> True --> False --> a === b
proof
  assume p : P
  assumption
  apply contradiction np p
  both p q
  and-left pq
  or-left p
  cases pq pr qr
  trivial
  absurd
qed

type Decl

type Arr = A -> B
type Prod = A * B
type Sum = A + B
type All = forall {A}, T
type Ex = exists {A}, T

declaration P : Prop
declaration Q : A -> Prop
declaration A : Type
declaration F : Type -> Type

axiom wut : False

record type Prod A B where
  fst : A
  snd : B

data type Option A where
  none
  some of A