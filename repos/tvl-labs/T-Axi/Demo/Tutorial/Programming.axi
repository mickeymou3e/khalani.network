// In this file, we will describe the basics of programming.
// Since the programming layer is much more amorphous and
// underspecified in comparison to the logic layer, this part
// of the demo will be much further from the final product
// than the logical part. But we must show something, so we
// will stick to a core language in this file and describe
// its possible extensions with various language features
// in separate files.

// This core language consists of:
// - A mechanism for defining new programs and types.
// - Base types.
// - Functions.
// - Polymorphism.
// - Records.
// - Inductive data types and recursive functions.
// - Typeclasses.
// - Proof principles needed to reason about the above.

// We will NOT describe the following:
// - Modules.
// - Monads, effects or other means of interacting with the blockchain.
// - Blockchain specific features, like constraints or pub-sub.
// - Cryptography.

// In later files, we will describe features such as:
// - Dependent types.
// - Structural records and variants (in the core language, they are nominal).
// - Termination checker.
// - Linear typing.
// - Subtyping.
// - And possibly more...

// The syntax for a definition is `name : type = body`.
answer : Int32 = 42

// Type annotations at the top-level are mandatory, so the code below
// results in an error, even though it's easy to infer the type.
missingAnnotationError = 42

// To replace a definition with its body in a proof, we can use `unfold`.
theorem unfold-example : answer === 42
proof              // |- answer === 42
  unfold answer    // |- 42 === 42
  refl
qed

// In proofterm style, it doesn't make much sense to use `unfold`,
// because its results are only visible in the goal, which is only
// visible in tactic mode.
theorem unfold-example-term-style : (answer === 42) =
  unfold answer in
    refl

// To define a type synonym, we can use the syntax `type name = body`.
type MediumSizedInt = Int32

// We can use such a type just as any other.
anotherAnswer : MediumSizedInt = 42

// To see that `MediumSizedInt` is considered equal to `Int32`, it
// suffices to state the following theorem. If these types were
// different, we would get a type error, but the theorem is accepted
// and we can proceed to prove it.
// Also note that to `unfold` multiple definitions, we separate their
// names with commas.
theorem type-synonym-example : anotherAnswer === answer
proof
  unfold anotherAnswer, answer
  refl
qed

// The exact set of base types is left more or less unspecified.
// I imagine there will be `Int`s, `Uint`s and `Float`s of multiple sizes,
// as well as `String`s and `Char`acters, together with support for their
// literals. On the blockchain side, there might be types for `Address`es,
// `Hash`es, etc.

// `Int`s of various sizes.
int8Example  : Int8  = -100
int16Example : Int16 = 0
int32Example : Int32 = 42
int64Example : Int64 = 2 ^ 32

// `Uint`s of various sizes.
uint8Example :  Uint8  = 42
uint16Example : Uint16 = 42
uint32Example : Uint32 = 42
uint64Example : Uint64 = 42

// `Float`s of various sizes.
float8Example  : Float8  = 1.0
float16Example : Float16 = 2.8e13
float32Example : Float32 = 0.4e-6
float64Example : Float64 = NaN

// Characters.
charExample : Char = '\n'

// Strings.
stringExample : String = "where lambo?"

// `t : A` is a type annotation. We can use it to give a hint to make
// the type checker think that `t` has type `A`, but only if it can
// check that this is indeed the case.
// As an example, we can use an annotation to make the type checker
// think that `1` is a float, even though it is ordinarily an int.
annotationExample : Float32 =
  1 : Float32

// The syntax for anonymous functions is `\ x : A -> e`.
idNat : Nat -> Nat =
  \ n : Nat -> n

// To simplify an expression to its result, use the `simpl` tactic.
theorem simpl-example : idNat 42 === 42
proof             // |- idNat 42 === 42
  unfold idNat    // |- (\ n : Nat -> n) 42 === 42
  simpl           // |- 42 === 42
  refl
qed

// `simpl` doesn't make much sense in proofterm style,
// because it only affects the goal.
theorem simpl-exampl-term-style : (idNat 42 === 42) =
  unfold idNat in
    simpl in
      refl

