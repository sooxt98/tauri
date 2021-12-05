// Copyright 2019-2021 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

//! The [`wry`] Tauri [`Runtime`].

use tauri_runtime::{
  http::{
    Request as HttpRequest, RequestParts as HttpRequestParts, Response as HttpResponse,
    ResponseParts as HttpResponseParts,
  },
  menu::{CustomMenuItem, Menu, MenuEntry, MenuHash, MenuItem, MenuUpdate, Submenu},
  monitor::Monitor,
  webview::{
    FileDropEvent, FileDropHandler, RpcRequest, WebviewRpcHandler, WindowBuilder, WindowBuilderBase,
  },
  window::{
    dpi::{LogicalPosition, LogicalSize, PhysicalPosition, PhysicalSize, Position, Size},
    DetachedWindow, PendingWindow, WindowEvent,
  },
  ClipboardManager, Dispatch, Error, ExitRequestedEventAction, GlobalShortcutManager, Icon, Result,
  RunEvent, RunIteration, Runtime, RuntimeHandle, UserAttentionType,
};

use tauri_runtime::window::MenuEvent;
#[cfg(feature = "system-tray")]
use tauri_runtime::{SystemTray, SystemTrayEvent};
#[cfg(windows)]
use winapi::shared::windef::HWND;
#[cfg(all(feature = "system-tray", target_os = "macos"))]
use wry::application::platform::macos::{SystemTrayBuilderExtMacOS, SystemTrayExtMacOS};
#[cfg(target_os = "linux")]
use wry::application::platform::unix::{WindowBuilderExtUnix, WindowExtUnix};
#[cfg(windows)]
use wry::application::platform::windows::{WindowBuilderExtWindows, WindowExtWindows};

#[cfg(feature = "system-tray")]
use wry::application::system_tray::{SystemTray as WrySystemTray, SystemTrayBuilder};

use tauri_utils::config::WindowConfig;
use uuid::Uuid;
use wry::{
  application::{
    accelerator::{Accelerator, AcceleratorId},
    clipboard::Clipboard,
    dpi::{
      LogicalPosition as WryLogicalPosition, LogicalSize as WryLogicalSize,
      PhysicalPosition as WryPhysicalPosition, PhysicalSize as WryPhysicalSize,
      Position as WryPosition, Size as WrySize,
    },
    event::{Event, StartCause, WindowEvent as WryWindowEvent},
    event_loop::{ControlFlow, EventLoop, EventLoopProxy, EventLoopWindowTarget},
    global_shortcut::{GlobalShortcut, ShortcutManager as WryShortcutManager},
    menu::{
      CustomMenuItem as WryCustomMenuItem, MenuBar, MenuId as WryMenuId, MenuItem as WryMenuItem,
      MenuItemAttributes as WryMenuItemAttributes, MenuType,
    },
    monitor::MonitorHandle,
    window::{Fullscreen, Icon as WindowIcon, UserAttentionType as WryUserAttentionType},
  },
  http::{
    Request as WryHttpRequest, RequestParts as WryRequestParts, Response as WryHttpResponse,
    ResponseParts as WryResponseParts,
  },
  webview::{
    FileDropEvent as WryFileDropEvent, RpcRequest as WryRpcRequest, RpcResponse, WebContext,
    WebView, WebViewBuilder,
  },
};

pub use wry::application::window::{Window, WindowBuilder as WryWindowBuilder, WindowId};

#[cfg(target_os = "windows")]
use wry::webview::WebviewExtWindows;

#[cfg(target_os = "macos")]
use tauri_runtime::{menu::NativeImage, ActivationPolicy};
#[cfg(target_os = "macos")]
pub use wry::application::platform::macos::{
  ActivationPolicy as WryActivationPolicy, CustomMenuItemExtMacOS, EventLoopExtMacOS,
  NativeImage as WryNativeImage, WindowExtMacOS,
};

use std::{
  collections::{
    hash_map::Entry::{Occupied, Vacant},
    HashMap,
  },
  convert::TryFrom,
  fmt,
  fs::read,
  path::PathBuf,
  sync::{
    atomic::{AtomicBool, Ordering},
    mpsc::{channel, Sender},
    Arc, Mutex, MutexGuard,
  },
  thread::{current as current_thread, ThreadId},
};

#[cfg(feature = "system-tray")]
mod system_tray;
#[cfg(feature = "system-tray")]
use system_tray::*;

type WebContextStore = Mutex<HashMap<Option<PathBuf>, WebContext>>;
// window
type WindowEventHandler = Box<dyn Fn(&WindowEvent) + Send>;
type WindowEventListenersMap = Arc<Mutex<HashMap<Uuid, WindowEventHandler>>>;
type WindowEventListeners = Arc<Mutex<HashMap<WindowId, WindowEventListenersMap>>>;
// global shortcut
type GlobalShortcutListeners = Arc<Mutex<HashMap<AcceleratorId, Box<dyn Fn() + Send>>>>;
// menu
pub type MenuEventHandler = Box<dyn Fn(&MenuEvent) + Send>;
pub type MenuEventListeners = Arc<Mutex<HashMap<WindowId, WindowMenuEventListeners>>>;
pub type WindowMenuEventListeners = Arc<Mutex<HashMap<Uuid, MenuEventHandler>>>;

macro_rules! dispatcher_getter {
  ($self: ident, $message: expr) => {{
    if current_thread().id() == $self.context.main_thread_id {
      panic!("This API cannot be called on the main thread. Try using `std::thread::spawn` or `tauri::async_runtime::spawn`.");
    }
    if !$self.context.is_event_loop_running.load(Ordering::Relaxed) {
      panic!("This API cannot be called when the event loop is not running. Try using `std::thread::spawn` or `tauri::async_runtime::spawn`.");
    }
    let (tx, rx) = channel();
    $self
      .context
      .proxy
      .send_event(Message::Window($self.window_id, $message(tx)))
      .map_err(|_| Error::FailedToSendMessage)?;
    rx.recv().unwrap()
  }};
}

macro_rules! getter {
  ($self: ident, $rx: expr, $message: expr) => {{
    if current_thread().id() == $self.context.main_thread_id {
      panic!("This API cannot be called on the main thread. Try using `std::thread::spawn` or `tauri::async_runtime::spawn`.");
    }
    if !$self.context.is_event_loop_running.load(Ordering::Relaxed) {
      panic!("This API cannot be called when the event loop is not running. Try using `std::thread::spawn` or `tauri::async_runtime::spawn`.");
    }
    $self
      .context
      .proxy
      .send_event($message)
      .map_err(|_| Error::FailedToSendMessage)?;
    $rx.recv().unwrap()
  }};
}

#[derive(Debug, Clone)]
struct EventLoopContext {
  main_thread_id: ThreadId,
  is_event_loop_running: Arc<AtomicBool>,
  proxy: EventLoopProxy<Message>,
}

struct HttpRequestPartsWrapper(HttpRequestParts);

impl From<HttpRequestPartsWrapper> for HttpRequestParts {
  fn from(parts: HttpRequestPartsWrapper) -> Self {
    Self {
      method: parts.0.method,
      uri: parts.0.uri,
      headers: parts.0.headers,
    }
  }
}

impl From<HttpRequestParts> for HttpRequestPartsWrapper {
  fn from(request: HttpRequestParts) -> Self {
    Self(HttpRequestParts {
      method: request.method,
      uri: request.uri,
      headers: request.headers,
    })
  }
}

impl From<WryRequestParts> for HttpRequestPartsWrapper {
  fn from(request: WryRequestParts) -> Self {
    Self(HttpRequestParts {
      method: request.method,
      uri: request.uri,
      headers: request.headers,
    })
  }
}

struct HttpRequestWrapper(HttpRequest);

impl From<&WryHttpRequest> for HttpRequestWrapper {
  fn from(req: &WryHttpRequest) -> Self {
    Self(HttpRequest {
      body: req.body.clone(),
      head: HttpRequestPartsWrapper::from(req.head.clone()).0,
    })
  }
}

// response
struct HttpResponsePartsWrapper(WryResponseParts);
impl From<HttpResponseParts> for HttpResponsePartsWrapper {
  fn from(response: HttpResponseParts) -> Self {
    Self(WryResponseParts {
      mimetype: response.mimetype,
      status: response.status,
      version: response.version,
      headers: response.headers,
    })
  }
}

struct HttpResponseWrapper(WryHttpResponse);
impl From<HttpResponse> for HttpResponseWrapper {
  fn from(response: HttpResponse) -> Self {
    Self(WryHttpResponse {
      body: response.body,
      head: HttpResponsePartsWrapper::from(response.head).0,
    })
  }
}

pub struct MenuItemAttributesWrapper<'a>(pub WryMenuItemAttributes<'a>);

impl<'a> From<&'a CustomMenuItem> for MenuItemAttributesWrapper<'a> {
  fn from(item: &'a CustomMenuItem) -> Self {
    let mut attributes = WryMenuItemAttributes::new(&item.title)
      .with_enabled(item.enabled)
      .with_selected(item.selected)
      .with_id(WryMenuId(item.id));
    if let Some(accelerator) = item.keyboard_accelerator.as_ref() {
      attributes = attributes.with_accelerators(&accelerator.parse().expect("invalid accelerator"));
    }
    Self(attributes)
  }
}

pub struct MenuItemWrapper(pub WryMenuItem);

impl From<MenuItem> for MenuItemWrapper {
  fn from(item: MenuItem) -> Self {
    match item {
      MenuItem::About(v) => Self(WryMenuItem::About(v)),
      MenuItem::Hide => Self(WryMenuItem::Hide),
      MenuItem::Services => Self(WryMenuItem::Services),
      MenuItem::HideOthers => Self(WryMenuItem::HideOthers),
      MenuItem::ShowAll => Self(WryMenuItem::ShowAll),
      MenuItem::CloseWindow => Self(WryMenuItem::CloseWindow),
      MenuItem::Quit => Self(WryMenuItem::Quit),
      MenuItem::Copy => Self(WryMenuItem::Copy),
      MenuItem::Cut => Self(WryMenuItem::Cut),
      MenuItem::Undo => Self(WryMenuItem::Undo),
      MenuItem::Redo => Self(WryMenuItem::Redo),
      MenuItem::SelectAll => Self(WryMenuItem::SelectAll),
      MenuItem::Paste => Self(WryMenuItem::Paste),
      MenuItem::EnterFullScreen => Self(WryMenuItem::EnterFullScreen),
      MenuItem::Minimize => Self(WryMenuItem::Minimize),
      MenuItem::Zoom => Self(WryMenuItem::Zoom),
      MenuItem::Separator => Self(WryMenuItem::Separator),
      _ => unimplemented!(),
    }
  }
}

