use std::fmt::{Display, Formatter, Result};

use bytes::Bytes;

#[derive(Clone, Debug)]
pub struct InputGroup {
    pub rlp: Vec<u8>,
    pub bcs: Vec<u8>,
    pub borsh: Vec<u8>,
}

impl InputGroup {
    pub fn size(&self) -> usize {
        self.rlp.len() + self.bcs.len() + self.borsh.len()
    }
}

impl Display for InputGroup {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        write!(f, "InputGroup")
    }
}

pub fn random_bytes(len: usize) -> Bytes {
    (0..len).map(|_| rand::random()).collect::<Vec<u8>>().into()
}