// When a definition needs to be unfolded to perform simplification,
// `simpl` can do it.
theorem simpl-without-unfold : idNat 42 === 42
proof                    // |- idNat 42 === 42
  simpl                  // |- 42 === 42
  refl
qed

// Of course since both `unfold` and `simpl` work only to change how the goal
// is displayed, to prove the above theorem it suffices to use `refl`.
theorem refl-is-enough : idNat 42 === 42
proof
  refl
qed

// We don't need to put a type annotation on the variable if it can be inferred.
idNat' : Nat -> Nat =
  \ n -> n

// Even though we did not write the annotation on the variable,
// it will be present when the definition is unfolded.
theorem no-annotation-desugared : idNat' === (\ n : Nat -> n)
proof                       // |- idNat' === (\ n : Nat -> n)
  unfold idNat'             // |- (\ n : Nat -> n) === (\ n : Nat -> n)
  refl
qed

// We can make the definition shorter by putting all arguments on
// the left-hand side.
idNat'' (n : Nat) : Nat = n

// The short definition produces the same term as the other two definitions.
theorem short-definition-desugared : idNat'' === (\ n : Nat -> n)
proof                          // |- idNat'' === (\ n : Nat -> n)
  unfold idNat''               // |- (\ n : Nat -> n) === (\ n : Nat -> n)
  refl
qed

// When a function has more than one argument, they are surrounded
// with parentheses.
const : Int32 -> String -> Int32 =
  \ (a : Int32) (b : String) -> a

// When there are multiple arguments of the same type, they can be
// put together in a single pair of parentheses.
constInt32 : Int32 -> Int32 -> Int32 =
  \ (x y : Int32) -> x

// To define a polymorphic function, we use the quantifier `forall A`
// in the function's type. Note that in the term, we don't need to bind the
// type with `\` - type abstractions are implicit by default.
id : forall A, A -> A =
  \ x : A -> x

// Just as for monomorphic functions, we can put all the arguments on the
// left-hand side to make the definition much shorter.
id' A (x : A) : A = x

// When using a polymorphic function, we don't need to provide the type
// argument explicitly - it is inferred automatically. So to apply `id`
// to an argument `n`, we write just `id n`.
idNat-from-id : Nat -> Nat =
  \ n : Nat -> id n

// However, we can apply the type argument explicitly if we want to.
// To do so, we prefix it with the symbol `@`.
idNat-from-id' : Nat -> Nat =
  id @Nat

// Alternatively, we can prefix the function `id` itself with `@@` to turn
// all implicit arguments into explicit arguments.
idNat-from-id'' : Nat -> Nat =
  \ n : Nat -> @@id Nat n