#[cfg(target_os = "macos")]
pub struct NativeImageWrapper(pub WryNativeImage);

#[cfg(target_os = "macos")]
impl std::fmt::Debug for NativeImageWrapper {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    f.debug_struct("NativeImageWrapper").finish()
  }
}

#[cfg(target_os = "macos")]
impl From<NativeImage> for NativeImageWrapper {
  fn from(image: NativeImage) -> NativeImageWrapper {
    let wry_image = match image {
      NativeImage::Add => WryNativeImage::Add,
      NativeImage::Advanced => WryNativeImage::Advanced,
      NativeImage::Bluetooth => WryNativeImage::Bluetooth,
      NativeImage::Bookmarks => WryNativeImage::Bookmarks,
      NativeImage::Caution => WryNativeImage::Caution,
      NativeImage::ColorPanel => WryNativeImage::ColorPanel,
      NativeImage::ColumnView => WryNativeImage::ColumnView,
      NativeImage::Computer => WryNativeImage::Computer,
      NativeImage::EnterFullScreen => WryNativeImage::EnterFullScreen,
      NativeImage::Everyone => WryNativeImage::Everyone,
      NativeImage::ExitFullScreen => WryNativeImage::ExitFullScreen,
      NativeImage::FlowView => WryNativeImage::FlowView,
      NativeImage::Folder => WryNativeImage::Folder,
      NativeImage::FolderBurnable => WryNativeImage::FolderBurnable,
      NativeImage::FolderSmart => WryNativeImage::FolderSmart,
      NativeImage::FollowLinkFreestanding => WryNativeImage::FollowLinkFreestanding,
      NativeImage::FontPanel => WryNativeImage::FontPanel,
      NativeImage::GoLeft => WryNativeImage::GoLeft,
      NativeImage::GoRight => WryNativeImage::GoRight,
      NativeImage::Home => WryNativeImage::Home,
      NativeImage::IChatTheater => WryNativeImage::IChatTheater,
      NativeImage::IconView => WryNativeImage::IconView,
      NativeImage::Info => WryNativeImage::Info,
      NativeImage::InvalidDataFreestanding => WryNativeImage::InvalidDataFreestanding,
      NativeImage::LeftFacingTriangle => WryNativeImage::LeftFacingTriangle,
      NativeImage::ListView => WryNativeImage::ListView,
      NativeImage::LockLocked => WryNativeImage::LockLocked,
      NativeImage::LockUnlocked => WryNativeImage::LockUnlocked,
      NativeImage::MenuMixedState => WryNativeImage::MenuMixedState,
      NativeImage::MenuOnState => WryNativeImage::MenuOnState,
      NativeImage::MobileMe => WryNativeImage::MobileMe,
      NativeImage::MultipleDocuments => WryNativeImage::MultipleDocuments,
      NativeImage::Network => WryNativeImage::Network,
      NativeImage::Path => WryNativeImage::Path,
      NativeImage::PreferencesGeneral => WryNativeImage::PreferencesGeneral,
      NativeImage::QuickLook => WryNativeImage::QuickLook,
      NativeImage::RefreshFreestanding => WryNativeImage::RefreshFreestanding,
      NativeImage::Refresh => WryNativeImage::Refresh,
      NativeImage::Remove => WryNativeImage::Remove,
      NativeImage::RevealFreestanding => WryNativeImage::RevealFreestanding,
      NativeImage::RightFacingTriangle => WryNativeImage::RightFacingTriangle,
      NativeImage::Share => WryNativeImage::Share,
      NativeImage::Slideshow => WryNativeImage::Slideshow,
      NativeImage::SmartBadge => WryNativeImage::SmartBadge,
      NativeImage::StatusAvailable => WryNativeImage::StatusAvailable,
      NativeImage::StatusNone => WryNativeImage::StatusNone,
      NativeImage::StatusPartiallyAvailable => WryNativeImage::StatusPartiallyAvailable,
      NativeImage::StatusUnavailable => WryNativeImage::StatusUnavailable,
      NativeImage::StopProgressFreestanding => WryNativeImage::StopProgressFreestanding,
      NativeImage::StopProgress => WryNativeImage::StopProgress,

      NativeImage::TrashEmpty => WryNativeImage::TrashEmpty,
      NativeImage::TrashFull => WryNativeImage::TrashFull,
      NativeImage::User => WryNativeImage::User,
      NativeImage::UserAccounts => WryNativeImage::UserAccounts,
      NativeImage::UserGroup => WryNativeImage::UserGroup,
      NativeImage::UserGuest => WryNativeImage::UserGuest,
    };
    Self(wry_image)
  }
}

#[derive(Debug, Clone)]
pub struct GlobalShortcutWrapper(GlobalShortcut);

unsafe impl Send for GlobalShortcutWrapper {}

/// Wrapper around [`WryShortcutManager`].
#[derive(Clone)]
pub struct GlobalShortcutManagerHandle {
  context: EventLoopContext,
  shortcuts: Arc<Mutex<HashMap<String, (AcceleratorId, GlobalShortcutWrapper)>>>,
  listeners: GlobalShortcutListeners,
}

impl fmt::Debug for GlobalShortcutManagerHandle {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    f.debug_struct("GlobalShortcutManagerHandle")
      .field("context", &self.context)
      .field("shortcuts", &self.shortcuts)
      .finish()
  }
}

impl GlobalShortcutManager for GlobalShortcutManagerHandle {
  fn is_registered(&self, accelerator: &str) -> Result<bool> {
    let (tx, rx) = channel();
    Ok(getter!(
      self,
      rx,
      Message::GlobalShortcut(GlobalShortcutMessage::IsRegistered(
        accelerator.parse().expect("invalid accelerator"),
        tx
      ))
    ))
  }

  fn register<F: Fn() + Send + 'static>(&mut self, accelerator: &str, handler: F) -> Result<()> {
    let wry_accelerator: Accelerator = accelerator.parse().expect("invalid accelerator");
    let id = wry_accelerator.clone().id();
    let (tx, rx) = channel();
    let shortcut = getter!(
      self,
      rx,
      Message::GlobalShortcut(GlobalShortcutMessage::Register(wry_accelerator, tx))
    )?;

    self.listeners.lock().unwrap().insert(id, Box::new(handler));
    self
      .shortcuts
      .lock()
      .unwrap()
      .insert(accelerator.into(), (id, shortcut));

    Ok(())
  }

  fn unregister_all(&mut self) -> Result<()> {
    let (tx, rx) = channel();
    getter!(
      self,
      rx,
      Message::GlobalShortcut(GlobalShortcutMessage::UnregisterAll(tx))
    )?;
    self.listeners.lock().unwrap().clear();
    self.shortcuts.lock().unwrap().clear();
    Ok(())
  }

  fn unregister(&mut self, accelerator: &str) -> Result<()> {
    if let Some((accelerator_id, shortcut)) = self.shortcuts.lock().unwrap().remove(accelerator) {
      let (tx, rx) = channel();
      getter!(
        self,
        rx,
        Message::GlobalShortcut(GlobalShortcutMessage::Unregister(shortcut, tx))
      )?;
      self.listeners.lock().unwrap().remove(&accelerator_id);
    }
    Ok(())
  }
}

#[derive(Debug, Clone)]
pub struct ClipboardManagerWrapper {
  context: EventLoopContext,
}

impl ClipboardManager for ClipboardManagerWrapper {
  fn read_text(&self) -> Result<Option<String>> {
    let (tx, rx) = channel();
    Ok(getter!(
      self,
      rx,
      Message::Clipboard(ClipboardMessage::ReadText(tx))
    ))
  }

  fn write_text<T: Into<String>>(&mut self, text: T) -> Result<()> {
    let (tx, rx) = channel();
    getter!(
      self,
      rx,
      Message::Clipboard(ClipboardMessage::WriteText(text.into(), tx))
    );
    Ok(())
  }
}

/// Wrapper around a [`wry::application::window::Icon`] that can be created from an [`Icon`].
pub struct WryIcon(WindowIcon);

fn icon_err<E: std::error::Error + Send + 'static>(e: E) -> Error {
  Error::InvalidIcon(Box::new(e))
}

impl TryFrom<Icon> for WryIcon {
  type Error = Error;
  fn try_from(icon: Icon) -> std::result::Result<Self, Self::Error> {
    let image_bytes = match icon {
      Icon::File(path) => read(path).map_err(icon_err)?,
      Icon::Raw(raw) => raw,
      _ => unimplemented!(),
    };
    let extension = infer::get(&image_bytes)
      .expect("could not determine icon extension")
      .extension();
    match extension {
      #[cfg(windows)]
      "ico" => {
        let icon_dir = ico::IconDir::read(std::io::Cursor::new(image_bytes)).map_err(icon_err)?;
        let entry = &icon_dir.entries()[0];
        let icon = WindowIcon::from_rgba(
          entry.decode().map_err(icon_err)?.rgba_data().to_vec(),
          entry.width(),
          entry.height(),
        )
        .map_err(icon_err)?;
        Ok(Self(icon))
      }
      #[cfg(target_os = "linux")]
      "png" => {
        let decoder = png::Decoder::new(std::io::Cursor::new(image_bytes));
        let (info, mut reader) = decoder.read_info().map_err(icon_err)?;
        let mut buffer = Vec::new();
        while let Ok(Some(row)) = reader.next_row() {
          buffer.extend(row);
        }
        let icon = WindowIcon::from_rgba(buffer, info.width, info.height).map_err(icon_err)?;
        Ok(Self(icon))
      }
      _ => panic!(
        "image `{}` extension not supported; please file a Tauri feature request",
        extension
      ),
    }
  }
}

