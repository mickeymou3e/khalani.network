use criterion::{criterion_group, criterion_main, BenchmarkId, Criterion};
use serde_bench::{Block, Transaction};

const KB: usize = 1024;
const MB: usize = 1024 * KB;

fn criterion_serialize_transaction(c: &mut Criterion) {
    let mut group = c.benchmark_group("Serialize Transaction");
    let txs = vec![
        Transaction::mock(1, KB / 2), // 512B
        Transaction::mock(4, KB),     // 1KB
        Transaction::mock(7, 5 * KB), // 5KB
    ];

    for input in txs.iter() {
        group.bench_with_input(
            BenchmarkId::new(format!("RLP-TX-SER-{}", input.size()), input),
            input,
            |b, input| b.iter(|| input.to_rlp()),
        );

        group.bench_with_input(
            BenchmarkId::new(format!("BCS-TX-SER-{}", input.size()), input),
            input,
            |b, input| b.iter(|| input.to_bcs()),
        );

        group.bench_with_input(
            BenchmarkId::new(format!("BORSH-TX-SER-{}", input.size()), input),
            input,
            |b, input| b.iter(|| input.to_borsh()),
        );
    }
    group.finish();
}

fn criterion_serialize_block(c: &mut Criterion) {
    let mut group = c.benchmark_group("Serialize Block");
    let txs = vec![
        Block::mock(1, KB - 32 - 8, 1, 1, 32), // 1KB
        Block::mock(5, KB - 32 - 8, 2, 1, 32), // 5KB
        Block::mock(5, 2 * KB, 2, 1, 32),      // 10KB
        Block::mock(20, 5 * KB, 2, 1, 32),     // 100KB
        Block::mock(50, MB / 20, 2, 1, 32),    // 1MB
    ];

    for input in txs.iter() {
        group.bench_with_input(
            BenchmarkId::new(format!("RLP-BLOCK-SER-{}", input.size()), input),
            input,
            |b, input| b.iter(|| input.to_rlp()),
        );

        group.bench_with_input(
            BenchmarkId::new(format!("BCS-BLOCK-SER-{}", input.size()), input),
            input,
            |b, input| b.iter(|| input.to_bcs()),
        );

        group.bench_with_input(
            BenchmarkId::new(format!("BORSH-BLOCK-SER-{}", input.size()), input),
            input,
            |b, input| b.iter(|| input.to_borsh()),
        );
    }
    group.finish();
}

criterion_group!(
    ser_benches,
    criterion_serialize_transaction,
    criterion_serialize_block
);
criterion_main!(ser_benches);
