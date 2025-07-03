mod kind;
mod macros;

pub use kind::ErrorKind;

use std::{error::Error as StdError, fmt, sync::Arc};

use derive_more::Display;

/// Top level error type of Mirax project.
#[derive(Clone, Display, Debug)]
#[display("Mirax Error\nKind: {}\nMessage {}", kind, inner)]
pub struct MiraxError {
    kind: ErrorKind,
    inner: AnyError,
}

impl StdError for MiraxError {}

impl From<MiraxError> for Box<dyn StdError + Send> {
    fn from(err: MiraxError) -> Self {
        Box::new(err) as Box<dyn StdError + Send>
    }
}

impl MiraxError {
    /// Create a new error with the kind and message.
    pub fn new(kind: ErrorKind, inner: impl Into<anyhow::Error>) -> Self {
        Self {
            kind,
            inner: AnyError(Arc::new(inner.into())),
        }
    }

    /// Returns the general category of this error.
    pub fn kind(&self) -> ErrorKind {
        self.kind
    }

    /// Downcast this error object by reference.
    pub fn downcast_ref<E>(&self) -> Option<&E>
    where
        E: fmt::Display + fmt::Debug + Send + Sync + 'static,
    {
        self.inner.0.downcast_ref::<E>()
    }

    /// The lowest level cause of this error — this error's cause's cause's cause etc.
    pub fn root_cause(&self) -> &(dyn StdError + 'static) {
        self.inner.0.root_cause()
    }

    /// The lower-level source of this error, if any.
    pub fn cause(&self) -> Option<&(dyn StdError + 'static)> {
        self.inner.0.chain().next()
    }
}

/// A wrapper of anyhow error.
#[derive(Clone, Display, Debug)]
pub struct AnyError(Arc<anyhow::Error>);