struct WindowEventWrapper(Option<WindowEvent>);

impl<'a> From<&WryWindowEvent<'a>> for WindowEventWrapper {
  fn from(event: &WryWindowEvent<'a>) -> Self {
    let event = match event {
      WryWindowEvent::Resized(size) => WindowEvent::Resized(PhysicalSizeWrapper(*size).into()),
      WryWindowEvent::Moved(position) => {
        WindowEvent::Moved(PhysicalPositionWrapper(*position).into())
      }
      WryWindowEvent::CloseRequested => WindowEvent::CloseRequested,
      WryWindowEvent::Destroyed => WindowEvent::Destroyed,
      WryWindowEvent::ScaleFactorChanged {
        scale_factor,
        new_inner_size,
      } => WindowEvent::ScaleFactorChanged {
        scale_factor: *scale_factor,
        new_inner_size: PhysicalSizeWrapper(**new_inner_size).into(),
      },
      _ => return Self(None),
    };
    Self(Some(event))
  }
}

impl From<&WebviewEvent> for WindowEventWrapper {
  fn from(event: &WebviewEvent) -> Self {
    let event = match event {
      WebviewEvent::Focused(focused) => WindowEvent::Focused(*focused),
    };
    Self(Some(event))
  }
}

pub struct MonitorHandleWrapper(MonitorHandle);

impl From<MonitorHandleWrapper> for Monitor {
  fn from(monitor: MonitorHandleWrapper) -> Monitor {
    Self {
      name: monitor.0.name(),
      position: PhysicalPositionWrapper(monitor.0.position()).into(),
      size: PhysicalSizeWrapper(monitor.0.size()).into(),
      scale_factor: monitor.0.scale_factor(),
    }
  }
}

struct PhysicalPositionWrapper<T>(WryPhysicalPosition<T>);

impl<T> From<PhysicalPositionWrapper<T>> for PhysicalPosition<T> {
  fn from(position: PhysicalPositionWrapper<T>) -> Self {
    Self {
      x: position.0.x,
      y: position.0.y,
    }
  }
}

impl<T> From<PhysicalPosition<T>> for PhysicalPositionWrapper<T> {
  fn from(position: PhysicalPosition<T>) -> Self {
    Self(WryPhysicalPosition {
      x: position.x,
      y: position.y,
    })
  }
}

struct LogicalPositionWrapper<T>(WryLogicalPosition<T>);

impl<T> From<LogicalPosition<T>> for LogicalPositionWrapper<T> {
  fn from(position: LogicalPosition<T>) -> Self {
    Self(WryLogicalPosition {
      x: position.x,
      y: position.y,
    })
  }
}

struct PhysicalSizeWrapper<T>(WryPhysicalSize<T>);

impl<T> From<PhysicalSizeWrapper<T>> for PhysicalSize<T> {
  fn from(size: PhysicalSizeWrapper<T>) -> Self {
    Self {
      width: size.0.width,
      height: size.0.height,
    }
  }
}

impl<T> From<PhysicalSize<T>> for PhysicalSizeWrapper<T> {
  fn from(size: PhysicalSize<T>) -> Self {
    Self(WryPhysicalSize {
      width: size.width,
      height: size.height,
    })
  }
}

struct LogicalSizeWrapper<T>(WryLogicalSize<T>);

impl<T> From<LogicalSize<T>> for LogicalSizeWrapper<T> {
  fn from(size: LogicalSize<T>) -> Self {
    Self(WryLogicalSize {
      width: size.width,
      height: size.height,
    })
  }
}

struct SizeWrapper(WrySize);

impl From<Size> for SizeWrapper {
  fn from(size: Size) -> Self {
    match size {
      Size::Logical(s) => Self(WrySize::Logical(LogicalSizeWrapper::from(s).0)),
      Size::Physical(s) => Self(WrySize::Physical(PhysicalSizeWrapper::from(s).0)),
    }
  }
}

struct PositionWrapper(WryPosition);

impl From<Position> for PositionWrapper {
  fn from(position: Position) -> Self {
    match position {
      Position::Logical(s) => Self(WryPosition::Logical(LogicalPositionWrapper::from(s).0)),
      Position::Physical(s) => Self(WryPosition::Physical(PhysicalPositionWrapper::from(s).0)),
    }
  }
}

#[derive(Debug, Clone)]
pub struct UserAttentionTypeWrapper(WryUserAttentionType);

impl From<UserAttentionType> for UserAttentionTypeWrapper {
  fn from(request_type: UserAttentionType) -> UserAttentionTypeWrapper {
    let o = match request_type {
      UserAttentionType::Critical => WryUserAttentionType::Critical,
      UserAttentionType::Informational => WryUserAttentionType::Informational,
    };
    Self(o)
  }
}

#[derive(Debug, Clone, Default)]
pub struct WindowBuilderWrapper {
  inner: WryWindowBuilder,
  center: bool,
  menu: Menu,
}

// safe since `menu_items` are read only here
unsafe impl Send for WindowBuilderWrapper {}

impl WindowBuilderBase for WindowBuilderWrapper {}
impl WindowBuilder for WindowBuilderWrapper {
  fn new() -> Self {
    Default::default()
  }

  fn with_config(config: WindowConfig) -> Self {
    let mut window = WindowBuilderWrapper::new()
      .title(config.title.to_string())
      .inner_size(config.width, config.height)
      .visible(config.visible)
      .resizable(config.resizable)
      .decorations(config.decorations)
      .maximized(config.maximized)
      .fullscreen(config.fullscreen)
      .transparent(config.transparent)
      .always_on_top(config.always_on_top)
      .skip_taskbar(config.skip_taskbar);

    if let (Some(min_width), Some(min_height)) = (config.min_width, config.min_height) {
      window = window.min_inner_size(min_width, min_height);
    }
    if let (Some(max_width), Some(max_height)) = (config.max_width, config.max_height) {
      window = window.max_inner_size(max_width, max_height);
    }
    if let (Some(x), Some(y)) = (config.x, config.y) {
      window = window.position(x, y);
    }

    if config.center {
      window = window.center();
    }

    window
  }

  fn menu(mut self, menu: Menu) -> Self {
    self.menu = convert_menu_id(Menu::new(), menu);
    self
  }

  fn center(mut self) -> Self {
    self.center = true;
    self
  }

  fn position(mut self, x: f64, y: f64) -> Self {
    self.inner = self.inner.with_position(WryLogicalPosition::new(x, y));
    self
  }

  fn inner_size(mut self, width: f64, height: f64) -> Self {
    self.inner = self
      .inner
      .with_inner_size(WryLogicalSize::new(width, height));
    self
  }

  fn min_inner_size(mut self, min_width: f64, min_height: f64) -> Self {
    self.inner = self
      .inner
      .with_min_inner_size(WryLogicalSize::new(min_width, min_height));
    self
  }

  fn max_inner_size(mut self, max_width: f64, max_height: f64) -> Self {
    self.inner = self
      .inner
      .with_max_inner_size(WryLogicalSize::new(max_width, max_height));
    self
  }

  fn resizable(mut self, resizable: bool) -> Self {
    self.inner = self.inner.with_resizable(resizable);
    self
  }

  fn title<S: Into<String>>(mut self, title: S) -> Self {
    self.inner = self.inner.with_title(title.into());
    self
  }

  fn fullscreen(mut self, fullscreen: bool) -> Self {
    self.inner = if fullscreen {
      self
        .inner
        .with_fullscreen(Some(Fullscreen::Borderless(None)))
    } else {
      self.inner.with_fullscreen(None)
    };
    self
  }

  /// Deprecated since 0.1.4 (noop)
  /// Windows is automatically focused when created.
  fn focus(self) -> Self {
    self
  }

  fn maximized(mut self, maximized: bool) -> Self {
    self.inner = self.inner.with_maximized(maximized);
    self
  }

  fn visible(mut self, visible: bool) -> Self {
    self.inner = self.inner.with_visible(visible);
    self
  }

  fn transparent(mut self, transparent: bool) -> Self {
    self.inner = self.inner.with_transparent(transparent);
    self
  }

  fn decorations(mut self, decorations: bool) -> Self {
    self.inner = self.inner.with_decorations(decorations);
    self
  }

  fn always_on_top(mut self, always_on_top: bool) -> Self {
    self.inner = self.inner.with_always_on_top(always_on_top);
    self
  }

  #[cfg(windows)]
  fn parent_window(mut self, parent: HWND) -> Self {
    self.inner = self.inner.with_parent_window(parent);
    self
  }

  #[cfg(windows)]
  fn owner_window(mut self, owner: HWND) -> Self {
    self.inner = self.inner.with_owner_window(owner);
    self
  }

  fn icon(mut self, icon: Icon) -> Result<Self> {
    self.inner = self
      .inner
      .with_window_icon(Some(WryIcon::try_from(icon)?.0));
    Ok(self)
  }

  #[cfg(any(target_os = "windows", target_os = "linux"))]
  fn skip_taskbar(mut self, skip: bool) -> Self {
    self.inner = self.inner.with_skip_taskbar(skip);
    self
  }

  #[cfg(target_os = "macos")]
  fn skip_taskbar(self, _skip: bool) -> Self {
    self
  }

  fn has_icon(&self) -> bool {
    self.inner.window.window_icon.is_some()
  }

  fn has_menu(&self) -> bool {
    self.inner.window.window_menu.is_some()
  }
}

pub struct RpcRequestWrapper(WryRpcRequest);

impl From<RpcRequestWrapper> for RpcRequest {
  fn from(request: RpcRequestWrapper) -> Self {
    Self {
      command: request.0.method,
      params: request.0.params,
    }
  }
}

pub struct FileDropEventWrapper(WryFileDropEvent);

impl From<FileDropEventWrapper> for FileDropEvent {
  fn from(event: FileDropEventWrapper) -> Self {
    match event.0 {
      WryFileDropEvent::Hovered(paths) => FileDropEvent::Hovered(paths),
      WryFileDropEvent::Dropped(paths) => FileDropEvent::Dropped(paths),
      // default to cancelled
      // FIXME(maybe): Add `FileDropEvent::Unknown` event?
      _ => FileDropEvent::Cancelled,
    }
  }
}

