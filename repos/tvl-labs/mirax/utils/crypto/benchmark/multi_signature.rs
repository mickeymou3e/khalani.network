use criterion::{criterion_group, criterion_main, Criterion};
use mirax_crypto::{
    bls::{
        BlsAggregatedPublicKey, BlsAggregatedSignature, BlsPrivateKey, BlsPublicKey, BlsSignature,
    },
    AggregatedPublicKey, AggregatedSignature, PrivateKey,
};
use mirax_primitive::H256;
use rand::rngs::ThreadRng;

struct Case {
    public_key: BlsPublicKey,
    signature: BlsSignature,
}

impl Case {
    fn new(rng: &mut ThreadRng, msg: H256) -> Self {
        let private_key = BlsPrivateKey::generate(rng);
        let public_key = private_key.public_key();
        let signature = private_key.sign(&msg);
        Self {
            public_key,
            signature,
        }
    }
}

fn criterion_bls_sign(c: &mut Criterion) {
    let bls_sk = BlsPrivateKey::generate(&mut rand::thread_rng());
    let msg = H256::random();

    c.bench_function("BLS sign", |b| {
        b.iter(|| {
            let _ = bls_sk.sign(&msg);
        })
    });
}

fn criterion_bls_signature(c: &mut Criterion) {
    let mut group = c.benchmark_group("BLS Signature");
    let msg = H256::random();
    let mut rng = rand::thread_rng();

    let cases = (0..100)
        .map(|_| Case::new(&mut rng, msg))
        .collect::<Vec<_>>();

    for num in [5, 10, 20, 50, 100] {
        let sigs = cases
            .iter()
            .take(num)
            .map(|case| case.signature.clone())
            .collect::<Vec<_>>();
        let pks = cases
            .iter()
            .take(num)
            .map(|case| case.public_key.clone())
            .collect::<Vec<_>>();
        let aggregate_sig = BlsAggregatedSignature::aggregate(sigs.clone()).unwrap();

        group.bench_function(format!("Aggregate {} Signatures", num), |b| {
            b.iter(|| {
                BlsAggregatedSignature::aggregate(sigs.clone()).unwrap();
            })
        });

        group.bench_function(format!("Aggregate {} Public Keys", num), |b| {
            b.iter(|| {
                BlsAggregatedPublicKey::aggregate(pks.clone()).unwrap();
            })
        });

        group.bench_function(format!("Verify {} Aggregate Signature", num), |b| {
            b.iter(|| {
                let aggregated_pk = BlsAggregatedPublicKey::aggregate(pks.clone()).unwrap();
                aggregate_sig.aggregate_verify(&msg, aggregated_pk).unwrap();
            })
        });
    }
}

criterion_group!(bls_benches, criterion_bls_sign, criterion_bls_signature);
criterion_main!(bls_benches);
