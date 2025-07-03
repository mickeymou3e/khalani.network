// TODO

data Bool where
  false
  true

data List A where
  nil
  cons : A -> List A -> List A

type A
declaration r : A -> A -> Bool

smaller-head (x : A) : List A -> Bool
| nil => true
| cons h _ => r x h

isSorted : List A -> Bool
| nil => true
| cons h t => andb (smaller-head h t) (isSorted t)

insert (x : A) : List A -> List A
| nil => cons x nil
| cons h t =>
  if r x h
  then cons x (cons h t)
  else cons h (insert x t)

theorem isSorted-insert :
  forall (x : A) (l : List A),
    isSorted l === true --> isSorted (insert x l) === true
proof
  pick-any x l
  assume isSorted-l : isSorted l
  induction l with
  | nil =>
    chaining
      === isSorted (insert x nil)
      === isSorted (cons x nil)
      === andb (smaller-head x nil) (isSorted nil)
      === andb true true
      === true
  | cons h (t & ind (IH : isSorted t === true --> isSorted (insert x t) === true)) =>
    proving isSorted (if r x h then cons x (cons h t) else cons h (insert x t))
    cases r x h with
    | true =>
      proving isSorted (insert x (cons h t))
        === isSorted (cons x (cons h t))
        === andb (smaller-head x (cons h t)) (isSorted (cons h t))
        === andb (r x h) (isSorted (cons h t))
        === andb true (isSorted (cons h t))
        === andb true true                   by rewrite isSorted-l
        === true
    | false =>
      lemma andb-true-r : forall b1 b2 : Bool, andb b1 b2 === true --> b2 === true by
        // TODO
      lemma isSorted-t : isSorted t === true by
        apply (andb-true-r (smaller-head h t) (isSorted t))
        proving andb (smaller-head h t) (isSorted t) === true
        isSorted-l

      chaining
        === isSorted (insert x (cons h t))
        === isSorted (cons h (insert x t))
        === andb (smaller-head h (insert x t)) (isSorted (insert x t))
        === andb (smaller-head h (insert x t)) true                     by rewrite (IH isSorted-t)
      // TODO 
qed