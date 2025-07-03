use ark_bn254::{Fq, Fq2, Fr, G1Affine, G1Projective, G2Affine, G2Projective};
use ark_ff::{BigInteger, BigInteger256, One, Zero};
use ethers::types::U256;

use std::ops::{Add, Mul};
use std::str::FromStr;

use crate::error::{BlsError, Bn254Err};

pub fn new_fp_element(x: BigInteger256) -> Fq {
    Fq::from(x)
}

fn new_fp2_element(a: BigInteger256, b: BigInteger256) -> Fq2 {
    Fq2::new(Fq::from(a), Fq::from(b))
}

type PrivateKey = Fr;

#[derive(Debug, Clone)]
pub struct Signature {
    g1_point: G1Point,
}

impl From<G1Projective> for Signature {
    fn from(value: G1Projective) -> Self {
        Signature {
            g1_point: G1Point { point: value },
        }
    }
}

impl Signature {
    pub fn new_zero_signature() -> Self {
        return Signature {
            g1_point: G1Point::new_zero_g1_point(),
        };
    }

    pub fn sig(&self) -> G1Projective {
        self.g1_point.point
    }

    pub fn add(&mut self, sig: Signature) -> Signature {
        let added_point = self.g1_point.add(sig.g1_point);
        Signature {
            g1_point: added_point,
        }
    }
}

pub struct KeyPair {
    priv_key: PrivateKey,
    pub_key: G1Projective,
}

impl KeyPair {
    pub fn new(key: PrivateKey) -> Result<Self, BlsError> {
        let priv_key_projective_cconfig_result = mul_by_generator_g1(key);

        match priv_key_projective_cconfig_result {
            Ok(priv_key_projective_cconfig) => {
                return Ok(Self {
                    priv_key: key,
                    pub_key: priv_key_projective_cconfig,
                });
            }
            Err(_) => return Err(BlsError::MulByG1Projective),
        }
    }

    pub fn sign_hashes_to_curve_message(&self, g1_hashes_msg: G1Projective) -> Signature {
        let sig = g1_hashes_msg.mul(self.priv_key);

        Signature {
            g1_point: G1Point { point: sig },
        }
    }

    pub fn get_pub_key_g1(&self) -> G1Projective {
        self.pub_key
    }

    pub fn gt_pub_key_g2(&self) -> Result<G2Projective, BlsError> {
        let mul_result = mul_by_generator_g2(self.priv_key);

        match mul_result {
            Ok(mul) => Ok(mul),
            Err(_) => return Err(BlsError::MulByG2Projective),
        }
    }
}

#[derive(Debug, Clone)]
pub struct G1Point {
    pub point: G1Projective,
}

#[derive(Debug, Clone)]
pub struct G2Point {
    pub point: G2Projective,
}

impl G2Point {
    // Function to create a new G2Point from x and y coordinates, where each coordinate is a pair of BigIntegers
    pub fn new(x: (BigInteger256, BigInteger256), y: (BigInteger256, BigInteger256)) -> Self {
        // Convert x and y to Fq2 elements
        let x_elem = new_fp2_element(x.1, x.0);
        let y_elem = new_fp2_element(y.1, y.0);

        // Create a new G2 point in projective coordinates
        let point = G2Projective::new(x_elem, y_elem, Fq2::one()); // Z coordinate is set to 1

        G2Point { point }
    }

    pub fn new_zero() -> Self {
        G2Point {
            point: G2Projective::zero(),
        }
    }

    pub fn add(&self, p2: G2Point) -> G2Point {
        let added_point = self.point.add(p2.point);
        G2Point { point: added_point }
    }
}

impl G1Point {
    // Function to create a new G1Point from x and y coordinates
    pub fn new(x: BigInteger256, y: BigInteger256) -> Self {
        // Convert x and y to field elements
        let x_elem = new_fp_element(x);
        let y_elem = new_fp_element(y);

        // Create a new G1 point in projective coordinates
        let point = G1Projective::new(x_elem, y_elem, Fq::one()); // Z coordinate is set to 1

        G1Point { point }
    }

