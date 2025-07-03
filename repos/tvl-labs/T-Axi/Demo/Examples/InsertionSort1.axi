// TODO

data Bool where
  false
  true

data List A where
  nil
  cons : A -> List A -> List A

isSorted A (r : A -> A -> Bool) : List A -> Bool
| nil => true
| cons _ nil => true
| cons x (cons y l) => andb (r x y) (isSorted r (cons y l))

insert A (r : A -> A -> Bool) (x : A) : List A -> List A
| nil => cons x nil
| cons h t =>
  if r x h
  then cons x (cons h t)
  else cons h (insert x t)

theorem isSorted-insert :
  forall {A} (r : A -> A -> Bool) (x : A) (l : List A),
    isSorted r l === true --> isSorted r (insert r x l) === true
proof
  pick-any A r x l
  assume isSorted-l : isSorted l === true
  induction l with
  | nil => refl
  | cons h (t & ind IHt) =>
    proving isSorted r (if r x h then cons x (cons h t) else cons h (insert x t)) === true
    cases r x h with
    | true =>
      proving isSorted r (cons x (cons h t))
      // TODO
    | false =>
      // TODO
qed