#[cfg(target_os = "macos")]
pub struct NSWindow(*mut std::ffi::c_void);
#[cfg(target_os = "macos")]
unsafe impl Send for NSWindow {}

#[cfg(windows)]
pub struct Hwnd(HWND);
#[cfg(windows)]
unsafe impl Send for Hwnd {}

#[cfg(any(
  target_os = "linux",
  target_os = "dragonfly",
  target_os = "freebsd",
  target_os = "netbsd",
  target_os = "openbsd"
))]
pub struct GtkWindow(gtk::ApplicationWindow);
#[cfg(any(
  target_os = "linux",
  target_os = "dragonfly",
  target_os = "freebsd",
  target_os = "netbsd",
  target_os = "openbsd"
))]
unsafe impl Send for GtkWindow {}

#[derive(Debug, Clone)]
pub enum WindowMessage {
  // Getters
  ScaleFactor(Sender<f64>),
  InnerPosition(Sender<Result<PhysicalPosition<i32>>>),
  OuterPosition(Sender<Result<PhysicalPosition<i32>>>),
  InnerSize(Sender<PhysicalSize<u32>>),
  OuterSize(Sender<PhysicalSize<u32>>),
  IsFullscreen(Sender<bool>),
  IsMaximized(Sender<bool>),
  IsDecorated(Sender<bool>),
  IsResizable(Sender<bool>),
  IsVisible(Sender<bool>),
  IsMenuVisible(Sender<bool>),
  CurrentMonitor(Sender<Option<MonitorHandle>>),
  PrimaryMonitor(Sender<Option<MonitorHandle>>),
  AvailableMonitors(Sender<Vec<MonitorHandle>>),
  #[cfg(target_os = "macos")]
  NSWindow(Sender<NSWindow>),
  SetHasShadow(bool),
  #[cfg(windows)]
  Hwnd(Sender<Hwnd>),
  #[cfg(any(
    target_os = "linux",
    target_os = "dragonfly",
    target_os = "freebsd",
    target_os = "netbsd",
    target_os = "openbsd"
  ))]
  GtkWindow(Sender<GtkWindow>),
  // Setters
  Center(Sender<Result<()>>),
  RequestUserAttention(Option<UserAttentionTypeWrapper>),
  SetResizable(bool),
  SetTitle(String),
  Maximize,
  Unmaximize,
  Minimize,
  Unminimize,
  ShowMenu,
  HideMenu,
  Show,
  Hide,
  Close,
  SetDecorations(bool),
  SetAlwaysOnTop(bool),
  SetSize(Size),
  SetMinSize(Option<Size>),
  SetMaxSize(Option<Size>),
  SetPosition(Position),
  SetFullscreen(bool),
  SetFocus,
  SetIcon(WindowIcon),
  SetSkipTaskbar(bool),
  DragWindow,
  UpdateMenuItem(u16, MenuUpdate),
}

#[derive(Debug, Clone)]
pub enum WebviewMessage {
  EvaluateScript(String),
  #[allow(dead_code)]
  WebviewEvent(WebviewEvent),
  Print,
}

#[allow(dead_code)]
#[derive(Debug, Clone)]
pub enum WebviewEvent {
  Focused(bool),
}

#[cfg(feature = "system-tray")]
#[derive(Debug, Clone)]
pub enum TrayMessage {
  UpdateItem(u16, MenuUpdate),
  UpdateIcon(Icon),
  #[cfg(target_os = "macos")]
  UpdateIconAsTemplate(bool),
}

#[derive(Debug, Clone)]
pub enum GlobalShortcutMessage {
  IsRegistered(Accelerator, Sender<bool>),
  Register(Accelerator, Sender<Result<GlobalShortcutWrapper>>),
  Unregister(GlobalShortcutWrapper, Sender<Result<()>>),
  UnregisterAll(Sender<Result<()>>),
}

#[derive(Debug, Clone)]
pub enum ClipboardMessage {
  WriteText(String, Sender<()>),
  ReadText(Sender<Option<String>>),
}

pub enum Message {
  Task(Box<dyn FnOnce() + Send>),
  Window(WindowId, WindowMessage),
  Webview(WindowId, WebviewMessage),
  #[cfg(feature = "system-tray")]
  Tray(TrayMessage),
  CreateWebview(
    Box<
      dyn FnOnce(&EventLoopWindowTarget<Message>, &WebContextStore) -> Result<WindowWrapper> + Send,
    >,
    Sender<WindowId>,
  ),
  CreateWindow(
    Box<dyn FnOnce() -> (String, WryWindowBuilder) + Send>,
    Sender<Result<Arc<Window>>>,
  ),
  GlobalShortcut(GlobalShortcutMessage),
  Clipboard(ClipboardMessage),
}

#[derive(Clone)]
struct DispatcherContext {
  main_thread_id: ThreadId,
  is_event_loop_running: Arc<AtomicBool>,
  proxy: EventLoopProxy<Message>,
  window_event_listeners: WindowEventListeners,
  menu_event_listeners: MenuEventListeners,
}

impl fmt::Debug for DispatcherContext {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    f.debug_struct("DispatcherContext")
      .field("main_thread_id", &self.main_thread_id)
      .field("is_event_loop_running", &self.is_event_loop_running)
      .field("proxy", &self.proxy)
      .finish()
  }
}

/// The Tauri [`Dispatch`] for [`Wry`].
#[derive(Debug, Clone)]
pub struct WryDispatcher {
  window_id: WindowId,
  context: DispatcherContext,
}

impl Dispatch for WryDispatcher {
  type Runtime = Wry;
  type WindowBuilder = WindowBuilderWrapper;

  fn run_on_main_thread<F: FnOnce() + Send + 'static>(&self, f: F) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Task(Box::new(f)))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn on_window_event<F: Fn(&WindowEvent) + Send + 'static>(&self, f: F) -> Uuid {
    let id = Uuid::new_v4();
    self
      .context
      .window_event_listeners
      .lock()
      .unwrap()
      .get(&self.window_id)
      .unwrap()
      .lock()
      .unwrap()
      .insert(id, Box::new(f));
    id
  }

  fn on_menu_event<F: Fn(&MenuEvent) + Send + 'static>(&self, f: F) -> Uuid {
    let id = Uuid::new_v4();
    self
      .context
      .menu_event_listeners
      .lock()
      .unwrap()
      .get(&self.window_id)
      .unwrap()
      .lock()
      .unwrap()
      .insert(id, Box::new(f));
    id
  }

  // Getters

  fn scale_factor(&self) -> Result<f64> {
    Ok(dispatcher_getter!(self, WindowMessage::ScaleFactor))
  }

  fn inner_position(&self) -> Result<PhysicalPosition<i32>> {
    dispatcher_getter!(self, WindowMessage::InnerPosition)
  }

  fn outer_position(&self) -> Result<PhysicalPosition<i32>> {
    dispatcher_getter!(self, WindowMessage::OuterPosition)
  }

  fn inner_size(&self) -> Result<PhysicalSize<u32>> {
    Ok(dispatcher_getter!(self, WindowMessage::InnerSize))
  }

  fn outer_size(&self) -> Result<PhysicalSize<u32>> {
    Ok(dispatcher_getter!(self, WindowMessage::OuterSize))
  }

  fn is_fullscreen(&self) -> Result<bool> {
    Ok(dispatcher_getter!(self, WindowMessage::IsFullscreen))
  }

  fn is_maximized(&self) -> Result<bool> {
    Ok(dispatcher_getter!(self, WindowMessage::IsMaximized))
  }

  /// Gets the window’s current decoration state.
  fn is_decorated(&self) -> Result<bool> {
    Ok(dispatcher_getter!(self, WindowMessage::IsDecorated))
  }

  /// Gets the window’s current resizable state.
  fn is_resizable(&self) -> Result<bool> {
    Ok(dispatcher_getter!(self, WindowMessage::IsResizable))
  }

  fn is_visible(&self) -> Result<bool> {
    Ok(dispatcher_getter!(self, WindowMessage::IsVisible))
  }

  fn is_menu_visible(&self) -> Result<bool> {
    Ok(dispatcher_getter!(self, WindowMessage::IsMenuVisible))
  }

  fn current_monitor(&self) -> Result<Option<Monitor>> {
    Ok(
      dispatcher_getter!(self, WindowMessage::CurrentMonitor)
        .map(|m| MonitorHandleWrapper(m).into()),
    )
  }

  fn primary_monitor(&self) -> Result<Option<Monitor>> {
    Ok(
      dispatcher_getter!(self, WindowMessage::PrimaryMonitor)
        .map(|m| MonitorHandleWrapper(m).into()),
    )
  }

  fn available_monitors(&self) -> Result<Vec<Monitor>> {
    Ok(
      dispatcher_getter!(self, WindowMessage::AvailableMonitors)
        .into_iter()
        .map(|m| MonitorHandleWrapper(m).into())
        .collect(),
    )
  }

  #[cfg(target_os = "macos")]
  fn ns_window(&self) -> Result<*mut std::ffi::c_void> {
    Ok(dispatcher_getter!(self, WindowMessage::NSWindow).0)
  }

  fn set_has_shadow(&self, shadow: bool) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(
        self.window_id,
        WindowMessage::SetHasShadow(shadow),
      ))
      .map_err(|_| Error::FailedToSendMessage)
  }

  #[cfg(windows)]
  fn hwnd(&self) -> Result<HWND> {
    Ok(dispatcher_getter!(self, WindowMessage::Hwnd).0)
  }

  /// Returns the `ApplicatonWindow` from gtk crate that is used by this window.
  #[cfg(any(
    target_os = "linux",
    target_os = "dragonfly",
    target_os = "freebsd",
    target_os = "netbsd",
    target_os = "openbsd"
  ))]
  fn gtk_window(&self) -> Result<gtk::ApplicationWindow> {
    Ok(dispatcher_getter!(self, WindowMessage::GtkWindow).0)
  }

  // Setters

  fn center(&self) -> Result<()> {
    dispatcher_getter!(self, WindowMessage::Center)
  }

  fn print(&self) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Webview(self.window_id, WebviewMessage::Print))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn request_user_attention(&self, request_type: Option<UserAttentionType>) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(
        self.window_id,
        WindowMessage::RequestUserAttention(request_type.map(Into::into)),
      ))
      .map_err(|_| Error::FailedToSendMessage)
  }

  // Creates a window by dispatching a message to the event loop.
  // Note that this must be called from a separate thread, otherwise the channel will introduce a deadlock.
  fn create_window(
    &mut self,
    pending: PendingWindow<Self::Runtime>,
  ) -> Result<DetachedWindow<Self::Runtime>> {
    let (tx, rx) = channel();
    let label = pending.label.clone();
    let context = self.context.clone();

    self
      .context
      .proxy
      .send_event(Message::CreateWebview(
        Box::new(move |event_loop, web_context| {
          create_webview(event_loop, web_context, context, pending)
        }),
        tx,
      ))
      .map_err(|_| Error::FailedToSendMessage)?;
    let window_id = rx.recv().unwrap();

    let dispatcher = WryDispatcher {
      window_id,
      context: self.context.clone(),
    };
    Ok(DetachedWindow { label, dispatcher })
  }

  fn set_resizable(&self, resizable: bool) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(
        self.window_id,
        WindowMessage::SetResizable(resizable),
      ))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn set_title<S: Into<String>>(&self, title: S) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(
        self.window_id,
        WindowMessage::SetTitle(title.into()),
      ))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn maximize(&self) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(self.window_id, WindowMessage::Maximize))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn unmaximize(&self) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(self.window_id, WindowMessage::Unmaximize))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn minimize(&self) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(self.window_id, WindowMessage::Minimize))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn unminimize(&self) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(self.window_id, WindowMessage::Unminimize))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn show_menu(&self) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(self.window_id, WindowMessage::ShowMenu))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn hide_menu(&self) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(self.window_id, WindowMessage::HideMenu))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn show(&self) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(self.window_id, WindowMessage::Show))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn hide(&self) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(self.window_id, WindowMessage::Hide))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn close(&self) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(self.window_id, WindowMessage::Close))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn set_decorations(&self, decorations: bool) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(
        self.window_id,
        WindowMessage::SetDecorations(decorations),
      ))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn set_always_on_top(&self, always_on_top: bool) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(
        self.window_id,
        WindowMessage::SetAlwaysOnTop(always_on_top),
      ))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn set_size(&self, size: Size) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(
        self.window_id,
        WindowMessage::SetSize(size),
      ))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn set_min_size(&self, size: Option<Size>) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(
        self.window_id,
        WindowMessage::SetMinSize(size),
      ))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn set_max_size(&self, size: Option<Size>) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(
        self.window_id,
        WindowMessage::SetMaxSize(size),
      ))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn set_position(&self, position: Position) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(
        self.window_id,
        WindowMessage::SetPosition(position),
      ))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn set_fullscreen(&self, fullscreen: bool) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(
        self.window_id,
        WindowMessage::SetFullscreen(fullscreen),
      ))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn set_focus(&self) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(self.window_id, WindowMessage::SetFocus))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn set_icon(&self, icon: Icon) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(
        self.window_id,
        WindowMessage::SetIcon(WryIcon::try_from(icon)?.0),
      ))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn set_skip_taskbar(&self, skip: bool) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(
        self.window_id,
        WindowMessage::SetSkipTaskbar(skip),
      ))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn start_dragging(&self) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(self.window_id, WindowMessage::DragWindow))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn eval_script<S: Into<String>>(&self, script: S) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Webview(
        self.window_id,
        WebviewMessage::EvaluateScript(script.into()),
      ))
      .map_err(|_| Error::FailedToSendMessage)
  }

  fn update_menu_item(&self, id: u16, update: MenuUpdate) -> Result<()> {
    self
      .context
      .proxy
      .send_event(Message::Window(
        self.window_id,
        WindowMessage::UpdateMenuItem(id, update),
      ))
      .map_err(|_| Error::FailedToSendMessage)
  }
}

