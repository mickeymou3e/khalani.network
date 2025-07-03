// The totality checker is a component of the language (similarly to the type
// checker and the proof checker) whose role is to make sure that programs and
// proofs are total.

// There are two modes of the totality checker:
// - The syntactic check mode (available for both programs and proofs).
// - The totality proof mode (available only for programs).

// The syntactic totality check for programs gets automatically triggered during
// type checking for:
// - Definitions by pattern matching (this is called "coverage check").
// - Recursive function definitions (this is called "termination check").

// The syntactic totality check for proofs gets automatically triggered during
// proof checking:
// - Proofs by cases (this is called "coverage check").
// - Proofs by induction (this is called "termination check").

// The totality proof mode for programs can be used to manually prove totality
// of programs that failed the syntactic totality check. It is never triggered
// automatically and must be manually started by the user.

// The intended way of working with the totality checker is something like this:
// Definitions of functions by structural recursion and proofs by structural
// induction are automatically accepted by the totality checker without any
// input from the user. More complicated programs that fail the totality check
// are still accepted by the system (only a warning is generated), but they are
// available only in the programming layer of the language. We can't refer to
// them in the logic, but we can refer to relations that correspond to the graphs
// of these functions. To make the function available for reasoning in the logic,
// we must prove that it's total by proving that its graph is total as a relation.

// More complicated proofs that require going beyond structural recursion can be
// carried out by well-founded induction. The principle of well-founded induction
// is provable using classical logic and does not require special support from the
// language.

// Below, we will first see examples of the syntactic totality check for programs,
// and then we will see some totality proofs which go through using structural
// induction. At the end, we will see totality proofs that require well-founded
// induction.

// The simplest flavour of structural recursion,
// accepted because of a syntactic check.
idNat1 : Nat -> Nat
| zero => zero
| succ n => succ (idNat1 n)

// Structural recursion (deep, nested pattern matching),
// accepted because of a syntactic check.
idNat2 : Nat -> Nat
| zero => zero
| succ zero => succ zero
| succ (succ n) => succ (succ (idNat2 n))

// Structural recursion (deep, a bit more complicated),
// accepted because of a syntactic check.
idNat3 : Nat -> Nat
| zero => zero
| succ zero => succ zero
| succ (succ n) => succ (idNat3 (succ n))

