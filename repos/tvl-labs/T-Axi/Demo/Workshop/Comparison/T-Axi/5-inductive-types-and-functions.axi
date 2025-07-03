data type Nat where
  Zero
  Succ : Nat -> Nat

add (x : Nat) : Nat -> Nat
| Zero => x
| Succ y => Succ (add x y)

theorem add-Zero-r :
  forall x : Nat,
    add x Zero === x
proof
  pick-any x
  refl
qed

theorem add-Succ-r :
  forall x y : Nat,
    add x (Succ y) === Succ (add x y)
proof
  pick-any x y
  refl
qed

theorem add-Zero-l :
  forall y : Nat,
    add Zero y === y
proof
  pick-any y
  induction y with
  | Zero => refl
  | Succ (y' & ind (IH : add Zero y' === y')) =>
    chaining
      === add Zero (Succ y')
      === Succ (add Zero y')  by refl
      === Succ y'             by rewrite IH
qed