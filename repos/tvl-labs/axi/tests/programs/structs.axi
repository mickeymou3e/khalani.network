struct Foo {
    x: Nat,
    y: Nat,
    z: Nat,
}

!claim(forall x1: Nat, y1: Nat, z1: Nat, x2: Nat, y2: Nat, z2: Nat. (
    Foo { x: x1, y: y1, z: z1 } = Foo { x: x2, y: y2, z: z2 } ==>
    x1 = x2 & y1 = y2 & z1 = z2
));

struct Bar {
    f: Foo,
}

let foo := Foo { x: 3, z: 5, y: 4 };

# Test that the order of fields doesn't matter.
!eq_chain(foo, Foo { z: 5, x: 3, y: 4 });

foo.x;

let bar := Bar { f: foo };

bar.f.x;

# Test elimination of Foo {}.field
!eq_chain(5, foo.z);
!eq_chain(bar.f.y, foo.y, 4);

!prove_by_eval(bar.f.y = 4);