#[cfg(feature = "system-tray")]
#[derive(Clone, Default)]
struct TrayContext {
  tray: Arc<Mutex<Option<Arc<Mutex<WrySystemTray>>>>>,
  listeners: SystemTrayEventListeners,
  items: SystemTrayItems,
}

enum WindowHandle {
  Webview(WebView),
  Window(Arc<Window>),
}

impl WindowHandle {
  fn window(&self) -> &Window {
    match self {
      Self::Webview(w) => w.window(),
      Self::Window(w) => w,
    }
  }
}

pub struct WindowWrapper {
  label: String,
  inner: WindowHandle,
  menu_items: HashMap<u16, WryCustomMenuItem>,
}

/// A Tauri [`Runtime`] wrapper around wry.
pub struct Wry {
  main_thread_id: ThreadId,
  global_shortcut_manager: Arc<Mutex<WryShortcutManager>>,
  global_shortcut_manager_handle: GlobalShortcutManagerHandle,
  clipboard_manager: Arc<Mutex<Clipboard>>,
  clipboard_manager_handle: ClipboardManagerWrapper,
  is_event_loop_running: Arc<AtomicBool>,
  event_loop: EventLoop<Message>,
  windows: Arc<Mutex<HashMap<WindowId, WindowWrapper>>>,
  web_context: WebContextStore,
  window_event_listeners: WindowEventListeners,
  menu_event_listeners: MenuEventListeners,
  #[cfg(feature = "system-tray")]
  tray_context: TrayContext,
}

/// A handle to the Wry runtime.
#[derive(Debug, Clone)]
pub struct WryHandle {
  dispatcher_context: DispatcherContext,
}

impl WryHandle {
  /// Creates a new tao window using a callback, and returns its window id.
  pub fn create_tao_window<F: FnOnce() -> (String, WryWindowBuilder) + Send + 'static>(
    &self,
    f: F,
  ) -> Result<Arc<Window>> {
    let (tx, rx) = channel();
    self
      .dispatcher_context
      .proxy
      .send_event(Message::CreateWindow(Box::new(f), tx))
      .map_err(|_| Error::FailedToSendMessage)?;
    rx.recv().unwrap()
  }

  /// Send a message to the event loop.
  pub fn send_event(&self, message: Message) -> Result<()> {
    self
      .dispatcher_context
      .proxy
      .send_event(message)
      .map_err(|_| Error::FailedToSendMessage)?;
    Ok(())
  }
}

impl RuntimeHandle for WryHandle {
  type Runtime = Wry;

  // Creates a window by dispatching a message to the event loop.
  // Note that this must be called from a separate thread, otherwise the channel will introduce a deadlock.
  fn create_window(
    &self,
    pending: PendingWindow<Self::Runtime>,
  ) -> Result<DetachedWindow<Self::Runtime>> {
    let (tx, rx) = channel();
    let label = pending.label.clone();
    let dispatcher_context = self.dispatcher_context.clone();
    self
      .dispatcher_context
      .proxy
      .send_event(Message::CreateWebview(
        Box::new(move |event_loop, web_context| {
          create_webview(event_loop, web_context, dispatcher_context, pending)
        }),
        tx,
      ))
      .map_err(|_| Error::FailedToSendMessage)?;
    let window_id = rx.recv().unwrap();

    let dispatcher = WryDispatcher {
      window_id,
      context: self.dispatcher_context.clone(),
    };
    Ok(DetachedWindow { label, dispatcher })
  }

  #[cfg(all(windows, feature = "system-tray"))]
  /// Deprecated. (not needed anymore)
  fn remove_system_tray(&self) -> Result<()> {
    Ok(())
  }
}

impl Runtime for Wry {
  type Dispatcher = WryDispatcher;
  type Handle = WryHandle;
  type GlobalShortcutManager = GlobalShortcutManagerHandle;
  type ClipboardManager = ClipboardManagerWrapper;
  #[cfg(feature = "system-tray")]
  type TrayHandler = SystemTrayHandle;

  fn new() -> Result<Self> {
    let event_loop = EventLoop::<Message>::with_user_event();
    let proxy = event_loop.create_proxy();
    let main_thread_id = current_thread().id();
    let is_event_loop_running = Arc::new(AtomicBool::default());

    let event_loop_context = EventLoopContext {
      main_thread_id,
      is_event_loop_running: is_event_loop_running.clone(),
      proxy,
    };

    let global_shortcut_manager = WryShortcutManager::new(&event_loop);
    let global_shortcut_listeners = GlobalShortcutListeners::default();
    let clipboard_manager = Clipboard::new();
    let clipboard_manager_handle = ClipboardManagerWrapper {
      context: event_loop_context.clone(),
    };

    Ok(Self {
      main_thread_id,
      global_shortcut_manager: Arc::new(Mutex::new(global_shortcut_manager)),
      global_shortcut_manager_handle: GlobalShortcutManagerHandle {
        context: event_loop_context,
        shortcuts: Default::default(),
        listeners: global_shortcut_listeners,
      },
      clipboard_manager: Arc::new(Mutex::new(clipboard_manager)),
      clipboard_manager_handle,
      is_event_loop_running,
      event_loop,
      windows: Default::default(),
      web_context: Default::default(),
      window_event_listeners: Default::default(),
      menu_event_listeners: Default::default(),
      #[cfg(feature = "system-tray")]
      tray_context: Default::default(),
    })
  }

  fn handle(&self) -> Self::Handle {
    WryHandle {
      dispatcher_context: DispatcherContext {
        main_thread_id: self.main_thread_id,
        is_event_loop_running: self.is_event_loop_running.clone(),
        proxy: self.event_loop.create_proxy(),
        window_event_listeners: self.window_event_listeners.clone(),
        menu_event_listeners: self.menu_event_listeners.clone(),
      },
    }
  }

  fn global_shortcut_manager(&self) -> Self::GlobalShortcutManager {
    self.global_shortcut_manager_handle.clone()
  }

  fn clipboard_manager(&self) -> Self::ClipboardManager {
    self.clipboard_manager_handle.clone()
  }

