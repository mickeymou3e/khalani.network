use lazy_static::lazy_static;
use prometheus::{
    CounterVec, HistogramVec, IntGauge, exponential_buckets, register_counter_vec,
    register_histogram_vec, register_int_gauge,
};
use prometheus_static_metric::{auto_flush_from, make_auto_flush_static_metric};

make_auto_flush_static_metric! {
    pub label_enum RequestKind {
        getSolutionForIntent,
        getConnectedSolvers,
        getSolutionsForSolver,
        getIntent,
        getIntentStatus,
        proposeSolution,
        proposeIntent,
        cancelIntent,
        createRefinement,
        queryRefinement,
        getNonce,
        withdrawMtokens,
        getIntentIdsByAuthor,
        getLiquidityIntentsByAuthor,
        getBridgeIntentsByAuthor,
        getHistoryForIntent,
        getFailedIntentsSince,
    }

    pub label_enum Request_Result {
        success,
        failure,
    }

    pub struct RequestResultCounterVec: LocalCounter {
        "type" => RequestKind,
        "result" => Request_Result,
    }

    pub struct RequestTimeHistogramVec: LocalHistogram {
        "type" => RequestKind,
    }
}

lazy_static! {
    pub static ref API_REQUEST_RESULT_COUNTER_VEC: CounterVec = register_counter_vec!(
        "medusa_api_request_result_total",
        "Total number of request result",
        &["type", "result"]
    )
    .expect("request result total");
    pub static ref API_REQUEST_TIME_HISTOGRAM_VEC: HistogramVec = register_histogram_vec!(
        "medusa_api_request_time_cost_seconds",
        "Request process time cost",
        &["type"],
        exponential_buckets(0.001, 2.0, 20).expect("api req time exponential")
    )
    .expect("request time cost");
    pub static ref WS_CONNECTION_GAUGE: IntGauge =
        register_int_gauge!("medusa_ws_connection", "Count of websocket connection").unwrap();
}

lazy_static! {
    pub static ref API_REQUEST_RESULT_COUNTER_VEC_STATIC: RequestResultCounterVec =
        auto_flush_from!(API_REQUEST_RESULT_COUNTER_VEC, RequestResultCounterVec);
    pub static ref API_REQUEST_TIME_HISTOGRAM_STATIC: RequestTimeHistogramVec =
        auto_flush_from!(API_REQUEST_TIME_HISTOGRAM_VEC, RequestTimeHistogramVec);
}

pub fn api_request_result_counter_vec_static() -> &'static RequestResultCounterVec {
    &API_REQUEST_RESULT_COUNTER_VEC_STATIC
}

pub fn api_request_time_histogram_static() -> &'static RequestTimeHistogramVec {
    &API_REQUEST_TIME_HISTOGRAM_STATIC
}

pub fn ws_connection_gauge() -> &'static IntGauge {
    &WS_CONNECTION_GAUGE
}
