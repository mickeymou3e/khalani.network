noncomputable def ex_elim :
  forall (A : Type) (P : A -> Prop) (Q : (exists x : A, P x) -> Type),
    (forall (x : A) (h : P x), Q (Exists.intro x h)) ->
      forall ex : (exists x : A, P x), Q ex := by
  intro A P Q all ex
  have h' := Classical.indefiniteDescription _ ex
  apply all
  case x =>
    cases h'
    case mk x p => exact x
  case h =>
    cases h'
    case mk x p =>
      simp
      exact p

theorem choice_from_dep :
  forall (A B : Type) (R : A -> B -> Prop),
    (forall a : A, exists b : B, R a b) ->
      exists f : A -> B, forall a : A, R a (f a) := by
  intro A B R all
  apply Exists.intro
  case w =>
    intro a
    apply (ex_elim B (fun b : B => R a b) (fun _ => B))
    case a =>
      intro b rab
      exact b
    case ex =>
      apply all
  case h =>
    intro a
    simp
    cases (all a)
    case intro b rab =>
      unfold ex_elim
      simp
      apply Classical.strongIndefiniteDescription.proof_1
      exists b

noncomputable def ex_elim_nondep :
  forall (A : Type) (P : A -> Prop) (B : Type),
    (forall (x : A), P x -> B) ->
      (exists x : A, P x) -> B := by
  intro A P Q all ex
  have h' := Classical.indefiniteDescription _ ex
  apply all
  case x =>
    cases h'
    case mk x p => exact x
  case a =>
    cases h'
    case mk x p =>
      simp
      exact p

theorem choice :
  forall (A B : Type) (R : A -> B -> Prop),
    (forall a : A, exists b : B, R a b) ->
      exists f : A -> B, forall a : A, R a (f a) := by
  intro A B R all
  apply Exists.intro
  case w =>
    intro a
    apply (ex_elim_nondep B (fun b : B => R a b) B _ (all a))
    intro b rab
    exact b
  case h =>
    intro a
    unfold ex_elim_nondep <;> simp
    apply Classical.strongIndefiniteDescription.proof_1
    apply all