  fn create_window(&self, pending: PendingWindow<Self>) -> Result<DetachedWindow<Self>> {
    let label = pending.label.clone();
    let proxy = self.event_loop.create_proxy();
    let webview = create_webview(
      &self.event_loop,
      &self.web_context,
      DispatcherContext {
        main_thread_id: self.main_thread_id,
        is_event_loop_running: self.is_event_loop_running.clone(),
        proxy: proxy.clone(),
        window_event_listeners: self.window_event_listeners.clone(),
        menu_event_listeners: self.menu_event_listeners.clone(),
      },
      pending,
    )?;

    #[cfg(target_os = "windows")]
    {
      let id = webview.inner.window().id();
      if let WindowHandle::Webview(ref webview) = webview.inner {
        if let Some(controller) = webview.controller() {
          let proxy = self.event_loop.create_proxy();
          controller
            .add_got_focus(move |_| {
              let _ = proxy.send_event(Message::Webview(
                id,
                WebviewMessage::WebviewEvent(WebviewEvent::Focused(true)),
              ));
              Ok(())
            })
            .unwrap();
          let proxy = self.event_loop.create_proxy();
          controller
            .add_lost_focus(move |_| {
              let _ = proxy.send_event(Message::Webview(
                id,
                WebviewMessage::WebviewEvent(WebviewEvent::Focused(false)),
              ));
              Ok(())
            })
            .unwrap();
        }
      }
    }

    let dispatcher = WryDispatcher {
      window_id: webview.inner.window().id(),
      context: DispatcherContext {
        main_thread_id: self.main_thread_id,
        is_event_loop_running: self.is_event_loop_running.clone(),
        proxy,
        window_event_listeners: self.window_event_listeners.clone(),
        menu_event_listeners: self.menu_event_listeners.clone(),
      },
    };

    self
      .windows
      .lock()
      .unwrap()
      .insert(webview.inner.window().id(), webview);

    Ok(DetachedWindow { label, dispatcher })
  }

  #[cfg(feature = "system-tray")]
  fn system_tray(&self, system_tray: SystemTray) -> Result<Self::TrayHandler> {
    let icon = system_tray
      .icon
      .expect("tray icon not set")
      .into_tray_icon();

    let mut items = HashMap::new();

    #[cfg(target_os = "macos")]
    let tray = SystemTrayBuilder::new(
      icon,
      system_tray
        .menu
        .map(|menu| to_wry_context_menu(&mut items, menu)),
    )
    .with_icon_as_template(system_tray.icon_as_template)
    .build(&self.event_loop)
    .map_err(|e| Error::SystemTray(Box::new(e)))?;

    #[cfg(not(target_os = "macos"))]
    let tray = SystemTrayBuilder::new(
      icon,
      system_tray
        .menu
        .map(|menu| to_wry_context_menu(&mut items, menu)),
    )
    .build(&self.event_loop)
    .map_err(|e| Error::SystemTray(Box::new(e)))?;

    *self.tray_context.items.lock().unwrap() = items;
    *self.tray_context.tray.lock().unwrap() = Some(Arc::new(Mutex::new(tray)));

    Ok(SystemTrayHandle {
      proxy: self.event_loop.create_proxy(),
    })
  }

  #[cfg(feature = "system-tray")]
  fn on_system_tray_event<F: Fn(&SystemTrayEvent) + Send + 'static>(&mut self, f: F) -> Uuid {
    let id = Uuid::new_v4();
    self
      .tray_context
      .listeners
      .lock()
      .unwrap()
      .insert(id, Box::new(f));
    id
  }

  #[cfg(target_os = "macos")]
  fn set_activation_policy(&mut self, activation_policy: ActivationPolicy) {
    self
      .event_loop
      .set_activation_policy(match activation_policy {
        ActivationPolicy::Regular => WryActivationPolicy::Regular,
        ActivationPolicy::Accessory => WryActivationPolicy::Accessory,
        ActivationPolicy::Prohibited => WryActivationPolicy::Prohibited,
        _ => unimplemented!(),
      });
  }

  #[cfg(any(target_os = "windows", target_os = "macos"))]
  fn run_iteration<F: Fn(RunEvent) + 'static>(&mut self, callback: F) -> RunIteration {
    use wry::application::platform::run_return::EventLoopExtRunReturn;
    let windows = self.windows.clone();
    let web_context = &self.web_context;
    let window_event_listeners = self.window_event_listeners.clone();
    let menu_event_listeners = self.menu_event_listeners.clone();
    #[cfg(feature = "system-tray")]
    let tray_context = self.tray_context.clone();
    let global_shortcut_manager = self.global_shortcut_manager.clone();
    let global_shortcut_manager_handle = self.global_shortcut_manager_handle.clone();
    let clipboard_manager = self.clipboard_manager.clone();

    let mut iteration = RunIteration::default();

    self.is_event_loop_running.store(true, Ordering::Relaxed);
    self
      .event_loop
      .run_return(|event, event_loop, control_flow| {
        if let Event::MainEventsCleared = &event {
          *control_flow = ControlFlow::Exit;
        }
        iteration = handle_event_loop(
          event,
          event_loop,
          control_flow,
          EventLoopIterationContext {
            callback: &callback,
            windows: windows.lock().expect("poisoned webview collection"),
            window_event_listeners: &window_event_listeners,
            global_shortcut_manager: global_shortcut_manager.clone(),
            global_shortcut_manager_handle: &global_shortcut_manager_handle,
            clipboard_manager: clipboard_manager.clone(),
            menu_event_listeners: &menu_event_listeners,
            #[cfg(feature = "system-tray")]
            tray_context: &tray_context,
          },
          web_context,
        );
      });
    self.is_event_loop_running.store(false, Ordering::Relaxed);

    iteration
  }

  fn run<F: Fn(RunEvent) + 'static>(self, callback: F) {
    self.is_event_loop_running.store(true, Ordering::Relaxed);
    let windows = self.windows.clone();
    let web_context = self.web_context;
    let window_event_listeners = self.window_event_listeners.clone();
    let menu_event_listeners = self.menu_event_listeners.clone();
    #[cfg(feature = "system-tray")]
    let tray_context = self.tray_context;
    let global_shortcut_manager = self.global_shortcut_manager.clone();
    let global_shortcut_manager_handle = self.global_shortcut_manager_handle.clone();
    let clipboard_manager = self.clipboard_manager.clone();

    self.event_loop.run(move |event, event_loop, control_flow| {
      handle_event_loop(
        event,
        event_loop,
        control_flow,
        EventLoopIterationContext {
          callback: &callback,
          windows: windows.lock().expect("poisoned webview collection"),
          window_event_listeners: &window_event_listeners,
          global_shortcut_manager: global_shortcut_manager.clone(),
          global_shortcut_manager_handle: &global_shortcut_manager_handle,
          clipboard_manager: clipboard_manager.clone(),
          menu_event_listeners: &menu_event_listeners,
          #[cfg(feature = "system-tray")]
          tray_context: &tray_context,
        },
        &web_context,
      );
    })
  }
}

struct EventLoopIterationContext<'a> {
  callback: &'a (dyn Fn(RunEvent) + 'static),
  windows: MutexGuard<'a, HashMap<WindowId, WindowWrapper>>,
  window_event_listeners: &'a WindowEventListeners,
  global_shortcut_manager: Arc<Mutex<WryShortcutManager>>,
  global_shortcut_manager_handle: &'a GlobalShortcutManagerHandle,
  clipboard_manager: Arc<Mutex<Clipboard>>,
  menu_event_listeners: &'a MenuEventListeners,
  #[cfg(feature = "system-tray")]
  tray_context: &'a TrayContext,
}

