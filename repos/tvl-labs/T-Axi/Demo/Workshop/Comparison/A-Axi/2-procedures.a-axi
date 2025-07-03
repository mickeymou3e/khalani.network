# User defined procedures

const a: Boolean;
const b: Boolean;
const c: Boolean;
const d: Boolean;

# Procedures can take propositions and return a proposition:

proc and3(x, y, z) {
    x & y & z
}

and3(a, b, c); # a & b & c

# They can also perform deductions and prove a conclusion. In this case, the
# procedure is a deduction procedure. All the deductions inside the procedure
# must be valid according to the assumption base at the time of invocation.

# This procedures proves a & b & c from a, b and c:

proc prove_and3(x, y, z) {
    !both(!both(x, y), z)
}

assume a {
    assume b {
        assume c {
            !prove_and3(a, b, c)
        }
    }
}

# Procedures can be nested and they follow the usual lexical scoping rules:

proc and3_nested(x, y, z) {
    proc xy() {
        x & y
    }

    xy() & z
}

and3_nested(a, b, c);

# Procedures can also take other procedures:
proc and3_higher_order(xy, x, y, z) {
    xy(x, y) & z
}

# Anonymous procedures can be defined with a syntax similar to rust closures and
# passed to higher order procedures:
and3_higher_order(|x, y| x & y, a, b, c);
