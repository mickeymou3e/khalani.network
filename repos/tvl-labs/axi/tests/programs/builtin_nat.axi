!prove_by_eval(1 add 2 = 3);
!prove_by_eval(10 lt (2 mul 8));
!prove_by_eval(17 le ((2 mul 8) add 1));

# Div axioms.
!claim(
    forall y: Nat, x: Nat. (
        (Zero lt y & y le x) ==>
        x div y = Succ((x sub y) div y)
    )
);

!claim(
    forall y: Nat, x: Nat. (
        ~(Zero lt y & y le x) ==>
        x div y = Zero
    )
);
