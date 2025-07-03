
export const chapters = [
    {
        title: "Chapter 1: Basics & Propositional Logic",
        pages: [
            {
                title: "Introduction", slug: "intro", sections: [
                    {
                        type: 'text',
                        title: "Introduction",
                        content: `Axi supports reasoning in the natural deduction style. We will declare some opaque propositions to reason about. Later we'll see that they are actually constant terms of a special type Boolean when we talk about first-order logic.`
                    },
                    {
                        type: 'code',
                        title: 'Boolean Constants',
                        initialCode: `const a: Boolean;\nconst b: Boolean;\nconst c: Boolean;\nconst d: Boolean;`
                    },
                    {
                        type: 'text',
                        title: 'Assumption Base',
                        content: `There is a global assumption base that contains all the axioms and all the theorems that has been proved so far. The following assume block proves p ==> q.\n
It does this by inserting p into the assumption base and then proving q within that context. After the block is finished, p and anything proved in the block will be removed from the assumption base. A final conclusion should be proved by the block. Let's say it's q, then p ==> q is proved by the whole assume block and added to the assumption base.`
                    },
                    {
                        type: 'code',
                        title: 'Proving a conditional',
                        initialCode: `assume p {
# ...
    !claim(q)
}`
                    }
                ]
            },
            { title: "Basic Concepts", slug: "basic-concepts", sections: [] },
        ]
    },
    {
        title: "Chapter 2: Programming with Axi",
        pages: [
            {
                title: "Expressions versus Proofs",
                slug: "expressions-vs-proofs",
                sections: []
            },
            {
                title: "Reusable Proof Schemas",
                slug: "reusable-proof-schemas",
                sections: []
            },
            {
                title: "Higher Order Functions",
                slug: "higher-order-functions",
                sections: []
            }
        ]
    },
    {
        title: "Chapter 3: Proofs in First Order Logic",
        pages: [
            {
                title: "Domains and Sorts",
                slug: "domains-and-sorts",
                sections: []
            },
            { title: "Quantifiers", slug: "quantifiers", sections: [] },

        ]
    },
    {
        title: "Chapter 4: Equational Reasoning",
        pages: [
            { title: "Equality, Congruence and Substitution", slug: "equality-congruence-substitution", sections: [] },
            { title: "Equational Proofs", slug: "equational-proofs", sections: [] }
        ]
    },
    {
        title: "Chapter 5: Inductive Types and Axiomatized Functions", pages: [
            { title: "Inductive Types", slug: "inductive-types", sections: [] },
            { title: "Structural Induction over Inductive Types", slug: "structural-induction-over-inductive-types", sections: [] },
            { title: "Functions and Pattern Matching", slug: "functions-and-pattern-matching", sections: [] }
        ]
    }

]