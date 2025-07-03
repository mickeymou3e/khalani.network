# The equality relation = is builtin in Axi, and the usual axiom (schemas) for
# equality are provided as builtin deduction procedures.

domain N;

function f(x: N) -> N;
function g(x: N, y: N) -> N;
function h(x: N) -> N;

# The primitive deduction procedures for working with equality are fcong and
# rcong.

pick_any a: N, b: N, c: N, d: N {
    assume a = c {
        assume b = d {
            # fcong(f(a1, a2, ..., an), f(b1, b2, ..., bn)) proves that the two
            # terms are equal by checking that a1 = b1, a2 = b2, ..., an = bn.
            !fcong(a g b, c g d)
        }
    }
}

pick_any a: N, b: N, c: N {
    assume a = b {
        assume b = c {
            # rcong(R(a1, a2, ..., an), R(b1, b2, ..., bn)) proves R(b1, b2,
            # ..., bn) by checking that R(a1, a2, ..., an) is in the assumption
            # base and that a1 = b1, a2 = b2, ..., an = bn.
            !rcong(a = b, a = c)
        }
    }
}

# There is also eq_chain that performs equality chaining. It's often more
# convenient than fcong and rcong.

pick_any a: N {
    # You can prove that anything is equal to itself with eq_chain.
    !eq_chain(a, a)
}

pick_any a: N, b: N, c: N, d: N {
    assume a = c {
        assume b = d {
            # You can prove that terms are equal because the arguments are equal.
            !eq_chain(c g d, a g b)
        }
    }
}

pick_any a: N, b: N, c: N {
    assume g(a, b) = f(b) {
        assume b = h(c) {
            # eq_chain(A, B, C) proves A = C if it can prove that A = B and B = C.
            !eq_chain(
                g(a, b),
                f(b),
                f(h(c)),
            )
        }
    }
}
