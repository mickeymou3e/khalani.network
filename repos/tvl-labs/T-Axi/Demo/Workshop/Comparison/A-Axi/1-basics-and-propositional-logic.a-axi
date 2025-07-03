# Axi supports reasoning in the natural deduction style.
#
# We will declare some opaque propositions to reason about. Later we'll see that
# they are actually constant terms of a special type Boolean when we talk about
# first-order logic.

const a: Boolean;
const b: Boolean;
const c: Boolean;
const d: Boolean;

# There is a global assumption base that contains all the axioms and all the
# theorems that has been proved so far.
#
# An assume block
#
# # This proves p ==> q.
# assume p {
#     ...
#     !claim(q)
# }
#
# inserts p into the assumption base and run the proofs in the block. After the
# block is finished, p and anything proved in the block will be removed from the
# assumption base. A final conclusion should be proved by the block. Let's say
# it's q, then p ==> q is proved by the whole assume block and added to the
# assumption base.

assume ~~a {
    # Expressions that start with a bang (!) is a deduction procedure
    # invocation. It will prove something, return it, and add it to the
    # assumption base.
    #
    # dn is double-negation, dn(~~a) proves a, given that ~~a is in the
    # assumption base.
    #
    # Like rust, the result of the last expression of a block is the result of
    # the whole block. You should not add a semicolon to the last expression.
    !dn(~~a)
}

assume a {
    assume b {
        # both proves a & b, given that a and b are both in the assumption base.
        !both(a, b)
    }
}

assume a {
    assume b {
        # left_and(b & a) proves b, given that b & a is in the assumption base.
        #
        # You can probably guess that there's also right_and(b & a) which proves
        # a.
        #
        # A deduction procedure invocation will return its conclusion, so we can
        # pass it to other deduction procedures. Here the conclusion of both(b,
        # a), (b & a) is passed to left_and.
        !left_and(!both(b, a))
    }
}

assume a & b {
    !left_and(a & b);
    # left_either(a, c) prove a || c, given that a is in the assumption base.
    #
    # There's also right_either.
    !left_either(a, c)
}

assume a | c ==> d {
    assume a & b {
        !left_and(a & b);
        !left_either(a, c);
        # mp(p ==> q) proves q, given that both p and p ==> q are in the
        # assumption base.
        !mp(a | c ==> d)
    }
}

assume a ==> b {
    assume b ==> a {
        # equiv(a, b)assumption block proves a <==> b, given that both a ==> b and b ==> a are
        # in the assumption base.
        !equiv(a, b)
    }
}

assume a <==> b {
    # left_iff(a <==> b) proves a ==> b from a <==> b.
    #
    # Let bindings can be used to bind propositions to identifiers.
    let x := !left_iff(a <==> b);
    # reft_iff(a <==> b) proves b ==> a from a <==> b.
    let y := !right_iff(a <==> b);
    !both(x, y)
}
