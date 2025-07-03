use super::*;

#[test]
fn test_de_bruijn() {
    let t = Type::new("T");
    let p = Proposition::Term(Term::FunctionApp(
        "p".into(),
        vec![Term::Var(3, t.clone()), Term::Var(4, t.clone())],
        Type::boolean().clone(),
    ));

    let var = |x| Term::Var(x, t.clone());

    // exists. p(0, y)
    let p1 = Proposition::Exists(
        t.clone(),
        de_bruijn(&p, 0, &var(3), &Default::default(), &mut false).into(),
    );
    // forall. exists. p(0, 1)
    let p2 = Proposition::ForAll(
        t.clone(),
        de_bruijn(&p1, 0, &var(4), &Default::default(), &mut false).into(),
    );

    let Proposition::ForAll(_, p2) = p2 else {
        panic!()
    };
    // exists. p(0, 5)
    let p1 = subst(&p2, 0, &var(5));
    let Proposition::Exists(_, p1) = p1 else {
        panic!()
    };
    // p(6, 5)
    let p = subst(&p1, 0, &var(6));
    assert_eq!(
        p,
        Proposition::Term(Term::FunctionApp(
            "p".into(),
            vec![var(6), var(5)],
            Type::boolean().clone(),
        ))
    );
}
