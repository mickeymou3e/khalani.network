const a: Boolean;
const b: Boolean;

# Test duplicated assume.
assume a {
    assume a {
        !claim(a)
    }
    !right_either(b, a)
}

# Test that b doesn't hold when the assume b block is closed.
assume a {
    assume b {
        !both(a, b)
    }
    !claim(a & b)
}
