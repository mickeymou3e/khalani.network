function factorial(n: Nat) -> Nat {
    match n {
        Zero => 1,
        Succ(m) => n mul factorial(m),
    }
}

!prove_by_eval_term(factorial(0));
!prove_by_eval_term(factorial(1));
!prove_by_eval_term(factorial(5));

function fibonacci(n: Nat) -> Nat {
    match n {
        Succ(Zero) => 1,
        Succ(Succ(m)) => fibonacci(m) add fibonacci(m add 1),
        Zero => 0,
    }
}

!prove_by_eval(fibonacci(0) = 0);
!prove_by_eval(fibonacci(1) = 1);
!prove_by_eval(fibonacci(8) = 21);

inductive ListNat {
    ListNatNil,
    ListNatCons(Nat, ListNat),
}

function sum_list_nat(xs: ListNat) -> Nat {
    let ys := xs;
    let zero := Zero;

    match ys {
        ListNatNil => zero,
        ListNatCons(x, xs) => x add sum_list_nat(xs),
    }
}

!prove_by_eval(sum_list_nat(
    ListNatCons(
        1,
        ListNatCons(
            2,
            ListNatCons(
                3,
                ListNatNil,
            ),
        ),
    )
) = 6);

function my_predicate(x: Nat) -> Boolean {
    x lt 3 | x = 3
}

!prove_by_eval(my_predicate(1));
!prove_by_eval(my_predicate(3));
!prove_by_eval(my_predicate(Succ(Succ(Succ(Zero)))));

function my_boolean_function() -> Boolean {
    my_predicate(1) | false
}

!prove_by_eval(my_boolean_function());

# Should fail.
!prove_by_eval(my_predicate(4));
