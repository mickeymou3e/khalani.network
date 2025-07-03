data type Nat
  zero
  succ of Nat

add : Nat -> Nat -> Nat
| zero   , m => n
| succ n', m => succ (add n' m)

// claude-3.7-sonnet-thinking: one shot, but used `unfold` instead of `simpl`.
// With chaining, almost one shot, but used `by IH` instead of `by rewrite IH`.
theorem add-zero-r :
  forall n : Nat,
    add n zero === n

// claude-3.7-sonnet-thinking: one shot using chaining.
theorem add-succ-r :
  forall n m : Nat,
    add n (succ m) === succ (add n m)

// claude-3.7-sonnet-thinking: one shot using chaining.
theorem add-assoc :
  forall a b c : Nat,
    add (add a b) c === add a (add b c)

// claude-3.7-sonnet-thinking: good idea, but inlining the lemma makes it fail.
// However, he succeeds if you tell him to prove `add-succ-r` first.
// Forgets to say `rewrite`, but otherwise good.
theorem add-comm :
  forall n m : Nat,
    add n m === add m n

halve : Nat -> Nat
| zero => zero
| succ zero => zero
| succ (succ n) => succ (halve n)

// claude-3.7-sonnet-thinking: one shot using chaining.
theorem halve-spec :
  forall n : Nat,
    halve (add n n) === n

// Minimum.

min : Nat -> Nat -> Nat
| zero, _ => zero
| _, zero => zero
| succ n, succ m => succ (min n m)

// claude-3.7-sonnet-thinking: one shot, no induction.
theorem min-zero-l :
  forall n : Nat,
    min zero n === zero

// claude-3.7-sonnet-thinking: two shot.
theorem min-zero-r :
  forall n : Nat,
    min n zero === zero

// claude-3.7-sonnet-thinking: one shot.
theorem min-diag :
  forall n : Nat,
    min n n === n

// claude-3.7-sonnet-thinking: one shot, two nested inductions.
// When reprimanded, he can use `cases` when induction hypothesis is not needed.
theorem min-comm :
  forall n m : Nat,
    min n m === min m n

// claude-3.7-sonnet-thinking: one shot, three nested inductions.
theorem min-assoc :
  forall a b c : Nat,
    min (min a b) c === min a (min b c)

// Maximum.

max : Nat -> Nat -> Nat
| zero, m => m
| n, zero => n
| succ n, succ m => succ (max n m)

// claude-3.7-sonnet-thinking: one shot.
theorem max-zero-l :
  forall n : Nat,
    max zero n === n

// claude-3.7-sonnet-thinking: one shot.
theorem max-zero-r :
  forall n : Nat,
    max n zero === n

// claude-3.7-sonnet-thinking: one shot.
theorem max-diag :
  forall n : Nat,
    max n n === n

// claude-3.7-sonnet-thinking: one shot.
theorem max-comm :
  forall n m : Nat,
    max n m === max m n

// claude-3.7-sonnet-thinking: one shot.
theorem max-assoc :
  forall a b c : Nat,
    max (max a b) c === max a (max b c)

// Predecessor (floored at zero).
pred : Nat -> Nat
| zero => zero
| succ n => n

// Subtraction.

sub : Nat -> Nat -> Nat
| n, zero => n
| n, succ m => pred (sub n m)

// claude-3.7-sonnet-thinking: one shot.
theorem sub-spec :
  forall n : Nat,
    sub n (succ zero) === pred n

// claude-3.7-sonnet-thinking: one shot.
theorem sub-zero-r :
  forall n : Nat,
    sub n zero === n

// claude-3.7-sonnet-thinking: one shot.
theorem sub-zero-l :
  forall n : Nat,
    sub zero n === zero

// claude-3.7-sonnet-thinking: one shot.
theorem sub-succ :
  forall n m : Nat,
    sub (succ n) (succ m) === sub n m

// claude-3.7-sonnet-thinking: one shot.
// He actually made a mistake, but was able to realize his mistake himself.
theorem sub-diag :
  forall n : Nat,
    sub n n === zero

// claude-3.7-sonnet-thinking: one shot.
theorem sub-add-r :
  forall a b c : Nat,
    sub a (add b c) === sub (sub a b) c

// claude-3.7-sonnet-thinking: one shot.
theorem sub-add-l-l :
  forall n m : Nat,
    sub (add n m) n === m

// claude-3.7-sonnet-thinking: almost got it, but forgot to rewrite
// `add-succ-r` in the base case.
theorem sub-add-l-r :
  forall n m : Nat,
    sub (add n m) m === n

// claude-3.7-sonnet-thinking: failed. Induction on the wrong argument.
// He got it after 5-6 tries, but still used rewriting in the wrong direction.
theorem sub-pred :
  forall n m : Nat,
    sub (pred n) m === pred (sub n m)

// claude-3.7-sonnet-thinking: failed, he's clearly missing a lemma.
// When asked to prove the lemma first: one shot, but he rewrote in
// the wrong direction twice.
theorem sub-exchange :
  forall a b c : Nat,
    sub (sub a b) c === sub (sub a c) b

// Multiplication.

// I guess this would be where it gets too hard.

mul : Nat -> Nat -> Nat
| zero  , _ => zero
| succ n, m => add m (mul n m)

// claude-3.7-sonnet-thinking: one shot.
theorem mul-zero-l :
  forall n : Nat,
    mul zero n === zero

// claude-3.7-sonnet-thinking: one shot.
theorem mul-zero-r :
  forall n : Nat,
    mul n zero === zero

// claude-3.7-sonnet-thinking: one shot.
// He understands `1` even though it was not defined as `succ zero` anywhere.
// Also, he was rewriting with `mul-zero-l` instead of using `simpl`.
theorem mul-1-l :
  forall n : Nat,
    mul 1 n === n

// claude-3.7-sonnet-thinking: one shot.
theorem mul-1-r :
  forall n : Nat,
    mul n 1 === n

// claude-3.7-sonnet-thinking: one shot, except for rewriting in the
// wrong direction.
theorem mul-add-l :
  forall a b c : Nat,
    mul (add a b) c === add (mul a c) (mul b c)

// claude-3.7-sonnet-thinking: one shot, except for rewriting in the
// wrong direction.
theorem mul-assoc :
  forall a b c : Nat,
    mul a (mul b c) === mul (mul a b) c

// claude-3.7-sonnet-thinking: failed - used additional lemmas which
// he didn't want to prove.
theorem mul-sub-r :
  forall a b c : Nat,
    mul a (sub b c) === sub (mul a b) (mul a c)

// claude-3.7-sonnet-thinking: failed - used additional lemmas which
// he didn't want to prove.
theorem mul-sub-l :
  forall a b c : Nat,
    mul (sub a b) c === sub (mul a c) (mul b c)

// claude-3.7-sonnet-thinking: good idea, but was missing a lemma,
// which he had a good idea of how to prove, but ultimately didn't
// realize another lemma he needed was associativity of addition.
// Another try: one shot! Except, of course, for rewriting direction
// and some trivial syntax errors in the lemma header.
theorem mul-comm :
  forall n m : Nat,
    mul n m === mul m n