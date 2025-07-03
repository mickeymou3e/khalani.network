domain N;

function P(x: N) -> Boolean;

function Q(x: N) -> Boolean;

function R(x: N, y: N) -> Boolean;

# Test parsing.
~forall x: N. (P(x) & ~~~exists x: N. R(x, x));

let PQ := forall x: N. (P(x) & Q(x));
let P_Q := forall x: N. P(x) & forall x: N. Q(x);
assume PQ {
    let p := pick_any x: N {
        !left_and(!uspec(PQ, x))
    };
    let q := pick_any x: N {
        !right_and(!uspec(PQ, x))
    };
    !both(p, q)
}
assume P_Q {
    pick_any x: N {
        let p := !uspec(!left_and(P_Q), x);
        let q := !uspec(!right_and(P_Q), x);
        !both(p, q)
    }
}
!equiv(PQ, P_Q);

let PQ := exists x: N. (P(x) | Q(x));
assume PQ {
    pick_witness x . PQ;
    let conc := exists x: N. P(x) | exists x: N. Q(x);
    let p := assume P(x) {
        !left_either(!egen(exists x: N. P(x), x), exists x: N. Q(x))
    };
    let q := assume Q(x) {
        !right_either(exists x: N. P(x), !egen(exists x: N. Q(x), x))
    };
    !cd(p, q)
}

assume forall x: N. P(x) {
    let e := exists x: N. ~P(x);
    !false_elim();
    !mt(assume e {
        pick_witness x. e;
        !uspec(forall x: N. P(x), x);
        !absurd(P(x), ~P(x))
    })
}

let irreflex := forall x: N. ~R(x, x);
let trans := forall x: N, y: N, z: N. (R(x, y) & R(y, z) ==> R(x, z));
let not_sym := forall x: N, y: N. (R(x, y) ==> ~R(y, x));
assume irreflex {
    assume trans {
        pick_any a: N, b: N {
            assume R(a, b) {
                !false_elim();
                !mt(assume R(b, a) {
                    !both(R(a, b), R(b, a));
                    let a_less_a := !mp(!uspec(!uspec(!uspec(trans, a), b), a));
                    !absurd(!uspec(irreflex, a), a_less_a)
                })
            }
        }
    }
}
!claim(irreflex ==> trans ==> not_sym);