    pub fn add(&mut self, p2: G1Point) -> G1Point {
        let added_point = self.point.add(p2.point);
        G1Point { point: added_point }
    }

    pub fn new_zero_g1_point() -> Self {
        G1Point::new(
            u256_to_bigint256(U256::from(0)),
            u256_to_bigint256(U256::from(0)),
        )
    }
}

pub fn u256_to_bigint256(value: U256) -> BigInteger256 {
    // Convert U256 to a byte array
    let mut bytes = [0u8; 32];
    value.to_big_endian(&mut bytes);
    // Convert the byte array to a bit array
    let mut bits = [false; 256];
    for (byte_idx, byte) in bytes.iter().enumerate() {
        for bit_idx in 0..8 {
            let bit = byte & (1 << bit_idx) != 0;
            bits[byte_idx * 8 + bit_idx] = bit;
        }
    }
    // Create a BigInteger256 from the byte array
    BigInteger256::from_bits_be(&bits)
}

pub fn biginteger256_to_u256(bi: BigInteger256) -> U256 {
    let s = bi.to_bytes_be();
    U256::from_little_endian(&s)
}

pub fn get_g1_generator() -> Result<G1Affine, Bn254Err> {
    let x_result = Fq::from_str("1");
    let y_result = Fq::from_str("2");

    match x_result {
        Ok(x) => match y_result {
            Ok(y) => {
                return Ok(G1Affine::new(x, y));
            }
            Err(_) => return Err(Bn254Err::Fq),
        },
        Err(_) => return Err(Bn254Err::Fq),
    }
}

pub fn get_g2_generator() -> Result<G2Affine, Bn254Err> {
    let x_0_result = Fq::from_str(
        "10857046999023057135944570762232829481370756359578518086990519993285655852781",
    );

    let x_1result = Fq::from_str(
        "11559732032986387107991004021392285783925812861821192530917403151452391805634",
    );

    match x_0_result {
        Ok(x_0) => {
            match x_1result {
                Ok(x_1) => {
                    let x = Fq2::new(x_0, x_1);

                    let y_0_result = Fq::from_str("8495653923123431417604973247489272438418190587263600148770280649306958101930");

                    match y_0_result {
                        Ok(y_0) => {
                            let y_1_result = Fq::from_str("4082367875863433681332203403145435568316851327593401208105741076214120093531");

                            match y_1_result {
                                Ok(y_1) => {
                                    let y = Fq2::new(y_0, y_1);
                                    return Ok(G2Affine::new(x, y));
                                }
                                Err(_) => return Err(Bn254Err::Fq),
                            }
                        }
                        Err(_) => {
                            return Err(Bn254Err::Fq);
                        }
                    }
                }
                Err(_) => return Err(Bn254Err::Fq),
            }
        }
        Err(_) => {
            return Err(Bn254Err::Fq);
        }
    }
}

pub fn mul_by_generator_g1(pvt_key: Fr) -> Result<G1Projective, Bn254Err> {
    let g1_gen_result = get_g1_generator();

    match g1_gen_result {
        Ok(g1_gen) => {
            let s: G1Projective = g1_gen.into();
            return Ok(s.mul(pvt_key));
        }
        Err(_) => {
            return Err(Bn254Err::Fq);
        }
    }
}

pub fn mul_by_generator_g2(pvt_key: Fr) -> Result<G2Projective, Bn254Err> {
    let g2_gen_result = get_g2_generator();

    match g2_gen_result {
        Ok(g2_gen) => {
            let s: G2Projective = g2_gen.into();
            return Ok(s.mul(pvt_key));
        }
        Err(_) => {
            return Err(Bn254Err::Fq);
        }
    }
}
