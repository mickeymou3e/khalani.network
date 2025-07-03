| Description         | Schematic           | Slides                  | Naturalistic                |
| ------------------- | ------------------- | ----------------------- | --------------------------- |
| True intro          | true-intro          | true                    | trivial                     |
| False elim          | false-elim e        | exfalso e               | absurd e                    |
| Implication intro   | impl-intro P e      | assume P in e           | assume p : P in e           |
| Implication elim    | impl-elim e1 e2     | modus-ponens e1 e2      | apply, imply (?)            |
| Negation intro      | not-intro P e       | suppose-absurd P in e   |                             |
| Negation elim       | not-elim e1 e2      | absurd e1 e2            | contradiction e1 e2         |
| Conjunction intro   | and-intro e1 e2     | both e1 e2              | both e1 e2                  |
| Conjunction elim l  | and-elim-l e        | left-and e              | and-left e                  |
| Conjunction elim r  | and-elim-r e        | right-and e             | and-right e                 |
| Biconditional intro | iff-intro e1 e2     | equivalence e1 e2       |                             |
| Biconditiona elim l | iff-elim-l e        | left-iff e              |                             |
| Biconditiona elim r | iff-elim-r e        | right-iff               |                             |
| Disjunction intro l | or-intro-l e        | left-either Q e         | or-left e                   |
| Disjunction intro r | or-intro-r e        | right-either P e        | or-right e                  |
| Disjunction elim    | or-elim e1 e2 e3    | constructive-dilemma    | cases e1 e2 e3              |
| Forall intro        | forall-intro x e    | pick-any x in e         | pick-any x : A in e         |
| Forall elim         | forall-elim e t     | specialize e with t     | instantiate e with t        |
| Exists intro        | exists-intro t e    | exists t such-that e    | exists t such-that e        |
| Exists elim         | exists-elim x e1 e2 | pick-witness x for e1 in e2 |                         |
| Equality intro      | eq-intro            | refl                    | reflexivity                 |
| Equality elim       | eq-elim e e'        | rewrite e in e'         | rewrite e in e'             |
| Classical logic     |                     | double-negation e       | by-contradiction x : ~ P in e |