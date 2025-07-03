const a: Boolean;

proc by_contradiction(p) {
    !false_elim();
    !mt(p)
}

# Prove law of excluded-middle
let ex := a | ~a;
!dn(!by_contradiction(assume ~ex {
    !by_contradiction(
        assume a {
            !left_either(a, ~a);
            !absurd(ex, ~ex)
        }
    );
    !right_either(a, ~a);
    !absurd(ex, ~ex)
}));

const c: Boolean;
const d: Boolean;

# c or d => not c => d
assume c | d {
    assume ~c {
        !dn(!by_contradiction(assume ~d {
            let if_c_false := assume c {
                !absurd(c, ~c)
            };
            let if_d_false := assume d {
                !absurd(d, ~d)
            };
            !cd(if_c_false, if_d_false)
        }))
    }
}
