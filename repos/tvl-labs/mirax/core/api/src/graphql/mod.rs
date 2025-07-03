pub mod mirax;

use async_graphql::{http::GraphiQLSource, EmptyMutation, EmptySubscription, Schema};
use async_graphql_axum::GraphQL;
use axum::{
    response::{self, IntoResponse},
    routing::get,
    Router,
};
use mirax_config::ApiConfig;
use mirax_signal::ShutdownRx;
use mirax_types::MiraxResult;
use tokio::{net::TcpListener, task::JoinHandle};

use crate::{backend::traits::APIBackend, error::APIError};

async fn graphiql() -> impl IntoResponse {
    response::Html(GraphiQLSource::build().endpoint("/graphql").finish())
}

#[derive(Default)]
pub struct GraphQLServer {
    inner: Option<JoinHandle<Result<(), APIError>>>,
}

impl GraphQLServer {
    pub fn stop(mut self) -> Result<(), APIError> {
        if let Some(inner) = self.inner.take() {
            inner.abort();
        }

        Ok(())
    }
}

pub async fn run_graphql_server<Backend: APIBackend + 'static>(
    config: ApiConfig,
    backend: Backend,
    shutdown_rx: ShutdownRx,
) -> MiraxResult<GraphQLServer> {
    let mut server = GraphQLServer::default();

    if let Some(addr) = config.graphql.http_listening_address {
        let schema = Schema::build(
            mirax::QueryRoot::<Backend>::new(),
            EmptyMutation,
            EmptySubscription,
        )
        .data(backend)
        .finish();

        let app = Router::new().route(
            "/graphql",
            get(graphiql).post_service(GraphQL::new(schema.clone())),
        );

        let listening = TcpListener::bind(addr).await.map_err(APIError::from)?;
        let handle = tokio::spawn(async move {
            axum::serve(listening, app)
                .with_graceful_shutdown(shutdown_rx)
                .await
                .map_err(APIError::from)
        });

        server.inner = Some(handle);
    }

    Ok(server)
}
