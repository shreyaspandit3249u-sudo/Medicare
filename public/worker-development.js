/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./worker/index.ts":
/*!*************************!*\
  !*** ./worker/index.ts ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval(__webpack_require__.ts("/// <reference lib=\"webworker\" />\nself.addEventListener(\"push\", (event)=>{\n    var _event_data;\n    var _event_data_json;\n    const data = (_event_data_json = (_event_data = event.data) === null || _event_data === void 0 ? void 0 : _event_data.json()) !== null && _event_data_json !== void 0 ? _event_data_json : {};\n    const title = data.title || \"Medicare+ Reminder\";\n    const body = data.body || \"It is time for your medication!\";\n    // Show notification\n    event.waitUntil(self.registration.showNotification(title, {\n        body,\n        icon: \"/icon-192x192.png\",\n        badge: \"/icon-192x192.png\",\n        vibrate: data.alarm ? [\n            200,\n            100,\n            200,\n            100,\n            200,\n            100,\n            200\n        ] : [\n            100,\n            50,\n            100\n        ],\n        tag: \"medicare-plus-alarm\",\n        requireInteraction: true\n    }));\n    // Send message to all open tabs to trigger the loud audio alarm\n    if (data.alarm) {\n        event.waitUntil(self.clients.matchAll({\n            type: \"window\",\n            includeUncontrolled: true\n        }).then((clients)=>{\n            for (const client of clients){\n                client.postMessage({\n                    type: \"NOTIFICATION_RECEIVED\",\n                    title,\n                    body,\n                    alarm: true\n                });\n            }\n        }));\n    }\n});\nself.addEventListener(\"notificationclick\", (event)=>{\n    event.notification.close();\n    event.waitUntil(self.clients.matchAll({\n        type: \"window\"\n    }).then((clients)=>{\n        // If a window is already open, focus it\n        for (const client of clients){\n            if (client.url.includes(\"/\") && \"focus\" in client) {\n                // Tell the client to stop the alarm since the user clicked the notification\n                client.postMessage({\n                    type: \"STOP_ALARM\"\n                });\n                return client.focus();\n            }\n        }\n        // If no window is open, open a new one\n        if (self.clients.openWindow) {\n            return self.clients.openWindow(\"/\");\n        }\n    }));\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi93b3JrZXIvaW5kZXgudHMiLCJtYXBwaW5ncyI6IkFBQUEsaUNBQWlDO0FBSWpDQSxLQUFLQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUNDO1FBQ2hCQTtRQUFBQTtJQUFiLE1BQU1DLE9BQU9ELENBQUFBLG9CQUFBQSxjQUFBQSxNQUFNQyxJQUFJLGNBQVZELGtDQUFBQSxZQUFZRSxJQUFJLGdCQUFoQkYsOEJBQUFBLG1CQUFzQixDQUFDO0lBQ3BDLE1BQU1HLFFBQVFGLEtBQUtFLEtBQUssSUFBSTtJQUM1QixNQUFNQyxPQUFPSCxLQUFLRyxJQUFJLElBQUk7SUFFMUIsb0JBQW9CO0lBQ3BCSixNQUFNSyxTQUFTLENBQ2JQLEtBQUtRLFlBQVksQ0FBQ0MsZ0JBQWdCLENBQUNKLE9BQU87UUFDeENDO1FBQ0FJLE1BQU07UUFDTkMsT0FBTztRQUNQQyxTQUFTVCxLQUFLVSxLQUFLLEdBQUc7WUFBQztZQUFLO1lBQUs7WUFBSztZQUFLO1lBQUs7WUFBSztTQUFJLEdBQUc7WUFBQztZQUFLO1lBQUk7U0FBSTtRQUMxRUMsS0FBSztRQUNMQyxvQkFBb0I7SUFDdEI7SUFHRixnRUFBZ0U7SUFDaEUsSUFBSVosS0FBS1UsS0FBSyxFQUFFO1FBQ2RYLE1BQU1LLFNBQVMsQ0FDYlAsS0FBS2dCLE9BQU8sQ0FBQ0MsUUFBUSxDQUFDO1lBQUVDLE1BQU07WUFBVUMscUJBQXFCO1FBQUssR0FBR0MsSUFBSSxDQUFDLENBQUNKO1lBQ3pFLEtBQUssTUFBTUssVUFBVUwsUUFBUztnQkFDNUJLLE9BQU9DLFdBQVcsQ0FBQztvQkFDakJKLE1BQU07b0JBQ05iO29CQUNBQztvQkFDQU8sT0FBTztnQkFDVDtZQUNGO1FBQ0Y7SUFFSjtBQUNGO0FBRUFiLEtBQUtDLGdCQUFnQixDQUFDLHFCQUFxQixDQUFDQztJQUMxQ0EsTUFBTXFCLFlBQVksQ0FBQ0MsS0FBSztJQUV4QnRCLE1BQU1LLFNBQVMsQ0FDYlAsS0FBS2dCLE9BQU8sQ0FBQ0MsUUFBUSxDQUFDO1FBQUVDLE1BQU07SUFBUyxHQUFHRSxJQUFJLENBQUMsQ0FBQ0o7UUFDOUMsd0NBQXdDO1FBQ3hDLEtBQUssTUFBTUssVUFBVUwsUUFBUztZQUM1QixJQUFJSyxPQUFPSSxHQUFHLENBQUNDLFFBQVEsQ0FBQyxRQUFRLFdBQVdMLFFBQVE7Z0JBQ2pELDRFQUE0RTtnQkFDNUVBLE9BQU9DLFdBQVcsQ0FBQztvQkFBRUosTUFBTTtnQkFBYTtnQkFDeEMsT0FBT0csT0FBT00sS0FBSztZQUNyQjtRQUNGO1FBQ0EsdUNBQXVDO1FBQ3ZDLElBQUkzQixLQUFLZ0IsT0FBTyxDQUFDWSxVQUFVLEVBQUU7WUFDM0IsT0FBTzVCLEtBQUtnQixPQUFPLENBQUNZLFVBQVUsQ0FBQztRQUNqQztJQUNGO0FBRUoiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xccmV2YXBcXC5nZW1pbmlcXGFudGlncmF2aXR5XFxzY3JhdGNoXFxoZWFsdGgtYXNzaXN0YW50XFx3b3JrZXJcXGluZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIGxpYj1cIndlYndvcmtlclwiIC8+XG5cbmRlY2xhcmUgY29uc3Qgc2VsZjogU2VydmljZVdvcmtlckdsb2JhbFNjb3BlO1xuXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoXCJwdXNoXCIsIChldmVudCkgPT4ge1xuICBjb25zdCBkYXRhID0gZXZlbnQuZGF0YT8uanNvbigpID8/IHt9O1xuICBjb25zdCB0aXRsZSA9IGRhdGEudGl0bGUgfHwgXCJNZWRpY2FyZSsgUmVtaW5kZXJcIjtcbiAgY29uc3QgYm9keSA9IGRhdGEuYm9keSB8fCBcIkl0IGlzIHRpbWUgZm9yIHlvdXIgbWVkaWNhdGlvbiFcIjtcblxuICAvLyBTaG93IG5vdGlmaWNhdGlvblxuICBldmVudC53YWl0VW50aWwoXG4gICAgc2VsZi5yZWdpc3RyYXRpb24uc2hvd05vdGlmaWNhdGlvbih0aXRsZSwge1xuICAgICAgYm9keSxcbiAgICAgIGljb246IFwiL2ljb24tMTkyeDE5Mi5wbmdcIixcbiAgICAgIGJhZGdlOiBcIi9pY29uLTE5MngxOTIucG5nXCIsXG4gICAgICB2aWJyYXRlOiBkYXRhLmFsYXJtID8gWzIwMCwgMTAwLCAyMDAsIDEwMCwgMjAwLCAxMDAsIDIwMF0gOiBbMTAwLCA1MCwgMTAwXSxcbiAgICAgIHRhZzogXCJtZWRpY2FyZS1wbHVzLWFsYXJtXCIsXG4gICAgICByZXF1aXJlSW50ZXJhY3Rpb246IHRydWUsIC8vIEtlZXAgaXQgb24gc2NyZWVuIHVudGlsIGRpc21pc3NlZFxuICAgIH0gYXMgYW55KVxuICApO1xuXG4gIC8vIFNlbmQgbWVzc2FnZSB0byBhbGwgb3BlbiB0YWJzIHRvIHRyaWdnZXIgdGhlIGxvdWQgYXVkaW8gYWxhcm1cbiAgaWYgKGRhdGEuYWxhcm0pIHtcbiAgICBldmVudC53YWl0VW50aWwoXG4gICAgICBzZWxmLmNsaWVudHMubWF0Y2hBbGwoeyB0eXBlOiBcIndpbmRvd1wiLCBpbmNsdWRlVW5jb250cm9sbGVkOiB0cnVlIH0pLnRoZW4oKGNsaWVudHMpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBjbGllbnQgb2YgY2xpZW50cykge1xuICAgICAgICAgIGNsaWVudC5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiBcIk5PVElGSUNBVElPTl9SRUNFSVZFRFwiLFxuICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICBib2R5LFxuICAgICAgICAgICAgYWxhcm06IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgfVxufSk7XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcIm5vdGlmaWNhdGlvbmNsaWNrXCIsIChldmVudCkgPT4ge1xuICBldmVudC5ub3RpZmljYXRpb24uY2xvc2UoKTtcblxuICBldmVudC53YWl0VW50aWwoXG4gICAgc2VsZi5jbGllbnRzLm1hdGNoQWxsKHsgdHlwZTogXCJ3aW5kb3dcIiB9KS50aGVuKChjbGllbnRzKSA9PiB7XG4gICAgICAvLyBJZiBhIHdpbmRvdyBpcyBhbHJlYWR5IG9wZW4sIGZvY3VzIGl0XG4gICAgICBmb3IgKGNvbnN0IGNsaWVudCBvZiBjbGllbnRzKSB7XG4gICAgICAgIGlmIChjbGllbnQudXJsLmluY2x1ZGVzKFwiL1wiKSAmJiBcImZvY3VzXCIgaW4gY2xpZW50KSB7XG4gICAgICAgICAgLy8gVGVsbCB0aGUgY2xpZW50IHRvIHN0b3AgdGhlIGFsYXJtIHNpbmNlIHRoZSB1c2VyIGNsaWNrZWQgdGhlIG5vdGlmaWNhdGlvblxuICAgICAgICAgIGNsaWVudC5wb3N0TWVzc2FnZSh7IHR5cGU6IFwiU1RPUF9BTEFSTVwiIH0pO1xuICAgICAgICAgIHJldHVybiBjbGllbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gSWYgbm8gd2luZG93IGlzIG9wZW4sIG9wZW4gYSBuZXcgb25lXG4gICAgICBpZiAoc2VsZi5jbGllbnRzLm9wZW5XaW5kb3cpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuY2xpZW50cy5vcGVuV2luZG93KFwiL1wiKTtcbiAgICAgIH1cbiAgICB9KVxuICApO1xufSk7XG4iXSwibmFtZXMiOlsic2VsZiIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsImRhdGEiLCJqc29uIiwidGl0bGUiLCJib2R5Iiwid2FpdFVudGlsIiwicmVnaXN0cmF0aW9uIiwic2hvd05vdGlmaWNhdGlvbiIsImljb24iLCJiYWRnZSIsInZpYnJhdGUiLCJhbGFybSIsInRhZyIsInJlcXVpcmVJbnRlcmFjdGlvbiIsImNsaWVudHMiLCJtYXRjaEFsbCIsInR5cGUiLCJpbmNsdWRlVW5jb250cm9sbGVkIiwidGhlbiIsImNsaWVudCIsInBvc3RNZXNzYWdlIiwibm90aWZpY2F0aW9uIiwiY2xvc2UiLCJ1cmwiLCJpbmNsdWRlcyIsImZvY3VzIiwib3BlbldpbmRvdyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./worker/index.ts\n"));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	(() => {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = () => {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: (script) => (script)
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	(() => {
/******/ 		__webpack_require__.ts = (script) => (__webpack_require__.tt().createScript(script));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	(() => {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push((options) => {
/******/ 			const originalFactory = options.factory;
/******/ 			options.factory = (moduleObject, moduleExports, webpackRequire) => {
/******/ 				const hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				const cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : () => {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./worker/index.ts");
/******/ 	
/******/ })()
;