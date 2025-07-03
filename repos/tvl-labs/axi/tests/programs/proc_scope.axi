const a: Boolean;

let assumption := ~~a;
assume assumption {
    proc my_dn(x) {
        !dn(x)
    }
    let my_dn1 := |x| { !my_dn(x) };
    let scope_2 := |x| {
        let my_dn := || {
            !invalid(
            foo,
            bar,
            baz,
            )
        };
        # Test that my_dn in my_dn1 is referring to the one in the parent scope.
        !my_dn1(assumption)
    };
    let my_dn := || { !invalid() };
    !my_dn1(assumption)
}
!my_dn1(assumption)