fn handle_event_loop(
  event: Event<Message>,
  event_loop: &EventLoopWindowTarget<Message>,
  control_flow: &mut ControlFlow,
  context: EventLoopIterationContext<'_>,
  web_context: &WebContextStore,
) -> RunIteration {
  let EventLoopIterationContext {
    callback,
    mut windows,
    window_event_listeners,
    global_shortcut_manager,
    global_shortcut_manager_handle,
    clipboard_manager,
    menu_event_listeners,
    #[cfg(feature = "system-tray")]
    tray_context,
  } = context;
  if *control_flow == ControlFlow::Exit {
    return RunIteration {
      window_count: windows.len(),
    };
  }
  *control_flow = ControlFlow::Wait;

  match event {
    Event::NewEvents(StartCause::Init) => {
      callback(RunEvent::Ready);
    }

    Event::NewEvents(StartCause::Poll) => {
      callback(RunEvent::Resumed);
    }

    Event::MainEventsCleared => {
      callback(RunEvent::MainEventsCleared);
    }

    Event::GlobalShortcutEvent(accelerator_id) => {
      for (id, handler) in &*global_shortcut_manager_handle.listeners.lock().unwrap() {
        if accelerator_id == *id {
          handler();
        }
      }
    }
    Event::MenuEvent {
      window_id,
      menu_id,
      origin: MenuType::MenuBar,
      ..
    } => {
      let window_id = window_id.unwrap(); // always Some on MenuBar event
      let event = MenuEvent {
        menu_item_id: menu_id.0,
      };
      let listeners = menu_event_listeners.lock().unwrap();
      let window_menu_event_listeners = listeners.get(&window_id).cloned().unwrap_or_default();
      for handler in window_menu_event_listeners.lock().unwrap().values() {
        handler(&event);
      }
    }
    #[cfg(feature = "system-tray")]
    Event::MenuEvent {
      window_id: _,
      menu_id,
      origin: MenuType::ContextMenu,
      ..
    } => {
      let event = SystemTrayEvent::MenuItemClick(menu_id.0);
      for handler in tray_context.listeners.lock().unwrap().values() {
        handler(&event);
      }
    }
    #[cfg(feature = "system-tray")]
    Event::TrayEvent {
      bounds,
      event,
      position: _cursor_position,
      ..
    } => {
      let (position, size) = (
        PhysicalPositionWrapper(bounds.position).into(),
        PhysicalSizeWrapper(bounds.size).into(),
      );
      let event = match event {
        TrayEvent::RightClick => SystemTrayEvent::RightClick { position, size },
        TrayEvent::DoubleClick => SystemTrayEvent::DoubleClick { position, size },
        // default to left click
        _ => SystemTrayEvent::LeftClick { position, size },
      };
      for handler in tray_context.listeners.lock().unwrap().values() {
        handler(&event);
      }
    }
    Event::WindowEvent {
      event, window_id, ..
    } => {
      if event == WryWindowEvent::Focused(true) {
        if let Some(WindowHandle::Webview(webview)) = windows.get(&window_id).map(|w| &w.inner) {
          webview.focus();
        }
      }

      if let Some(event) = WindowEventWrapper::from(&event).0 {
        for handler in window_event_listeners
          .lock()
          .unwrap()
          .get(&window_id)
          .unwrap()
          .lock()
          .unwrap()
          .values()
        {
          handler(&event);
        }
      }
      match event {
        WryWindowEvent::CloseRequested => {
          let (tx, rx) = channel();
          if let Some(w) = windows.get(&window_id) {
            callback(RunEvent::CloseRequested {
              label: w.label.clone(),
              signal_tx: tx,
            });
            if let Ok(true) = rx.try_recv() {
            } else {
              on_window_close(
                callback,
                window_id,
                &mut windows,
                control_flow,
                #[cfg(target_os = "linux")]
                window_event_listeners,
                menu_event_listeners.clone(),
              );
            }
          }
        }
        WryWindowEvent::Resized(_) => {
          if let Some(WindowHandle::Webview(webview)) = windows.get(&window_id).map(|w| &w.inner) {
            if let Err(e) = webview.resize() {
              eprintln!("{}", e);
            }
          }
        }
        _ => {}
      }
    }
    Event::UserEvent(message) => match message {
      Message::Task(task) => task(),
      Message::Window(id, window_message) => {
        if let Some(webview) = windows.get_mut(&id) {
          let window = webview.inner.window();
          match window_message {
            // Getters
            WindowMessage::ScaleFactor(tx) => tx.send(window.scale_factor()).unwrap(),
            WindowMessage::InnerPosition(tx) => tx
              .send(
                window
                  .inner_position()
                  .map(|p| PhysicalPositionWrapper(p).into())
                  .map_err(|_| Error::FailedToSendMessage),
              )
              .unwrap(),
            WindowMessage::OuterPosition(tx) => tx
              .send(
                window
                  .outer_position()
                  .map(|p| PhysicalPositionWrapper(p).into())
                  .map_err(|_| Error::FailedToSendMessage),
              )
              .unwrap(),
            WindowMessage::InnerSize(tx) => tx
              .send(PhysicalSizeWrapper(window.inner_size()).into())
              .unwrap(),
            WindowMessage::OuterSize(tx) => tx
              .send(PhysicalSizeWrapper(window.outer_size()).into())
              .unwrap(),
            WindowMessage::IsFullscreen(tx) => tx.send(window.fullscreen().is_some()).unwrap(),
            WindowMessage::IsMaximized(tx) => tx.send(window.is_maximized()).unwrap(),
            WindowMessage::IsDecorated(tx) => tx.send(window.is_decorated()).unwrap(),
            WindowMessage::IsResizable(tx) => tx.send(window.is_resizable()).unwrap(),
            WindowMessage::IsVisible(tx) => tx.send(window.is_visible()).unwrap(),
            WindowMessage::IsMenuVisible(tx) => tx.send(window.is_menu_visible()).unwrap(),
            WindowMessage::CurrentMonitor(tx) => tx.send(window.current_monitor()).unwrap(),
            WindowMessage::PrimaryMonitor(tx) => tx.send(window.primary_monitor()).unwrap(),
            WindowMessage::AvailableMonitors(tx) => {
              tx.send(window.available_monitors().collect()).unwrap()
            }
            #[cfg(target_os = "macos")]
            WindowMessage::NSWindow(tx) => tx.send(NSWindow(window.ns_window())).unwrap(),
            WindowMessage::SetHasShadow(shadow) => window.set_has_shadow(shadow),
            #[cfg(windows)]
            WindowMessage::Hwnd(tx) => tx.send(Hwnd(window.hwnd() as HWND)).unwrap(),
            #[cfg(any(
              target_os = "linux",
              target_os = "dragonfly",
              target_os = "freebsd",
              target_os = "netbsd",
              target_os = "openbsd"
            ))]
            WindowMessage::GtkWindow(tx) => {
              tx.send(GtkWindow(window.gtk_window().clone())).unwrap()
            }
            // Setters
            WindowMessage::Center(tx) => {
              tx.send(center_window(window)).unwrap();
            }
            WindowMessage::RequestUserAttention(request_type) => {
              window.request_user_attention(request_type.map(|r| r.0));
            }
            WindowMessage::SetResizable(resizable) => window.set_resizable(resizable),
            WindowMessage::SetTitle(title) => window.set_title(&title),
            WindowMessage::Maximize => window.set_maximized(true),
            WindowMessage::Unmaximize => window.set_maximized(false),
            WindowMessage::Minimize => window.set_minimized(true),
            WindowMessage::Unminimize => window.set_minimized(false),
            WindowMessage::ShowMenu => window.show_menu(),
            WindowMessage::HideMenu => window.hide_menu(),
            WindowMessage::Show => window.set_visible(true),
            WindowMessage::Hide => window.set_visible(false),
            WindowMessage::Close => {
              on_window_close(
                callback,
                id,
                &mut windows,
                control_flow,
                #[cfg(target_os = "linux")]
                window_event_listeners,
                menu_event_listeners.clone(),
              );
            }
            WindowMessage::SetDecorations(decorations) => window.set_decorations(decorations),
            WindowMessage::SetAlwaysOnTop(always_on_top) => window.set_always_on_top(always_on_top),
            WindowMessage::SetSize(size) => {
              window.set_inner_size(SizeWrapper::from(size).0);
            }
            WindowMessage::SetMinSize(size) => {
              window.set_min_inner_size(size.map(|s| SizeWrapper::from(s).0));
            }
            WindowMessage::SetMaxSize(size) => {
              window.set_max_inner_size(size.map(|s| SizeWrapper::from(s).0));
            }
            WindowMessage::SetPosition(position) => {
              window.set_outer_position(PositionWrapper::from(position).0)
            }
            WindowMessage::SetFullscreen(fullscreen) => {
              if fullscreen {
                window.set_fullscreen(Some(Fullscreen::Borderless(None)))
              } else {
                window.set_fullscreen(None)
              }
            }
            WindowMessage::SetFocus => {
              window.set_focus();
            }
            WindowMessage::SetIcon(icon) => {
              window.set_window_icon(Some(icon));
            }
            WindowMessage::SetSkipTaskbar(_skip) => {
              #[cfg(any(target_os = "windows", target_os = "linux"))]
              window.set_skip_taskbar(_skip);
            }
            WindowMessage::DragWindow => {
              let _ = window.drag_window();
            }
            WindowMessage::UpdateMenuItem(id, update) => {
              let item = webview
                .menu_items
                .get_mut(&id)
                .expect("menu item not found");
              match update {
                MenuUpdate::SetEnabled(enabled) => item.set_enabled(enabled),
                MenuUpdate::SetTitle(title) => item.set_title(&title),
                MenuUpdate::SetSelected(selected) => item.set_selected(selected),
                #[cfg(target_os = "macos")]
                MenuUpdate::SetNativeImage(image) => {
                  item.set_native_image(NativeImageWrapper::from(image).0)
                }
              }
            }
          }
        }
      }
      Message::Webview(id, webview_message) => {
        if let Some(WindowHandle::Webview(webview)) = windows.get(&id).map(|w| &w.inner) {
          match webview_message {
            WebviewMessage::EvaluateScript(script) => {
              if let Err(e) = webview.evaluate_script(&script) {
                eprintln!("{}", e);
              }
            }
            WebviewMessage::Print => {
              let _ = webview.print();
            }
            WebviewMessage::WebviewEvent(event) => {
              if let Some(event) = WindowEventWrapper::from(&event).0 {
                for handler in window_event_listeners
                  .lock()
                  .unwrap()
                  .get(&id)
                  .unwrap()
                  .lock()
                  .unwrap()
                  .values()
                {
                  handler(&event);
                }
              }
            }
          }
        }
      }
      Message::CreateWebview(handler, sender) => match handler(event_loop, web_context) {
        Ok(webview) => {
          let window_id = webview.inner.window().id();
          windows.insert(window_id, webview);
          sender.send(window_id).unwrap();
        }
        Err(e) => {
          eprintln!("{}", e);
        }
      },
      Message::CreateWindow(handler, sender) => {
        let (label, builder) = handler();
        if let Ok(window) = builder.build(event_loop) {
          let window_id = window.id();

          context
            .window_event_listeners
            .lock()
            .unwrap()
            .insert(window.id(), WindowEventListenersMap::default());

          context
            .menu_event_listeners
            .lock()
            .unwrap()
            .insert(window.id(), WindowMenuEventListeners::default());

          let w = Arc::new(window);

          windows.insert(
            window_id,
            WindowWrapper {
              label,
              inner: WindowHandle::Window(w.clone()),
              menu_items: Default::default(),
            },
          );
          sender.send(Ok(w)).unwrap();
        } else {
          sender.send(Err(Error::CreateWindow)).unwrap();
        }
      }

      #[cfg(feature = "system-tray")]
      Message::Tray(tray_message) => match tray_message {
        TrayMessage::UpdateItem(menu_id, update) => {
          let mut tray = tray_context.items.as_ref().lock().unwrap();
          let item = tray.get_mut(&menu_id).expect("menu item not found");
          match update {
            MenuUpdate::SetEnabled(enabled) => item.set_enabled(enabled),
            MenuUpdate::SetTitle(title) => item.set_title(&title),
            MenuUpdate::SetSelected(selected) => item.set_selected(selected),
            #[cfg(target_os = "macos")]
            MenuUpdate::SetNativeImage(image) => {
              item.set_native_image(NativeImageWrapper::from(image).0)
            }
          }
        }
        TrayMessage::UpdateIcon(icon) => {
          if let Some(tray) = &*tray_context.tray.lock().unwrap() {
            tray.lock().unwrap().set_icon(icon.into_tray_icon());
          }
        }
        #[cfg(target_os = "macos")]
        TrayMessage::UpdateIconAsTemplate(is_template) => {
          if let Some(tray) = &*tray_context.tray.lock().unwrap() {
            tray.lock().unwrap().set_icon_as_template(is_template);
          }
        }
      },
      Message::GlobalShortcut(message) => match message {
        GlobalShortcutMessage::IsRegistered(accelerator, tx) => tx
          .send(
            global_shortcut_manager
              .lock()
              .unwrap()
              .is_registered(&accelerator),
          )
          .unwrap(),
        GlobalShortcutMessage::Register(accelerator, tx) => tx
          .send(
            global_shortcut_manager
              .lock()
              .unwrap()
              .register(accelerator)
              .map(GlobalShortcutWrapper)
              .map_err(|e| Error::GlobalShortcut(Box::new(e))),
          )
          .unwrap(),
        GlobalShortcutMessage::Unregister(shortcut, tx) => tx
          .send(
            global_shortcut_manager
              .lock()
              .unwrap()
              .unregister(shortcut.0)
              .map_err(|e| Error::GlobalShortcut(Box::new(e))),
          )
          .unwrap(),
        GlobalShortcutMessage::UnregisterAll(tx) => tx
          .send(
            global_shortcut_manager
              .lock()
              .unwrap()
              .unregister_all()
              .map_err(|e| Error::GlobalShortcut(Box::new(e))),
          )
          .unwrap(),
      },
      Message::Clipboard(message) => match message {
        ClipboardMessage::WriteText(text, tx) => {
          clipboard_manager.lock().unwrap().write_text(text);
          tx.send(()).unwrap();
        }
        ClipboardMessage::ReadText(tx) => tx
          .send(clipboard_manager.lock().unwrap().read_text())
          .unwrap(),
      },
    },
    _ => (),
  }

  RunIteration {
    window_count: windows.len(),
  }
}

