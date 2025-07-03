#![allow(non_snake_case)]

use lazy_static::lazy_static;
use prometheus::{
    exponential_buckets, register_counter_vec, register_histogram_vec, CounterVec, Encoder,
    HistogramVec, TextEncoder,
};
use prometheus_static_metric::{auto_flush_from, make_auto_flush_static_metric};

make_auto_flush_static_metric! {
    pub label_enum RequestKind {
        eth_accounts,
        eth_blockNumber,
        eth_call,
        eth_chainId,
        eth_estimateGas,
        eth_gasPrice,
        eth_getBalance,
        eth_getBlockByHash,
        eth_getBlockByNumber,
        eth_getBlockTransactionCountByHash,
        eth_getBlockTransactionCountByNumber,
        eth_getTransactionCount,
        eth_getCode,
        eth_getFilterChanges,
        eth_getLogs,
        eth_getStorageAt,
        eth_getTransactionByBlockNumberAndIndex,
        eth_getTransactionByBlockHashAndIndex,
        eth_getTransactionByHash,
        web3_clientVersion,
        eth_fillTransaction,
        eth_getTransactionReceipt,
        eth_getUncleByBlockHashAndIndex,
        eth_getUncleByBlockNumberAndIndex,
        eth_getUncleCountByBlockHash,
        eth_getUncleCountByBlockNumber,
        eth_mining,
        eth_newFilter,
        eth_protocolVersion,
        eth_sendRawTransaction,
        eth_sign,
        eth_signTransaction,
        eth_syncing,
        eth_uninstallFilter,
        eth_subscribe,
        eth_unsubscribe,

        trace_call,
        trace_callMany,
        trace_rawTransaction,
        trace_replayTransaction,
        trace_replayBlockTransactions,
        trace_block,
        trace_filter,
        trace_get,
        trace_transaction,
        parity_blockReceipts,
    }

    pub struct RequestResultCounterVec: LocalCounter {
        "type" => RequestKind,
    }

    pub struct RequestTimeHistogramVec: LocalHistogram {
        "type" => RequestKind,
    }
}

lazy_static! {
    pub static ref API_REQUEST_COUNTER_VEC: CounterVec = register_counter_vec!(
        "axon_api_request_result_total",
        "Total number of request result",
        &["type"]
    )
    .expect("request result total");
    pub static ref API_REQUEST_TIME_HISTOGRAM_VEC: HistogramVec = register_histogram_vec!(
        "axon_api_request_time_cost_seconds",
        "Request process time cost",
        &["type"],
        exponential_buckets(0.001, 2.0, 20).expect("api req time expontial")
    )
    .expect("request time cost");
}

lazy_static! {
    pub static ref API_REQUEST_RESULT_COUNTER_VEC_STATIC: RequestResultCounterVec =
        auto_flush_from!(API_REQUEST_COUNTER_VEC, RequestResultCounterVec);
    pub static ref API_REQUEST_TIME_HISTOGRAM_STATIC: RequestTimeHistogramVec =
        auto_flush_from!(API_REQUEST_TIME_HISTOGRAM_VEC, RequestTimeHistogramVec);
}

pub fn all_metrics() -> Vec<u8> {
    let metric_families = prometheus::gather();
    let encoder = TextEncoder::new();
    let mut encoded_metrics = vec![];
    encoder
        .encode(&metric_families, &mut encoded_metrics)
        .unwrap();

    encoded_metrics
}
