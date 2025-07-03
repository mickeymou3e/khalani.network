domain Set;

function in(a: Set, b: Set) -> Boolean;

# Some useful stuff.

# Procedures can be used as syntax sugars.
proc notin(a, b) {
    ~a in b
}

# set_def_is(S, P) is basically S = {x | P(x)}.
proc set_def_is(S, P) {
    forall x: Set. (x in S <==> P(x))
}

# x in S then P(x)
proc by_set_def(S, P, x) {
    !mp(!left_iff(!uspec(set_def_is(S, P), x)))
}

# P(x) then x in S
proc member_by_def(S, P, x) {
    !mp(!right_iff(!uspec(set_def_is(S, P), x)))
}

# End some useful stuff.

# Axiom schema of specification.
proc spec(P) {
    !assert(forall z: Set. exists y: Set. set_def_is(y, |x| x in z & P(x, z)))
}

# Exists { x in z | P(x) }
proc subset(z, P) {
    !uspec(!spec(|x, z| P(x)), z)
}

# Prove that there doesn't exist the universal set in ZF by Russell's paradox.
{
    let e_universal := exists s: Set. forall x: Set. x in s;
    !false_elim();
    !mt(assume e_universal {
        pick_witness u. e_universal;

        pick_witness y. !subset(u, |x| x notin x);
        let yprop := |x| x in u & x notin x;

        # y notin y
        !mt(assume y in y {
            # y notin y.
            !right_and(!by_set_def(y, yprop, y));
            !absurd(y in y, y notin y);
        });

        # y in u
        !uspec(forall x: Set. x in u, y);
        !both(y in u, y notin y);
        # y in y.
        !member_by_def(y, yprop, y);
        !absurd(y in y, y notin y);
    });
}

let ext := !assert(forall x: Set, y: Set. (forall z: Set. (z in x <==> z in y) ==> x = y));

let pair := !assert(forall x: Set, y: Set. exists z: Set. set_def_is(z, |a| a = x | a = y));

let union_axiom := !assert(forall A: Set. exists B: Set. set_def_is(B, |c| exists D: Set. and(c in D, D in A)));

function S(a: Set) -> Set;

let inf := !assert(exists X: Set. (
    exists e: Set. (forall z: Set. z notin e & e in X) &
    forall y: Set. (y in X ==> S(y) in X)
));

# TODO: reg, power, replacement.

# Given set_def_is(S, P), prove that
# forall S1. (set_def_is(S1, P) ==> S1 = S)
proc prove_unique(S, P) {
    pick_any S1: Set {
        assume set_def_is(S1, P) {
            pick_any x: Set {
                assume x in S1 {
                    !by_set_def(S1, P, x);
                    !member_by_def(S, P, x);
                }
                assume x in S {
                    !by_set_def(S, P, x);
                    !member_by_def(S1, P, x);
                }
                !equiv(x in S1, x in S)
            }
            !mp(!uspec(!uspec(ext, S1), S));
            !claim(S1 = S)
        }
    }
}

proc exists_unique(P) {
    exists x: Set. (P(x) & forall y: Set. (P(y) ==> y = x))
}

# If S = {x | P(x)}, prove that there exists exactly one such S.
proc prove_unique_that(P, S) {
    !both(set_def_is(S, P), !prove_unique(S, P));
    !egen(exists_unique(|S| set_def_is(S, P)), S)
}

# Intersection.
pick_any a: Set, b: Set {
    pick_witness aIb. !subset(a, |x| x in b);
    !prove_unique_that(|x| x in a & x in b, aIb)
}
# Having proved the unique existance, this is an extension by definition.
function intersection(a: Set, b: Set) -> Set;
!assert(forall a: Set, b: Set, c: Set. (
    c = intersection(a, b) <==> set_def_is(c, |x| x in a & x in b)
));

# Union.
pick_any a: Set, b: Set {
    pick_witness ab. !uspec(!uspec(pair, a), b);
    let ab_prop := |x| x = a | x = b;
    pick_witness aUb. !uspec(union_axiom, ab);
    let aUb_prop := |x| exists d: Set. (x in d & d in ab);
    pick_any x: Set {
        assume x in a | x in b {
            !cd(assume x in a {
                !left_either(!reflex(a), a = b);
                !member_by_def(ab, ab_prop, a);
                !both(x in a, a in ab);
                !egen(exists a: Set. (x in a & a in ab), a);
            }, assume x in b {
                !right_either(b = a, !reflex(b));
                !member_by_def(ab, ab_prop, b);
                !both(x in b, b in ab);
                !egen(exists b: Set. (x in b & b in ab), b);
            });
            !member_by_def(aUb, aUb_prop, x);
        }
        assume x in aUb {
            # x in d & d in ab
            pick_witness d. !by_set_def(aUb, aUb_prop, x);
            !left_and(x in d & d in ab);
            !right_and(x in d & d in ab);
            # d = a | d = b
            !by_set_def(ab, ab_prop, d);
            !cd(assume d = a {
                !rcong(x in d, x in a);
                !left_either(x in a, x in b)
            }, assume d = b {
                !rcong(x in d, x in b);
                !right_either(x in a, x in b)
            });
        }
        !equiv(x in aUb, x in a | x in b)
    };
    !prove_unique_that(|x| x in a | x in b, aUb)
}
# Definition.
function union(a: Set, b: Set) -> Set;
!assert(forall a: Set, b: Set, c: Set. (
    c = union(a, b) <==> set_def_is(c, |x| x in a | x in b)
));
