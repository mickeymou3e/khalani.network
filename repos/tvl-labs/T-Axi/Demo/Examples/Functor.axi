// TODO: finish, update to new typeclass syntax/semantics.

class Functor (F : Type -> Type) where
  fmap : forall A B, (A -> B) -> F A -> F B

class LawfulFunctor (F : Type -> Type) <= Functor F where
  fmap-id : forall A, fmap id === id
  fmap-comp : forall A B C (f : A -> B) (g : B -> C), fmap (comp f g) === comp (fmap f) (fmap g)

instance Functor List where
  fmap (f : A -> B) : List A -> List B
  | nil => nil
  | cons h t => cons (f h) (f t)

instance LawfulFunctor List where
  theorem fmap-id :
    forall {A}, fmap id === id
  proof
    pick-any A
    funext l
    proving fmap id l === l
    induction l with
    | nil =>
      chaining
      === fmap id nil
      === nil
    | cons h (t & ind IH) =>
      chaining
        === fmap id (cons h t)
        === cons (id h) (fmap id t)
        === cons h (fmap id t)
        === cons h t                 by rewrite IH
  qed