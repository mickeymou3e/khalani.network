!eq_chain(3_u8, 3u8);
!eq_chain(0x3344aabb, 0x3344aabb);
!prove_by_eval(bytes_len(BytesCons(2u8, 0x334455)) add 2 = Succ(4 add 1));

!claim(forall b: u8. forall bs: Bytes. bytes_len(BytesCons(b, bs)) = Succ(bytes_len(bs)));
