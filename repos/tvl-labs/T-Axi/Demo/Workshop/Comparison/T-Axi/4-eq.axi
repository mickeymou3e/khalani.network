
type N

declaration f h : N -> N
declaration g : N -> N -> N


theorem fcong-g :
  forall a b c d : N,
    a === c --> b === d --> g a b === g c d
proof
  pick-any a b c d
  assume (ac : a === c) (bd : b === d)
  rewrite ac, bd
  refl
qed

theorem fcong-g-pattern :
  forall a b c d : N,
    a === c --> b === d --> g a b === g c d
proof
  pick-any a b c d
  assume ===> ===>
  refl
qed

theorem fcong-g-chaining :
  forall a b c d : N,
    a === c --> b === d --> g a b === g c d
proof
  pick-any a b c d
  assume (ac : a === c) (bd : b === d)
  chaining
    === g a b
    === g c b  by rewrite ac
    === g c d  by rewrite bd
qed

theorem eq-trans :
  forall a b c : N,
    a === b --> b === c --> a === c
proof
  pick-any a b c
  assume (ab : a === b) (bc : b === c)
  rewrite ab, bc
  refl
qed

theorem refl-example :
  forall a : N,
    a === a
proof
  pick-any a
  refl
qed

theorem chaining-example :
  forall a b c d : N,
    a === c --> b === d --> g c d === g a b
proof
  pick-any a b c d
  assume (ac : a === c) (bd : b === d)
  chaining
    === g a b
    === g c b  by rewrite <-ac
    === g c d  by rewrite <-bd
qed

theorem another-chaining-example :
  forall a b c : N,
    g a b === f b --> b === h c --> g a b === f (h c)
proof
  pick-any a b c
  assume h1 h2
  chaining
    === g a b
    === f b      by rewrite h1
    === f (h c)  by rewrite h2
qed