fn on_window_close<'a>(
  callback: &'a (dyn Fn(RunEvent) + 'static),
  window_id: WindowId,
  windows: &mut MutexGuard<'a, HashMap<WindowId, WindowWrapper>>,
  control_flow: &mut ControlFlow,
  #[cfg(target_os = "linux")] window_event_listeners: &WindowEventListeners,
  menu_event_listeners: MenuEventListeners,
) {
  if let Some(webview) = windows.remove(&window_id) {
    menu_event_listeners.lock().unwrap().remove(&window_id);
    callback(RunEvent::WindowClose(webview.label.clone()));

    if windows.is_empty() {
      let (tx, rx) = channel();
      callback(RunEvent::ExitRequested {
        window_label: webview.label,
        tx,
      });

      let recv = rx.try_recv();
      let should_prevent = matches!(recv, Ok(ExitRequestedEventAction::Prevent));

      if !should_prevent {
        *control_flow = ControlFlow::Exit;
        callback(RunEvent::Exit);
      }
    }
  }
  // TODO: tao does not fire the destroyed event properly
  #[cfg(target_os = "linux")]
  {
    for handler in window_event_listeners
      .lock()
      .unwrap()
      .get(&window_id)
      .unwrap()
      .lock()
      .unwrap()
      .values()
    {
      handler(&WindowEvent::Destroyed);
    }
  }
}

fn center_window(window: &Window) -> Result<()> {
  if let Some(monitor) = window.current_monitor() {
    let screen_size = monitor.size();
    let window_size = window.inner_size();
    let x = (screen_size.width - window_size.width) / 2;
    let y = (screen_size.height - window_size.height) / 2;
    window.set_outer_position(WryPhysicalPosition::new(x, y));
    Ok(())
  } else {
    Err(Error::FailedToGetMonitor)
  }
}

fn convert_menu_id(mut new_menu: Menu, menu: Menu) -> Menu {
  for item in menu.items {
    match item {
      MenuEntry::CustomItem(c) => {
        let mut item = CustomMenuItem::new(c.id_str, c.title);
        #[cfg(target_os = "macos")]
        if let Some(native_image) = c.native_image {
          item = item.native_image(native_image);
        }
        if let Some(accelerator) = c.keyboard_accelerator {
          item = item.accelerator(accelerator);
        }
        if !c.enabled {
          item = item.disabled();
        }
        if c.selected {
          item = item.selected();
        }
        new_menu = new_menu.add_item(item);
      }
      MenuEntry::NativeItem(i) => {
        new_menu = new_menu.add_native_item(i);
      }
      MenuEntry::Submenu(submenu) => {
        let new_submenu = convert_menu_id(Menu::new(), submenu.inner);
        new_menu = new_menu.add_submenu(Submenu::new(submenu.title, new_submenu));
      }
    }
  }
  new_menu
}

fn to_wry_menu(
  custom_menu_items: &mut HashMap<MenuHash, WryCustomMenuItem>,
  menu: Menu,
) -> MenuBar {
  let mut wry_menu = MenuBar::new();
  for item in menu.items {
    match item {
      MenuEntry::CustomItem(c) => {
        let mut attributes = MenuItemAttributesWrapper::from(&c).0;
        attributes = attributes.with_id(WryMenuId(c.id));
        #[allow(unused_mut)]
        let mut item = wry_menu.add_item(attributes);
        #[cfg(target_os = "macos")]
        if let Some(native_image) = c.native_image {
          item.set_native_image(NativeImageWrapper::from(native_image).0);
        }
        custom_menu_items.insert(c.id, item);
      }
      MenuEntry::NativeItem(i) => {
        wry_menu.add_native_item(MenuItemWrapper::from(i).0);
      }
      MenuEntry::Submenu(submenu) => {
        wry_menu.add_submenu(
          &submenu.title,
          submenu.enabled,
          to_wry_menu(custom_menu_items, submenu.inner),
        );
      }
    }
  }
  wry_menu
}

fn create_webview(
  event_loop: &EventLoopWindowTarget<Message>,
  web_context: &WebContextStore,
  context: DispatcherContext,
  pending: PendingWindow<Wry>,
) -> Result<WindowWrapper> {
  #[allow(unused_mut)]
  let PendingWindow {
    webview_attributes,
    uri_scheme_protocols,
    mut window_builder,
    rpc_handler,
    file_drop_handler,
    label,
    url,
    ..
  } = pending;

  let is_window_transparent = window_builder.inner.window.transparent;
  let menu_items = {
    let mut menu_items = HashMap::new();
    let menu = to_wry_menu(&mut menu_items, window_builder.menu);
    window_builder.inner = window_builder.inner.with_menu(menu);
    menu_items
  };
  let window = window_builder.inner.build(event_loop).unwrap();

  context
    .window_event_listeners
    .lock()
    .unwrap()
    .insert(window.id(), WindowEventListenersMap::default());

  context
    .menu_event_listeners
    .lock()
    .unwrap()
    .insert(window.id(), WindowMenuEventListeners::default());

  if window_builder.center {
    let _ = center_window(&window);
  }
  let mut webview_builder = WebViewBuilder::new(window)
    .map_err(|e| Error::CreateWebview(Box::new(e)))?
    .with_url(&url)
    .unwrap() // safe to unwrap because we validate the URL beforehand
    .with_transparent(is_window_transparent);
  if let Some(handler) = rpc_handler {
    webview_builder =
      webview_builder.with_rpc_handler(create_rpc_handler(context.clone(), label.clone(), handler));
  }
  if let Some(handler) = file_drop_handler {
    webview_builder = webview_builder.with_file_drop_handler(create_file_drop_handler(
      context,
      label.clone(),
      handler,
    ));
  }
  for (scheme, protocol) in uri_scheme_protocols {
    webview_builder = webview_builder.with_custom_protocol(scheme, move |wry_request| {
      protocol(&HttpRequestWrapper::from(wry_request).0)
        .map(|tauri_response| HttpResponseWrapper::from(tauri_response).0)
        .map_err(|_| wry::Error::InitScriptError)
    });
  }

  for script in webview_attributes.initialization_scripts {
    webview_builder = webview_builder.with_initialization_script(&script);
  }

  let webview = if let Ok("true") = std::env::var("TAURI_AUTOMATION").as_deref() {
    let mut web_context = web_context.lock().expect("poisoned WebContext store");
    let is_first_context = web_context.is_empty();
    let web_context = match web_context.entry(webview_attributes.data_directory) {
      Occupied(occupied) => occupied.into_mut(),
      Vacant(vacant) => {
        let mut web_context = WebContext::new(vacant.key().clone());
        web_context.set_allows_automation(match std::env::var("TAURI_AUTOMATION").as_deref() {
          Ok("true") => is_first_context,
          _ => false,
        });
        vacant.insert(web_context)
      }
    };
    webview_builder
      .with_web_context(web_context)
      .build()
      .map_err(|e| Error::CreateWebview(Box::new(e)))?
  } else {
    let mut context = WebContext::new(webview_attributes.data_directory);
    webview_builder
      .with_web_context(&mut context)
      .build()
      .map_err(|e| Error::CreateWebview(Box::new(e)))?
  };

  Ok(WindowWrapper {
    label,
    inner: WindowHandle::Webview(webview),
    menu_items,
  })
}

/// Create a wry rpc handler from a tauri rpc handler.
fn create_rpc_handler(
  context: DispatcherContext,
  label: String,
  handler: WebviewRpcHandler<Wry>,
) -> Box<dyn Fn(&Window, WryRpcRequest) -> Option<RpcResponse> + 'static> {
  Box::new(move |window, request| {
    handler(
      DetachedWindow {
        dispatcher: WryDispatcher {
          window_id: window.id(),
          context: context.clone(),
        },
        label: label.clone(),
      },
      RpcRequestWrapper(request).into(),
    );
    None
  })
}

/// Create a wry file drop handler from a tauri file drop handler.
fn create_file_drop_handler(
  context: DispatcherContext,
  label: String,
  handler: FileDropHandler<Wry>,
) -> Box<dyn Fn(&Window, WryFileDropEvent) -> bool + 'static> {
  Box::new(move |window, event| {
    handler(
      FileDropEventWrapper(event).into(),
      DetachedWindow {
        dispatcher: WryDispatcher {
          window_id: window.id(),
          context: context.clone(),
        },
        label: label.clone(),
      },
    )
  })
}