// Last but not least, note that implicit arguments can also be inferred from
// context, even when the function is not applied to any (explicit) arguments.
idNat-from-id''' : Nat -> Nat =
  id

// If we don't want to make an argument implicit, we can make it explicit
// by prefixing it with `@` in the quantifier. However, in such a case we
// need to also explicitly bind it in the definition body.
explicit-id : forall @A, A -> A =
  \ @A (x : A) -> x

// When using `explicit-id`, we need to provide the type argument explicitly.
idNat-from-explicit-id : Nat -> Nat
  explicit-id Nat

// Note that the explicit argument can be annotated.
explicit-id-annotated : forall @A, A -> A =
  \ @(A : Type) (x : A) -> x

// If we want to avoid binding `A` in the body, but we still want it explicit,
// we can move it to the left of the colon.
explicit-id-args @A (x : A) : A = x

// To state a theorem about a polymorphic function,
// we can use `forall` as a quantifier in the logic.
theorem id-spec :
  forall {A} (x : A),
    id x === x
proof
  pick-any A x
  refl
qed

// Functions enjoy definitional extensionality, i.e. a function
// `f` is equal to `\ x -> f x` and this can be proved with `refl`.
theorem definitional-funext-example :
  forall {A B} (f : A -> B),
    f === \ x : A -> f x
proof
  pick-any A B f
  refl
qed

// If two functions return the same result for all arguments, they are equal.
// This principle is called (propositional) function extensionality.
// Formally, `funext x in e` proves `f === g` when `e` proves `f x === g x`
// in the context extended with `x : A`.
theorem funext-example :
  forall {A B} (f g : A -> B),
    (forall x : A, f x === g x) --> f === g
proof                                  // |- forall {A B} (f g : A -> B), (forall x : A, f x === g x) --> f === g
  pick-any A B f g                     // A B : Type, f g : A -> B |- (forall x : A, f x === g x) --> f === g
  assume eq                            // A B : Type, f g : A -> B, eq : forall x : A, f x === g x |- f === g
  funext x                             // A B : Type, f g : A -> B, eq : forall x : A, f x === g x, x : A |- f x === g x
  instantiate eq                       // Theorem proved!
qed

// We can use `let` bindings.
letExample (a b : Float32) : Float32 =
  let x = a + b in
    let y = a - b in
      x * y

// In case we have more than one `let` binding, we can group them in a block.
letBlockExample (a b : Float32) : Float32 =
  let
    x = a + b
    y = a - b
  in
    x * y

// We may put type annotations on variables in `let`s.
annotatedLetExample (a b : Float32) : Float32 =
  let
    x : Float32 = a + b
    y : Float32 = a - b
  in
    x * y

// When we encounter a `let` binding in a proof, we can get rid of it
// with `simpl`.
theorem let-computation-example :
  forall {A} (e1 e2 : A),
    (let x = e1 in e2) === (\ x -> e2) e1
proof
  pick-any A e1 e2  // A : Type, e1 e2 : A |- (let x = e1 in e2) === (\ x -> e2) e1
  simpl             // A : Type, e1 e2 : A |- (\ x -> e2) e1 === (\ x -> e2) e1
  refl
qed

// To define a record type, we need to provide its name together with
// a list of its fields and their types.
record type Point where
  x : Float32
  y : Float32

// We can access record fields using the familiar dot syntax.
dotSyntaxExample (p : Point) : Float32 = p.x

// However, presumably we can also access fields using
// ordinary function application syntax.
alternativeFieldAccessExample (p : Point) : Float32 = x p

// In case you wonder about the type correctness of the above example,
// in a record type `T` with field `f : A`, `f` is a function of type `T -> A`.
fieldTypeExample : Point -> Float32 = x

// As a third possibility, we can `open` a record and refer to the fields
// directly, without dot syntax or having to apply them.
recordOpeningExample (p : Point) : Float32 =
  open p in x

// We can build records with record literal syntax.
recordLiteralSyntaxExample : Point = record where
  x = 1.0
  y = 1e10

// We can also write record literals inline.
inlineRecordLiteralExample : Point = record {x = 1.0; y = 1e10}

// Records, similarly to functions, enjoy definitional extensionality.
theorem definitional-record-extensionality-example :
  forall p : Point,
    p === record {x = p.x; y = p.y}
proof
  pick-any p
  refl
qed

// Because of the above, we can prove record equality component-wise.
theorem record-equality :
  forall p1 p2 : Point,
    p1.x === p2.x --> p1.y === p2.y --> p1 === p2
proof
  pick-any p1 p2
  assume (eqx : p1.x === p2.x) (eqy : p1.y === p2.y)
  chaining
    === p1
    === record {x = p1.x; y = p1.y}
    === record {x = p2.x; y = p1.y}  by rewrite eqx
    === record {x = p2.x; y = p2.y}  by rewrite eqy
    === p2
qed

// When we need to update a record, we can use the syntax
// `record r with {x1 = e1; ...; xN = eN}`.
move-x (dist : Float32) (p : Point) : Point =
  record p with {x = p.x + dist}

theorem move-x-spec :
  forall (dist : Float32) (p : Point),
    move-x dist p === record {x = p.x + dist; y = p.y}
proof
  pick-any dist p
  apply (instantiate record-equality with _ _)
  . simpl
    refl
  . refl
qed

// We can define another record type, `Point3D`, whose field names overlap
// with fields names of `Point`. At the top level this causes some ambiguity,
// but we will allow to disambiguate based on types or explicitly.
record type Point3D where
  x : Float32
  y : Float32
  z : Float32

// We can explicitly disambiguate between the `x` from `Point` and the
// one from `Point3D` using dot syntax.
explicitDisambiguationExample : Point3D -> Float32 =
  Point3D.x

// We can also disambiguate implicitly, based on types.
implicitDisambiguationExample : Point3D -> Float32 = x

// Any kind of conversion between these two records must be performed
// manually.
projectToXY (p : Point3D) : Point =
  record {x = p.x; y = p.y}

embedInXYZ (p : Point) : Point3D =
  record {x = p.x; y = p.y; z = 0.0}

// Records can be polymorphic, just like functions.
// We can implement pairs as polymorphic records.
record type Prod A B where
  fst : A
  snd : B

// We can also use tuple syntax for records, but only if
// the type of the record can be inferred. In particular,
// this can always be done at the top level.
tupleSyntaxExample : Prod Int32 Float32 = (42, 3.14)

// As an alternative way of eliminating records, we can
// pattern match on them (using record literal syntax).
swapRecord A B : Prod A B -> Prod B A
| record {fst = x; snd = y} => record {fst = y; snd = x}

// Since a typical record pattern repeats all the field names twice,
// like in `record {x1 = x1; ...; xn = xn}`, it makes sense to have some
// special syntax to avoid this (it is a feature known as "record puns").
swapRecord' A B : Prod A B -> Prod B A
| record {fst; snd} => record {fst = snd; snd = fst}

// Pattern matching is also allowed using the tuple syntax.
swapTuple A B : Prod A B -> Prod B A
| (x, y) => (y, x)

// We can also pattern match on a record in a `let` binding.
swapLet A B (p : Prod A B) : Prod B A =
  let (x, y) = p in (y, x)

// `let`s support all pattern matching syntaxes for records.
swapLet' A B (p : Prod A B) : Prod B A =
  let record {fst; snd} = p in (snd, fst)

// We can define data types using the keyword `data type`.
// Note that we use `yes` and `no` as names of the booleans, to make it easier
// for newcomers not to confuse them with the propositions `True` and `False`.
data type Bool where
  no
  yes

// We can define functions out of data types by pattern matching.
// The syntax is OCaml-like:
// ```
// match t with
// | pat1 => expr1
//    ⋮
// | patN => exprN
// ```
notb (b : Bool) : Bool =
  match b with
  | no  => yes
  | yes => no

// However, since a `match` is very often the first thing we'll be
// doing when defining a function, there is a shorthand for this
// situation: we omit then final `=` and start listing the branches
// right away. Only the arguments that are not bound on the left of
// the final `:` are being matched.
notb' : Bool -> Bool
| no  => yes
| yes => no

// We can reason by cases on elements of data types using `cases`.
// The syntax is analogous as for pattern matching, i.e.
// ```
// cases t with
// | pat1 => proofterm1
//    ⋮
// | patN => prooftermN
// ```
theorem notb-notb :
  forall b : Bool,
    notb (notb b) === b
proof                    // |- forall b : Bool, notb (notb b) === b
  pick-any b             // b : Bool |- notb (notb b) === b
  cases b with
  | no =>                // b : Bool |- notb (notb no) === no
    simpl                // b : Bool |- no === no
    refl
  | yes =>               // b : Bool |- notb (notb yes) === yes
    simpl                // b : Bool |- yes === yes
    refl
qed

// In proofterm style, the above proof looks as follows.
theorem notb-notb-term-style :
  (forall b : Bool,
    notb (notb b) === b) =
      pick-any b in
        match b with
        | no  => simpl in refl
        | yes => simpl in refl

// We can match more than one argument at a time.
andb : Bool -> Bool -> Bool
| no , _   => no
| _  , no  => no
| yes, yes => yes

// Similarly, we can reason by cases on more than one term.
theorem andb-comm :
  forall b1 b2 : Bool,
    andb b1 b2 === andb b2 b1
proof
  pick-any b1 b2
  cases b1, b2 with
  | no , no  => refl
  | no , yes => refl
  | yes, no  => refl
  | yes, yes => refl
qed

// For `Bool`, we can use the more traditional `if` instead of `match`.
orb (b1 b2 : Bool) : Bool =
  if b1 then yes else b2

// When proving theorems about `if`s, we still use `cases`.
theorem orb-no-r :
  forall b : Bool,
    orb b no === b
proof               // |- forall b : Bool, orb b no === b
  pick-any b        // b : Bool |- orb b no === b
  unfold orb        // b : Bool |- if b then yes else no === b
  cases b with
  | no  =>          // b : Bool |- if no then yes else no === no
    simpl           // b : Bool |- no === no
    refl
  | yes =>          // b : Bool |- if yes then yes else no === yes
    simpl           // b : Bool |- yes === yes
    refl
qed

// In fact, `if` is equal to the appropriate `match`.
theorem if-example :
  forall (b : Bool) {A} (x y : A),
    (if b then x else y)
      ===
    match b with
    | no  => y
    | yes => x
proof
  pick-any b A x y
  cases b with
  | no  => refl
  | yes => refl
qed

// Data types can be polymorphic.
// We use the keyword `of` to declare the constructors' argument types,
// if there are any.
data type Option A where
  none
  some of A

// For a data type `T` with a constructor `c of A`,
// `c` is a function of type `A -> T`.
constructorTypeExample : forall A, A -> Option A = some

// We can use `if` not only with `Bool`, but with any two-constructor data type.
// Moreover, there's a special version of `if`, `if t is pat then t1 else t2`,
// which acts like pattern matching with a single branch, including binding variables
// in the `then`-branch of the `if`.
orElse A (x : Option A) (default : A) : A =
  if x is some a then a else default

// Proving theorems about this fancy `if` is still done using `cases`.
// `is` is equivalent to the following `match`.
theorem is-Option-spec :
  forall {A B} (f : A -> B) (x : Option A) (a : A) (b : B),
    (if x is some a then f a else b)
      ===
    match x with
    | none => b
    | some a => f a
proof
  pick-any A B f x a b
  cases x with
  | none => refl
  | some a => refl
qed

// In case you were wondering, the full syntax for defining data types
// is as follows:
// ```
// data type TypeName where
//   constructor1 : ArgType1_1 -> ... -> ArgType1_M1 -> TypeName
//      ⋮
//   constructorN : ArgTypeN_1 -> ... -> ArgTypeN1_MN -> TypeName
// ```
// However, this full syntax is quite lengthy, and that's why we've
// been using shorthands so far. Let's see the full syntax in action
// and all the possible shorthands on a simple example.

// In the full syntax, we write the full types of all constructors.
data type Sum A B where
  inl : A -> Sum A B
  inr : B -> Sum A B

// Similarly to top-level definitions, we can move the arguments to
// the left of the colon.
data type Sum A B where
  inl (a : A) : Sum A B
  inr (b : B) : Sum A B

// If the constructor arguments are on the left, we can omit the
// codomain of the constructor, since it's always the same as the
// type we're defining anyway.
data type Sum A B where
  inl (a : A)
  inr (b : B)

// Last but not least, if we only want to give the types of the constructors'
// arguments, we can use `of`.
data type Sum A B where
  inl of A
  inr of B

// All the above definitions of `Sum` are the same. The only possible difference
// could be that with the arguments named, some tools might use these names for
// tasks like generating code templates or something. Or maybe they can serve as
// style guide for copilot AIs.

// An example function on sums.
swapSum A B : Sum A B -> Sum B A
| inl a => inr a
| inr b => inl b

// The proofs go throught using `cases`, as before.
theorem swapSum-spec :
  forall {A B} (x : Sum A B),
    swapSum (swapSum x) === x
proof
  pick-any A B x
  cases x with
  | inl a => refl
  | inr b => refl
qed

// Data type can be recursive (or rather, inductive).
// Lists, the bread and butter of functional programming,
// can be defined as follows.
data type List A where
  nil
  cons (h : A) (t : List A)

// There's nothing special about defining recursive functions.
// We can perform a recursive call whenever we want.
map A B (f : A -> B) : List A -> List B
| nil      => nil
| cons h t => cons (f h) (map f t)

// Proving theorems about recursive functions requires induction.
// The full syntax is very similar to `cases`:
// ```
// induction t with
// | c_1 a_1_1 ... a_1_m => e_1
//    ⋮
// | c_n a_n_1 ... a_n_m => e_n
// ```
// This proves `P t` provided that
// `e_1` proves `P (c_1 ...)`, ..., and that
// `e_n` proves `P (c_n ...)`.
// However, note one special thing: for recursive arguments (like `t` below),
// the pattern becomes `(t & ind IH)`, which means that we name not only `t`, but
// also the corresponding induction hypothesis.

theorem map-id :
  forall {A} (l : List A),
    map id l === l
proof                      // |- forall {A} (l : List A), map id l === l
  pick-any A l             // A : Type, l : List A |- map id l === l
  induction l with
  | nil =>                 // A : Type, l : List A |- map id nil === nil
    simpl                  // A : Type, l : List A |- nil === nil
    refl
  | cons h (t & ind IH) => // A : Type, l : List A, h : A, t : List A, IH : map id t === t |- map id (cons h t) === cons h t
    simpl                  // A : Type, l : List A, h : A, t : List A, IH : map id t === t |- cons h (map id t) === cons h t
    rewrite IH             // A : Type, l : List A, h : A, t : List A, IH : map id t === t |- cons h t === cons h t
    refl
qed

// In proofterm style, the above proof looks as follows.
theorem map-id-term-style :
  (forall {A} (l : List A),
    map id l === l) =
      pick-any A l in
        induction l with
        | nil => refl
        | cons h (t & ind IH) => rewrite IH in refl

// If you think the first proof was ugly, we can also use chaining.
// Proofs that use chaining are harder to write, as there's much
// more writing involved, but easier to read, because the result of
// all intermediate steps in the proof are readily visible. When using
// chaining, we are really performing the same proof steps as before
// (as can be seen in the `by` clauses), but additionally their effect
// on the conclusion also gets recorded, instead of being left implicit.
theorem map-id-chaining :
  forall {A} (l : List A),
    map id l === l
proof
  pick-any A l
  induction l with
  | nil =>
    chaining
      === map id nil
      === nil
  | cons h (t & ind IH) =>
    chaining
      === map id (cons h t)
      === cons h (map id t)
      === cons h t           by rewrite IH
qed

// Let's see some more proofs by induction for the sake of examples.
theorem map-comp :
  forall {A B C} (f : A -> B) (g : B -> C) (l : List A),
    map (\ a -> g (f a)) l === map g (map f l)
proof
  pick-any A B C f g l
  induction l with
  | nil =>
    chaining
      === map (\ a -> g (f a)) nil
      === nil
  | cons h (t & ind IH) =>
    chaining
      === map (\ a -> g (f a)) (cons h t)
      === cons (g (f h)) (map (\ a -> g (f a)) t)
      === cons (g (f h)) (map g (map f t))         by rewrite IH
      === map g (map f (cons h t))
qed

// Often, we will want another name for a variant of an already existing theorem.
// A natural name for the right-to-left direction of the above theorem `map-comp`
// is `map-map`.
theorem map-map :
  forall {A B C} (f : A -> B) (g : B -> C) (l : List A),
    map g (map f l) === map (\ a -> g (f a)) l
proof
  pick-any A B C f g l
  rewrite (instantiate map-comp with f g l)
  refl
qed

// When we want to do recursion on an argument which is followed by more
// arguments, we can't use our convenience syntax and must resort to the
// more primitive `match`.
app A (l1 l2 : List A) : List A =
  match l1 with
  | nil      => l2
  | cons h t => cons h (app t l2)

// List concatenation is associative.
theorem app-assoc :
  forall {A} (l1 l2 l3 : List A),
    app (app l1 l2) l3 === app l1 (app l2 l3)
proof
  pick-any A l1
  induction l1 with
  | nil =>
    chaining
      === app (app nil l2) l3
      === app nil (app l2 l3)
  | cons h (t & ind IH) =>
    chaining
      === app (app (cons h t) l2) l3
      === cons h (app (app t l2) l3)
      === cons h (app t (app l2 l3))  by rewrite IH
      === app (cons h t) (app l2 l3)
qed

// Reversing a list.
rev A : List A -> List A
| nil      => nil
| cons h t => app (rev t) (cons h nil)

// Reversing a concatenation of two list results in a concatenation of
// the reversed lists in reverse order.
theorem rev-app :
  forall {A} (l1 l2 : List A),
    rev (app l1 l2) === app (rev l2) (rev l1)
proof
  pick-any A l1 l2
  induction l1 with
  | nil =>
    chaining
      === rev (app nil l2)
      === rev l2
      === app (rev l2) nil  by rewrite <-app-nil-r
  | cons h (t & ind IH) =>
    chaining
      === rev (app (cons h t) l2)
      === rev (cons h (app t l2))
      === app (rev (app t l2)) (cons h nil)
      === app (app (rev l2) (rev t)) (cons h nil)        by rewrite IH
      === app (app (rev l2) (app (rev t) (cons h nil)))  by rewrite app-assoc
      === app (app (rev l2) (rev (cons h t)))
qed

// The core language also has a simple type class mechanism.
// Type classes are more or less equivalent to records with
// type parameters, with some special syntax to make use of
// them in type signatures.
// `Eq` is a class whose types have a function that checks
// if two elements of the type are equal.
class Eq A where
  eqb : A -> A -> Bool

// We can define an instance of the class for a particular type
// by defining all the functions the class requires.
// Note that when defining the class's fields, the syntax is the
// same as at the top-level. For example, we must give a full type
// annotation to each function, and we can use the shorthand syntax
// for pattern matching.
instance Eq Bool where
  eqb : Bool -> Bool -> Bool
  | no , no  => yes
  | yes, yes => yes
  | _  , _   => no

// We can define conditional instances that depend on the existence
// of instances of the same or other classes.
// Note that in our example, our use of `eqb` in `eqb x y` refers to
// the `eqb` for type `A` which comes from the instance of `Eq` for `A`
// that our instance depends on.
instance Eq (Option A) <= Eq A where
  eqb : Option A -> Option A -> Bool
  | none  , none   => yes
  | some x, some y => eqb x y
  | _     , _      => no

// Conditional instances can have more than one dependency.
instance Eq (Sum A B) <= Eq A, Eq B where
  eqb : Sum A B -> Sum A B -> Bool
  | inl a1, inl a2 => eqb a1 a2
  | inr b1, inr b2 => eqb b1 b2
  | _     , _      => no

// Implementations of class functions can be recursive.
// Of course they can!
instance Eq (List A) <= Eq A where
  eqb : List A -> List A -> Bool
  | nil, nil => yes
  | cons h1 t1, cons h2 ht => andb (eqb h1 h2) (eqb t1 t2)
  | _, _ => no

// We can define functions which work with all types that belong to a given
// class. The syntax for a type class argument is `[Eq A]`, i.e. class
// instances are put in square brackets.
// As an example, we can define a function that checks if two elements of a
// type are not equal, provided that the type supports the `Eq` class.
neqb A [Eq A] (x y : A) : Bool =
  notb (eqb x y)

// When not on the left-hand side of the colon, class instances are put in
// a `forall`, also with square brackets.
neqb : forall A [Eq A], A -> A -> Bool =
  \ x y : A -> notb (eqb x y)

// Now, a question arises: what can we prove about functions that make
// use of type classes? Not much, it turns out. We might think `eqb` is
// a function for deciding equality, but in reality it could just as well
// be any random function that does nothing useful.
// In the example below, we define an instance of `Eq` for `Uint8` (one of
// our base types), in which `eq` always returns `no`. There's nothing that
// would force us to return `yes` when the arguments actually are equal.
instance Eq Uint8 where
  eqb (x y : Uint8) : Bool =
    no

// However, not all hope is lost. Besides ordinary "programming" type classes,
// there are also type classes in the logical layer, and they can force their
// member functions to satisfy various properties, which we'll make good use of.
// By the way, just as we can define conditional class instances, we can define
// classes that can require their arguments to belong to some other class.
class LawfulEq A <: Eq A where
  eqb-spec1 : forall x y : A, eqb x y === yes --> x === y
  eqb-spec2 : forall x y : A, x === y --> eqb x y === yes

theorem eqb-diag :
  forall {A} [LawfulEq A] (l : List A),
    eqb l l === yes
proof
  pick-any A l
  induction l with
  | nil =>
    refl
  | cons h (t & ind IH) =>
    chaining
      === eqb (cons h t) (cons h t)
      === andb (eqb h h) (eqb t t)
      === andb yes (eqb t t)       by rewrite (apply (instantiate eqb-spec2 with h h) refl)
      === andb yes yes             by rewrite IH
      === yes
qed

discriminator : Bool -> Prop
| yes => True
| no => False

theorem no-not-yes :
  no === yes --> False
proof
  assume h : no === yes
  proving False
  proving discriminator no
  rewrite h
  proving discriminator yes
  proving True
  trivial
qed

theorem andb-yes-inv :
  forall b1 b2 : Bool,
    andb b1 b2 === yes -> b1 === yes /\ b2 === yes
proof
  pick-any b1 b2
  cases b1, b2 with
  | yes, yes =>
    assume _
    both refl refl
  | no, _   =>
    assume h : no === yes
    absurd
    no-not-yes
    assumption
  | _, no =>
    assume h : no === yes
    absurd
    no-not-yes
    assumption
qed

instance LawfulEq (List A) <= LawfulEq A where
  theorem eqb-spec1 :
    forall l1 l2 : List A,
      eqb l1 l2 === yes --> l1 === l2
  proof
    pick-any l1 l2
    assume h : eqb l1 l2 === yes
    induction l1 with
    | nil =>
      cases l2 with
      | nil =>
        refl
      | cons h2 t2 =>
        absurd
        no-not-yes
        assumption
    | cons h1 (t1 & ind IHt1) =>
      cases l2 with
      | nil =>
        absurd
        no-not-yes
        assumption
      | cons h2 t2 =>
        // h : andb (eqb h1 h2) (eqb t1 t2) === yes
        proving cons h1 t1 === cons h2 t2
        lemma eq-heads : h1 === h2 by
          apply eqb-spec1
          proving eqb h1 h2 === yes
          and-left (andb-yes-inv (eqb h1 h2) (eqb t1 t2) h)
        lemma eq-tails : t1 === t2 by
          apply IHt1 t2
          proving eqb t1 t2 === yes
          and-right (andb-yes-inv (eqb h1 h2) (eqb t1 t2) h)
        chaining
          === cons h1 t1
          === cons h2 t1  by rewrite eq-heads
          === cons h2 t2  by rewrite eq-tails
  qed

  theorem eqb-spec2 :
    forall l1 l2 : List A,
      l1 === l2 --> eqb l1 l2 === yes
  proof
    pick-any A _ l1 l2
    assume h : l1 === l2
    chaining
      === eqb l1 l2
      === eqb l2 l2  by rewrite h
      === yes        by rewrite (instantiate eqb-diag with A l2)
  qed

// With lawful classes, we can indeed do some proving. As an example, let's prove
// an obvious specification of `neqb`.
theorem neqb-spec :
  forall {A} [LawfulEq A] (x y : A),
    neqb x y === yes <--> ~ (x === y)
proof                 // |- forall {A} [LawfulEq A] (x y : A), neqb x y === yes <--> ~ (x === y)
  pick-any A _ x y    // A : Type, LawfulEq A, x y : A |- neqb x y === yes <--> ~ (x === y)
  unfold neqb         // A : Type, LawfulEq A, x y : A |- notb (eqb x y) === yes <--> ~ (x === y)
  both
  . assume (hnot : notb (eqb x y) === yes) (heq : x === y)
                      // A : Type, LawfulEq A, x y : A, hnot : notb (eqb x y) === yes, heq : x === y |- False
qed