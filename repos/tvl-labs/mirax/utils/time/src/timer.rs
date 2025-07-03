use std::pin::Pin;
use std::task::{Context, Poll};
use std::time::Duration;

use flume::Sender;
use futures::Future;
use pin_project::pin_project;
use tokio::time::{sleep, sleep_until, Instant, Sleep};

/// Pinned future of sleep.
pub struct PinnedSleep {
    inner: Pin<Box<Sleep>>,
    duration: Duration,
}

impl Future for PinnedSleep {
    type Output = ();

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        self.inner.as_mut().poll(cx)
    }
}

impl PinnedSleep {
    pub fn new(duration: Duration) -> Self {
        Self {
            inner: Box::pin(sleep(duration)),
            duration,
        }
    }

    pub fn is_elapsed(&self) -> bool {
        self.inner.is_elapsed()
    }

    pub fn reset(&mut self) {
        self.inner.as_mut().reset(Instant::now() + self.duration);
    }

    pub fn reset_new(&mut self, duration: Duration) {
        let deadline = Instant::now() + duration;
        self.inner.as_mut().reset(deadline);
    }
}

/// A timer that always return the notify message when it is done.
#[pin_project]
pub struct Timer<N> {
    #[pin]
    sleep: Sleep,
    notify: N,
    tx: Sender<N>,
}

impl<N: Clone> Future for Timer<N> {
    type Output = ();

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        let notify = self.notify.clone();
        let tx_clone = self.tx.clone();

        self.project().sleep.poll(cx).map(|_| {
            let _ = tx_clone.send(notify);
        })
    }
}

impl<N: Clone> Timer<N> {
    pub fn new(duration: Duration, notify: N, tx: Sender<N>) -> Self {
        let sleep = sleep_until(Instant::now() + duration);
        Timer { sleep, notify, tx }
    }
}
