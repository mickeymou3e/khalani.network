function p(x: Nat) -> Boolean;
function q(x: Nat) -> Boolean;
function g(x: Nat) -> Nat;

function f(x: Nat) -> Nat {
    if p(x) {
        match x {
            Succ(y) => if q(y) { g(y) } else { f(y) },
            Zero => Zero
        }
    } else { Zero }
}

!claim(forall y: Nat. (
    p(Succ(y)) ==>
    q(y) ==>
    f(Succ(y)) = g(y)
));

!claim(forall y: Nat. (
    p(Succ(y)) ==>
    ~q(y) ==>
    f(Succ(y)) = f(y)
));

!claim(forall x: Nat. (
    ~p(x) ==>
    f(x) = Zero
));
