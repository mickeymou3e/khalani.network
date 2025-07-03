use criterion::{criterion_group, criterion_main, BenchmarkId, Criterion};
use serde_bench::{Block, Transaction};

const KB: usize = 1024;
const MB: usize = 1024 * KB;

fn criterion_deserialize_transaction(c: &mut Criterion) {
    let mut group = c.benchmark_group("Deserialize Transaction");
    let txs = vec![
        Transaction::mock(1, KB / 2), // 512B
        Transaction::mock(4, KB),     // 1KB
        Transaction::mock(7, 5 * KB), // 5KB
    ];
    let input_group = txs
        .iter()
        .map(|tx| tx.group_raw_input())
        .collect::<Vec<_>>();

    for input in input_group.iter() {
        group.bench_with_input(
            BenchmarkId::new(format!("RLP-TX-DE-{}", input.size()), input),
            input,
            |b, input| b.iter(|| Transaction::from_rlp(input.rlp.clone())),
        );

        group.bench_with_input(
            BenchmarkId::new(format!("BCS-TX-DE-{}", input.size()), input),
            input,
            |b, input| b.iter(|| Transaction::from_bcs(input.bcs.clone())),
        );

        group.bench_with_input(
            BenchmarkId::new(format!("BORSH-TX-DE-{}", input.size()), input),
            input,
            |b, input| b.iter(|| Transaction::from_borsh(input.borsh.clone())),
        );
    }
    group.finish();
}

fn criterion_deserialize_block(c: &mut Criterion) {
    let mut group = c.benchmark_group("Deserialize Block");
    let blocks = vec![
        Block::mock(1, KB - 32 - 8, 1, 1, 32), // 1KB
        Block::mock(5, KB - 32 - 8, 2, 1, 32), // 5KB
        Block::mock(5, 2 * KB, 2, 1, 32),      // 10KB
        Block::mock(20, 5 * KB, 2, 1, 32),     // 100KB
        Block::mock(50, MB / 20, 2, 1, 32),    // 1MB
    ];
    let input_group = blocks
        .iter()
        .map(|b| b.group_raw_input())
        .collect::<Vec<_>>();

    for input in input_group.iter() {
        group.bench_with_input(
            BenchmarkId::new(format!("RLP-BLOCK-DE-{}", input.size()), input),
            input,
            |b, input| b.iter(|| Block::from_rlp(input.rlp.clone())),
        );

        group.bench_with_input(
            BenchmarkId::new(format!("BCS-BLOCK-DE-{}", input.size()), input),
            input,
            |b, input| b.iter(|| Block::from_bcs(input.bcs.clone())),
        );

        group.bench_with_input(
            BenchmarkId::new(format!("BORSH-BLOCK-DE-{}", input.size()), input),
            input,
            |b, input| b.iter(|| Block::from_borsh(input.borsh.clone())),
        );
    }
    group.finish();
}

criterion_group!(
    de_benches,
    criterion_deserialize_transaction,
    criterion_deserialize_block
);
criterion_main!(de_benches);
