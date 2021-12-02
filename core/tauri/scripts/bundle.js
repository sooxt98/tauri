function _inherits(e, t) {
  if ('function' != typeof t && null !== t)
    throw new TypeError('Super expression must either be null or a function')
  ;(e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 }
  })),
    t && _setPrototypeOf(e, t)
}
function _setPrototypeOf(e, t) {
  return (_setPrototypeOf =
    Object.setPrototypeOf ||
    function (e, t) {
      return (e.__proto__ = t), e
    })(e, t)
}
function _createSuper(e) {
  var t = _isNativeReflectConstruct()
  return function () {
    var r,
      n = _getPrototypeOf(e)
    if (t) {
      var a = _getPrototypeOf(this).constructor
      r = Reflect.construct(n, arguments, a)
    } else r = n.apply(this, arguments)
    return _possibleConstructorReturn(this, r)
  }
}
function _possibleConstructorReturn(e, t) {
  if (t && ('object' === _typeof(t) || 'function' == typeof t)) return t
  if (void 0 !== t)
    throw new TypeError(
      'Derived constructors may only return object or undefined'
    )
  return _assertThisInitialized(e)
}
function _assertThisInitialized(e) {
  if (void 0 === e)
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    )
  return e
}
function _isNativeReflectConstruct() {
  if ('undefined' == typeof Reflect || !Reflect.construct) return !1
  if (Reflect.construct.sham) return !1
  if ('function' == typeof Proxy) return !0
  try {
    return (
      Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {})
      ),
      !0
    )
  } catch (e) {
    return !1
  }
}
function _getPrototypeOf(e) {
  return (_getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function (e) {
        return e.__proto__ || Object.getPrototypeOf(e)
      })(e)
}
function _createForOfIteratorHelper(e, t) {
  var r =
    ('undefined' != typeof Symbol && e[Symbol.iterator]) || e['@@iterator']
  if (!r) {
    if (
      Array.isArray(e) ||
      (r = _unsupportedIterableToArray(e)) ||
      (t && e && 'number' == typeof e.length)
    ) {
      r && (e = r)
      var n = 0,
        a = function () {}
      return {
        s: a,
        n: function () {
          return n >= e.length ? { done: !0 } : { done: !1, value: e[n++] }
        },
        e: function (e) {
          throw e
        },
        f: a
      }
    }
    throw new TypeError(
      'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
    )
  }
  var o,
    i = !0,
    u = !1
  return {
    s: function () {
      r = r.call(e)
    },
    n: function () {
      var e = r.next()
      return (i = e.done), e
    },
    e: function (e) {
      ;(u = !0), (o = e)
    },
    f: function () {
      try {
        i || null == r.return || r.return()
      } finally {
        if (u) throw o
      }
    }
  }
}
function _unsupportedIterableToArray(e, t) {
  if (e) {
    if ('string' == typeof e) return _arrayLikeToArray(e, t)
    var r = Object.prototype.toString.call(e).slice(8, -1)
    return (
      'Object' === r && e.constructor && (r = e.constructor.name),
      'Map' === r || 'Set' === r
        ? Array.from(e)
        : 'Arguments' === r ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
        ? _arrayLikeToArray(e, t)
        : void 0
    )
  }
}
function _arrayLikeToArray(e, t) {
  ;(null == t || t > e.length) && (t = e.length)
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r]
  return n
}
function ownKeys(e, t) {
  var r = Object.keys(e)
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e)
    t &&
      (n = n.filter(function (t) {
        return Object.getOwnPropertyDescriptor(e, t).enumerable
      })),
      r.push.apply(r, n)
  }
  return r
}
function _objectSpread(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = null != arguments[t] ? arguments[t] : {}
    t % 2
      ? ownKeys(Object(r), !0).forEach(function (t) {
          _defineProperty(e, t, r[t])
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
      : ownKeys(Object(r)).forEach(function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
        })
  }
  return e
}
function _defineProperty(e, t, r) {
  return (
    t in e
      ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0
        })
      : (e[t] = r),
    e
  )
}
function _classCallCheck(e, t) {
  if (!(e instanceof t))
    throw new TypeError('Cannot call a class as a function')
}
function _defineProperties(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r]
    ;(n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      'value' in n && (n.writable = !0),
      Object.defineProperty(e, n.key, n)
  }
}
function _createClass(e, t, r) {
  return t && _defineProperties(e.prototype, t), r && _defineProperties(e, r), e
}
function asyncGeneratorStep(e, t, r, n, a, o, i) {
  try {
    var u = e[o](i),
      s = u.value
  } catch (e) {
    return void r(e)
  }
  u.done ? t(s) : Promise.resolve(s).then(n, a)
}
function _asyncToGenerator(e) {
  return function () {
    var t = this,
      r = arguments
    return new Promise(function (n, a) {
      var o = e.apply(t, r)
      function i(e) {
        asyncGeneratorStep(o, n, a, i, u, 'next', e)
      }
      function u(e) {
        asyncGeneratorStep(o, n, a, i, u, 'throw', e)
      }
      i(void 0)
    })
  }
}
function _typeof(e) {
  return (_typeof =
    'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
      ? function (e) {
          return typeof e
        }
      : function (e) {
          return e &&
            'function' == typeof Symbol &&
            e.constructor === Symbol &&
            e !== Symbol.prototype
            ? 'symbol'
            : typeof e
        })(e)
}
!(function (e, t) {
  'object' ===
    ('undefined' == typeof exports ? 'undefined' : _typeof(exports)) &&
  'undefined' != typeof module
    ? t(exports)
    : 'function' == typeof define && define.amd
    ? define(['exports'], t)
    : t(
        ((e =
          'undefined' != typeof globalThis ? globalThis : e || self).__TAURI__ =
          {})
      )
})(this, function (e) {
  'use strict'
  var t = (function (e) {
    var t,
      r = Object.prototype,
      n = r.hasOwnProperty,
      a = 'function' == typeof Symbol ? Symbol : {},
      o = a.iterator || '@@iterator',
      i = a.asyncIterator || '@@asyncIterator',
      u = a.toStringTag || '@@toStringTag'
    function s(e, t, r) {
      return (
        Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }),
        e[t]
      )
    }
    try {
      s({}, '')
    } catch (e) {
      s = function (e, t, r) {
        return (e[t] = r)
      }
    }
    function c(e, t, r, n) {
      var a = t && t.prototype instanceof y ? t : y,
        o = Object.create(a.prototype),
        i = new M(n || [])
      return (
        (o._invoke = (function (e, t, r) {
          var n = l
          return function (a, o) {
            if (n === h) throw new Error('Generator is already running')
            if (n === m) {
              if ('throw' === a) throw o
              return C()
            }
            for (r.method = a, r.arg = o; ; ) {
              var i = r.delegate
              if (i) {
                var u = T(i, r)
                if (u) {
                  if (u === d) continue
                  return u
                }
              }
              if ('next' === r.method) r.sent = r._sent = r.arg
              else if ('throw' === r.method) {
                if (n === l) throw ((n = m), r.arg)
                r.dispatchException(r.arg)
              } else 'return' === r.method && r.abrupt('return', r.arg)
              n = h
              var s = p(e, t, r)
              if ('normal' === s.type) {
                if (((n = r.done ? m : f), s.arg === d)) continue
                return { value: s.arg, done: r.done }
              }
              'throw' === s.type &&
                ((n = m), (r.method = 'throw'), (r.arg = s.arg))
            }
          }
        })(e, r, i)),
        o
      )
    }
    function p(e, t, r) {
      try {
        return { type: 'normal', arg: e.call(t, r) }
      } catch (e) {
        return { type: 'throw', arg: e }
      }
    }
    e.wrap = c
    var l = 'suspendedStart',
      f = 'suspendedYield',
      h = 'executing',
      m = 'completed',
      d = {}
    function y() {}
    function g() {}
    function _() {}
    var v = {}
    s(v, o, function () {
      return this
    })
    var w = Object.getPrototypeOf,
      b = w && w(w(O([])))
    b && b !== r && n.call(b, o) && (v = b)
    var R = (_.prototype = y.prototype = Object.create(v))
    function k(e) {
      ;['next', 'throw', 'return'].forEach(function (t) {
        s(e, t, function (e) {
          return this._invoke(t, e)
        })
      })
    }
    function x(e, t) {
      function r(a, o, i, u) {
        var s = p(e[a], e, o)
        if ('throw' !== s.type) {
          var c = s.arg,
            l = c.value
          return l && 'object' === _typeof(l) && n.call(l, '__await')
            ? t.resolve(l.__await).then(
                function (e) {
                  r('next', e, i, u)
                },
                function (e) {
                  r('throw', e, i, u)
                }
              )
            : t.resolve(l).then(
                function (e) {
                  ;(c.value = e), i(c)
                },
                function (e) {
                  return r('throw', e, i, u)
                }
              )
        }
        u(s.arg)
      }
      var a
      this._invoke = function (e, n) {
        function o() {
          return new t(function (t, a) {
            r(e, n, t, a)
          })
        }
        return (a = a ? a.then(o, o) : o())
      }
    }
    function T(e, r) {
      var n = e.iterator[r.method]
      if (n === t) {
        if (((r.delegate = null), 'throw' === r.method)) {
          if (
            e.iterator.return &&
            ((r.method = 'return'), (r.arg = t), T(e, r), 'throw' === r.method)
          )
            return d
          ;(r.method = 'throw'),
            (r.arg = new TypeError(
              "The iterator does not provide a 'throw' method"
            ))
        }
        return d
      }
      var a = p(n, e.iterator, r.arg)
      if ('throw' === a.type)
        return (r.method = 'throw'), (r.arg = a.arg), (r.delegate = null), d
      var o = a.arg
      return o
        ? o.done
          ? ((r[e.resultName] = o.value),
            (r.next = e.nextLoc),
            'return' !== r.method && ((r.method = 'next'), (r.arg = t)),
            (r.delegate = null),
            d)
          : o
        : ((r.method = 'throw'),
          (r.arg = new TypeError('iterator result is not an object')),
          (r.delegate = null),
          d)
    }
    function G(e) {
      var t = { tryLoc: e[0] }
      1 in e && (t.catchLoc = e[1]),
        2 in e && ((t.finallyLoc = e[2]), (t.afterLoc = e[3])),
        this.tryEntries.push(t)
    }
    function P(e) {
      var t = e.completion || {}
      ;(t.type = 'normal'), delete t.arg, (e.completion = t)
    }
    function M(e) {
      ;(this.tryEntries = [{ tryLoc: 'root' }]),
        e.forEach(G, this),
        this.reset(!0)
    }
    function O(e) {
      if (e) {
        var r = e[o]
        if (r) return r.call(e)
        if ('function' == typeof e.next) return e
        if (!isNaN(e.length)) {
          var a = -1,
            i = function r() {
              for (; ++a < e.length; )
                if (n.call(e, a)) return (r.value = e[a]), (r.done = !1), r
              return (r.value = t), (r.done = !0), r
            }
          return (i.next = i)
        }
      }
      return { next: C }
    }
    function C() {
      return { value: t, done: !0 }
    }
    return (
      (g.prototype = _),
      s(R, 'constructor', _),
      s(_, 'constructor', g),
      (g.displayName = s(_, u, 'GeneratorFunction')),
      (e.isGeneratorFunction = function (e) {
        var t = 'function' == typeof e && e.constructor
        return (
          !!t && (t === g || 'GeneratorFunction' === (t.displayName || t.name))
        )
      }),
      (e.mark = function (e) {
        return (
          Object.setPrototypeOf
            ? Object.setPrototypeOf(e, _)
            : ((e.__proto__ = _), s(e, u, 'GeneratorFunction')),
          (e.prototype = Object.create(R)),
          e
        )
      }),
      (e.awrap = function (e) {
        return { __await: e }
      }),
      k(x.prototype),
      s(x.prototype, i, function () {
        return this
      }),
      (e.AsyncIterator = x),
      (e.async = function (t, r, n, a, o) {
        void 0 === o && (o = Promise)
        var i = new x(c(t, r, n, a), o)
        return e.isGeneratorFunction(r)
          ? i
          : i.next().then(function (e) {
              return e.done ? e.value : i.next()
            })
      }),
      k(R),
      s(R, u, 'Generator'),
      s(R, o, function () {
        return this
      }),
      s(R, 'toString', function () {
        return '[object Generator]'
      }),
      (e.keys = function (e) {
        var t = []
        for (var r in e) t.push(r)
        return (
          t.reverse(),
          function r() {
            for (; t.length; ) {
              var n = t.pop()
              if (n in e) return (r.value = n), (r.done = !1), r
            }
            return (r.done = !0), r
          }
        )
      }),
      (e.values = O),
      (M.prototype = {
        constructor: M,
        reset: function (e) {
          if (
            ((this.prev = 0),
            (this.next = 0),
            (this.sent = this._sent = t),
            (this.done = !1),
            (this.delegate = null),
            (this.method = 'next'),
            (this.arg = t),
            this.tryEntries.forEach(P),
            !e)
          )
            for (var r in this)
              't' === r.charAt(0) &&
                n.call(this, r) &&
                !isNaN(+r.slice(1)) &&
                (this[r] = t)
        },
        stop: function () {
          this.done = !0
          var e = this.tryEntries[0].completion
          if ('throw' === e.type) throw e.arg
          return this.rval
        },
        dispatchException: function (e) {
          if (this.done) throw e
          var r = this
          function a(n, a) {
            return (
              (u.type = 'throw'),
              (u.arg = e),
              (r.next = n),
              a && ((r.method = 'next'), (r.arg = t)),
              !!a
            )
          }
          for (var o = this.tryEntries.length - 1; o >= 0; --o) {
            var i = this.tryEntries[o],
              u = i.completion
            if ('root' === i.tryLoc) return a('end')
            if (i.tryLoc <= this.prev) {
              var s = n.call(i, 'catchLoc'),
                c = n.call(i, 'finallyLoc')
              if (s && c) {
                if (this.prev < i.catchLoc) return a(i.catchLoc, !0)
                if (this.prev < i.finallyLoc) return a(i.finallyLoc)
              } else if (s) {
                if (this.prev < i.catchLoc) return a(i.catchLoc, !0)
              } else {
                if (!c)
                  throw new Error('try statement without catch or finally')
                if (this.prev < i.finallyLoc) return a(i.finallyLoc)
              }
            }
          }
        },
        abrupt: function (e, t) {
          for (var r = this.tryEntries.length - 1; r >= 0; --r) {
            var a = this.tryEntries[r]
            if (
              a.tryLoc <= this.prev &&
              n.call(a, 'finallyLoc') &&
              this.prev < a.finallyLoc
            ) {
              var o = a
              break
            }
          }
          o &&
            ('break' === e || 'continue' === e) &&
            o.tryLoc <= t &&
            t <= o.finallyLoc &&
            (o = null)
          var i = o ? o.completion : {}
          return (
            (i.type = e),
            (i.arg = t),
            o
              ? ((this.method = 'next'), (this.next = o.finallyLoc), d)
              : this.complete(i)
          )
        },
        complete: function (e, t) {
          if ('throw' === e.type) throw e.arg
          return (
            'break' === e.type || 'continue' === e.type
              ? (this.next = e.arg)
              : 'return' === e.type
              ? ((this.rval = this.arg = e.arg),
                (this.method = 'return'),
                (this.next = 'end'))
              : 'normal' === e.type && t && (this.next = t),
            d
          )
        },
        finish: function (e) {
          for (var t = this.tryEntries.length - 1; t >= 0; --t) {
            var r = this.tryEntries[t]
            if (r.finallyLoc === e)
              return this.complete(r.completion, r.afterLoc), P(r), d
          }
        },
        catch: function (e) {
          for (var t = this.tryEntries.length - 1; t >= 0; --t) {
            var r = this.tryEntries[t]
            if (r.tryLoc === e) {
              var n = r.completion
              if ('throw' === n.type) {
                var a = n.arg
                P(r)
              }
              return a
            }
          }
          throw new Error('illegal catch attempt')
        },
        delegateYield: function (e, r, n) {
          return (
            (this.delegate = { iterator: O(e), resultName: r, nextLoc: n }),
            'next' === this.method && (this.arg = t),
            d
          )
        }
      }),
      e
    )
  })(
    'object' === ('undefined' == typeof module ? 'undefined' : _typeof(module))
      ? module.exports
      : {}
  )
  try {
    regeneratorRuntime = t
  } catch (e) {
    'object' ===
    ('undefined' == typeof globalThis ? 'undefined' : _typeof(globalThis))
      ? (globalThis.regeneratorRuntime = t)
      : Function('r', 'regeneratorRuntime = r')(t)
  }
  function r(e) {
    for (var t = void 0, r = e[0], n = 1; n < e.length; ) {
      var a = e[n],
        o = e[n + 1]
      if (
        ((n += 2),
        ('optionalAccess' === a || 'optionalCall' === a) && null == r)
      )
        return
      'access' === a || 'optionalAccess' === a
        ? ((t = r), (r = o(r)))
        : ('call' !== a && 'optionalCall' !== a) ||
          ((r = o(function () {
            for (
              var e, n = arguments.length, a = new Array(n), o = 0;
              o < n;
              o++
            )
              a[o] = arguments[o]
            return (e = r).call.apply(e, [t].concat(a))
          })),
          (t = void 0))
    }
    return r
  }
  function n() {
    var e = new Int8Array(1)
    window.crypto.getRandomValues(e)
    var t = new Uint8Array(Math.max(16, Math.abs(e[0])))
    return window.crypto.getRandomValues(t), t.join('')
  }
  function a(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
      a = n()
    return (
      Object.defineProperty(window, a, {
        value: function (n) {
          return (
            t && Reflect.deleteProperty(window, a),
            r([
              e,
              'optionalCall',
              function (e) {
                return e(n)
              }
            ])
          )
        },
        writable: !1,
        configurable: !0
      }),
      a
    )
  }
  function o(e) {
    return i.apply(this, arguments)
  }
  function i() {
    return (i = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        var r,
          n = arguments
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  (r = n.length > 1 && void 0 !== n[1] ? n[1] : {}),
                  e.abrupt(
                    'return',
                    new Promise(function (e, n) {
                      var o = a(function (t) {
                          e(t), Reflect.deleteProperty(window, i)
                        }, !0),
                        i = a(function (e) {
                          n(e), Reflect.deleteProperty(window, o)
                        }, !0)
                      window.__TAURI_POST_MESSAGE__(
                        t,
                        _objectSpread(
                          {
                            __invokeKey: __TAURI_INVOKE_KEY__,
                            callback: o,
                            error: i
                          },
                          r
                        )
                      )
                    })
                  )
                )
              case 2:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var u = Object.freeze({
    __proto__: null,
    transformCallback: a,
    invoke: o,
    convertFileSrc: function (e) {
      return navigator.userAgent.includes('Windows')
        ? 'https://asset.localhost/'.concat(e)
        : 'asset://'.concat(e)
    }
  })
  function s(e) {
    return c.apply(this, arguments)
  }
  function c() {
    return (c = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt('return', o('tauri', t))
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function p() {
    return (p = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({ __tauriModule: 'App', message: { cmd: 'getAppVersion' } })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function l() {
    return (l = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({ __tauriModule: 'App', message: { cmd: 'getAppName' } })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function f() {
    return (f = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'App',
                    message: { cmd: 'getTauriVersion' }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var h = Object.freeze({
    __proto__: null,
    getName: function () {
      return l.apply(this, arguments)
    },
    getVersion: function () {
      return p.apply(this, arguments)
    },
    getTauriVersion: function () {
      return f.apply(this, arguments)
    }
  })
  function m() {
    return (m = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({ __tauriModule: 'Cli', message: { cmd: 'cliMatches' } })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var d = Object.freeze({
    __proto__: null,
    getMatches: function () {
      return m.apply(this, arguments)
    }
  })
  function y() {
    return (y = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Clipboard',
                    message: { cmd: 'writeText', data: t }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function g() {
    return (g = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Clipboard',
                    message: { cmd: 'readText' }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var _ = Object.freeze({
    __proto__: null,
    writeText: function (e) {
      return y.apply(this, arguments)
    },
    readText: function () {
      return g.apply(this, arguments)
    }
  })
  function v() {
    return (v = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        var t,
          r = arguments
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  'object' ===
                    _typeof(
                      (t = r.length > 0 && void 0 !== r[0] ? r[0] : {})
                    ) && Object.freeze(t),
                  e.abrupt(
                    'return',
                    s({
                      __tauriModule: 'Dialog',
                      message: { cmd: 'openDialog', options: t }
                    })
                  )
                )
              case 3:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function w() {
    return (w = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        var t,
          r = arguments
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  'object' ===
                    _typeof(
                      (t = r.length > 0 && void 0 !== r[0] ? r[0] : {})
                    ) && Object.freeze(t),
                  e.abrupt(
                    'return',
                    s({
                      __tauriModule: 'Dialog',
                      message: { cmd: 'saveDialog', options: t }
                    })
                  )
                )
              case 3:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function b() {
    return (b = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Dialog',
                    message: { cmd: 'messageDialog', message: t }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function R() {
    return (R = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t, r) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Dialog',
                    message: { cmd: 'askDialog', title: r, message: t }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function k() {
    return (k = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t, r) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Dialog',
                    message: { cmd: 'confirmDialog', title: r, message: t }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var x = Object.freeze({
    __proto__: null,
    open: function () {
      return v.apply(this, arguments)
    },
    save: function () {
      return w.apply(this, arguments)
    },
    message: function (e) {
      return b.apply(this, arguments)
    },
    ask: function (e, t) {
      return R.apply(this, arguments)
    },
    confirm: function (e, t) {
      return k.apply(this, arguments)
    }
  })
  function T(e, t, r) {
    return G.apply(this, arguments)
  }
  function G() {
    return (G = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t, r, n) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  (e.next = 2),
                  s({
                    __tauriModule: 'Event',
                    message: {
                      cmd: 'emit',
                      event: t,
                      windowLabel: r,
                      payload: n
                    }
                  })
                )
              case 2:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function P(e) {
    return M.apply(this, arguments)
  }
  function M() {
    return (M = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Event',
                    message: { cmd: 'unlisten', eventId: t }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function O(e, t) {
    return C.apply(this, arguments)
  }
  function C() {
    return (C = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t, r) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Event',
                    message: { cmd: 'listen', event: t, handler: a(r) }
                  }).then(function (e) {
                    return _asyncToGenerator(
                      regeneratorRuntime.mark(function t() {
                        return regeneratorRuntime.wrap(function (t) {
                          for (;;)
                            switch ((t.prev = t.next)) {
                              case 0:
                                return t.abrupt('return', P(e))
                              case 1:
                              case 'end':
                                return t.stop()
                            }
                        }, t)
                      })
                    )
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function j(e, t) {
    return S.apply(this, arguments)
  }
  function S() {
    return (S = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t, r) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  O(t, function (e) {
                    r(e), P(e.id).catch(function () {})
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function A(e, t) {
    return D.apply(this, arguments)
  }
  function D() {
    return (D = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t, r) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt('return', T(t, void 0, r))
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var z,
    L = Object.freeze({ __proto__: null, listen: O, once: j, emit: A })
  function E() {
    return (E = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        var r,
          n = arguments
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  (r = n.length > 1 && void 0 !== n[1] ? n[1] : {}),
                  e.abrupt(
                    'return',
                    s({
                      __tauriModule: 'Fs',
                      message: { cmd: 'readTextFile', path: t, options: r }
                    })
                  )
                )
              case 2:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function W() {
    return (W = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        var r,
          n = arguments
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  (r = n.length > 1 && void 0 !== n[1] ? n[1] : {}),
                  e.abrupt(
                    'return',
                    s({
                      __tauriModule: 'Fs',
                      message: { cmd: 'readBinaryFile', path: t, options: r }
                    })
                  )
                )
              case 2:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function F() {
    return (F = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        var r,
          n = arguments
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  'object' ===
                    _typeof(
                      (r = n.length > 1 && void 0 !== n[1] ? n[1] : {})
                    ) && Object.freeze(r),
                  'object' === _typeof(t) && Object.freeze(t),
                  e.abrupt(
                    'return',
                    s({
                      __tauriModule: 'Fs',
                      message: {
                        cmd: 'writeFile',
                        path: t.path,
                        contents: t.contents,
                        options: r
                      }
                    })
                  )
                )
              case 4:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  !(function (e) {
    e[(e.Audio = 1)] = 'Audio'
    e[(e.Cache = 2)] = 'Cache'
    e[(e.Config = 3)] = 'Config'
    e[(e.Data = 4)] = 'Data'
    e[(e.LocalData = 5)] = 'LocalData'
    e[(e.Desktop = 6)] = 'Desktop'
    e[(e.Document = 7)] = 'Document'
    e[(e.Download = 8)] = 'Download'
    e[(e.Executable = 9)] = 'Executable'
    e[(e.Font = 10)] = 'Font'
    e[(e.Home = 11)] = 'Home'
    e[(e.Picture = 12)] = 'Picture'
    e[(e.Public = 13)] = 'Public'
    e[(e.Runtime = 14)] = 'Runtime'
    e[(e.Template = 15)] = 'Template'
    e[(e.Video = 16)] = 'Video'
    e[(e.Resource = 17)] = 'Resource'
    e[(e.App = 18)] = 'App'
    e[(e.Current = 19)] = 'Current'
    e[(e.Log = 20)] = 'Log'
  })(z || (z = {}))
  var I = 65536
  function N(e) {
    var t = (function (e) {
      if (e.length < I) return String.fromCharCode.apply(null, Array.from(e))
      for (var t = '', r = e.length, n = 0; n < r; n++) {
        var a = e.subarray(n * I, (n + 1) * I)
        t += String.fromCharCode.apply(null, Array.from(a))
      }
      return t
    })(new Uint8Array(e))
    return btoa(t)
  }
  function U() {
    return (U = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        var r,
          n = arguments
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  'object' ===
                    _typeof(
                      (r = n.length > 1 && void 0 !== n[1] ? n[1] : {})
                    ) && Object.freeze(r),
                  'object' === _typeof(t) && Object.freeze(t),
                  e.abrupt(
                    'return',
                    s({
                      __tauriModule: 'Fs',
                      message: {
                        cmd: 'writeBinaryFile',
                        path: t.path,
                        contents: N(t.contents),
                        options: r
                      }
                    })
                  )
                )
              case 4:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function B() {
    return (B = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        var r,
          n = arguments
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  (r = n.length > 1 && void 0 !== n[1] ? n[1] : {}),
                  e.abrupt(
                    'return',
                    s({
                      __tauriModule: 'Fs',
                      message: { cmd: 'readDir', path: t, options: r }
                    })
                  )
                )
              case 2:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function V() {
    return (V = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        var r,
          n = arguments
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  (r = n.length > 1 && void 0 !== n[1] ? n[1] : {}),
                  e.abrupt(
                    'return',
                    s({
                      __tauriModule: 'Fs',
                      message: { cmd: 'createDir', path: t, options: r }
                    })
                  )
                )
              case 2:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function q() {
    return (q = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        var r,
          n = arguments
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  (r = n.length > 1 && void 0 !== n[1] ? n[1] : {}),
                  e.abrupt(
                    'return',
                    s({
                      __tauriModule: 'Fs',
                      message: { cmd: 'removeDir', path: t, options: r }
                    })
                  )
                )
              case 2:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function H() {
    return (H = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t, r) {
        var n,
          a = arguments
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  (n = a.length > 2 && void 0 !== a[2] ? a[2] : {}),
                  e.abrupt(
                    'return',
                    s({
                      __tauriModule: 'Fs',
                      message: {
                        cmd: 'copyFile',
                        source: t,
                        destination: r,
                        options: n
                      }
                    })
                  )
                )
              case 2:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function J() {
    return (J = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        var r,
          n = arguments
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  (r = n.length > 1 && void 0 !== n[1] ? n[1] : {}),
                  e.abrupt(
                    'return',
                    s({
                      __tauriModule: 'Fs',
                      message: { cmd: 'removeFile', path: t, options: r }
                    })
                  )
                )
              case 2:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function K() {
    return (K = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t, r) {
        var n,
          a = arguments
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  (n = a.length > 2 && void 0 !== a[2] ? a[2] : {}),
                  e.abrupt(
                    'return',
                    s({
                      __tauriModule: 'Fs',
                      message: {
                        cmd: 'renameFile',
                        oldPath: t,
                        newPath: r,
                        options: n
                      }
                    })
                  )
                )
              case 2:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var Y = Object.freeze({
    __proto__: null,
    get BaseDirectory() {
      return z
    },
    get Dir() {
      return z
    },
    readTextFile: function (e) {
      return E.apply(this, arguments)
    },
    readBinaryFile: function (e) {
      return W.apply(this, arguments)
    },
    writeFile: function (e) {
      return F.apply(this, arguments)
    },
    writeBinaryFile: function (e) {
      return U.apply(this, arguments)
    },
    readDir: function (e) {
      return B.apply(this, arguments)
    },
    createDir: function (e) {
      return V.apply(this, arguments)
    },
    removeDir: function (e) {
      return q.apply(this, arguments)
    },
    copyFile: function (e, t) {
      return H.apply(this, arguments)
    },
    removeFile: function (e) {
      return J.apply(this, arguments)
    },
    renameFile: function (e, t) {
      return K.apply(this, arguments)
    }
  })
  function $() {
    return ($ = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t, r) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'GlobalShortcut',
                    message: { cmd: 'register', shortcut: t, handler: a(r) }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Q() {
    return (Q = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t, r) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'GlobalShortcut',
                    message: { cmd: 'registerAll', shortcuts: t, handler: a(r) }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function X() {
    return (X = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'GlobalShortcut',
                    message: { cmd: 'isRegistered', shortcut: t }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Z() {
    return (Z = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'GlobalShortcut',
                    message: { cmd: 'unregister', shortcut: t }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function ee() {
    return (ee = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'GlobalShortcut',
                    message: { cmd: 'unregisterAll' }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var te,
    re = Object.freeze({
      __proto__: null,
      register: function (e, t) {
        return $.apply(this, arguments)
      },
      registerAll: function (e, t) {
        return Q.apply(this, arguments)
      },
      isRegistered: function (e) {
        return X.apply(this, arguments)
      },
      unregister: function (e) {
        return Z.apply(this, arguments)
      },
      unregisterAll: function () {
        return ee.apply(this, arguments)
      }
    })
  function ne(e, t) {
    return null != e ? e : t()
  }
  function ae(e) {
    for (var t = void 0, r = e[0], n = 1; n < e.length; ) {
      var a = e[n],
        o = e[n + 1]
      if (
        ((n += 2),
        ('optionalAccess' === a || 'optionalCall' === a) && null == r)
      )
        return
      'access' === a || 'optionalAccess' === a
        ? ((t = r), (r = o(r)))
        : ('call' !== a && 'optionalCall' !== a) ||
          ((r = o(function () {
            for (
              var e, n = arguments.length, a = new Array(n), o = 0;
              o < n;
              o++
            )
              a[o] = arguments[o]
            return (e = r).call.apply(e, [t].concat(a))
          })),
          (t = void 0))
    }
    return r
  }
  !(function (e) {
    e[(e.JSON = 1)] = 'JSON'
    e[(e.Text = 2)] = 'Text'
    e[(e.Binary = 3)] = 'Binary'
  })(te || (te = {}))
  var oe = (function () {
      function e(t, r) {
        _classCallCheck(this, e), (this.type = t), (this.payload = r)
      }
      return (
        _createClass(e, null, [
          {
            key: 'form',
            value: function (t) {
              return new e('Form', t)
            }
          },
          {
            key: 'json',
            value: function (t) {
              return new e('Json', t)
            }
          },
          {
            key: 'text',
            value: function (t) {
              return new e('Text', t)
            }
          },
          {
            key: 'bytes',
            value: function (t) {
              return new e('Bytes', t)
            }
          }
        ]),
        e
      )
    })(),
    ie = function e(t) {
      _classCallCheck(this, e),
        (this.url = t.url),
        (this.status = t.status),
        (this.ok = this.status >= 200 && this.status < 300),
        (this.headers = t.headers),
        (this.data = t.data)
    },
    ue = (function () {
      function e(t) {
        _classCallCheck(this, e), (this.id = t)
      }
      var t, r, n, a, o, i, u
      return (
        _createClass(e, [
          {
            key: 'drop',
            value:
              ((u = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Http',
                                message: { cmd: 'dropClient', client: this.id }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return u.apply(this, arguments)
              })
          },
          {
            key: 'request',
            value:
              ((i = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t) {
                  var r
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (
                              (r =
                                !t.responseType ||
                                t.responseType === te.JSON) &&
                                (t.responseType = te.Text),
                              e.abrupt(
                                'return',
                                s({
                                  __tauriModule: 'Http',
                                  message: {
                                    cmd: 'httpRequest',
                                    client: this.id,
                                    options: t
                                  }
                                }).then(function (e) {
                                  var t = new ie(e)
                                  if (r) {
                                    try {
                                      t.data = JSON.parse(t.data)
                                    } catch (e) {
                                      if (t.ok)
                                        throw Error(
                                          'Failed to parse response `'
                                            .concat(t.data, '` as JSON: ')
                                            .concat(
                                              e,
                                              ';\n              try setting the `responseType` option to `ResponseType.Text` or `ResponseType.Binary` if the API does not return a JSON response.'
                                            )
                                        )
                                    }
                                    return t
                                  }
                                  return t
                                })
                              )
                            )
                          case 3:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e) {
                return i.apply(this, arguments)
              })
          },
          {
            key: 'get',
            value:
              ((o = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t, r) {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              this.request(
                                _objectSpread({ method: 'GET', url: t }, r)
                              )
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e, t) {
                return o.apply(this, arguments)
              })
          },
          {
            key: 'post',
            value:
              ((a = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t, r, n) {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              this.request(
                                _objectSpread(
                                  { method: 'POST', url: t, body: r },
                                  n
                                )
                              )
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e, t, r) {
                return a.apply(this, arguments)
              })
          },
          {
            key: 'put',
            value:
              ((n = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t, r, n) {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              this.request(
                                _objectSpread(
                                  { method: 'PUT', url: t, body: r },
                                  n
                                )
                              )
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e, t, r) {
                return n.apply(this, arguments)
              })
          },
          {
            key: 'patch',
            value:
              ((r = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t, r) {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              this.request(
                                _objectSpread({ method: 'PATCH', url: t }, r)
                              )
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e, t) {
                return r.apply(this, arguments)
              })
          },
          {
            key: 'delete',
            value:
              ((t = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t, r) {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              this.request(
                                _objectSpread({ method: 'DELETE', url: t }, r)
                              )
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e, r) {
                return t.apply(this, arguments)
              })
          }
        ]),
        e
      )
    })()
  function se(e) {
    return ce.apply(this, arguments)
  }
  function ce() {
    return (ce = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Http',
                    message: { cmd: 'createClient', options: t }
                  }).then(function (e) {
                    return new ue(e)
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var pe = null
  function le() {
    return (le = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t, r) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                if (null !== pe) {
                  e.next = 4
                  break
                }
                return (e.next = 3), se()
              case 3:
                pe = e.sent
              case 4:
                return e.abrupt(
                  'return',
                  pe.request(
                    _objectSpread(
                      {
                        url: t,
                        method: ne(
                          ae([
                            r,
                            'optionalAccess',
                            function (e) {
                              return e.method
                            }
                          ]),
                          function () {
                            return 'GET'
                          }
                        )
                      },
                      r
                    )
                  )
                )
              case 5:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var fe = Object.freeze({
    __proto__: null,
    getClient: se,
    fetch: function (e, t) {
      return le.apply(this, arguments)
    },
    Body: oe,
    Client: ue,
    Response: ie,
    get ResponseType() {
      return te
    }
  })
  function he() {
    return (he = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                if ('default' === window.Notification.permission) {
                  e.next = 2
                  break
                }
                return e.abrupt(
                  'return',
                  Promise.resolve('granted' === window.Notification.permission)
                )
              case 2:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Notification',
                    message: { cmd: 'isNotificationPermissionGranted' }
                  })
                )
              case 3:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function me() {
    return (me = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  window.Notification.requestPermission()
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var de = Object.freeze({
    __proto__: null,
    sendNotification: function (e) {
      'string' == typeof e
        ? new window.Notification(e)
        : new window.Notification(e.title, e)
    },
    requestPermission: function () {
      return me.apply(this, arguments)
    },
    isPermissionGranted: function () {
      return he.apply(this, arguments)
    }
  })
  function ye() {
    return navigator.appVersion.includes('Win')
  }
  function ge() {
    return (ge = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: { cmd: 'resolvePath', path: '', directory: z.App }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function _e() {
    return (_e = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: {
                      cmd: 'resolvePath',
                      path: '',
                      directory: z.Audio
                    }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function ve() {
    return (ve = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: {
                      cmd: 'resolvePath',
                      path: '',
                      directory: z.Cache
                    }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function we() {
    return (we = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: {
                      cmd: 'resolvePath',
                      path: '',
                      directory: z.Config
                    }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function be() {
    return (be = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: { cmd: 'resolvePath', path: '', directory: z.Data }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Re() {
    return (Re = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: {
                      cmd: 'resolvePath',
                      path: '',
                      directory: z.Desktop
                    }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function ke() {
    return (ke = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: {
                      cmd: 'resolvePath',
                      path: '',
                      directory: z.Document
                    }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function xe() {
    return (xe = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: {
                      cmd: 'resolvePath',
                      path: '',
                      directory: z.Download
                    }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Te() {
    return (Te = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: {
                      cmd: 'resolvePath',
                      path: '',
                      directory: z.Executable
                    }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Ge() {
    return (Ge = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: { cmd: 'resolvePath', path: '', directory: z.Font }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Pe() {
    return (Pe = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: { cmd: 'resolvePath', path: '', directory: z.Home }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Me() {
    return (Me = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: {
                      cmd: 'resolvePath',
                      path: '',
                      directory: z.LocalData
                    }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Oe() {
    return (Oe = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: {
                      cmd: 'resolvePath',
                      path: '',
                      directory: z.Picture
                    }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Ce() {
    return (Ce = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: {
                      cmd: 'resolvePath',
                      path: '',
                      directory: z.Public
                    }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function je() {
    return (je = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: {
                      cmd: 'resolvePath',
                      path: '',
                      directory: z.Resource
                    }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Se() {
    return (Se = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: {
                      cmd: 'resolvePath',
                      path: '',
                      directory: z.Runtime
                    }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Ae() {
    return (Ae = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: {
                      cmd: 'resolvePath',
                      path: '',
                      directory: z.Template
                    }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function De() {
    return (De = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: {
                      cmd: 'resolvePath',
                      path: '',
                      directory: z.Video
                    }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function ze() {
    return (ze = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: {
                      cmd: 'resolvePath',
                      path: '',
                      directory: z.Current
                    }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Le() {
    return (Le = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: { cmd: 'resolvePath', path: '', directory: z.Log }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var Ee = ye() ? '\\' : '/',
    We = ye() ? ';' : ':'
  function Fe() {
    return (Fe = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        var t,
          r,
          n,
          a = arguments
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                for (t = a.length, r = new Array(t), n = 0; n < t; n++)
                  r[n] = a[n]
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: { cmd: 'resolve', paths: r }
                  })
                )
              case 2:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Ie() {
    return (Ie = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: { cmd: 'normalize', path: t }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Ne() {
    return (Ne = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        var t,
          r,
          n,
          a = arguments
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                for (t = a.length, r = new Array(t), n = 0; n < t; n++)
                  r[n] = a[n]
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: { cmd: 'join', paths: r }
                  })
                )
              case 2:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Ue() {
    return (Ue = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: { cmd: 'dirname', path: t }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Be() {
    return (Be = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: { cmd: 'extname', path: t }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Ve() {
    return (Ve = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t, r) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: { cmd: 'basename', path: t, ext: r }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function qe() {
    return (qe = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Path',
                    message: { cmd: 'isAbsolute', path: t }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var He = Object.freeze({
    __proto__: null,
    appDir: function () {
      return ge.apply(this, arguments)
    },
    audioDir: function () {
      return _e.apply(this, arguments)
    },
    cacheDir: function () {
      return ve.apply(this, arguments)
    },
    configDir: function () {
      return we.apply(this, arguments)
    },
    dataDir: function () {
      return be.apply(this, arguments)
    },
    desktopDir: function () {
      return Re.apply(this, arguments)
    },
    documentDir: function () {
      return ke.apply(this, arguments)
    },
    downloadDir: function () {
      return xe.apply(this, arguments)
    },
    executableDir: function () {
      return Te.apply(this, arguments)
    },
    fontDir: function () {
      return Ge.apply(this, arguments)
    },
    homeDir: function () {
      return Pe.apply(this, arguments)
    },
    localDataDir: function () {
      return Me.apply(this, arguments)
    },
    pictureDir: function () {
      return Oe.apply(this, arguments)
    },
    publicDir: function () {
      return Ce.apply(this, arguments)
    },
    resourceDir: function () {
      return je.apply(this, arguments)
    },
    runtimeDir: function () {
      return Se.apply(this, arguments)
    },
    templateDir: function () {
      return Ae.apply(this, arguments)
    },
    videoDir: function () {
      return De.apply(this, arguments)
    },
    currentDir: function () {
      return ze.apply(this, arguments)
    },
    logDir: function () {
      return Le.apply(this, arguments)
    },
    get BaseDirectory() {
      return z
    },
    sep: Ee,
    delimiter: We,
    resolve: function () {
      return Fe.apply(this, arguments)
    },
    normalize: function (e) {
      return Ie.apply(this, arguments)
    },
    join: function () {
      return Ne.apply(this, arguments)
    },
    dirname: function (e) {
      return Ue.apply(this, arguments)
    },
    extname: function (e) {
      return Be.apply(this, arguments)
    },
    basename: function (e, t) {
      return Ve.apply(this, arguments)
    },
    isAbsolute: function (e) {
      return qe.apply(this, arguments)
    }
  })
  function Je() {
    return (Je = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        var t,
          r = arguments
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  (t = r.length > 0 && void 0 !== r[0] ? r[0] : 0),
                  e.abrupt(
                    'return',
                    s({
                      __tauriModule: 'Process',
                      message: { cmd: 'exit', exitCode: t }
                    })
                  )
                )
              case 2:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Ke() {
    return (Ke = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({ __tauriModule: 'Process', message: { cmd: 'relaunch' } })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var Ye = Object.freeze({
    __proto__: null,
    exit: function () {
      return Je.apply(this, arguments)
    },
    relaunch: function () {
      return Ke.apply(this, arguments)
    }
  })
  function $e(e, t) {
    return null != e ? e : t()
  }
  function Qe(e, t, r, n) {
    return Xe.apply(this, arguments)
  }
  function Xe() {
    return (Xe = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t, r, n, o) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  'object' === _typeof(n) && Object.freeze(n),
                  e.abrupt(
                    'return',
                    s({
                      __tauriModule: 'Shell',
                      message: {
                        cmd: 'execute',
                        program: r,
                        args: 'string' == typeof n ? [n] : n,
                        options: o,
                        onEventFn: a(t)
                      }
                    })
                  )
                )
              case 2:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var Ze = (function () {
      function e() {
        _classCallCheck(this, e), e.prototype.__init.call(this)
      }
      return (
        _createClass(e, [
          {
            key: '__init',
            value: function () {
              this.eventListeners = Object.create(null)
            }
          },
          {
            key: 'addEventListener',
            value: function (e, t) {
              e in this.eventListeners
                ? this.eventListeners[e].push(t)
                : (this.eventListeners[e] = [t])
            }
          },
          {
            key: '_emit',
            value: function (e, t) {
              if (e in this.eventListeners) {
                var r,
                  n = _createForOfIteratorHelper(this.eventListeners[e])
                try {
                  for (n.s(); !(r = n.n()).done; ) {
                    ;(0, r.value)(t)
                  }
                } catch (e) {
                  n.e(e)
                } finally {
                  n.f()
                }
              }
            }
          },
          {
            key: 'on',
            value: function (e, t) {
              return this.addEventListener(e, t), this
            }
          }
        ]),
        e
      )
    })(),
    et = (function () {
      function e(t) {
        _classCallCheck(this, e), (this.pid = t)
      }
      var t, r
      return (
        _createClass(e, [
          {
            key: 'write',
            value:
              ((r = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t) {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Shell',
                                message: {
                                  cmd: 'stdinWrite',
                                  pid: this.pid,
                                  buffer: t
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e) {
                return r.apply(this, arguments)
              })
          },
          {
            key: 'kill',
            value:
              ((t = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Shell',
                                message: { cmd: 'killChild', pid: this.pid }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return t.apply(this, arguments)
              })
          }
        ]),
        e
      )
    })(),
    tt = (function (e) {
      _inherits(a, e)
      var t,
        r,
        n = _createSuper(a)
      function a(e) {
        var t,
          r =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
          o = arguments.length > 2 ? arguments[2] : void 0
        return (
          _classCallCheck(this, a),
          (t = n.call(this)),
          a.prototype.__init2.call(_assertThisInitialized(t)),
          a.prototype.__init3.call(_assertThisInitialized(t)),
          (t.program = e),
          (t.args = 'string' == typeof r ? [r] : r),
          (t.options = $e(o, function () {
            return {}
          })),
          t
        )
      }
      return (
        _createClass(
          a,
          [
            {
              key: '__init2',
              value: function () {
                this.stdout = new Ze()
              }
            },
            {
              key: '__init3',
              value: function () {
                this.stderr = new Ze()
              }
            },
            {
              key: 'spawn',
              value:
                ((r = _asyncToGenerator(
                  regeneratorRuntime.mark(function e() {
                    var t = this
                    return regeneratorRuntime.wrap(
                      function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              return e.abrupt(
                                'return',
                                Qe(
                                  function (e) {
                                    switch (e.event) {
                                      case 'Error':
                                        t._emit('error', e.payload)
                                        break
                                      case 'Terminated':
                                        t._emit('close', e.payload)
                                        break
                                      case 'Stdout':
                                        t.stdout._emit('data', e.payload)
                                        break
                                      case 'Stderr':
                                        t.stderr._emit('data', e.payload)
                                    }
                                  },
                                  this.program,
                                  this.args,
                                  this.options
                                ).then(function (e) {
                                  return new et(e)
                                })
                              )
                            case 1:
                            case 'end':
                              return e.stop()
                          }
                      },
                      e,
                      this
                    )
                  })
                )),
                function () {
                  return r.apply(this, arguments)
                })
            },
            {
              key: 'execute',
              value:
                ((t = _asyncToGenerator(
                  regeneratorRuntime.mark(function e() {
                    var t = this
                    return regeneratorRuntime.wrap(function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              new Promise(function (e, r) {
                                t.on('error', r)
                                var n = [],
                                  a = []
                                t.stdout.on('data', function (e) {
                                  n.push(e)
                                }),
                                  t.stderr.on('data', function (e) {
                                    a.push(e)
                                  }),
                                  t.on('close', function (t) {
                                    e({
                                      code: t.code,
                                      signal: t.signal,
                                      stdout: n.join('\n'),
                                      stderr: a.join('\n')
                                    })
                                  }),
                                  t.spawn().catch(r)
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    }, e)
                  })
                )),
                function () {
                  return t.apply(this, arguments)
                })
            }
          ],
          [
            {
              key: 'sidecar',
              value: function (e) {
                var t =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : [],
                  r = arguments.length > 2 ? arguments[2] : void 0,
                  n = new a(e, t, r)
                return (n.options.sidecar = !0), n
              }
            }
          ]
        ),
        a
      )
    })(Ze)
  function rt() {
    return (rt = _asyncToGenerator(
      regeneratorRuntime.mark(function e(t, r) {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Shell',
                    message: { cmd: 'open', path: t, with: r }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var nt = Object.freeze({
    __proto__: null,
    Command: tt,
    Child: et,
    open: function (e, t) {
      return rt.apply(this, arguments)
    }
  })
  function at(e) {
    for (var t = void 0, r = e[0], n = 1; n < e.length; ) {
      var a = e[n],
        o = e[n + 1]
      if (
        ((n += 2),
        ('optionalAccess' === a || 'optionalCall' === a) && null == r)
      )
        return
      'access' === a || 'optionalAccess' === a
        ? ((t = r), (r = o(r)))
        : ('call' !== a && 'optionalCall' !== a) ||
          ((r = o(function () {
            for (
              var e, n = arguments.length, a = new Array(n), o = 0;
              o < n;
              o++
            )
              a[o] = arguments[o]
            return (e = r).call.apply(e, [t].concat(a))
          })),
          (t = void 0))
    }
    return r
  }
  function ot() {
    return (ot = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        var t, r
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  (r = function () {
                    t && t(), (t = void 0)
                  }),
                  e.abrupt(
                    'return',
                    new Promise(function (e, n) {
                      O('tauri://update-status', function (t) {
                        var a
                        ;(a = at([
                          t,
                          'optionalAccess',
                          function (e) {
                            return e.payload
                          }
                        ])).error
                          ? (r(), n(a.error))
                          : 'DONE' === a.status && (r(), e())
                      })
                        .then(function (e) {
                          t = e
                        })
                        .catch(function (e) {
                          throw (r(), e)
                        }),
                        A('tauri://update-install').catch(function (e) {
                          throw (r(), e)
                        })
                    })
                  )
                )
              case 2:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function it() {
    return (it = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        var t, r
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  (r = function () {
                    t && t(), (t = void 0)
                  }),
                  e.abrupt(
                    'return',
                    new Promise(function (e, n) {
                      j('tauri://update-available', function (t) {
                        var n
                        ;(n = at([
                          t,
                          'optionalAccess',
                          function (e) {
                            return e.payload
                          }
                        ])),
                          r(),
                          e({ manifest: n, shouldUpdate: !0 })
                      }).catch(function (e) {
                        throw (r(), e)
                      }),
                        O('tauri://update-status', function (t) {
                          var a
                          ;(a = at([
                            t,
                            'optionalAccess',
                            function (e) {
                              return e.payload
                            }
                          ])).error
                            ? (r(), n(a.error))
                            : 'UPTODATE' === a.status &&
                              (r(), e({ shouldUpdate: !1 }))
                        })
                          .then(function (e) {
                            t = e
                          })
                          .catch(function (e) {
                            throw (r(), e)
                          }),
                        A('tauri://update').catch(function (e) {
                          throw (r(), e)
                        })
                    })
                  )
                )
              case 2:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var ut = Object.freeze({
    __proto__: null,
    installUpdate: function () {
      return ot.apply(this, arguments)
    },
    checkUpdate: function () {
      return it.apply(this, arguments)
    }
  })
  function st(e) {
    for (var t = void 0, r = e[0], n = 1; n < e.length; ) {
      var a = e[n],
        o = e[n + 1]
      if (
        ((n += 2),
        ('optionalAccess' === a || 'optionalCall' === a) && null == r)
      )
        return
      'access' === a || 'optionalAccess' === a
        ? ((t = r), (r = o(r)))
        : ('call' !== a && 'optionalCall' !== a) ||
          ((r = o(function () {
            for (
              var e, n = arguments.length, a = new Array(n), o = 0;
              o < n;
              o++
            )
              a[o] = arguments[o]
            return (e = r).call.apply(e, [t].concat(a))
          })),
          (t = void 0))
    }
    return r
  }
  var ct,
    pt = (function () {
      function e(t, r) {
        _classCallCheck(this, e),
          e.prototype.__init.call(this),
          (this.width = t),
          (this.height = r)
      }
      return (
        _createClass(e, [
          {
            key: '__init',
            value: function () {
              this.type = 'Logical'
            }
          }
        ]),
        e
      )
    })(),
    lt = (function () {
      function e(t, r) {
        _classCallCheck(this, e),
          e.prototype.__init2.call(this),
          (this.width = t),
          (this.height = r)
      }
      return (
        _createClass(e, [
          {
            key: '__init2',
            value: function () {
              this.type = 'Physical'
            }
          },
          {
            key: 'toLogical',
            value: function (e) {
              return new pt(this.width / e, this.height / e)
            }
          }
        ]),
        e
      )
    })(),
    ft = (function () {
      function e(t, r) {
        _classCallCheck(this, e),
          e.prototype.__init3.call(this),
          (this.x = t),
          (this.y = r)
      }
      return (
        _createClass(e, [
          {
            key: '__init3',
            value: function () {
              this.type = 'Logical'
            }
          }
        ]),
        e
      )
    })(),
    ht = (function () {
      function e(t, r) {
        _classCallCheck(this, e),
          e.prototype.__init4.call(this),
          (this.x = t),
          (this.y = r)
      }
      return (
        _createClass(e, [
          {
            key: '__init4',
            value: function () {
              this.type = 'Physical'
            }
          },
          {
            key: 'toLogical',
            value: function (e) {
              return new ft(this.x / e, this.y / e)
            }
          }
        ]),
        e
      )
    })()
  function mt() {
    return window.__TAURI__.__windows.map(function (e) {
      return new _t(e.label, { skip: !0 })
    })
  }
  !(function (e) {
    e[(e.Critical = 1)] = 'Critical'
    e[(e.Informational = 2)] = 'Informational'
  })(ct || (ct = {}))
  var dt = ['tauri://created', 'tauri://error'],
    yt = (function () {
      function e(t) {
        _classCallCheck(this, e)
        try {
          this.label =
            ((n = function () {
              return window.__TAURI__.__currentWindow.label
            }),
            null != (r = t) ? r : n())
        } catch (e) {
          this.label = ''
        }
        var r, n
        this.listeners = Object.create(null)
      }
      var t, r, n
      return (
        _createClass(e, [
          {
            key: 'listen',
            value:
              ((n = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t, r) {
                  var n = this
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            if (!this._handleTauriEvent(t, r)) {
                              e.next = 2
                              break
                            }
                            return e.abrupt(
                              'return',
                              Promise.resolve(function () {
                                var e = n.listeners[t]
                                e.splice(e.indexOf(r), 1)
                              })
                            )
                          case 2:
                            return e.abrupt('return', O(t, r))
                          case 3:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e, t) {
                return n.apply(this, arguments)
              })
          },
          {
            key: 'once',
            value:
              ((r = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t, r) {
                  var n = this
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            if (!this._handleTauriEvent(t, r)) {
                              e.next = 2
                              break
                            }
                            return e.abrupt(
                              'return',
                              Promise.resolve(function () {
                                var e = n.listeners[t]
                                e.splice(e.indexOf(r), 1)
                              })
                            )
                          case 2:
                            return e.abrupt('return', j(t, r))
                          case 3:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e, t) {
                return r.apply(this, arguments)
              })
          },
          {
            key: 'emit',
            value:
              ((t = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t, r) {
                  var n, a
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            if (!dt.includes(t)) {
                              e.next = 4
                              break
                            }
                            n = _createForOfIteratorHelper(
                              this.listeners[t] || []
                            )
                            try {
                              for (n.s(); !(a = n.n()).done; )
                                (0, a.value)({ event: t, id: -1, payload: r })
                            } catch (e) {
                              n.e(e)
                            } finally {
                              n.f()
                            }
                            return e.abrupt('return', Promise.resolve())
                          case 4:
                            return e.abrupt('return', T(t, this.label, r))
                          case 5:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e, r) {
                return t.apply(this, arguments)
              })
          },
          {
            key: '_handleTauriEvent',
            value: function (e, t) {
              return (
                !!dt.includes(e) &&
                (e in this.listeners
                  ? this.listeners[e].push(t)
                  : (this.listeners[e] = [t]),
                !0)
              )
            }
          }
        ]),
        e
      )
    })(),
    gt = (function (e) {
      _inherits(L, e)
      var t,
        r,
        n,
        a,
        o,
        i,
        u,
        c,
        p,
        l,
        f,
        h,
        m,
        d,
        y,
        g,
        _,
        v,
        w,
        b,
        R,
        k,
        x,
        T,
        G,
        P,
        M,
        O,
        C,
        j,
        S,
        A,
        D,
        z = _createSuper(L)
      function L() {
        return _classCallCheck(this, L), z.apply(this, arguments)
      }
      return (
        _createClass(L, [
          {
            key: 'scaleFactor',
            value:
              ((D = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'scaleFactor' }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return D.apply(this, arguments)
              })
          },
          {
            key: 'innerPosition',
            value:
              ((A = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'innerPosition' }
                                  }
                                }
                              }).then(function (e) {
                                var t = e.x,
                                  r = e.y
                                return new ht(t, r)
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return A.apply(this, arguments)
              })
          },
          {
            key: 'outerPosition',
            value:
              ((S = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'outerPosition' }
                                  }
                                }
                              }).then(function (e) {
                                var t = e.x,
                                  r = e.y
                                return new ht(t, r)
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return S.apply(this, arguments)
              })
          },
          {
            key: 'innerSize',
            value:
              ((j = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'innerSize' }
                                  }
                                }
                              }).then(function (e) {
                                var t = e.width,
                                  r = e.height
                                return new lt(t, r)
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return j.apply(this, arguments)
              })
          },
          {
            key: 'outerSize',
            value:
              ((C = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'outerSize' }
                                  }
                                }
                              }).then(function (e) {
                                var t = e.width,
                                  r = e.height
                                return new lt(t, r)
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return C.apply(this, arguments)
              })
          },
          {
            key: 'isFullscreen',
            value:
              ((O = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'isFullscreen' }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return O.apply(this, arguments)
              })
          },
          {
            key: 'isMaximized',
            value:
              ((M = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'isMaximized' }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return M.apply(this, arguments)
              })
          },
          {
            key: 'isDecorated',
            value:
              ((P = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'isDecorated' }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return P.apply(this, arguments)
              })
          },
          {
            key: 'isResizable',
            value:
              ((G = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'isResizable' }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return G.apply(this, arguments)
              })
          },
          {
            key: 'isVisible',
            value:
              ((T = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'isVisible' }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return T.apply(this, arguments)
              })
          },
          {
            key: 'center',
            value:
              ((x = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'center' }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return x.apply(this, arguments)
              })
          },
          {
            key: 'requestUserAttention',
            value:
              ((k = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t) {
                  var r
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (
                              (r = null),
                              t &&
                                (r =
                                  t === ct.Critical
                                    ? { type: 'Critical' }
                                    : { type: 'Informational' }),
                              e.abrupt(
                                'return',
                                s({
                                  __tauriModule: 'Window',
                                  message: {
                                    cmd: 'manage',
                                    data: {
                                      label: this.label,
                                      cmd: {
                                        type: 'requestUserAttention',
                                        payload: r
                                      }
                                    }
                                  }
                                })
                              )
                            )
                          case 3:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e) {
                return k.apply(this, arguments)
              })
          },
          {
            key: 'setResizable',
            value:
              ((R = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t) {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'setResizable', payload: t }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e) {
                return R.apply(this, arguments)
              })
          },
          {
            key: 'setTitle',
            value:
              ((b = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t) {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'setTitle', payload: t }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e) {
                return b.apply(this, arguments)
              })
          },
          {
            key: 'maximize',
            value:
              ((w = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'maximize' }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return w.apply(this, arguments)
              })
          },
          {
            key: 'unmaximize',
            value:
              ((v = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'unmaximize' }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return v.apply(this, arguments)
              })
          },
          {
            key: 'toggleMaximize',
            value:
              ((_ = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'toggleMaximize' }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return _.apply(this, arguments)
              })
          },
          {
            key: 'minimize',
            value:
              ((g = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'minimize' }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return g.apply(this, arguments)
              })
          },
          {
            key: 'unminimize',
            value:
              ((y = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'unminimize' }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return y.apply(this, arguments)
              })
          },
          {
            key: 'show',
            value:
              ((d = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'show' }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return d.apply(this, arguments)
              })
          },
          {
            key: 'hide',
            value:
              ((m = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'hide' }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return m.apply(this, arguments)
              })
          },
          {
            key: 'close',
            value:
              ((h = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'close' }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return h.apply(this, arguments)
              })
          },
          {
            key: 'setDecorations',
            value:
              ((f = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t) {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'setDecorations', payload: t }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e) {
                return f.apply(this, arguments)
              })
          },
          {
            key: 'setAlwaysOnTop',
            value:
              ((l = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t) {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'setAlwaysOnTop', payload: t }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e) {
                return l.apply(this, arguments)
              })
          },
          {
            key: 'setSize',
            value:
              ((p = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t) {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            if (
                              t &&
                              ('Logical' === t.type || 'Physical' === t.type)
                            ) {
                              e.next = 2
                              break
                            }
                            throw new Error(
                              'the `size` argument must be either a LogicalSize or a PhysicalSize instance'
                            )
                          case 2:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: {
                                      type: 'setSize',
                                      payload: {
                                        type: t.type,
                                        data: {
                                          width: t.width,
                                          height: t.height
                                        }
                                      }
                                    }
                                  }
                                }
                              })
                            )
                          case 3:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e) {
                return p.apply(this, arguments)
              })
          },
          {
            key: 'setMinSize',
            value:
              ((c = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t) {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            if (
                              !t ||
                              'Logical' === t.type ||
                              'Physical' === t.type
                            ) {
                              e.next = 2
                              break
                            }
                            throw new Error(
                              'the `size` argument must be either a LogicalSize or a PhysicalSize instance'
                            )
                          case 2:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: {
                                      type: 'setMinSize',
                                      payload: t
                                        ? {
                                            type: t.type,
                                            data: {
                                              width: t.width,
                                              height: t.height
                                            }
                                          }
                                        : null
                                    }
                                  }
                                }
                              })
                            )
                          case 3:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e) {
                return c.apply(this, arguments)
              })
          },
          {
            key: 'setMaxSize',
            value:
              ((u = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t) {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            if (
                              !t ||
                              'Logical' === t.type ||
                              'Physical' === t.type
                            ) {
                              e.next = 2
                              break
                            }
                            throw new Error(
                              'the `size` argument must be either a LogicalSize or a PhysicalSize instance'
                            )
                          case 2:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: {
                                      type: 'setMaxSize',
                                      payload: t
                                        ? {
                                            type: t.type,
                                            data: {
                                              width: t.width,
                                              height: t.height
                                            }
                                          }
                                        : null
                                    }
                                  }
                                }
                              })
                            )
                          case 3:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e) {
                return u.apply(this, arguments)
              })
          },
          {
            key: 'setPosition',
            value:
              ((i = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t) {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            if (
                              t &&
                              ('Logical' === t.type || 'Physical' === t.type)
                            ) {
                              e.next = 2
                              break
                            }
                            throw new Error(
                              'the `position` argument must be either a LogicalPosition or a PhysicalPosition instance'
                            )
                          case 2:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: {
                                      type: 'setPosition',
                                      payload: {
                                        type: t.type,
                                        data: { x: t.x, y: t.y }
                                      }
                                    }
                                  }
                                }
                              })
                            )
                          case 3:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e) {
                return i.apply(this, arguments)
              })
          },
          {
            key: 'setFullscreen',
            value:
              ((o = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t) {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'setFullscreen', payload: t }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e) {
                return o.apply(this, arguments)
              })
          },
          {
            key: 'setFocus',
            value:
              ((a = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'setFocus' }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return a.apply(this, arguments)
              })
          },
          {
            key: 'setIcon',
            value:
              ((n = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t) {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: {
                                      type: 'setIcon',
                                      payload: { icon: t }
                                    }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e) {
                return n.apply(this, arguments)
              })
          },
          {
            key: 'setSkipTaskbar',
            value:
              ((r = _asyncToGenerator(
                regeneratorRuntime.mark(function e(t) {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'setSkipTaskbar', payload: t }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function (e) {
                return r.apply(this, arguments)
              })
          },
          {
            key: 'startDragging',
            value:
              ((t = _asyncToGenerator(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt(
                              'return',
                              s({
                                __tauriModule: 'Window',
                                message: {
                                  cmd: 'manage',
                                  data: {
                                    label: this.label,
                                    cmd: { type: 'startDragging' }
                                  }
                                }
                              })
                            )
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )),
              function () {
                return t.apply(this, arguments)
              })
          }
        ]),
        L
      )
    })(yt),
    _t = (function (e) {
      _inherits(r, e)
      var t = _createSuper(r)
      function r(e) {
        var n,
          a =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
        return (
          _classCallCheck(this, r),
          (n = t.call(this, e)),
          st([
            a,
            'optionalAccess',
            function (e) {
              return e.skip
            }
          ]) ||
            s({
              __tauriModule: 'Window',
              message: {
                cmd: 'createWebview',
                data: { options: _objectSpread({ label: e }, a) }
              }
            })
              .then(
                _asyncToGenerator(
                  regeneratorRuntime.mark(function e() {
                    return regeneratorRuntime.wrap(function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return e.abrupt('return', n.emit('tauri://created'))
                          case 1:
                          case 'end':
                            return e.stop()
                        }
                    }, e)
                  })
                )
              )
              .catch(
                (function () {
                  var e = _asyncToGenerator(
                    regeneratorRuntime.mark(function e(t) {
                      return regeneratorRuntime.wrap(function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              return e.abrupt(
                                'return',
                                n.emit('tauri://error', t)
                              )
                            case 1:
                            case 'end':
                              return e.stop()
                          }
                      }, e)
                    })
                  )
                  return function (t) {
                    return e.apply(this, arguments)
                  }
                })()
              ),
          n
        )
      }
      return (
        _createClass(r, null, [
          {
            key: 'getByLabel',
            value: function (e) {
              return mt().some(function (t) {
                return t.label === e
              })
                ? new r(e, { skip: !0 })
                : null
            }
          }
        ]),
        r
      )
    })(gt),
    vt = new _t(null, { skip: !0 })
  function wt() {
    return (wt = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Window',
                    message: {
                      cmd: 'manage',
                      data: { cmd: { type: 'currentMonitor' } }
                    }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function bt() {
    return (bt = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Window',
                    message: {
                      cmd: 'manage',
                      data: { cmd: { type: 'primaryMonitor' } }
                    }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Rt() {
    return (Rt = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({
                    __tauriModule: 'Window',
                    message: {
                      cmd: 'manage',
                      data: { cmd: { type: 'availableMonitors' } }
                    }
                  })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var kt = Object.freeze({
      __proto__: null,
      WebviewWindow: _t,
      WebviewWindowHandle: yt,
      WindowManager: gt,
      getCurrent: function () {
        return new _t(window.__TAURI__.__currentWindow.label, { skip: !0 })
      },
      getAll: mt,
      appWindow: vt,
      LogicalSize: pt,
      PhysicalSize: lt,
      LogicalPosition: ft,
      PhysicalPosition: ht,
      get UserAttentionType() {
        return ct
      },
      currentMonitor: function () {
        return wt.apply(this, arguments)
      },
      primaryMonitor: function () {
        return bt.apply(this, arguments)
      },
      availableMonitors: function () {
        return Rt.apply(this, arguments)
      }
    }),
    xt = ye() ? '\r\n' : '\n'
  function Tt() {
    return (Tt = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({ __tauriModule: 'Os', message: { cmd: 'platform' } })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Gt() {
    return (Gt = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({ __tauriModule: 'Os', message: { cmd: 'version' } })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Pt() {
    return (Pt = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({ __tauriModule: 'Os', message: { cmd: 'type' } })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Mt() {
    return (Mt = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({ __tauriModule: 'Os', message: { cmd: 'arch' } })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  function Ot() {
    return (Ot = _asyncToGenerator(
      regeneratorRuntime.mark(function e() {
        return regeneratorRuntime.wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  'return',
                  s({ __tauriModule: 'Os', message: { cmd: 'tempdir' } })
                )
              case 1:
              case 'end':
                return e.stop()
            }
        }, e)
      })
    )).apply(this, arguments)
  }
  var Ct = Object.freeze({
      __proto__: null,
      EOL: xt,
      platform: function () {
        return Tt.apply(this, arguments)
      },
      version: function () {
        return Gt.apply(this, arguments)
      },
      type: function () {
        return Pt.apply(this, arguments)
      },
      arch: function () {
        return Mt.apply(this, arguments)
      },
      tempdir: function () {
        return Ot.apply(this, arguments)
      }
    }),
    jt = o
  ;(e.app = h),
    (e.cli = d),
    (e.clipboard = _),
    (e.dialog = x),
    (e.event = L),
    (e.fs = Y),
    (e.globalShortcut = re),
    (e.http = fe),
    (e.invoke = jt),
    (e.notification = de),
    (e.os = Ct),
    (e.path = He),
    (e.process = Ye),
    (e.shell = nt),
    (e.tauri = u),
    (e.updater = ut),
    (e.window = kt),
    Object.defineProperty(e, '__esModule', { value: !0 })
})
