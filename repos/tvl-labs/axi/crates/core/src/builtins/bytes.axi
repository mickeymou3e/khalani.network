inductive Bytes {
    BytesNil,
    BytesCons(u8, Bytes),
}

function bytes_len(bs: Bytes) -> Nat {
    match bs {
        BytesNil => Zero,
        BytesCons(_, bs) => Succ(bytes_len(bs)),
    }
}
