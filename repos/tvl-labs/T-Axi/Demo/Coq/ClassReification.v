Require Import Bool.

Inductive Formula : Set :=
| FFalse : Formula
| FTrue  : Formula
| FAnd   : Formula -> Formula -> Formula
| FOr    : Formula -> Formula -> Formula
| FImp   : Formula -> Formula -> Formula.

Fixpoint denote (f : Formula) : Prop :=
match f with
| FFalse     => False
| FTrue      => True
| FAnd f1 f2 => denote f1 /\ denote f2
| FOr f1 f2  => denote f1 \/ denote f2
| FImp f1 f2 => denote f1 -> denote f2
end.

Fixpoint solve (f : Formula) : bool :=
match f with
| FFalse     => false
| FTrue      => true
| FAnd f1 f2 => andb (solve f1) (solve f2)
| FOr  f1 f2 => orb (solve f1) (solve f2)
| FImp f1 f2 => implb (solve f1) (solve f2)
end.

Class Reify (P : Prop) : Type :=
{
  reify : Formula;
  spec : reflect (denote reify) (solve reify)
}.

Arguments reify _ {Reify}.

#[refine]
Instance ReifyFalse : Reify False :=
{
  reify := FFalse
}.
Proof.
  now cbn; constructor.
Defined.

#[refine]
Instance ReifyTrue : Reify True :=
{
  reify := FTrue
}.
Proof.
  now cbn; constructor.
Defined.

#[refine]
Instance ReifyAnd (P Q : Prop) (RP : Reify P) (RQ : Reify Q) : Reify (P /\ Q) :=
{
  reify := FAnd (@reify P RP) (@reify Q RQ)
}.
Proof.
  destruct RP as [fP HP], RQ as [fQ HQ]; cbn.
  now destruct HP, HQ; cbn; constructor.
Defined.

#[refine]
Instance ReifyOr (P Q : Prop) (RP : Reify P) (RQ : Reify Q) : Reify (P \/ Q) :=
{
  reify := FOr (@reify P RP) (@reify Q RQ)
}.
Proof.
  destruct RP as [fP HP], RQ as [fQ HQ]; cbn.
  now destruct HP, HQ; cbn; constructor; tauto.
Defined.

#[refine]
Instance ReifyImpl (P Q : Prop) (RP : Reify P) (RQ : Reify Q) : Reify (P -> Q) :=
{
  reify := FImp (@reify P RP) (@reify Q RQ)
}.
Proof.
  destruct RP as [fP HP], RQ as [fQ HQ]; cbn.
  now destruct HP, HQ; cbn; constructor; tauto.
Defined.

Theorem solve_denote :
  forall (P : Prop) (RP : Reify P),
    solve (reify P) = true -> denote (reify P).
Proof.
  intros P [reify spec]; cbn.
  now destruct spec.
Qed.

Ltac reify :=
match goal with
| |- ?P => change (denote (reify P))
end.

Ltac obvious :=
  reify; apply solve_denote; reflexivity.

Lemma trues :
  (True /\ True) -> (True \/ (True /\ (True -> True))).
Proof.
  tauto.
Restart.
  reify.
  cbn [reify ReifyImpl ReifyAnd ReifyOr ReifyTrue].
Restart.
  obvious.
Qed.