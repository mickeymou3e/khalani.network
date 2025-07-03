use criterion::{criterion_group, criterion_main, Criterion};
use mirax_crypto::{
    ed25519::{Ed25519BatchVerify, Ed25519PrivateKey},
    secp256k1::{Secp256k1BatchVerify, Secp256k1PrivateKey, Secp256k1RecoverablePrivateKey},
    BatchVerify, PrivateKey, Signature,
};
use mirax_primitive::H256;

fn criterion_ecdsa_sign(c: &mut Criterion) {
    let mut group = c.benchmark_group("ECDSA Sign");
    let msg = H256::random();
    let mut rng = rand::thread_rng();

    let ed_private_key = Ed25519PrivateKey::generate(&mut rng);
    let secp_private_key = Secp256k1PrivateKey::generate(&mut rng);
    let secp_rec_private_key = Secp256k1RecoverablePrivateKey::generate(&mut rng);

    group.bench_function("Ed25519 Sign", |b| b.iter(|| ed_private_key.sign(&msg)));

    group.bench_function("Secp256k1 Sign", |b| b.iter(|| secp_private_key.sign(&msg)));

    group.bench_function("Secp256k1 Recoverable Sign", |b| {
        b.iter(|| secp_rec_private_key.sign(&msg))
    });
}

fn criterion_ecdsa_verify(c: &mut Criterion) {
    let mut group = c.benchmark_group("ECDSA Verify");
    let msg = H256::random();
    let mut rng = rand::thread_rng();

    let ed_private_key = Ed25519PrivateKey::generate(&mut rng);
    let ed_public_key = ed_private_key.public_key();
    let ed_signature = ed_private_key.sign(&msg);
    let secp_private_key = Secp256k1PrivateKey::generate(&mut rng);
    let secp_public_key = secp_private_key.public_key();
    let secp_signature = secp_private_key.sign(&msg);
    let secp_rec_private_key = Secp256k1RecoverablePrivateKey::generate(&mut rng);
    let secp_rec_public_key = secp_rec_private_key.public_key();
    let secp_rec_signature = secp_rec_private_key.sign(&msg);

    group.bench_function("Ed25519 Verify", |b| {
        b.iter(|| ed_signature.verify(&msg, &ed_public_key))
    });

    group.bench_function("Secp256k1 Verify", |b| {
        b.iter(|| secp_signature.verify(&msg, &secp_public_key))
    });

    group.bench_function("Secp256k1 Recoverable Verify", |b| {
        b.iter(|| secp_rec_signature.verify(&msg, &secp_rec_public_key))
    });
}

fn criterion_ecdsa_batch_verify(c: &mut Criterion) {
    let msg = H256::random();
    let mut rng = rand::thread_rng();
    let (ed25519_pks, ed25519_sigs): (Vec<_>, Vec<_>) = (0..100)
        .map(|_| {
            let private_key = Ed25519PrivateKey::generate(&mut rng);
            let public_key = private_key.public_key();
            let signature = private_key.sign(&msg);
            (public_key, signature)
        })
        .unzip();
    let (secp256k1_pks, secp256k1_sigs): (Vec<_>, Vec<_>) = (0..100)
        .map(|_| {
            let private_key = Secp256k1PrivateKey::generate(&mut rng);
            let public_key = private_key.public_key();
            let signature = private_key.sign(&msg);
            (public_key, signature)
        })
        .unzip();

    for num in [5, 10, 20, 50, 100] {
        let ed25519_sigs = ed25519_sigs.iter().take(num).cloned().collect::<Vec<_>>();
        let ed25519_pks = ed25519_pks.iter().take(num).cloned().collect::<Vec<_>>();
        let secp256k1_sigs = secp256k1_sigs.iter().take(num).cloned().collect::<Vec<_>>();
        let secp256k1_pks = secp256k1_pks.iter().take(num).cloned().collect::<Vec<_>>();

        c.bench_function(format!("Ed25519 Batch Verify {}", num).as_str(), |b| {
            b.iter(|| Ed25519BatchVerify::verify(&msg, &ed25519_sigs, &ed25519_pks))
        });

        c.bench_function(format!("Secp256k1 Batch Verify {}", num).as_str(), |b| {
            b.iter(|| Secp256k1BatchVerify::verify(&msg, &secp256k1_sigs, &secp256k1_pks))
        });
    }
}

criterion_group!(
    ecdsa_benches,
    criterion_ecdsa_sign,
    criterion_ecdsa_verify,
    criterion_ecdsa_batch_verify
);
criterion_main!(ecdsa_benches);
