function f(x: Nat) -> Boolean;

function g(x: Bytes) -> Boolean;

proc p(x) { f(x) }

forall x. p(x);

forall x, y. (x = y & p(y));

exists x, y. (x = y & p(x));

forall x. ((exists y. y = x) & p(x));

struct Point {
    x: Nat,
    y: Nat,
}

function fp(p: Point) -> Boolean;

forall p. (fp(p) & p.x = 1);

# Type error for g(y).
forall x, y. (x = y & p(x) & g(y));
