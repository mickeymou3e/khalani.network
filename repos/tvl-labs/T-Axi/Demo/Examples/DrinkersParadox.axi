theorem drinkers-paradox :
  forall {Man : Type} (drinks : Man -> Prop) (man : Man),
    exists drinker : Man, drinks drinker --> forall x : Man, drinks x
proof
  pick-any Man drinks man
  cases (instantiate lem with (forall x : Man, drinks x))
  . assume alld : (forall x : Man, drinks x)
    witness man
    assume d : drinks man
    assumption
  . assume nalld : ~ (forall x : Man, drinks x)
    lemma exn : exists x : Man, ~ drinks x by
      by-contradiction h : ~ (exists x : Man, ~ drinks x)
      apply nalld
      pick-any x : Man
      by-contradiction nd : ~ drinks x
      apply h
      witness x
      assumption
    proving (exists drinker : Man, drinks drinker --> forall x : Man, drinks x)
    pick-witness (drinker : Man) (drinker-doesnt-drink : ~ drinks drinker) for exn
    witness drinker
    assume drinker-drinks : drinks drinker
    absurd
    contradiction drinker-doesnt-drink drinker-drinks
qed