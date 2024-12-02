'use client';

import React, { useCallback, useEffect } from 'react';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  };
  return __assign.apply(this, arguments);
};

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var AnalyticsContext = React.createContext({
    trackEvent: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
});
var Analytics = function (_a) {
    var onCollect = _a.onCollect, _b = _a.endpoint, endpoint = _b === void 0 ? 'https://api.analyticstride.com' : _b, _c = _a.apiKey, apiKey = _c === void 0 ? 'public' : _c, _d = _a.debug, debug = _d === void 0 ? true : _d;
    var trackEvent = useCallback(function (eventData) { return __awaiter(void 0, void 0, void 0, function () {
        var data, url, response, responseText, responseData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    data = __assign({ pathname: window.location.pathname, timestamp: Date.now(), referrer: document.referrer || 'direct', userAgent: navigator.userAgent, screenResolution: "".concat(window.screen.width, "x").concat(window.screen.height), language: navigator.language, hostname: window.location.hostname }, eventData);
                    if (debug) {
                        console.log('Analytics Event:', {
                            type: eventData.eventType || 'pageview',
                            data: data
                        });
                    }
                    if (onCollect) {
                        onCollect(data);
                    }
                    url = "".concat(endpoint, "/collect");
                    if (debug) {
                        console.log('Sending to:', url);
                        console.log('Request body:', JSON.stringify(data, null, 2));
                    }
                    return [4 /*yield*/, fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-API-Key': apiKey,
                            },
                            body: JSON.stringify(data),
                            mode: 'cors',
                            credentials: 'omit',
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    responseText = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status, ", body: ").concat(responseText));
                    }
                    if (debug) {
                        try {
                            responseData = JSON.parse(responseText);
                            console.log('Server Response:', responseData);
                        }
                        catch (e) {
                            console.log('Raw Server Response:', responseText);
                        }
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Analytics error:', error_1);
                    if (debug) {
                        console.error('Full error details:', {
                            endpoint: endpoint,
                            eventData: eventData,
                            error: error_1
                        });
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [onCollect, endpoint, apiKey, debug]);
    useEffect(function () {
        if (debug)
            console.log('Analytics mounted, tracking pageview');
        trackEvent({ eventType: 'pageview' });
        var handleVisibilityChange = function () {
            if (document.visibilityState === 'visible') {
                if (debug)
                    console.log('Page became visible, tracking pageview');
                trackEvent({ eventType: 'pageview' });
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return function () {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [trackEvent, debug]);
    return (React.createElement(AnalyticsContext.Provider, { value: { trackEvent: trackEvent } }, debug && React.createElement("div", { style: { display: 'none' } }, "Analytics Initialized")));
};
var withTracking = function (WrappedButton) {
    return React.forwardRef(function (_a, ref) {
        var trackingName = _a.trackingName, onClick = _a.onClick, children = _a.children, props = __rest(_a, ["trackingName", "onClick", "children"]);
        var trackEvent = React.useContext(AnalyticsContext).trackEvent;
        var handleClick = function (e) { return __awaiter(void 0, void 0, void 0, function () {
            var buttonText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Button clicked:', trackingName);
                        buttonText = typeof children === 'string' ? children : 'custom_content';
                        console.log('Button details:', {
                            eventType: 'button_click',
                            buttonName: trackingName || props.name || 'unnamed_button',
                            buttonText: buttonText
                        });
                        // Track the button click
                        return [4 /*yield*/, trackEvent({
                                eventType: 'button_click',
                                buttonName: trackingName || props.name || 'unnamed_button',
                                buttonText: buttonText
                            })];
                    case 1:
                        // Track the button click
                        _a.sent();
                        // Call the original onClick handler
                        if (onClick) {
                            onClick(e);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        return (React.createElement("button", __assign({}, props, { ref: ref, onClick: handleClick }), children));
    });
};
var TrackedButton = withTracking();

export { Analytics, TrackedButton, withTracking };
//# sourceMappingURL=index.esm.js.map
