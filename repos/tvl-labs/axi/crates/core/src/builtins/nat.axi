inductive Nat {
    Zero,
    Succ(Nat),
}

function add(x: Nat, y: Nat) -> Nat {
    match y {
        Zero => x,
        Succ(z) => Succ(x add z),
    }
}

function sub(x: Nat, y: Nat) -> Nat {
    match y {
        Zero => x,
        Succ(y) => match x {
            Zero => Zero,
            Succ(x) => x sub y,
        }
    }
}

function mul(x: Nat, y: Nat) -> Nat {
    match y {
        Zero => Zero,
        Succ(z) => (x mul z) add x
    }
}

function lt(x: Nat, y: Nat) -> Boolean {
    match y {
        Zero => false,
        Succ(y) => match x {
            Zero => true,
            Succ(x) => x lt y,
        }
    }
}

function le(x: Nat, y: Nat) -> Boolean {
    x lt y | x = y
}

function div(x: Nat, y: Nat) -> Nat {
    if Zero lt y & y le x {
        Succ((x sub y) div y)
    } else {
        Zero
    }
}
