// Copyright 2019-2021 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

//! Items specific to the [`Runtime`](crate::Runtime)'s webview.

use crate::{window::DetachedWindow, Icon};

use crate::menu::Menu;

use serde::Deserialize;
use serde_json::Value as JsonValue;
use tauri_utils::config::{WindowConfig, WindowUrl};

#[cfg(windows)]
use winapi::shared::windef::HWND;

use std::{fmt, path::PathBuf};

/// The attributes used to create an webview.
pub struct WebviewAttributes {
  pub url: WindowUrl,
  pub initialization_scripts: Vec<String>,
  pub data_directory: Option<PathBuf>,
  pub file_drop_handler_enabled: bool,
}

impl fmt::Debug for WebviewAttributes {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    f.debug_struct("WebviewAttributes")
      .field("url", &self.url)
      .field("initialization_scripts", &self.initialization_scripts)
      .field("data_directory", &self.data_directory)
      .field("file_drop_handler_enabled", &self.file_drop_handler_enabled)
      .finish()
  }
}

impl WebviewAttributes {
  /// Initializes the default attributes for a webview.
  pub fn new(url: WindowUrl) -> Self {
    Self {
      url,
      initialization_scripts: Vec::new(),
      data_directory: None,
      file_drop_handler_enabled: true,
    }
  }

  /// Sets the init script.
  pub fn initialization_script(mut self, script: &str) -> Self {
    self.initialization_scripts.push(script.to_string());
    self
  }

  /// Data directory for the webview.
  pub fn data_directory(mut self, data_directory: PathBuf) -> Self {
    self.data_directory.replace(data_directory);
    self
  }

  /// Disables the file drop handler. This is required to use drag and drop APIs on the front end on Windows.
  pub fn disable_file_drop_handler(mut self) -> Self {
    self.file_drop_handler_enabled = false;
    self
  }
}

/// Do **NOT** implement this trait except for use in a custom [`Runtime`](crate::Runtime).
///
/// This trait is separate from [`WindowBuilder`] to prevent "accidental" implementation.
pub trait WindowBuilderBase: fmt::Debug + Sized {}

/// A builder for all attributes related to a single webview.
///
/// This trait is only meant to be implemented by a custom [`Runtime`](crate::Runtime)
/// and not by applications.
pub trait WindowBuilder: WindowBuilderBase {
  /// Initializes a new window attributes builder.
  fn new() -> Self;

  /// Initializes a new webview builder from a [`WindowConfig`]
  fn with_config(config: WindowConfig) -> Self;

  /// Sets the menu for the window.
  fn menu(self, menu: Menu) -> Self;

  /// Show window in the center of the screen.
  fn center(self) -> Self;

  /// The initial position of the window's.
  fn position(self, x: f64, y: f64) -> Self;

  /// Window size.
  fn inner_size(self, min_width: f64, min_height: f64) -> Self;

  /// Window min inner size.
  fn min_inner_size(self, min_width: f64, min_height: f64) -> Self;

  /// Window max inner size.
  fn max_inner_size(self, max_width: f64, max_height: f64) -> Self;

  /// Whether the window is resizable or not.
  fn resizable(self, resizable: bool) -> Self;

  /// Whether the window has shadow or not.
  fn shadow(self, shadow: bool) -> Self;

  /// The title of the window in the title bar.
  fn title<S: Into<String>>(self, title: S) -> Self;

  /// Whether to start the window in fullscreen or not.
  fn fullscreen(self, fullscreen: bool) -> Self;

  /// Whether the window will be initially hidden or focused.
  fn focus(self) -> Self;

  /// Whether the window should be maximized upon creation.
  fn maximized(self, maximized: bool) -> Self;

  /// Whether the window should be immediately visible upon creation.
  fn visible(self, visible: bool) -> Self;

  /// Whether the the window should be transparent. If this is true, writing colors
  /// with alpha values different than `1.0` will produce a transparent window.
  fn transparent(self, transparent: bool) -> Self;

  /// Whether the window should have borders and bars.
  fn decorations(self, decorations: bool) -> Self;

  /// Whether the window should always be on top of other windows.
  fn always_on_top(self, always_on_top: bool) -> Self;

  /// Sets the window icon.
  fn icon(self, icon: Icon) -> crate::Result<Self>;

  /// Sets whether or not the window icon should be added to the taskbar.
  fn skip_taskbar(self, skip: bool) -> Self;

  /// Sets a parent to the window to be created.
  ///
  /// A child window has the WS_CHILD style and is confined to the client area of its parent window.
  ///
  /// For more information, see <https://docs.microsoft.com/en-us/windows/win32/winmsg/window-features#child-windows>
  #[cfg(windows)]
  fn parent_window(self, parent: HWND) -> Self;

  /// Set an owner to the window to be created.
  ///
  /// From MSDN:
  /// - An owned window is always above its owner in the z-order.
  /// - The system automatically destroys an owned window when its owner is destroyed.
  /// - An owned window is hidden when its owner is minimized.
  ///
  /// For more information, see <https://docs.microsoft.com/en-us/windows/win32/winmsg/window-features#owned-windows>
  #[cfg(windows)]
  fn owner_window(self, owner: HWND) -> Self;

  /// Whether the icon was set or not.
  fn has_icon(&self) -> bool;

  /// Whether the menu was set or not.
  fn has_menu(&self) -> bool;
}

/// Rpc request.
#[derive(Debug)]
pub struct RpcRequest {
  /// RPC command.
  pub command: String,
  /// Params.
  pub params: Option<JsonValue>,
}

/// The file drop event payload.
#[derive(Debug, Clone)]
#[non_exhaustive]
pub enum FileDropEvent {
  /// The file(s) have been dragged onto the window, but have not been dropped yet.
  Hovered(Vec<PathBuf>),
  /// The file(s) have been dropped onto the window.
  Dropped(Vec<PathBuf>),
  /// The file drop was aborted.
  Cancelled,
}

/// Rpc handler.
pub type WebviewRpcHandler<R> = Box<dyn Fn(DetachedWindow<R>, RpcRequest) + Send>;

/// File drop handler callback
/// Return `true` in the callback to block the OS' default behavior of handling a file drop.
pub type FileDropHandler<R> = Box<dyn Fn(FileDropEvent, DetachedWindow<R>) -> bool + Send>;

#[derive(Debug, Deserialize)]
pub struct InvokePayload {
  #[serde(rename = "__tauriModule")]
  pub tauri_module: Option<String>,
  pub callback: String,
  pub error: String,
  #[serde(rename = "__invokeKey")]
  pub key: u32,
  #[serde(flatten)]
  pub inner: JsonValue,
}
