// We define the types of booleans and natural numbers, and
// two functions that check whether a number is even or odd.
// Then we state a theorem that for every natural number,
// either `even` or `odd` returns `true`.

// Booleans.
data type Bool where
  false
  true

// Natural numbers.
data type Nat where
  zero
  succ of Nat

// Check if a natural number is even.
even : Nat -> Bool
| zero => true
| succ zero => false
| succ (succ n) => even n

// Check if a natural number is odd.
odd : Nat -> Bool
| zero => false
| succ zero => true
| succ (succ n) => odd n

// Every natural number is either even or odd.
theorem even-or-odd :
  forall n : Nat,
    even n === true \/ odd n === true
proof
  pick-any n
  induction n with
  | zero => or-left refl
  | succ zero => or-right refl
  | succ (succ (n' & ind IH)) =>
    cases IH
    . assume (heven : even n' === true)
      or-left heven
    . assume (hodd : odd n' === true)
      or-right hodd
qed

// The same theorem, but with a chaining-based proof.
theorem even-or-odd-chaining :
  forall n : Nat,
    even n === true \/ odd n === true
proof
  pick-any n
  induction n with
  | zero =>
    or-left
    chaining
      === even zero
      === true
  | succ zero =>
    or-right
    chaining
      === odd (succ zero)
      === true
  | succ (succ (n' & ind IH)) =>
    cases IH
    . assume (heven : even n' === true)
      or-left
      chaining
        === even (succ (succ n'))
        === even n'
        === true                   by heven
    . assume (hodd : odd n' === true)
      or-right
      chaining
        === odd (succ (succ n'))
        === odd n'
        === true                   by hodd
qed