use std::pin::Pin;
use std::task::{ready, Context, Poll};

use flume::Receiver;
use futures::{Future, FutureExt};
use tokio::signal::unix::{self, SignalKind};

use tokio::task::JoinHandle;

/// Signal handler for stopping Mirax process.
#[derive(Clone)]
pub struct ShutdownRx {
    inner_rx: Receiver<SignalKind>,
}

impl Future for ShutdownRx {
    type Output = ();

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        let _ = ready!(self.inner_rx.recv_async().poll_unpin(cx));
        Poll::Ready(())
    }
}

impl ShutdownRx {
    pub(crate) fn new(inner_rx: Receiver<SignalKind>) -> Self {
        Self { inner_rx }
    }
}

/// Initialize a signal handler for stopping Mirax process.
pub async fn init_stop_signal() -> (JoinHandle<()>, ShutdownRx) {
    let (tx, rx) = flume::bounded(1);
    let rx = ShutdownRx::new(rx);

    let handle = tokio::spawn(async move {
        #[cfg(windows)]
        let _ = tokio::signal::ctrl_c().await;
        #[cfg(unix)]
        {
            let mut interrupt_signal = unix::signal(SignalKind::interrupt()).unwrap();
            let mut terminate_signal = unix::signal(SignalKind::terminate()).unwrap();
            tokio::select! {
                _ = interrupt_signal.recv() => {}
                _ = terminate_signal.recv() => {}
            };
        }

        tx.send(SignalKind::interrupt()).unwrap();
    });

    (handle, rx)
}