// Structural recursion in which one recursive call is higher-order.
// Notice that both recursive calls are on `n'`, which is a strict subterm
// of `n`.
transform (n : Nat) (f : Nat -> Nat) : Nat =
  match n with
  | zero => f zero
  | succ n' => transform n' (\ x -> f (transform n' (\ y -> f (x + y))))

// A representation of the integers with `z` (zero), `s` (successor) and
// `p` (predecessor). Note that the representation is not unique, e.g.
// both `z` and `s (p z)` represent zero.
data type Z where
  z : Z
  s : Z -> Z
  p : Z -> Z

// A function that finds a normal representation of an integer.
// It is structurally recursive - we perform the recursive call
// on a strict subterm, and then pattern match on it.
norm : Z -> Z
| z => z
| s k =>
  match norm k with
  | p k' => k'
  | k' => s k'
| p k =>
  match norm k with
  | s k' => k'
  | k' => p k'

// We can define a function from `Unit` to `Empty` by looping.
// This function does NOT pass the syntactic check (more precisely,
// it fails the termination check), but it is still accepted by the
// language with a warning.
u2e (x : Unit) : Empty =
  u2e x
// WARNING: Cannot establish the totality of `u2e` with a syntactic check.

// We can define a similar function that fails the coverage check instead.
// Note: the syntax for an empty pattern matching is not settled for now.
u2e' : Unit -> Empty
// WARNING: Cannot establish the totality of `u2e'` with a syntactic check.

// Despite being able to define the above functions, the logic is free from
// contradiction.
fail theorem contradiction : False
proof                                  // |- False
  cases u2e unit with
  // ERROR: Cannot use partial program `u2e` inside a proof.
  // We attempt reasoning by cases on a value of the empty type,
  // but `u2e` is a partial function, so it cannot be used inside
  // proofs.
abort

// t1 : A   t2 : A   (t1, t2 not necessarily total)
// ---------------------------------------------
// t1 =?= t2 : Prop

// t : A (t total)
// --------------------------------------------
// prefl @t : t =?= t

// t1 : A   t2 : A   (t1, t2 total)   e : t1 =?= t2
// ------------------------------------------------
// totalize e : t1 === t2

missing-case-ok (n : Nat) : Nat =
  match succ n with
  | succ n' => n'
// WARNING: Missing case: `zero`.

// The function is total, because the `zero` case is impossible.
totality missing-case-ok
proof                                  // |- forall n : Nat, exists r : Nat, missing-case-ok n =?= r
  pick-any n                           // n : Nat |- exists r : Nat, missing-case-ok n =?= r
  witness n                            // n : Nat |- missing-case-ok n =?= n
  chaining
    =?= missing-case-ok n
    =?= n                  by step
qed

missing-case-bad : Nat -> Nat
| succ n => succ n
// WARNING: Missing case: `zero`.

// The function is not total, so the proof fails no matter what we do.
fail totality missing-case-bad
proof                                  // |- forall x : Nat, exists r : Nat, missing-case-bad x =?= r
  pick-any x                           // x : Nat |- exists r : Nat, missing-case-bad x =?= r
  cases x with
  | succ n' =>                         // x : Nat, n : Nat |- exists r : Nat, missing-case-bad (succ n) =?= r
    witness succ n'                    // x : Nat, n : Nat |- missing-case-bad (succ n) =?= succ n
    chaining
      =?= missing-case-bad (succ n)
      =?= succ n                     by step
  | zero =>                            // x : Nat |- exists r : Nat, missing-case-bad zero =?= r
    witness 42                         // x : Nat |- missing-case-bad zero =?= 42
    step                               // x : Nat |- False
    // Nothing can be done at this point.
abort

// Moreover, we can prove that `missing-case-bad` is not total.
theorem missing-case-bad-diverges :
  forall r : Nat, ~ missing-case-bad zero =?= r
proof                                  // |- forall r : Nat, ~ missing-case-bad zero =?= r
  pick-any r                           // r : Nat |- ~ missing-case-bad zero =?= r
  assume h                             // r : Nat, h : missing-case-bad zero =?= r |- False
  step at h                            // r : Nat, h : False |- False
  assumption                           // Theorem proved!
qed

// An alternative proof, using functional inversion.
theorem missing-case-bad-zero :
  forall r : Nat, ~ missing-case-bad zero =?= r
proof                                  // |- forall r : Nat, ~ missing-case-bad zero =?= r
  pick-any r                           // r : Nat |- ~ missing-case-bad zero =?= r
  assume h                             // r : Nat, h : missing-case-bad zero =?= r |- False
  functional inversion h               // Theorem proved! // The case for `zero` was undefined, which gives an instant contradiction.
qed

// But we can also prove that it returns results for non-zero naturals.
theorem missing-case-bad-succ :
  forall n : Nat, missing-case-bad (succ n) =?= succ n
proof                                  // |- forall n : Nat, missing-case-bad (succ n) =?= succ n
  pick-any n                           // n : Nat |- missing-case-bad (succ n) =?= succ n
  chaining
    =?= missing-case-bad (succ n)
    =?= succ n                     by step
qed

// We can use `missing-case-bad` to define another function,
// which the syntactic check thinks is not total, but we will
// be able to prove that it is.
missing-case-good (n : Nat) : Nat =
  missing-case-bad (succ n)
// WARNING: Cannot establish the totality of `missing-case-good` with a syntactic check.

totality missing-case-good
proof                                  // forall n : Nat, exists r : Nat, missing-case-good n =?= r
  pick-any n                           // n : Nat |- exists r : Nat, missing-case-good n =?= r
  witness succ n                       // n : Nat |- missing-case-good n =?= succ n
  chaining
    =?= missing-case-good n
    =?= missing-case-bad (succ n)
    =?= succ n                     by step
qed

loop (x : Unit) : Unit =
  loop x
// WARNING: Cannot establish the totality of `loop` with a syntactic check.

// The function is not total, so the proof fails.
fail totality loop
proof                                  // |- forall x : Unit, exists r : Unit, loop x =?= r
  pick-any x                           // x : Unit |- exists r : Unit, loop x =?= r
  witness unit                         // x : Unit |- loop x =?= unit
  step                                 // x : Unit |- loop x =?= unit
  // Nothing can be done at this point.
  cases x with
  | unit =>                            // x : Unit |- loop unit =?= unit
  // Still nothing to do...
abort

// Moreover, we can prove that `loop` doesn't termine using functional induction.
theorem loop-diverges :
  forall x r : Unit, ~ loop x =?= r
proof                                  // |- forall x r : Unit, ~ loop x =?= r
  pick-any x r                         // x r : Unit |- ~ loop x =?= r
  assume h                             // x r : Unit, h : loop x =?= r |- False
  functional induction h               // x r : Unit, h : loop x =?= r |- False --> False // There's just a single case.
  absurd                               // Theorem proved!
qed

bad (x : Unit) : Bool =
  notb (bad x)
// WARNING: Cannot establish the totality of `bad` with a syntactic check.

theorem bad-diverges :
  forall (x : Unit) (b : Bool),
    ~ bad x =?= b
proof                                  // |- forall (x : Unit) (b : Bool), ~ bad x =?= b
  pick-any x b                         // x : Unit, b : Bool |- ~ bad x =?= b
  assume heq                           // x : Unit, b : Bool, heq : bad x =?= b |- False
  functional induction heq             // x : Unit, b : Bool, heq : bad x =?= b |- False --> False
  absurd
qed

theorem bad-diverges' :
  forall (x : Unit) (b : Bool),
    ~ bad x =?= b
proof                                  // |- forall (x : Unit) (b : Bool), ~ bad x =?= b
  pick-any x b                         // x : Unit, b : Bool |- ~ bad x =?= b
  assume heq                           // x : Unit, b : Bool, heq : bad x =?= b |- False
  apply notb-nofix                     // x : Unit, b : Bool, heq : bad x =?= b |- b === notb b
  totalize                             // x : Unit, b : Bool, heq : bad x =?= b |- b =?= notb b
  chaining
    =?= b
    =?= bad x         by quarantine-rewrite <- heq
    =?= notb (bad x)  by step
    =?= notb b        by quarantine-rewrite heq
qed

silly (b : Bool) : Bool =
  if b then true else silly true
// WARNING: Cannot establish the totality of `silly` with a syntactic check.

// The function is total.
totality silly
proof                                  // |- forall b : Bool, exists r : Bool, silly b =?= r
  pick-any b                           // b : Bool |- exists r : Bool, silly b =?= r
  witness true                         // b : Bool |- silly b =?= true
  cases b with
  | true =>                            // b : Bool |- silly true =?= true
    chaining
      =?= silly true
      =?= true        by step
  | false =>                           // b : Bool |- silly false =?= true
    chaining
      =?= silly false
      =?= silly true   by step
      =?= true         by step
qed

even : Nat -> Bool
| zero => true
| succ n => notb (even n)

search (n : Nat) : Nat =
  if even n then n else search (succ n)
// WARNING: Cannot establish the totality of `search` with a syntactic check.

// Proving `search` total isn't very hard.
totality search
proof                                  // |- forall n : Nat, exists r : Nat, search n =?= r
  pick-any n                           // n : Nat |- exists r : Nat, search n =?= r
  cases even n with
  | true & eqn even-n =>               // n : Nat, even-n : even n === true |- exists r : Nat, search n =?= r
    witness n                          // n : Nat, even-n : even n === true |- search n =?= n
    chaining
      =?= search n
      =?= if even n then n else search (succ n)  by step
      =?= if true then n else search (succ n)    by rewrite even-n
      =?= n
  | false & eqn odd-n =>               // n : Nat, odd-n : even n === false |- exists r : Nat, search n =?= r
    witness succ n                     // n : Nat, odd-n : even n === false |- search n =?= succ n
    chaining
      =?= search n
      =?= if even n then n else search (succ n)                     by step
      =?= if false then n else search (succ n)                      by rewrite odd-n
      =?= search (succ n)
      =?= if notb (even n) then succ n else search (succ (succ n))  by step
      =?= if notb false then succ n else search (succ (succ n))     by rewrite odd-n
      =?= succ n
qed

interleave A (l1 l2 : List A) : List A =
  match l1 with
  | nil => l2
  | cons h t => cons h (interleave l2 t)
// WARNING: Cannot establish the totality of `interleave` with a syntactic check.

// We can prove totality by structural induction, because we could just as well
// have defined this function with structural recursion...
totality interleave
proof                                  // |- forall {A} (l1 l2 : List A), exists r : List A, interleave l1 l2 =?= r
  pick-any A l1                        // A : Type, l1 : List A |- forall l2 : List A, exists r : List A, interleave l1 l2 =?= r
  induction l1 with                    // Termination by syntactic check.
  | nil =>                             // A : Type, l1 : List A |- forall l2 : List A, exists r : List A, interleave nil l2 =?= r
    pick-any l2                        // A : Type, l1 l2 : List A |- exists r : List A, interleave nil l2 =?= r
    witness l2                         // A : Type, l1 l2 : List A |- interleave nil l2 =?= l2
    chaining
      =?= interleave nil l2
      =?= l2                 by step
  | cons h1 (t1 & ind IH) =>           // A : Type, l1 : List A, IH : forall l2, exists r, interleave t1 l2 =?= r |- forall l2, exists r, interleave (cons h1 t1) l2 =?= r
    pick-any l2                        // A : Type, l1 : List A, IH : forall l2, exists r, interleave t1 l2 =?= r, l2 : List A |- exists r, interleave (cons h1 t1) l2 =?= r
    cases l2 with
    | nil =>                           // A : Type, l1 : List A, IH : forall l2, exists r, interleave t1 l2 =?= r, l2 : List A |- exists r, interleave (cons h1 t1) nil =?= r
      witness cons h1 t1               // A : Type, l1 : List A, IH : forall l2, exists r, interleave t1 l2 =?= r, l2 : List A |- interleave (cons h1 t1) nil =?= cons h1 t1
      chaining
        =?= interleave (cons h1 t1) nil
        =?= cons h1 (interleave nil t1)  by step
        =?= cons h1 t1                   by step
    | cons h2 t2 =>                    // A : Type, l1 : List A, IH : forall l2, exists r, interleave t1 l2 =?= r, l2 : List A |- exists r, interleave (cons h1 t1) (cons h2 t2) =?= r
      pick-witness r IH' for IH t2     // A : Type, l1 : List A, IH : forall l2, exists r, interleave t1 l2 =?= r, l2 r : List A, IH' : interleave t1 t2 =?= r
                                       // |- exists r, interleave (cons h1 t1) (cons h2 t2) =?= r
      witness cons h1 (cons h2 r)      // ... |- interleave (cons h1 t1) (cons h2 t2) =?= cons h1 (cons h2 r)
      chaining
        =?= interleave (cons h1 t1) (cons h2 t2)
        =?= cons h1 (interleave (cons h2 t2) t1)  by step
        =?= cons h1 (cons h2 (interleave t1 t2))  by step
        =?= cons h1 (cons h2 r)                   by quarantine-rewrite IH'
qed

// Termination by syntactic check.
interleave' A : List A -> List A -> List A
| nil, l2 => l2
| l1, nil => l1
| cons h1 t1, cons h2 t2 => cons h1 (cons h2 (interleave' t1 t2))

// Another proof, using `interleave'`.
totality interleave
proof                                  // |- forall {A} (l1 l2 : List A), exists r : List A, interleave l1 l2 =?= r
  pick-any A l1 l2                     // A : Type, l1 l2 : List A |- exists r : List A, interleave l1 l2 =?= r
  witness (interleave' l1 l2)          // A : Type, l1 l2 : List A |- interleave l1 l2 =?= interleave' l1 l2
  induction l1 with                    // Termination by syntactic check.
  | nil =>                             // A : Type, l1 l2 : List A |- interleave nil l2 =?= interleave' nil l2
    chaining
      =?= interleave nil l2
      =?= l2                  by step
      =?= interleave' nil l2
  | cons h1 (t1 & ind IH) =>           // A : Type, l1 l2 : List A, IH : forall l2, interleave t1 l2 =?= interleave' t1 l2
                                       // |- interleave (cons h1 t1) l2 =?= interleave' (cons h1 t1) l2
    cases l2 with
    | nil =>                           // ... |- interleave (cons h1 t1) nil =?= interleave' (cons h1 t1) nil
      chaining
        =?= interleave (cons h1 t1) nil
        =?= cons h1 (interleave nil t1)   by step
        =?= cons h1 t1                    by step
        =?= interleave' (cons h1 t1) nil
    | cons h2 t2 =>                    // ..., h2 : A, t2 : List A |- interleave (cons h1 t1) (cons h2 t2) =?= interleave' (cons h1 t1) (cons h2 t2)
      chaining
        =?= interleave (cons h1 t1) (cons h2 t2)
        =?= cons h1 (interleave (cons h2 t2) t1)   by step
        =?= cons h1 (cons h2 (interleave t1 t2))   by step
        =?= cons h1 (cons h2 (interleave' t1 t2))  by quarantine-rewrite (IH t2)
        =?= interleave' (cons h1 t1) (cons h2 t2)
qed

// Fails the syntactic check.
weird-id : Nat -> Nat
| zero => zero
| succ n => succ (weird-id (weird-id n))
// WARNING: Cannot establish the totality of `weird-id` with a syntactic check.

data weird-id-graph : Nat -> Nat -> Prop where
  weird-id-graph-zero : weird-id-graph zero zero
  weird-id-graph-succ : forall n r2 : Nat, (exists r1 : Nat, weird-id-graph n r1 /\ weird-id-graph r1 r2) --> weird-id-graph (succ n) (succ r2)

// We should be able to prove that the graph of `weird-id` is deterministic.
theorem weird-id-det :
  forall x r1 r2 : Nat,
    weird-id x =?= r1 --> weird-id x =?= r2 --> r1 === r2
proof
  pick-any x r1 r2
  assume xr1 xr2                       // x r1 r2 : Nat, xr1 : weird-id x =?= r1, xr2 : weird-id x =?= r2 |- r1 === r2
  totalize                             // x r1 r2 : Nat, xr1 : weird-id x =?= r1, xr2 : weird-id x =?= r2 |- r1 =?= r2
  chaining
    =?= r1
    =?= weird-id x  by quarantine-rewrite <-xr1
    =?= r2          by quarantine-rewrite xr2
qed

// Now it's legal to state theorems about the graph of `weird-id`.
theorem weird-id-aux :
  forall x : Nat, weird-id x =?= x
proof                                  // |- forall x : Nat, weird-id x =?= x
  pick-any x                           // x : Nat |- weird-id x =?= x
  induction x with                     // Termination by syntactic check.
  | zero =>                            // x : Nat |- weird-id zero =?= zero
    chaining
      =?= weird-id zero
      =?= zero           by step
  | succ (n & ind IH) =>               // x : Nat, n : Nat, IH : weird-id n =?= n |- weird-id (succ n) =?= succ n
    chaining
      =?= weird-id (succ n)
      =?= succ (weird-id (weird-id n))  by step
      =?= succ (weird-id n)             by quarantine-rewrite IH
      =?= succ n                        by quarantine-rewrite IH
qed

// Proving totality of `weird-id` (RTP).
// Note an amusing fact: even though this function is not structurally
// recursive, its totality was proven using structural induction
// (in the previous lemma, that is).
totality weird-id
proof                                  // |- forall n : Nat, exists r : Nat, weird-id n =?= r
  pick-any n : Nat                     // n : Nat |- exists r : Nat, weird-id n =?= r
  witness n                            // n : Nat |- weird-id n =?= n
  instantiate weird-id-aux with n      // Theorem proved!
qed

// Now it's legal to state theorems about `weird-id`.
// Moreover, we don't need to reprove the theorem below from scratch.
// We can use the lemma about the graph that we already proved.
theorem weird-id-spec :
  forall n : Nat, weird-id n === n
proof                                  // |- forall n : Nat, weird-id n === n
  pick-any n                           // n : Nat |- weird-id n === n
  totalize                             // n : Nat |- weird-id n =?= n
  instantiate weird-id-aux with n      // Theorem proved!
qed

weird-zero : Nat -> Nat
| zero => zero
| succ n => weird-zero (weird-zero n)
// WARNING: Cannot establish the totality of `weird-zero` with a syntactic check.

theorem weird-zero-aux :
  forall x : Nat, weird-zero x =?= zero
proof                                  // |- forall x : Nat, weird-zero x =?= zero
  pick-any x                           // x : Nat |- weird-zero x =?= zero
  induction x with                     // Termination by syntactic check.
  | zero =>                            // x : Nat |- weird-zero zero =?= zero
    chaining
      =?= weird-zero zero
      =?= zero             by step
  | succ (n & ind IH) =>               // x : Nat, n : Nat, IH : weird-zero n =?= zero |- weird-zero (succ n) =?= zero
    chaining
      =?= weird-zero (succ n)
      =?= weird-zero (weird-zero n)  by step
      =?= weird-zero zero            by quarantine-rewrite IH
      =?= zero                       by step
qed

totality weird-zero
proof                                  // |- forall n : Nat, exists r : Nat, weird-zero n =?= r
  pick-any n : Nat                     // n : Nat |- exists r : Nat, weird-zero n =?= r
  witness zero                         // n : Nat |- weird-zero n =?= zero
  instantiate weird-zero-aux with n    // Theorem proved!
qed

// `>>` is forward function composition
// `<<` is backward function composition
// `|>` is forward function application

funpow A (f : A -> A) : Nat -> A -> A
| zero => id
| succ n => f >> funpow f n

// This function breaks Coq's Function command (I didn't check Equations),
// and is listed as breaking HOL's tool for defining weird functions.
weirdest-zero (n : Nat) : Nat =
  funpow weirdest-zero n zero
// WARNING: Cannot establish the totality of `weirdest-zero` with a syntactic check.

// weirdest-zero 5 = weirdest-zero (weirdest-zero (weirdest-zero (weirdest-zero (weirdest-zero zero))))

theorem weirdest-zero-zero :
  weirdest-zero zero =?= zero
proof
  chaining
    =?= weirdest-zero zero
    =?= funpow weirdest-zero zero zero  by step
    =?= id zero
    =?= zero
qed

theorem weirdest-zero-spec :
  forall x : Nat, weirdest-zero x =?= zero
proof                                  // |- forall x : Nat, weirdest-zero x =?= zero
  pick-any x                           // x : Nat |- weirdest-zero x =?= zero
  induction x with                     // Termination by syntactic check.
  | zero =>                            // x : Nat |- weirdest-zero zero =?= zero
    weirdest-zero-zero                 // Goal solved!
  | succ (n & ind IH) =>               // x n : Nat, IH : weirdest-zero n =?= zero |- weirdest-zero (succ n) =?= zero
    chaining
      =?= weirdest-zero (succ n)
      =?= funpow weirdest-zero (succ n) zero              by step
      =?= (weirdest-zero >> funpow weirdest-zero n) zero  by step
      =?= funpow weirdest-zero n (weirdest-zero zero)     by unfold (>>)
      =?= funpow weirdest-zero n zero                     by quarantine-rewrite weirdest-zero-zero
      =?= weirdest-zero n                                 by step // `step` also works in the reverse direction, i.e. to fold the definition
      =?= zero                                            by quarantine-rewrite IH
qed

// Even weirder...
weirdest-id : Nat -> Nat
| zero => zero
| succ n => succ (funpow weirdest-id n n)

theorem funpow-weirdest-id :
  forall r : Nat, weirdest-id r =?= r -->
    forall x : Nat, funpow weirdest-id x r =?= r
proof
  pick-any r : Nat
  assume hwid : weirdest-id r =?= r
  pick-any x : Nat
  induction x with
  | zero =>
    chaining
      =?= funpow weirdest-id zero r
      =?= id r                       by step
      =?= r
  | succ (n & ind (IH : funpow weirdest-id n r =?= r)) =>
    chaining
      =?= funpow weirdest-id (succ n) r
      =?= (weirdest-id >> funpow weirdest-id n) r  by step
      =?= funpow weirdest-id n (weirdest-id r)     by unfold (>>)
      =?= funpow weirdest-id n r                   by quarantine-rewrite hwid
      =?= r                                        by quarantine-rewrite IH
qed

theorem weirdest-id-spec :
  forall x : Nat, weirdest-id x =?= x
proof
  pick-any x : Nat
  induction x with
  | zero =>
    chaining
      =?= weirdest-id zero
      =?= zero              by step
  | succ (n & ind (IH : weirdest-id n =?= n)) =>
    chaining
      =?= weirdest-id (succ n)
      =?= succ (funpow weirdest-id n n)                   by step
      =?= succ n                                          by quarantine-rewrite (funpow-weirdest-id n IH n)
qed

totality weirdest-id
proof
  proving forall n : Nat, exists r : Nat, weirdest-id n =?= r
  pick-any n
  witness n
  instantiate weirdest-id-spec with n
qed

search (p : Nat -> Bool) (n : Nat) : Nat =
  if p n then n else search p (succ n)

// It's not hard to have some flavour of functional induction...
// but it's hard to have a clever one that isn't just generating
// all the cases under the hood.
// Fixed point induction doesn't seem to be helpful here.
theorem search-aux :
  forall (p : Nat -> Bool) (n r : Nat),
    search p n =?= r --> p r === true
proof                                  // |- forall (p : Nat -> Bool) (n r : Nat), search p n =?= r --> p r === true
  pick-any p n r                       // p : Nat -> Bool, n r : Nat |- search p n =?= r --> p r === true
  assume heq                           // p : Nat -> Bool, n r : Nat, heq : search p n =?= r |- p r === true
  functional induction heq
                                       // p : Nat -> Bool, n r : Nat, heq : n =?= r |- p n === true --> p r === true
  . assume hpn                         // p : Nat -> Bool, n r : Nat, heq : n =?= r, hpn : p n === true |- p r === true
    totalize                           // ... |- p r =?= true
    chaining
      =?= p r
      =?= p n             by quarantine-rewrite heq
      =?= true            by rewrite hpn
                                       // p : Nat -> Bool, n r : Nat, heq : search p (succ n) =?= r |- p n === false --> p r === true --> p r === true
  . assume hpn hpr                     // p : Nat -> Bool, n r : Nat, heq : search p (succ n) =?= r, hpn : p n === false hpr : p r === true |- p r === true
    assumption                         // Theorem proved!
qed

theorem search-concrete :
  forall (p : Nat -> Bool) (n r : Nat),
    search p n =?= r --> exists k : Nat, r === add k n
proof
  pick-any p n r
  assume heq                           // p : Nat -> Bool, n r : Nat, heq : search p n =?= r |- exists k : Nat, r === add k n
  functional induction heq
                                       // p : Nat -> Bool, n r : Nat, heq : n =?= r |- p n === true --> exists k : Nat, r === add k n
  . assume hpn                         // p : Nat -> Bool, n r : Nat, heq : n =?= r, hpn : p n === true |- exists k : Nat, r === add k n
    witness zero                       // p : Nat -> Bool, n r : Nat, heq : n =?= r, hpn : p n === true |- r === add zero n
    simpl                              // p : Nat -> Bool, n r : Nat, heq : n =?= r, hpn : p n === true |- r === n
    totalize                           // p : Nat -> Bool, n r : Nat, heq : n =?= r, hpn : p n === true |- r =?= n
    quarantine-rewrite heq
    prefl
                                       // p : Nat -> Bool, n r : Nat, heq : n =?= r
                                       // |- p n === false --> (exists k : Nat, r === add k (succ n)) --> exists k : Nat, r === add k n
  . assume hpn (witness k such-that IH)// ..., hpn : p n === false, k : Nat, IH : r === add k (succ n) |- exists k : Nat, r === add k n
    witness (succ k)                   // ... |- r === add (succ k) n
    totalize                           // ... |- r =?= add (succ k) n
    quarantine-rewrite IH              // ... |- add k (succ n) =?= add (succ k) n
    // At this point, it's just arithmetic.
qed

// (forall r : Nat, ~ search p n =?= r) --> forall k : Nat, p (add k n) === false
// (exists k : Nat, p (add k n) === true) --> exists r : Nat, search p n =?= r

theorem search-aux :
  forall p : Nat -> Bool,
    (forall n : Nat, exists k : Nat, p (add k n) === true) -->
    forall n : Nat, exists r : Nat, search p n =?= r
proof
  pick-any p
  assume eventually-p
  pick-any n                           // p : Nat -> Bool, eventually-p : (forall n : Nat, exists k : Nat, p (add k n) === true), n : Nat
                                       // |- exists r : Nat, search p n =?= r
  suffices ~ forall r : Nat, ~ search p n =?= r by
    // TODO

  assume diverges : forall r : Nat, ~ search p n =?= r
  proving False

  pick-witness k (h : p (add k n) === true) for eventually-p n
  apply diverges (add n k)

  proving search p n =?= add n k

qed

sub (n : Nat) : Nat -> Nat
| zero => n
| succ m => pred (sub n m)

// A modified Hofstadter H function.
hof : Nat -> Nat
| zero => zero
| succ n => sub n (hof (hof n))
// WARNING: Cannot establish the totality of `hof` with a syntactic check.

// The function is total, but the proof won't go through by structural induction.
fail totality hof
proof                        // |- forall x : Nat, exists r : Nat, hof x =?= r
  pick-any x                 // x : Nat |- exists r : Nat, hof x =?= r
  induction x with           // Termination by syntactic check.
  | zero =>                  // x : Nat |- exists r : Nat, hof zero =?= r
    witness zero             // x : Nat |- exists r : Nat, hof zero =?= zero
    chaining
      =?= hof zero
      =?= zero      by step
  | succ (n & ind (witness rn such-that IH)) =>
                             // x : Nat, n : Nat, rn : Nat, IH : hof n =?= rn |- exists r : Nat, hof (succ n) =?= r
    witness rn               // x : Nat, n : Nat, rn : Nat, IH : hof n =?= rn |- hof (succ n) =?= rn
    step                     // x : Nat, n : Nat, rn : Nat, IH : hof n =?= rn |- sub n (hof (hof n)) =?= rn
    quarantine-rewrite IH    // x : Nat, n : Nat, rn : Nat, IH : hof n =?= rn |- sub n (hof rn) =?= rn
    // Now we're stuck.
abort

data FreeMon A where
  e  : FreeMon A
  i  : A -> FreeMon A
  op : FreeMon A -> FreeMon A -> FreeMon A

norm A : FreeMon A -> FreeMon A
| e => e
| i a => op (i a) e
| op l r =>
  match norm l with
  | e => norm r
  //| i a => op (i a) (norm r)
  | op l1 l2 => op l1 (norm (op l2 r))
// WARNING: Cannot establish the totality of `norm` with a syntactic check.

// The function is total, but the proof won't go through by structural induction.
fail totality norm
proof                                  // |- forall {A} (x : FreeMon A), exists res : FreeMon A, norm x =?= res
  pick-any A x                         // A : Type, x : FreeMon A |- exists res : FreeMon A, norm x =?= res
  induction x with                     // Termination by syntactic check.
  | e =>                               // A : Type, x : FreeMon A |- exists res : FreeMon A, norm e =?= res
    witness e                          // A : Type, x : FreeMon A |- norm e =?= e
    chaining
      =?= norm e
      =?= e       by step
  | i a =>                             // A : Type, x : FreeMon A, a : A |- exists res : FreeMon A, norm (i a) =?= res
    witness op (i a) e                 // A : Type, x : FreeMon A, a : A |- norm (i a) =?= op (i a) e
    chaining
      =?= norm (i a)
      =?= op (i a) e  by step
  | op (l & ind (witness res-l such-that IHl)) (r & ind (witness res-r such-that IHr)) =>
                                       // A : Type, x l r res-l res-r : FreeMon A, IHl : norm l =?= res-l, IHr : norm r =?= res-r |- exists res : FreeMon A, norm (op l r) =?= res
    step                               // ... |- exists res, match norm l with | e => norm r | op l1 l2 => op l1 (norm (op l2 r)) =?= res
    quarantine-rewrite IHl             // ... |- exists res, match res-l with | e => norm r | op l1 l2 => op l1 (norm (op l2 r)) =?= res
    cases res-l with
    | e =>                             // ... |- exists res, match e with | e => norm r | op l1 l2 => op l1 (norm (op l2 r)) =?= res
      step                             // ... |- exists res, norm r =?= res
      witness res-r                    // ... |- norm r =?= res-r
      assumption                       // Goal solved!
    | i a =>                           // ... |- exists res, match i a with | e => norm r | op l1 l2 => op l1 (norm (op l2 r)) =?= res
      step                             // ... |- exists res, False
      lemma contra : ~ norm l =?= (i a) by
        // TODO
      absurd
      contradiction contra IHl
    | op l1 l2 =>                      // ... |- exists res, match op l1 l2 with | e => norm r | op l1 l2 => op l1 (norm (op l2 r)) =?= res
      step                             // ... |- exists res, op l1 (norm (op l2 r)) =?= res
      // At this point we can see that it won't go through by structural induction, as expected.
abort

data type Tree A where
  node : A -> List (Tree A) -> Tree A

tmap A B (f : A -> B) : Tree A -> Tree B
| node x ts => node (f x) (map (tmap f) ts)
// WARNING: Cannot establish the totality of `tmap` with a syntactic check.

forall-list A (P : A -> Prop) : List A -> Prop
| nil => True
| cons h t => P h /\ forall-list P t

theorem list-ind-deep :
  forall {A} (P : A -> Prop) (Q : List A -> Prop),
    Q nil -->
    (forall (h : A) (t : List A), P h --> Q t --> Q (cons h t)) -->
    forall l : List A, forall-list P l --> Q l
proof
  pick-any A P Q
  assume qn qc
  pick-any l
  assume allp
  // Let Γ = A : Type, P : A -> Prop, Q : List A -> Prop, qn : Q nil, qc : (forall (h : A) (t : List A), P h --> Q t --> Q (cons h t)), l : List A, allp : forall-list P l
  induction l with                     // Termination by syntactic check.
  | nil =>                             // Γ |- Q nil
    assumption                         // Goal solved!
  | cons h (t & ind IH) =>             // Γ, h : A, t : List A, IH : Q t |- Q (cons h t)
    apply qc h t
                                       // Γ, h : A, t : List A, IH : Q t |- P h
    . and-left allp                    // Goal solved!
                                       // Γ, h : A, t : List A, IH : Q t |- Q t
    . IH                               // Theorem proved!
qed

theorem tmap-aux :
  forall {A B} (f : A -> B) (ts : List (Tree A)),
    forall-list (\t -> exists r : Tree B, tmap f t =?= r) ts -->
      exists rs : List (Tree B), map (tmap f) ts =?= rs
proof
  pick-any A B f
  // Let Γ = A B : Type, f : A -> B
  apply list-ind-deep {A} (\t -> exists r : Tree B, tmap f t =?= r) (\ts -> exists rs : List (Tree B), map (tmap f) ts =?= rs)
                                       // A B : Type, f : A -> B |- exists rs : List (Tree B), map (tmap f) nil =?= rs
  . witness nil                        // A B : Type, f : A -> B |- map (tmap f) nil =?= nil
    chaining
      =?= map (tmap f) nil
      =?= nil               by step
                                       // A B : Type, f : A -> B |- forall (t : Tree A) (ts : List (Tree A)), (exists r : Tree B, tmap f t =?= r) --> (exists rs : List (Tree B), map (tmap f) ts =?= rs) --> exists rs : List (Tree B), map (tmap f) (cons t ts) =?= rs
  . pick-any t ts                      // A B : Type, f : A -> B, t : Tree A, ts : List (Tree A)
                                       // |- (exists r : Tree B, tmap f t =?= r) --> (exists rs : List (Tree B), map (tmap f) ts =?= rs) --> exists rs : List (Tree B), map (tmap f) (cons t ts) =?= rs
    assume (witness rt such-that IHt) (witness rts such-that IHts)
                                       // A B : Type, f : A -> B, t : Tree A, ts : List (Tree A), rt : Tree B, IHt : tmap f t =?= rt, rts : List (Tree B), IHts : map (tmap f) ts =?= rts |- exists rs : List (Tree B), map (tmap f) (cons t ts) =?= rs
    witness (cons rt rts)              // ... |- map (tmap f) (cons t ts) =?= cons rt rts
    chaining
      =?= map (tmap f) (cons t ts)
      =?= cons (tmap f t) (map (tmap f) ts)  by step
      =?= cons rt (map (tmap f) ts)          by quarantine-rewrite IHt
      =?= cons rt rts                        by quarantine-rewrite IHts
qed

fail theorem Tree-ind-deep :
  forall {A} (P : A -> Prop) (Q : Tree A -> Prop),
    (forall (x : A) (ts : List (Tree A)), P x --> forall-list Q ts --> Q (node x ts)) -->
      forall t : Tree A, Q t
proof
  pick-any A P Q
  assume all
  pick-any t
abort

fail totality tmap
proof                                  // |- forall {A B} (f : A -> B) (t : Tree A), exists r : Tree B, tmap f t =?= r
  pick-any A B f t                     // A B : Type, f : A -> B, t : Tree A |- exists r : Tree B, tmap f t =?= r
  cases t with
  | node x ts =>                       // A B : Type, f : A -> B, t : Tree A, x : A, ts : List (Tree A) |- exists r : Tree B, tmap f (node x ts) =?= r
    suffices exists rs : List (Tree B), map (tmap f) ts =?= rs
      assume (witness rs such-that h)
                                        // A B : Type, f : A -> B, t : Tree A, x : A, ts : List (Tree A), rs : List (Tree B), h : map (tmap f) ts =?= rs |- exists r : Tree B, tmap f (node x ts) =?= r
      witness node (f x) rs              // ... |- tmap f (node x ts) =?= node (f x) rs
      chaining
        =?= tmap f (node x ts)
        =?= node (f x) (map (tmap f) ts)  by step
        =?= node (f x) rs                 by quarantine-rewrite h
                                         // A B : Type, f : A -> B, t : Tree A, x : A, ts : List (Tree A) |- exists rs : List (Tree B), map (tmap f) ts =?= rs
    apply tmap-aux                       // ... |- forall-list (\t -> exists r : Tree B, tmap f t =?= r) ts
    induction ts with                    // Termination by syntactic check.
    | nil =>                             // ... |- forall-list (\t -> exists r : Tree B, tmap f t =?= r) nil
      simpl                              // ... |- True
      trivial                            // Goal solved!
    | cons // TODO
abort

data type RoseTree A where
  empty : A -> RoseTree A
  node  : List (RoseTree A) -> RoseTree A

data type Queue A where
  nil  : Queue A
  cons : Option A -> Queue (Prod A A) -> Queue A

data type Bush A where
  nil  : Bush A
  cons : A -> Bush (Bush A) -> Bush A

bushmap A B (f : A -> B) : Bush A -> Bush B
| nil => nil
| cons h t => cons (f h) (bushmap (bushmap f) t)