use thiserror::Error;

#[derive(Debug, Error)]
pub enum Bn254Err {
    /// Build Fq instance from string
    #[error("failed to build a Fq instance from string ")]
    Fq,
}

#[derive(Debug, Error)]
pub enum BlsError {
    /// Multiply private key to g2 projective
    #[error("Failed to multiply by G2 Projective")]
    MulByG2Projective,

    /// Multiply private key to g1 projective
    #[error("Failed to multiply by G1 Projective")]
    MulByG1Projective,
}
