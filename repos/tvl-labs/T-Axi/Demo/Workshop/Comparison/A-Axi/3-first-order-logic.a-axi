# Besides propositional logic, Axi also supports (many-sorted) first-order
# logic.
#
# There are some builtin sorts like Boolean and Nat (natural numbers), you can
# declare other sorts with the domain keyword:

domain N;

# You can declare functions and predicates. Predicates are functions whose
# return type is Boolean.

function P(x: N) -> Boolean;
function Q(x: N) -> Boolean;
function R(x: N, y: N) -> Boolean;

# The syntax for universal and existential quantified propositions is like this:

let all_p := forall x: N. P(x);
exists x: N. (Q(x) & R(x, x));

# You can prove a universal quantified proposition with pick_any, and use a
# universal quantified proposition with uspec:
assume forall x: N. P(x) {
    pick_any y: N {
        !uspec(all_p, y) # Proves P(y).
    }
}

# The above expression proves that:
!claim(forall x: N. P(x) ==> forall y: N. P(y));

# Which is the same as
!claim(forall x: N. P(x) ==> forall x: N. P(x));
# because they are alpha-equivalent.

# The following proves that if a relation is irreflexive and transitive, it is
# not symmetrical:
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

# You can prove and use existential quantified propositions with egen and pick_witness:
assume exists x: N. P(x) {
    pick_witness y . exists x: N. P(x);
    # egen(exists z. P(z), y) checks that P(y) is in the assumption base.
    !egen(exists z: N. P(z), y);
}
!claim(exists x: N. P(x) ==> exists x: N. P(x));

# Procedures can take terms and return terms or propositions:
proc pq(x) {
    P(x) & Q(x)
}
forall x: N. pq(x);

function f(x: N) -> N;
proc ff(x) {
    f(f(x))
}
forall x: N. P(ff(x));
