(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = {
  load: function load(userInfo, apiKey, integrations) {
    var analytics = this.setup(apiKey);

    analytics.identify(userInfo.user_id, {
      email: userInfo.email,
      username: userInfo.username,
      "package": userInfo.pkg
    }, { integrations: integrations });

    // always track initial page visit
    analytics.page(undefined, undefined, undefined, { integrations: integrations });

    analytics.ready(function () {
      if (!window._weq) return; // make sure webengage is enabled

      // http://docs.webengage.com/sdks/web/older_v4_docs/readme.html
      window._weq["webengage.onReady"] = function () {
        window._weq["webengage.customData"] = {
          user_id: userInfo.user_id,
          "package": userInfo.pkg
        };
      };
    });
  },

  // from https://segment.com/docs/libraries/analytics.js/quickstart/#step-1-copy-the-snippet
  //
  // segment.io's analytics library works best when the `analytics` object
  // is treated as a global object (i.e. `window.analytics`). Therefore,
  // this library won't return anything. It just sets up the global object.
  setup: function setup(apiKey) {
    // Create a queue, but don't obliterate an existing one!
    var analytics = window.analytics = window.analytics || [];

    // If the real analytics.js is already on the page return.
    if (analytics.initialize) {
      return;
    } // If the snippet was invoked already show an error.
    if (analytics.invoked) {
      if (window.console && console.error) {
        console.error("Segment snippet included twice.");
      }
      return;
    }

    // Invoked flag, to make sure the snippet
    // is never invoked twice.
    analytics.invoked = true;

    // A list of the methods in Analytics.js to stub.
    analytics.methods = ["trackSubmit", "trackClick", "trackLink", "trackForm", "pageview", "identify", "group", "track", "ready", "alias", "page", "once", "off", "on"];

    // Define a factory to create stubs. These are placeholders
    // for methods in Analytics.js so that you never have to wait
    // for it to load to actually record data. The `method` is
    // stored as the first argument, so we can replay the data.
    analytics.factory = function (method) {
      return function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(method);
        analytics.push(args);
        return analytics;
      };
    };

    // For each of our methods, generate a queueing stub.
    for (var i = 0; i < analytics.methods.length; i++) {
      var key = analytics.methods[i];
      analytics[key] = analytics.factory(key);
    }

    // Define a method to load Analytics.js from our CDN,
    // and that will be sure to only ever load it once.
    analytics.load = function (key) {
      // Create an async script element based on your key.
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = ("https:" === document.location.protocol ? "https://" : "http://") + "cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";

      // Insert our script next to the first script element.
      var first = document.getElementsByTagName("script")[0];
      first.parentNode.insertBefore(script, first);
    };

    // Add a version to keep track of what's in the wild.
    analytics.SNIPPET_VERSION = "3.0.1";

    // Load Analytics.js with your key, which will automatically
    // load the tools you've enabled for your account. Boosh!
    analytics.load(apiKey);

    return analytics;
  }
};

},{}],2:[function(require,module,exports){
"use strict";

var Tiara = require("../tiara");

Tiara.run({
  api_key: "PxxE6QRKENlnTEG9w75maGwrGs8z3Ug1" // https://segment.com/sendgrid/mako-front-end
});

},{"../tiara":9}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Analytics = require("./analytics");

module.exports = (function () {
  function DeferredHandlers(defs, helpers, revealAllLinks) {
    _classCallCheck(this, DeferredHandlers);

    this.defs = defs;
    this.helpers = helpers;
    this.revealAllLinks = revealAllLinks;
  }

  _createClass(DeferredHandlers, {
    revealPagesViaFeatureToggles: {
      value: function revealPagesViaFeatureToggles() {
        var _this = this;

        $.when(this.defs.feature_toggles).done(function (featureToggles) {
          if (!_this.revealAllLinks) {
            _this.helpers.revealLinksViaFeatureToggles(featureToggles);
          }
        }).fail(function () {
          console.error("NO FEATURE TOGGLES");
        });
      }
    },
    revealPagesViaFeatureTogglesAndScopes: {
      value: function revealPagesViaFeatureTogglesAndScopes() {
        var _this = this;

        // In case the scopes request fails, isolate the logic that needs both scope and feature toggles down here -
        // the above callback should still run if the scopes request fails.
        $.when(this.defs.feature_toggles, this.defs.scopes).done(function (featureToggles, scopes) {
          featureToggles = featureToggles[0];
          scopes = scopes[0].scopes;

          // At GA, everyone who had access to marketing campaigns should see Nlvx.
          if (_this.helpers.hasFeatureEnabled("nlvx", "nlvx_ga", featureToggles) && _this.helpers.hasScope("^marketing_campaigns\\.create$", scopes)) {
            $("[role=nlvx]").parent().addBack().show();
          }

          // When Two Factor Auth (Authy) feature toggle enabled, show 2FA link and hide legacy Multifactor link
          if (_this.helpers.hasFeatureEnabled("mako", "multifactor_authentication", featureToggles) && _this.helpers.hasScope("^user\\.multifactor_authentication\\.", scopes)) {
            $("[role=two_factor_auth]").parent().addBack().show();
            $("[role=legacy_multifactor]").parent().addBack().hide();
          }

          // When Teammates feature toggle enabled, show Teammates link and hide Credentials link
          if (_this.helpers.hasFeatureEnabled("mako", "teammates", featureToggles) && _this.helpers.hasScope("^credentials\\.", scopes)) {
            $("[role=teammates]").parent().addBack().show();
            $("[role=credentials]").parent().addBack().hide();
          }
        }).fail(function () {
          console.error("NO FEATURE TOGGLES OR NO SCOPES");
        });
      }
    },
    revealPagesViaScopes: {
      value: function revealPagesViaScopes() {
        var _this = this;

        $.when(this.defs.scopes).done(function (scopes) {
          if (!_this.revealAllLinks) {
            scopes = scopes.scopes;
            _this.helpers.revealLinksViaScopes(scopes);
          }
        }).fail(function () {
          console.error("NO SCOPES");
        });
      }
    },
    revealPagesViaAccount: {
      value: function revealPagesViaAccount() {
        var _this = this;

        $.when(this.defs.account).done(function (account) {
          if (!_this.revealAllLinks) {
            if (account.type === "paid") {
              // show whitelabel ips
              $("[data-tiara-nav] [role=whitelabel_ips]").show();
            }
          }
        }).fail(function () {
          console.error("NO ACCOUNT");
        });
      }
    },
    renderPages: {

      // After toggles and scopes have been fetched, show the markup.
      // Note: We're not waiting on defs.ips, since it's an unusually lengthy call

      value: function renderPages() {
        var _this = this;

        return $.when(this.defs.feature_toggles, this.defs.scopes).always(function () {
          if (_this.revealAllLinks) {
            _this.helpers.revealAllLinks();
          }
          $("[role=show-after-fetched]").show();
        });
      }
    },
    showReputationBar: {
      value: function showReputationBar() {
        var _this = this;

        $.when(this.defs.account).done(function (account) {
          _this.helpers.showReputation(account.reputation);
        }).fail(function () {
          console.error("Could not render reputation meter");
        });
      }
    },
    showCreditsBar: {
      value: function showCreditsBar() {
        var _this = this;

        $.when(this.defs.credits).done(function (credits) {
          _this.helpers.showCredits(credits.used, credits.total);
        }).fail(function () {
          console.error("Could not render credits meter");
        });
      }
    },
    showEmailsSentToday: {
      value: function showEmailsSentToday() {
        var _this = this;

        $.when(this.defs.email_stats).done(function (emailStats) {
          var emailsSentToday = emailStats[0].stats[0].metrics.delivered;
          _this.helpers.showEmailsSentToday(emailsSentToday);
        }).fail(function () {
          console.error("Could not render emails sent today");
        });
      }
    },
    showAccountName: {
      value: function showAccountName() {
        var _this = this;

        $.when(this.defs.profile).done(function (profile) {
          var fullName = undefined;
          if (profile.first_name || profile.last_name) {
            fullName = "" + (profile.first_name || "") + " " + (profile.last_name || "");
          } else {
            fullName = "Account";
          }
          _this.helpers.showAccount(fullName);
        }).fail(function () {
          console.error("Could not render account menu");
        });
      }
    },
    loadAnalytics: {
      value: function loadAnalytics(apiKey, integrations) {
        // Even if some of these fail, we want to load analytics with as much data as possible
        // Inspired by http://stackoverflow.com/a/5825233

        var email = {};
        var username = {};
        var pkg = {};
        var defEmail = $.Deferred();
        var defUsername = $.Deferred();
        var defPkg = $.Deferred();

        $.when(this.defs.email).done(function (data) {
          email = data;
        }).always(defEmail.resolve);
        $.when(this.defs.username).done(function (data) {
          username = data;
        }).always(defUsername.resolve);
        $.when(this.defs.pkg).done(function (data) {
          pkg = data;
        }).always(defPkg.resolve);

        $.when(defEmail, defUsername, defPkg).done(function () {
          Analytics.load({
            email: email.email,
            user_id: username.user_id,
            username: username.username,
            pkg: pkg.name
          }, apiKey, integrations);
        }).fail(function () {
          console.error("Could not load analytics");
        });
      }
    },
    showSubusers: {
      value: function showSubusers(subusersHelper, fetcher, parentFetcher, impersonating, impersonateCallback) {
        if (impersonating) {
          $.when(this.defs.parent_subusers).done(function (subusers) {
            if (subusers.length > 1) {
              // can't re-impersonate as same subuser
              $("[data-impersonation-banner-switch-subuser-container]").addClass("is-active");
            }
            subusersHelper.bindSubusers({
              subusers: subusers,
              fetcher: parentFetcher,
              impersonate_callback: impersonateCallback,
              currently_impersonating: impersonating });
          });
        } else {
          $.when(this.defs.subusers).done(function (subusers) {
            if (subusers.length > 0) {
              $("[data-account-toggle-submenu]").show();
            }
            subusersHelper.bindSubusers({
              subusers: subusers,
              fetcher: fetcher,
              impersonate_callback: impersonateCallback });
          }).fail(function () {
            console.error("Could not render subusers");
          });
        }
      }
    },
    hideNewsletterParentLink: {

      // only hide the newsletter parent link if a user has neither newsletter scopes nor nlvx early access feature toggle

      value: function hideNewsletterParentLink() {
        var self = this;
        $.when(self.defs.scopes, self.defs.feature_toggles).done(function (scopes, feature_toggles) {
          scopes = scopes[0].scopes;
          feature_toggles = feature_toggles[0];

          if (!self.helpers.hasScope(/^newsletter\./, scopes) && !self.helpers.hasFeatureEnabled("nlvx", "has_early_access", feature_toggles) && !self.helpers.hasFeatureEnabled("nlvx", "nlvx_ga", feature_toggles)) {
            // hide newsletter page entirely
            $("[data-tiara-nav] li.marketing").hide();
          }
        });
      }
    }
  });

  return DeferredHandlers;
})();

},{"./analytics":1}],4:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

module.exports = (function () {
  function Fetcher($, token, options) {
    _classCallCheck(this, Fetcher);

    options = options || {};
    this.$ = $;
    this.token = token;
    this.api_host = options.api_host;
    this.impersonatingUsername = options.impersonating;

    // Optional option.  This will be a no-op unless configured to logout on auth failure
    this.logoutCallback = options.logoutCallback || function () {};
  }

  _createClass(Fetcher, {
    fetchProfile: {

      // Example response: {"first_name": "Pat", "last_name":  "Pattington"}

      value: function fetchProfile() {
        return this.authorizedAjax("tokens/profile");
      }
    },
    fetchEmail: {

      // Example response: {"email": "me@example.com"}

      value: function fetchEmail() {
        return this.authorizedAjax("user/email");
      }
    },
    fetchAccount: {

      // Example response: {"reputation": 99, "type": "paid"}

      value: function fetchAccount() {
        return this.authorizedAjax("user/account");
      }
    },
    fetchCredits: {

      /* Example response:
        {
          "last_reset": "2015-03-01",
          "next_reset": "2015-04-01",
          "overage": 0,
          "remain": 99997,
          "reset_frequency": "monthly",
          "total": 100000,
          "used": 3
        } */

      value: function fetchCredits() {
        return this.authorizedAjax("user/credits");
      }
    },
    fetchEmailStats: {

      /* Example response:
        [{
          "date": "2015-03-03",
          "stats": [{
            "metrics": {
              "blocks": 0,
              "bounce_drops": 0,
              "bounces": 0,
              "clicks": 0,
              "deferred": 0,
              "delivered": 0,
              "invalid_emails": 0,
              "opens": 0,
              "processed": 0,
              "requests": 0,
              "spam_report_drops": 0,
              "spam_reports": 0,
              "unique_clicks": 0,
              "unique_opens": 0,
              "unsubscribe_drops": 0,
              "unsubscribes": 0
            }
          }]
        }]
      */

      value: function fetchEmailStats() {
        var today = dateString();
        return this.authorizedAjax("stats?aggregated_by=day&start_date=" + today + "&end_date=" + today);
      }
    },
    fetchSubusers: {

      /* Example response:
        [{
         "id": 100,
         "username": "subby1",
         "email": "subby1@example.com"
        }, {
         "id": 101,
         "username": "subby2",
         "email": "subby2@example.com"
        ]
      */

      value: function fetchSubusers(userParams) {
        var params = { limit: 20 };
        if (userParams) {
          this.$.extend(params, userParams);
        }
        return this.authorizedAjax("subusers?" + this.$.param(params));
      }
    },
    fetchFeatureToggles: {

      /* Example response:
        [{
         "id": 100,
         "username": "subby1",
         "email": "subby1@example.com"
        }, {
         "id": 101,
         "username": "subby2",
         "email": "subby2@example.com"
        ]
      */

      value: function fetchFeatureToggles() {
        return this.authorizedAjax("feature_toggles");
      }
    },
    fetchScopes: {

      /* Example response:
        {
          "scopes": [
            "alerts.create",
            "alerts.read",
            "alerts.update",
            "alerts.delete"
          ]
        }
      */

      value: function fetchScopes() {
        return this.authorizedAjax("scopes");
      }
    },
    fetchUsername: {

      /* Example response:
        {
          "user_id": 180,
          "username": "my_username"
        }
      */

      value: function fetchUsername() {
        return this.authorizedAjax("user/username");
      }
    },
    fetchPackage: {

      /* Example response:
        {
          name: "Silver Package",
          description: "Silver Package includes 100,000 email credits per month, $0.00085 per email thereafter.",
          base_price: 79.95,
          overage_price: 0.00085,
          newsletter_price: 0,
          campaign_price: 0,
          is_hv: false,
          package_id: "8b8403b0-ce8a-11e4-b4e5-5fcde71ee009",
          package_status: "Active",
          downgrade_package_id: ""
        }
      */

      value: function fetchPackage() {
        return this.authorizedAjax("user/package");
      }
    },
    authorizedAjax: {
      value: function authorizedAjax(route) {
        var headers = { authorization: "token " + this.token };
        var skipImpersonation = false;

        if (this.impersonatingUsername) {
          headers["On-Behalf-Of"] = this.impersonatingUsername;
        } else {
          // if you use $.ajaxPrefilter in your client code,
          // check options to avoid applying "On-Behalf-Of"
          skipImpersonation = true;
        }
        return this.$.ajax({
          url: "" + this.api_host + "" + route,
          headers: headers,
          skipImpersonation: skipImpersonation,
          statusCode: {
            401: (function (response) {
              this.logoutCallback();
            }).bind(this)
          }
        });
      }
    }
  });

  return Fetcher;
})();

// return today's date formatted, ex: "2015-02-28"
function dateString() {
  var today = new Date();
  var date = today.getDate();
  var month = today.getMonth() + 1; // months are 0-indexed
  var year = today.getFullYear();

  if (date < 10) {
    date = "0" + date;
  }

  if (month < 10) {
    month = "0" + month;
  }

  return [year, month, date].join("-");
}

},{}],5:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Templates = require("./templates");

module.exports = (function () {
  function Helpers($, _, $container) {
    _classCallCheck(this, Helpers);

    this.$ = $;
    this._ = _;
    this.$container = $container;
  }

  _createClass(Helpers, {
    revealLinksViaFeatureToggles: {
      value: function revealLinksViaFeatureToggles(featureToggles) {
        var $ = this.$;
        var self = this;
        this.$container.find("[data-ft-app][data-ft-feature]").each(function (i, link) {
          var $link = $(link);
          var appName = $link.data("ft-app");
          var featureName = $link.data("ft-feature");
          if (self.hasFeatureEnabled(appName, featureName, featureToggles)) {
            $link.removeClass(Templates.featureToggleHiddenClass);
          } else {
            $link.addClass(Templates.featureToggleHiddenClass);
          }
        });
      }
    },
    revealLinksViaScopes: {
      value: function revealLinksViaScopes(scopes) {
        var $ = this.$;
        var self = this;
        this.$container.find("[data-scope]").each(function (i, link) {
          var $link = $(link);
          var scope = $link.data("scope");
          if (self.hasScope(new RegExp(scope), scopes)) {
            $link.removeClass(Templates.scopeHiddenClass);
          } else {
            $link.addClass(Templates.scopeHiddenClass);
          }
        });
      }
    },
    revealAllLinks: {
      value: function revealAllLinks() {
        this.$container.find("[data-ft-app][data-ft-feature], [data-scope], [role=whitelabel_ips]").each(function (i, link) {
          var $link = $(link).show();
        });
      }
    },
    hasFeatureEnabled: {
      value: function hasFeatureEnabled(appName, featureName, featureToggles) {
        for (var i in featureToggles) {
          var ftAppName = featureToggles[i].app_name;
          var ftFeatureName = featureToggles[i].feature_name;
          if (appName == ftAppName && featureName == ftFeatureName) {
            return true;
          }
        }
        return false;
      }
    },
    hasScope: {
      value: function hasScope(scopeRegex, scopes) {
        for (var i in scopes) {
          var scope = scopes[i];
          if (scope.match(scopeRegex)) {
            return true;
          }
        }
        return false;
      }
    },
    bindTooltips: {
      value: function bindTooltips() {
        var $ = this.$;
        var $tooltips = this.$container.find("[data-spotlight=tiara-marketing-campaigns]");
        var $tooltipCallout = this.$container.find(".spotlight-tooltip");
        var $tooltipCloser = this.$container.find("[data-spotlight-close]");
        $tooltipCloser.click(function (e) {
          $tooltips.hide();
          $(".marketing").removeClass("is-active");
          $(".dashboard").addClass("is-active");
        });
        $tooltips.click(function (e) {
          $tooltips.hide();
          $(".marketing").removeClass("is-active");
          $(".dashboard").addClass("is-active");
        });
        $tooltipCallout.click(function (e) {
          e.stopPropagation();
        });
      }
    },
    bindNav: {
      value: function bindNav() {
        var $ = this.$;
        var $pageLinks = this.$container.find("[role=page] > a");
        var $allSubpages = this.$container.find("[role=subpages]");
        var speed = "fast";
        $pageLinks.click(function (e) {
          var $parent = $(e.currentTarget).parent();
          var $subpages = $parent.find("[role=subpages]");

          if ($subpages.length > 0) {
            if ($subpages.is(":visible")) {
              // if the subpages are already visible, toggle it off
              $allSubpages.slideUp(speed);
              $parent.removeClass("is-active");
            } else {
              // if the subpages aren't visible, toggle it on
              $allSubpages.slideUp(speed);
              $subpages.slideDown(speed);
              $pageLinks.parent().removeClass("is-active");
              $parent.addClass("is-active");
            }
            return false;
          } else {
            $pageLinks.parent().removeClass("is-active");
            $parent.addClass("is-active");
            $allSubpages.slideUp(speed);
            // if there were no subpages, just navigate like normal
            return true;
          }
        });
      }
    },
    bindAccount: {
      value: function bindAccount(logoutCallback) {
        var _this = this;

        var $ = this.$;

        // TODO This block can eventually be generalized with
        // https://github.com/sendgrid/style-guide/blob/master/app/assets/javascripts/style-guide/_dropdown.js
        // Isolating behavior to just tiara elements for now
        $(document).click(function (event) {
          var $target = $(event.target);
          var $dropdowns = _this.$container.find("[data-dropdown-toggle]");

          // if a dropdown is already active, close all dropdown-menus
          if ($dropdowns.hasClass("is-active")) {
            // don't close when clicking a menu item like 'search'
            if ($target.closest("[data-dropdown-no-close]").length == 0) {
              $dropdowns.removeClass("is-active");
            }
          } else {
            // if they're clicking an inactive dropdown in tiara, open it
            if ($target.closest(_this.$container).length > 0) {
              $target.closest("[data-dropdown-toggle]").addClass("is-active");
            }
          }
        });

        this.$container.find("[data-account-toggle-submenu]").click(function () {
          _this.$container.find("[data-account-submenu=\"account\"]").toggleClass("is-active");
          _this.$container.find("[data-account-submenu=\"subusers\"]").toggleClass("is-active");
        });

        this.$container.find("[data-logout]").click(logoutCallback);
      }
    },
    showReputation: {
      value: function showReputation(reputation) {
        this.$container.find("[role=reputation]").text(reputation + "%");
        this.$container.find("[role=reputation-progress-bar]").addClass(this.barClass(reputation)).css("width", reputation + "%");
        this.$container.show();
      }
    },
    showCredits: {
      value: function showCredits(used, total) {
        var creditsPercentage = undefined,
            creditsTitle = undefined,
            creditsClass = undefined;
        if (total > 0) {
          // normal user
          if (used > total) {
            // overage!
            creditsPercentage = 0;
            creditsTitle = "0 / " + this.prettyNumber(total) + " (" + this.prettyNumber(used) + " total used)";
            creditsClass = "overage";
          } else {
            var remaining = total - used;
            creditsPercentage = 100 * remaining / total;
            creditsTitle = "" + this.prettyNumber(remaining) + " / " + this.prettyNumber(total);
          }
        } else {
          // unlimited user
          creditsPercentage = 100; // default to nice full bar
          creditsTitle = "";
        }

        this.$container.find("[role=credits-fraction]").text(creditsTitle).addClass(creditsClass);
        this.$container.find("[role=credits-progress-bar]").addClass(this.barClass(creditsPercentage)).css("width", creditsPercentage + "%");
        this.$container.show();
      }
    },
    showEmailsSentToday: {
      value: function showEmailsSentToday(emailsSentToday) {
        this.$container.find("[role=emails-sent-today]").text(this.prettyNumber(emailsSentToday));
      }
    },
    showAccount: {
      value: function showAccount(name) {
        if (name.trim()) {
          this.$container.find("[data-account-name]").text(name);
        }
      }
    },
    barClass: {

      // private

      value: function barClass(percentage) {
        switch (true) {
          case percentage > 50:
            return "is-above-50";
          case percentage > 25:
            return "is-below-50";
          default:
            return "is-below-25";
        }
      }
    },
    prettyNumber: {
      value: function prettyNumber(num) {
        if (isNaN(num)) {
          return "N/A";
        } else {
          return this.abbrNum(num, 2);
        }
      }
    },
    abbrNum: {

      // from http://stackoverflow.com/a/2686098

      value: function abbrNum(number, decPlaces) {
        decPlaces = Math.pow(10, decPlaces);

        var abbrev = ["k", "m", "b", "t"];

        // Go through the array backwards, so we do the largest first
        for (var i = abbrev.length - 1; i >= 0; i--) {

          // Convert array index to "1000", "1000000", etc
          var size = Math.pow(10, (i + 1) * 3);

          // If the number is bigger or equal do the abbreviation
          if (size <= number) {
            // Here, we multiply by decPlaces, round, and then divide by decPlaces.
            // This gives us nice rounding to a particular decimal place.
            number = Math.round(number * decPlaces / size) / decPlaces;

            // Handle special case where we round up to the next abbreviation
            if (number == 1000 && i < abbrev.length - 1) {
              number = 1;
              i++;
            }

            // Add the letter for the abbreviation
            number += abbrev[i];

            // We are done... stop
            break;
          }
        }

        return number;
      }
    },
    activateNav: {
      value: function activateNav(path, $list) {
        var $matchingA = undefined,
            matchingHref = "";
        $list.find("a").each(function (index, a) {
          var href = a.pathname;

          // path starts with link's href
          if (path.indexOf(href) == 0) {
            // link is more specific
            if (href.length > matchingHref.length) {
              $matchingA = $(a);
              matchingHref = href;
            }
          }
        });

        if ($matchingA) {
          var $mainLink = $matchingA.parents(".page");
          var parentAlreadyExpanded = $mainLink.hasClass("is-active");

          // clear all 'active' subpages
          $list.find(".subpages li").removeClass("is-active");

          $matchingA.parent("li").addClass("is-active");

          // simulate a click if page isn't already expanded
          if (!parentAlreadyExpanded) {
            // simulate opening subpages by clicking main link
            $mainLink.find("a:first").click();
          }
        };
      }
    }
  });

  return Helpers;
})();

},{"./templates":8}],6:[function(require,module,exports){
// sidebar svgs
"use strict";

var dashboardSvg = require("../style-guide/app/assets/images/style-guide/sidebar/sidebar_icons/dashboard.svg");
var marketingSvg = require("../style-guide/app/assets/images/style-guide/sidebar/sidebar_icons/marketing.svg");
var templatesSvg = require("../style-guide/app/assets/images/style-guide/sidebar/sidebar_icons/templates.svg");
var statsSvg = require("../style-guide/app/assets/images/style-guide/sidebar/sidebar_icons/stats.svg");
var activitySvg = require("../style-guide/app/assets/images/style-guide/sidebar/sidebar_icons/activity.svg");
var reportsSvg = require("../style-guide/app/assets/images/style-guide/sidebar/sidebar_icons/reports.svg");
var settingsSvg = require("../style-guide/app/assets/images/style-guide/sidebar/sidebar_icons/settings.svg");

module.exports = {
  getPageData: function getPageData(params) {
    var makoHost = params.makoHost;
    var nlvxHost = params.nlvxHost;
    return [{
      title: "Dashboard",
      img: dashboardSvg,
      href: makoHost,
      mako_route: "/"
    }, {
      title: "Marketing",
      img: marketingSvg,
      subpages: [{
        title: "Marketing Campaigns",
        feature_toggle: ["nlvx", "has_early_access"],
        href: "" + nlvxHost + "/",
        role: "nlvx" }, {
        title: "Tour",
        href: "" + nlvxHost + "/ui/tour",
        is_indented: true }, {
        title: "Overview",
        href: "" + nlvxHost + "/ui/overview",
        is_indented: true }, {
        title: "Campaigns",
        href: "" + nlvxHost + "/campaigns",
        is_indented: true }, {
        title: "Contacts",
        href: "" + nlvxHost + "/contacts",
        is_indented: true }, {
        title: "Custom Fields",
        href: "" + nlvxHost + "/ui/custom_fields",
        is_indented: true }, {
        title: "Templates",
        href: "" + nlvxHost + "/templates",
        is_indented: true }, {
        title: "Senders",
        href: "" + nlvxHost + "/ui/senders",
        is_indented: true }, {
        title: "Notifications",
        href: "" + nlvxHost + "/notifications",
        is_indented: true }, {
        title: "User Guide",
        href: "https://sendgrid.com/docs/User_Guide/Marketing_Campaigns/index.html",
        is_indented: true }, {
        title: "Legacy Newsletter",
        href: "https://sendgrid.com/newsletter/dashboard", // legacy page
        scope: "^newsletter\\.read$",
        role: "nlv3"
      }]
    }, {
      title: "Templates",
      img: templatesSvg,
      subpages: [{
        title: "Transactional",
        href: "https://sendgrid.com/templates"
      }, {
        title: "Marketing",
        href: "" + nlvxHost + "/templates",
        feature_toggle: ["nlvx", "has_early_access"] }]
    }, {
      title: "Stats",
      img: statsSvg,
      subpages: [{
        title: "Overview",
        href: "" + makoHost + "/statistics",
        mako_route: "statistics",
        scope: "^stats\\.read" }, {
        title: "Global Stats",
        href: "" + makoHost + "/statistics/global",
        mako_route: "statistics/global",
        scope: "^stats\\.global\\.read" }, {
        title: "Category Stats",
        href: "" + makoHost + "/statistics/category",
        mako_route: "statistics/category",
        scope: "^categories\\.stats\\.read" }, {
        title: "Category Comparison",
        href: "" + makoHost + "/statistics/category/compare",
        mako_route: "statistics/category/compare",
        scope: "^categories\\.stats\\.read" }, {
        title: "Subuser Stats",
        href: "" + makoHost + "/statistics/subuser",
        mako_route: "statistics/subuser",
        scope: "^subusers\\.stats\\." }, {
        title: "Subuser Comparison",
        href: "" + makoHost + "/statistics/subuser/compare",
        mako_route: "statistics/subuser/compare",
        scope: "^subusers\\.stats\\." }, {
        title: "Geographical",
        href: "" + makoHost + "/statistics/geo",
        mako_route: "statistics/geo",
        scope: "^geo\\.stats\\.read" }, {
        title: "Email Clients & Devices",
        href: "" + makoHost + "/statistics/device",
        mako_route: "statistics/device",
        scope: "^clients\\.stats\\.read|^devices\\.stats\\.read" }, {
        title: "Mailbox Provider Stats",
        href: "" + makoHost + "/statistics/mailbox_provider",
        mako_route: "statistics/mailbox_provider",
        scope: "^mailbox_providers\\.stats\\.read" }, {
        title: "Mailbox Provider Comparison",
        href: "" + makoHost + "/statistics/mailbox_provider/compare",
        mako_route: "statistics/mailbox_provider/compare",
        scope: "^mailbox_providers\\.stats\\.read" }, {
        title: "Browser Stats",
        href: "" + makoHost + "/statistics/browser",
        mako_route: "statistics/browser",
        scope: "^clients\\.stats\\.read" }, {
        title: "Browser Comparison",
        href: "" + makoHost + "/statistics/browser/compare",
        mako_route: "statistics/browser/compare",
        scope: "^clients\\.stats\\.read" }, {
        title: "Parse Webhook",
        href: "" + makoHost + "/statistics/parse_webhook",
        mako_route: "statistics/parse_webhook",
        scope: "^user\\.webhooks\\.parse\\.settings\\.read" }]
    }, {
      title: "Activity",
      img: activitySvg,
      href: "" + makoHost + "/email_activity",
      mako_route: "email_activity",
      scope: "^email_activity\\.read$" }, {
      title: "Suppressions",
      img: reportsSvg,
      scope: "^suppression\\.read$|^asm\\.groups\\.read$",
      subpages: [{
        title: "Global Unsubscribes",
        href: "" + makoHost + "/suppressions/global_unsubscribes",
        mako_route: "suppressions/global_unsubscribes",
        scope: "^suppression\\.read$" }, {
        title: "Group Unsubscribes",
        href: "" + makoHost + "/suppressions/group_unsubscribes",
        mako_route: "suppressions/group_unsubscribes",
        scope: "^suppression\\.read$" }, {
        title: "Bounces",
        href: "" + makoHost + "/suppressions/bounces",
        mako_route: "suppressions/bounces",
        scope: "^suppression\\.read$" }, {
        title: "Spam Reports",
        href: "" + makoHost + "/suppressions/spam_reports",
        mako_route: "suppressions/spam_reports",
        scope: "^suppression\\.read$" }, {
        title: "Blocks",
        href: "" + makoHost + "/suppressions/blocks",
        mako_route: "suppressions/blocks",
        scope: "^suppression\\.read$" }, {
        title: "Invalid",
        href: "" + makoHost + "/suppressions/invalid_emails",
        mako_route: "suppressions/invalid_emails",
        scope: "^suppression\\.read$" }, {
        title: "Unsubscribe Groups",
        href: "" + makoHost + "/suppressions/advanced_suppression_manager",
        mako_route: "suppressions/advanced_suppression_manager",
        scope: "^asm\\.groups\\.read$" }]
    }, {
      title: "Settings",
      img: settingsSvg,
      subpages: [{
        title: "Account Details",
        href: "" + makoHost + "/settings/account",
        mako_route: "settings/account" }, {
        title: "Alert Settings",
        href: "" + makoHost + "/settings/alerts",
        mako_route: "settings/alerts",
        scope: "^alerts\\.read$" }, {
        title: "API Keys",
        href: "" + makoHost + "/settings/api_keys",
        mako_route: "settings/api_keys",
        scope: "^api_keys\\.read" }, {
        title: "Credentials",
        href: "" + makoHost + "/settings/credentials",
        mako_route: "settings/credentials",
        scope: "^credentials\\.",
        role: "credentials" }, {
        title: "Inbound Parse",
        href: "" + makoHost + "/settings/parse",
        mako_route: "settings/parse",
        scope: "^user\\.webhooks\\.parse\\.settings\\.read" }, {
        title: "IP Access Management",
        href: "" + makoHost + "/settings/access",
        mako_route: "settings/access",
        feature_toggle: ["mako", "ip_access_mgmt"] }, {
        title: "Mail Settings",
        href: "" + makoHost + "/settings/mail_settings",
        mako_route: "settings/mail_settings",
        scope: "^mail_settings\\.read$" }, {
        title: "Multifactor Authentication",
        href: "https://sendgrid.com/multifactor/configure", // still lives in old site
        scope: "^user\\.multifactor_authentication\\.",
        role: "legacy_multifactor" }, {
        title: "Partners",
        href: "" + makoHost + "/settings/partners",
        mako_route: "settings/partners",
        scope: "^partner_settings\\.read$" }, {
        title: "Plan & Billing Details",
        href: "" + makoHost + "/settings/billing",
        mako_route: "settings/billing",
        scope: "^billing\\.read$" }, {
        title: "Subuser Management",
        href: "" + makoHost + "/settings/subusers",
        mako_route: "settings/subusers",
        scope: "^subusers\\.read$" }, {
        title: "Teammates",
        href: "" + makoHost + "/settings/teammates",
        mako_route: "settings/teammates",
        scope: "^credentials\\.",
        feature_toggle: ["mako", "teammates"],
        role: "teammates" }, {
        title: "Tracking",
        href: "" + makoHost + "/settings/tracking",
        mako_route: "settings/tracking",
        scope: "^tracking_settings\\.read$" }, {
        title: "Two-Factor Authentication",
        href: "" + makoHost + "/settings/auth",
        mako_route: "settings/auth",
        scope: "^user\\.multifactor_authentication\\.",
        feature_toggle: ["mako", "multifactor_authentication"],
        role: "two_factor_auth" }, {
        title: "Whitelabels",
        href: "" + makoHost + "/settings/whitelabel",
        mako_route: "settings/whitelabel",
        scope: "^whitelabel\\.read$" }, {
        title: "Overview",
        href: "" + makoHost + "/settings/whitelabel",
        mako_route: "settings/whitelabel",
        is_indented: true,
        scope: "^whitelabel\\.read$" }, {
        title: "Domains",
        href: "" + makoHost + "/settings/whitelabel/domains",
        mako_route: "settings/whitelabel/domains",
        is_indented: true,
        scope: "^whitelabel\\.read$" }, {
        title: "Email Links",
        href: "" + makoHost + "/settings/whitelabel/links",
        mako_route: "settings/whitelabel/links",
        is_indented: true,
        scope: "^whitelabel\\.read$" }, {
        title: "IPs",
        href: "" + makoHost + "/settings/whitelabel/ips",
        mako_route: "settings/whitelabel/ips",
        role: "whitelabel_ips",
        scope: "^ips\\.read$",
        is_indented: true,
        hidden: true
      }]
    }];
  }
};

},{"../style-guide/app/assets/images/style-guide/sidebar/sidebar_icons/activity.svg":13,"../style-guide/app/assets/images/style-guide/sidebar/sidebar_icons/dashboard.svg":14,"../style-guide/app/assets/images/style-guide/sidebar/sidebar_icons/marketing.svg":15,"../style-guide/app/assets/images/style-guide/sidebar/sidebar_icons/reports.svg":16,"../style-guide/app/assets/images/style-guide/sidebar/sidebar_icons/settings.svg":17,"../style-guide/app/assets/images/style-guide/sidebar/sidebar_icons/stats.svg":18,"../style-guide/app/assets/images/style-guide/sidebar/sidebar_icons/templates.svg":19}],7:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Templates = require("./templates");

module.exports = (function () {
  function Subusers(params) {
    _classCallCheck(this, Subusers);

    this.$ = params.$;
    this._ = params._;

    this.$container = $(params.container_selector);
    this.$search = this.$container.find("[data-account-search-subusers]");
    this.$subusersContainer = this.$container.find("[data-account-subusers-list]");
    this.$subusersError = this.$container.find("[data-account-subusers-error]");
  }

  _createClass(Subusers, {
    bindSubusers: {
      value: function bindSubusers(params) {
        var $ = this.$;
        var _ = this._;
        var subusers = params.subusers;
        var fetcher = params.fetcher;
        var impersonatingUsername = params.currently_impersonating;
        var impersonateCallback = params.impersonate_callback;
        this.populateSubusers(subusers, impersonatingUsername);

        var self = this;
        var throttledFetch = _.throttle(function () {
          var _this = this;

          fetcher.fetchSubusers({ username: $(this).val().trim() }).done(function (subusers) {
            self.populateSubusers(subusers, impersonatingUsername);
          }).error(function () {
            _this.$subusersContainer.addClass("hidden");
            _this.$subusersError.text("Error: Unable to retrieve subuser list").removeClass("hidden");
          });
        }, 200);

        this.$search.keyup(throttledFetch);
        this.$subusersContainer.on("click", "[role=subuser]", function () {
          var $subuser = $(this);
          impersonateCallback($subuser.data("id"), $subuser.data("username"));
        });
      }
    },
    populateSubusers: {
      value: function populateSubusers(subusers, impersonatingUsername) {
        var $ = this.$;
        var _ = this._;
        subusers = _.reject(subusers, function (subuser) {
          return subuser.username === impersonatingUsername;
        });
        if (subusers.length > 0) {
          this.$subusersContainer.html(Templates.subusersHtml(subusers)).removeClass("hidden");
          this.$subusersError.addClass("hidden");
        } else {
          this.$subusersError.text("No subusers found").removeClass("hidden");
          this.$subusersContainer.addClass("hidden");
        }
      }
    }
  });

  return Subusers;
})();

},{"./templates":8}],8:[function(require,module,exports){
"use strict";

var Pages = require("./pages.js");
var logoSvg = require("../style-guide/app/assets/images/style-guide/logos/sendgrid-logo.svg");
var dropdownCaretSvg = require("../style-guide/app/assets/images/style-guide/misc/dropdown-caret.svg");
var closeSvg = require("../style-guide/app/assets/images/style-guide/misc/close.svg");

module.exports = {
  sidebarHtml: function sidebarHtml(params) {
    var html = "\n    <nav data-tiara-nav=\"true\" data-tiara-generated=\"true\" class=\"navbar\">\n      <div role=\"show-after-fetched\" style=\"display: none\">\n        " + this.account(params.makoHost) + "\n        " + this.pages(params) + "\n        " + this.tooltips(params.nlvxHost) + "\n        " + this.stats() + "\n        " + this.modals() + "\n      </div>\n    </nav>";
    return html;
  },

  subusersHtml: function subusersHtml(subusers) {
    var html = "";
    for (var i in subusers) {
      var subuser = subusers[i];
      html += "<li role=\"subuser\" class=\"dropdown-link\" data-username=\"" + subuser.username + "\", data-id=\"" + subuser.id + "\">\n        " + subuser.username + "\n      </li>";
    }
    return html;
  },

  // private

  account: function account(makoHost) {
    return "<div class=\"account dropdown\" data-dropdown-toggle=\"true\">\n      <div class=\"account-title\">\n        <div class=\"account-logo\">" + logoSvg + "</div>\n        <span class=\"account-name\" data-account-name=\"name\">&nbsp;</span>\n        <div class=\"account-name-fader\"></div>\n        <span class=\"account-expand-icon\">" + dropdownCaretSvg + "</span>\n      </div>\n\n      <div class=\"dropdown-menu dropdown-menu-account\" data-dropdown-menu=\"true\">\n        <ul class=\"account-submenu is-active\" data-account-submenu=\"account\">\n          <li>\n            <a class=\"dropdown-link\" href=\"" + makoHost + "/settings/account\" data-mako-route=\"settings/account\">Account Details</a>\n          </li>\n          <li>\n            <a class=\"dropdown-link\" target=\"_blank\" href=\"https://support.sendgrid.com/hc/en-us\">Help &amp; Support</a>\n          </li>\n          <li data-account-toggle-submenu=\"true\" data-dropdown-no-close=\"true\" style=\"display: none\">\n            <a class=\"dropdown-link\">Switch User</a>\n          </li>\n          <li data-logout=\"logout\">\n            <a class=\"dropdown-link\">Sign Out of Account</a>\n          </li>\n        </ul>\n        <ul class=\"account-submenu\" data-account-submenu=\"subusers\">\n          <li class=\"account-subusers-previous\" data-account-toggle-submenu=\"true\" data-dropdown-no-close=\"true\">\n            <a class=\"dropdown-link\">&lt; Previous</a>\n          </li>\n\n          <li class=\"dropdown-item\">\n            <input class=\"dropdown-input\" data-account-search-subusers=\"true\" data-dropdown-no-close=\"true\" placeholder=\"Search Users\">\n          </li>\n\n          <li class=\"account-subusers-list-container\">\n            <ul data-account-subusers-list=\"true\"></ul>\n          </li>\n\n          <div class=\"dropdown-text error hidden\" data-account-subusers-error=\"true\"></div>\n        </ul>\n      </div>\n    </div>";
  },

  tooltips: function tooltips(nlvxHost) {
    return "\n      <div class=\"spotlight-container\" data-spotlight=\"tiara-marketing-campaigns\">\n        <div class=\"spotlight-circle spotlight-circle-tiara-marketing-campaigns\"></div>\n        <div class=\"spotlight-tooltip spotlight-tooltip-tiara-marketing-campaigns\">\n          <div class=\"spotlight-close\" data-spotlight-close=\"true\">\n            " + closeSvg + "\n          </div>\n          <h2>Introducing</h2>\n          <h1>Marketing Campaigns</h1>\n          <p>The next generation of marketing with SendGrid has arrived. We're bringing you segmentation, a brand new campaign builder, improved testing and tracking, and more.</p>\n          <a class=\"btn btn-primary\" href=\"" + nlvxHost + "/welcome\">Start Exploring</a>\n        </div>\n      </div>\n    ";
  },

  pages: (function (_pages) {
    var _pagesWrapper = function pages(_x) {
      return _pages.apply(this, arguments);
    };

    _pagesWrapper.toString = function () {
      return _pages.toString();
    };

    return _pagesWrapper;
  })(function (params) {
    var html = "<ul class=\"pages\">";
    var pages = Pages.getPageData(params);
    for (var i in pages) {
      html += this.pageHtml(pages[i]);
    }
    return html + "</ul>";
  }),

  pageHtml: function pageHtml(page) {
    var liClass = "";
    var featureToggleAttributes = this.getFeatureToggleAttributes(page);
    var scopeAttributes = this.getScopeAttributes(page);
    var expandIcon = "";
    if (featureToggleAttributes) {
      liClass += " " + this.featureToggleHiddenClass;
    }
    if (scopeAttributes) {
      liClass += " " + this.scopeHiddenClass;
    }
    if (page.subpages) {
      expandIcon = "<span class=\"page-expand-icon\">" + dropdownCaretSvg + "</span>";
    }

    return "<li " + featureToggleAttributes + " " + scopeAttributes + " role=\"page\" class=\"page " + liClass + "\">\n      " + this.aTagStartHtml(page) + "\n        <div class=\"page-icon\">\n          " + page.img + "\n        </div>\n        <span class=\"page-title\">" + page.title + "</span>\n        " + expandIcon + "\n      </a>\n      " + this.subpagesHtml(page.subpages) + "\n    </li>";
  },

  subpagesHtml: function subpagesHtml(subpages) {
    if (!subpages) {
      return "";
    }

    var html = "<ul role=\"subpages\" class=\"subpages\">";
    for (var i in subpages) {
      html += this.subpageHtml(subpages[i]);
    }
    return html + "</ul>";
  },

  subpageHtml: function subpageHtml(subpage) {
    var html = undefined;
    var featureToggleAttributes = this.getFeatureToggleAttributes(subpage);
    var scopeAttributes = this.getScopeAttributes(subpage);
    var classes = "subpage";
    if (featureToggleAttributes) {
      classes += " " + this.featureToggleHiddenClass;
    }
    if (scopeAttributes) {
      classes += " " + this.scopeHiddenClass;
    }
    var spanClasses = "subpage-title";
    if (subpage.is_indented) {
      spanClasses += " is-indented";
    }

    html = "<li " + featureToggleAttributes + " " + scopeAttributes + " class=\"" + classes + "\">\n      " + this.aTagStartHtml(subpage, true) + "\n        <span class=\"" + spanClasses + "\">\n          " + subpage.title + "\n        </span>\n      </a>";
    return html + "</li>";
  },

  getFeatureToggleAttributes: function getFeatureToggleAttributes(page) {
    if (page.feature_toggle) {
      return "data-ft-app=\"" + page.feature_toggle[0] + "\" data-ft-feature=\"" + page.feature_toggle[1] + "\"";
    }
    return "";
  },

  getScopeAttributes: function getScopeAttributes(page) {
    if (page.scope) {
      return "data-scope=\"" + page.scope + "\" ";
    }
    return "";
  },

  featureToggleHiddenClass: "feature-toggle-hidden",
  scopeHiddenClass: "scope-hidden",

  aTagStartHtml: function aTagStartHtml(page, isSubpage) {
    var klass = isSubpage ? "subpage-link" : "page-link";
    var html = "<a class=\"" + klass + "\"";
    if (page.href !== undefined) {
      html += " href=\"" + page.href + "\"";
    }
    if (page.role) {
      html += " role=\"" + page.role + "\"";
    }
    if (page.hidden) {
      html += " style=\"display: none\"";
    }
    if (page.mako_route) {
      html += " data-mako-route=\"" + page.mako_route + "\"";
    }
    return html + ">";
  },

  stats: function stats() {
    return "<div class=\"navbar-stats\">\n      <div class=\"meter-container\">\n        <span class=\"meter-title\">Reputation</span>\n        <span class=\"meter-value\" role=\"reputation\"></span>\n        <div class=\"meter-bar\">\n          <div class=\"meter-bar-fill\" role=\"reputation-progress-bar\"></div>\n        </div>\n      </div>\n\n      <div class=\"meter-container\">\n        <span class=\"meter-title\">Emails Remaining</span>\n        <span class=\"meter-value\" role=\"credits-fraction\"></span>\n        <div class=\"meter-bar\">\n          <div class=\"meter-bar-fill\" role=\"credits-progress-bar\"></div>\n        </div>\n      </div>\n\n      <div class=\"meter-container\">\n        <div class=\"meter-title\">Emails sent today</div>\n        <div class=\"emails-sent-today\" role=\"emails-sent-today\"></div>\n      </div>\n    </div>";
  },

  credits: function credits() {
    var creditsClass = undefined,
        creditsTitle = undefined,
        creditsLabel = undefined,
        creditsPercentage = undefined;
    this.creditsUsed = this.creditsTotal - this.creditsUsed;

    if (this.creditsTotal > 0) {
      // normal user
      creditsPercentage = 100 * this.creditsUsed / this.creditsTotal;
      creditsTitle = "Credits Used " + this.creditsUsed + " / " + this.creditsTotal;
      creditsLabel = "" + creditsPercentage + "%";
    } else {
      // unlimited user
      creditsPercentage = 100; // default to nice full blue bar
      creditsTitle = "Credits";
      creditsLabel = "Unlimited";
    }
    creditsClass = this.barClass(creditsPercentage);

    return "<div role=\"credits\">\n      <div>\n        <span class=\"title\">\n          Emails Remaining\n          <span class=\"value credits\">\n            " + this.prettyNumber(this.creditsUsed) + " / " + this.prettyNumber(this.creditsTotal) + "\n          </span>\n        </span></span>\n        <div class=\"meter\">\n          <div role=\"progress-bar\" class=\"" + creditsClass + "\" style=\"width: " + creditsPercentage + "%;\">\n          </div>\n        </div>\n      </div>\n    </div>";
  },

  impersonationBanner: function impersonationBanner(impersonatingUsername) {
    return "<div class=\"impersonation-banner\">\n      <div role=\"back-to-parent-account\" class=\"impersonation-banner-back\">\n        &larr; Back to Parent Account\n      </div>\n\n      <div class=\"impersonation-banner-title\">You're currently logged in as <span class=\"impersonation-banner-username\" role=\"subuser-username\">" + impersonatingUsername + "</span></div>\n\n      <div class=\"impersonation-banner-switch-container\" data-impersonation-banner-switch-subuser-container=\"true\">\n        <div class=\"impersonation-banner-switch dropdown\" data-dropdown-toggle=\"true\">\n          <span class=\"impersonation-banner-switch-title\">Switch Subuser</span>\n\n          <div class=\"dropdown-menu dropdown-menu-right-aligned dropdown-menu-spaced dropdown-menu-account\" data-dropdown-menu=\"true\">\n            <div class=\"dropdown-item\">\n              <input class=\"dropdown-input\" data-account-search-subusers=\"true\" data-dropdown-no-close=\"true\" placeholder=\"Search Users\">\n            </div>\n            <ul data-account-subusers-list=\"true\"></ul>\n            <div class=\"dropdown-text error hidden\" data-account-subusers-error=\"true\"></div>\n            </ul>\n          </div>\n        </div>\n      </div>\n    </div>";
  },

  modals: function modals() {
    return "<div class=\"hidden conf-alert conf-alert-old-sg-warning\" data-conf-alert-old-sg-warning=\"true\">\n      <h2 class=\"conf-alert-header\">\n        Please note that you will be taken to the old SendGrid interface where you will be logged in as the parent user. You will need to reselect the subuser on the next page.\n      </h2>\n      <div class=\"conf-alert-actions\">\n        <a class=\"btn btn-small btn-secondary\" data-old-sg-warning-cancel-btn=\"true\">Cancel</a>\n        <a class=\"btn btn-small btn-primary\" data-old-sg-warning-ok-btn=\"true\">OK</a>\n      </div>\n    </div>\n    ";
  },

  barClass: function barClass(percentage) {
    switch (true) {
      case percentage > 50:
        return "is-above-50";
      case percentage > 25:
        return "is-below-50";
      default:
        return "is-below-25";
    }
  },

  prettyNumber: function prettyNumber(num) {
    if (isNaN(num)) {
      return "N/A";
    } else {
      return this.abbrNum(num, 2);
    }
  },

  // from http://stackoverflow.com/a/2686098
  abbrNum: function abbrNum(number, decPlaces) {
    decPlaces = Math.pow(10, decPlaces);

    var abbrev = ["k", "m", "b", "t"];

    // Go through the array backwards, so we do the largest first
    for (var i = abbrev.length - 1; i >= 0; i--) {

      // Convert array index to "1000", "1000000", etc
      var size = Math.pow(10, (i + 1) * 3);

      // If the number is bigger or equal do the abbreviation
      if (size <= number) {
        // Here, we multiply by decPlaces, round, and then divide by decPlaces.
        // This gives us nice rounding to a particular decimal place.
        number = Math.round(number * decPlaces / size) / decPlaces;

        // Handle special case where we round up to the next abbreviation
        if (number == 1000 && i < abbrev.length - 1) {
          number = 1;
          i++;
        }

        // Add the letter for the abbreviation
        number += abbrev[i];

        // We are done... stop
        break;
      }
    }

    return number;
  }
};

},{"../style-guide/app/assets/images/style-guide/logos/sendgrid-logo.svg":10,"../style-guide/app/assets/images/style-guide/misc/close.svg":11,"../style-guide/app/assets/images/style-guide/misc/dropdown-caret.svg":12,"./pages.js":6}],9:[function(require,module,exports){
"use strict";

var Helpers = require("./helpers");
var Templates = require("./templates");
var Fetcher = require("./fetcher");
var Subusers = require("./subusers");
var Pages = require("./pages");
var DeferredHandlers = require("./deferred_handlers");

var _ = undefined,
    $ = undefined;
var RESELLER_BANNER_COOKIE = "mako-reseller-header";
var READ_TOOLTIPS_COOKIE = "read-tooltips";
var IMPERSONATING_USERNAME_COOKIE = "sendgrid-impersonating-username";
var ADMIN_IMPERSONATION_COOKIE = "sendgrid-admin-impersonation";

// See https://segment.com/docs/libraries/analytics.js/#selecting-integrations
var VISUAL_SEGMENT_INTEGRATIONS = {
  All: true
};

var NON_VISUAL_SEGMENT_INTEGRATIONS = {
  All: true,
  Intercom: false,
  WebEngage: false
};

module.exports = {
  run: function run(config) {
    window.SendGridTiara = {
      init: function init(params) {
        var _this = this;

        $ = params.jQuery;
        _ = params.underscore;
        this.auth_token = params.auth_token || $.cookie("mako_auth_token");
        this.target = params.target || "[role=tiara-target]";
        this.render = params.render || function () {};
        this.api_host = params.api_host || "https://api.sendgrid.com/v3/";
        this.logoutCallback = params.logoutCallback || this.defaultLogout;
        this.readTooltips = params.read_tooltips || this._getReadTooltips();
        this.resellerHeader = params.reseller_header || this._getResellerHeader($);
        this.nlvxHost = params.nlvxHost === undefined ? "https://sendgrid.com/marketing_campaigns" : params.nlvxHost;
        this.makoHost = params.makoHost === undefined ? "https://app.sendgrid.com" : params.makoHost;
        this.revealAllLinks = params.revealAllLinks;
        this.shouldLogoutOnAuthFail = params.shouldLogoutOnAuthFail;
        this.shouldHideSidebar = params.shouldHideSidebar;
        this.segmentIntegrations = params.shouldHideSegmentIntegrations ? NON_VISUAL_SEGMENT_INTEGRATIONS : VISUAL_SEGMENT_INTEGRATIONS;
        this.shouldMakeRequests = params.shouldMakeRequests === undefined ? true : params.shouldMakeRequests;

        // expose default segment integration options just in case the client
        // needs them to do more advanced tracking
        this.VISUAL_SEGMENT_INTEGRATIONS = VISUAL_SEGMENT_INTEGRATIONS;
        this.NON_VISUAL_SEGMENT_INTEGRATIONS = NON_VISUAL_SEGMENT_INTEGRATIONS;

        // subuser impersonation params
        this.disableImpersonation = params.disable_impersonation;
        if (!this.disableImpersonation) {
          this.impersonating = params.impersonating || $.cookie(IMPERSONATING_USERNAME_COOKIE);
          this.impersonateCallback = params.impersonate_callback || this._defaultImpersonateCallback;
          this.backToParentCallback = params.back_to_parent_callback || this._defaultBackToParentCallback;
        }

        // Log out if auth token is missing
        if (!this.auth_token && this.shouldLogoutOnAuthFail) this.logoutCallback();

        if (this.shouldHideSidebar) {
          // skip all dom manipulation, just set up deferreds and analytics
          this.helpers = new Helpers($, _, $(""));
          this.render();
          this.hasInitialized = true;

          var _defs = this._createDeferreds();
          var _deferredHandlers = new DeferredHandlers(_defs, this.helpers);
          if (config.api_key) {
            _deferredHandlers.loadAnalytics(config.api_key, this.segmentIntegrations);
          } else {
            console.error("No analytics API key found!");
          }
          return _defs;
        }

        // find target
        var $target = $(this.target);
        if ($target.length == 0) {
          console.error("Could not find element matching " + targetSelector);
          return;
        }

        this._wrapTarget($target);

        this.helpers = new Helpers($, _, $("[data-tiara-generated]"));
        this.helpers.bindNav();
        this.helpers.bindAccount(this.logoutCallback);
        this.helpers.bindTooltips();
        this.render();
        this.hasInitialized = true;

        // set up impersonation and subuser helpers
        if (this.impersonating) {
          (function () {
            _this.subusersHelper = new Subusers({ $: $, _: _,
              container_selector: "[data-impersonation-banner-switch-subuser-container]"
            });

            // show warning modal if navigating to nlv3 while impersonating
            var $modal = $("[data-conf-alert-old-sg-warning]");
            $("[role=nlv3]").click(function (e) {
              $modal.removeClass("hidden");
              return false;
            });
            $("[data-old-sg-warning-cancel-btn]").click(function () {
              $modal.addClass("hidden");
            });
            $("[data-old-sg-warning-ok-btn]").prop("href", "https://sendgrid.com/subuser");
          })();
        } else {
          this.subusersHelper = new Subusers({ $: $, _: _,
            container_selector: "[data-account-submenu=subusers]"
          });
        }

        var defs = this._createDeferreds();

        // now that we've set up our fetchers and deferred user data, bind to them
        var deferredHandlers = new DeferredHandlers(defs, this.helpers, this.revealAllLinks);
        deferredHandlers.revealPagesViaFeatureToggles(this.impersonating);
        deferredHandlers.revealPagesViaScopes();
        deferredHandlers.revealPagesViaFeatureTogglesAndScopes();
        deferredHandlers.revealPagesViaAccount();
        deferredHandlers.renderPages().always(function () {
          return _this.updateNav();
        });
        deferredHandlers.showReputationBar();
        deferredHandlers.showCreditsBar();
        deferredHandlers.showEmailsSentToday();
        deferredHandlers.showAccountName();
        deferredHandlers.hideNewsletterParentLink();
        if (config.api_key) {
          deferredHandlers.loadAnalytics(config.api_key, this.segmentIntegrations);
        } else {
          console.error("No analytics API key found!");
        }

        if (!this.disableImpersonation) {
          deferredHandlers.showSubusers(this.subusersHelper, this.fetcher, this.parentFetcher, this.impersonating, this.impersonateCallback);
        }

        // return deferred userdata
        return defs;
      },

      updateNav: function updateNav() {
        if (this.hasInitialized) {
          if (window.analytics) {
            this.analyticsPage();
          }

          this.helpers.activateNav(document.location.pathname.toLowerCase(), $("[data-tiara-nav] .pages"));
        }
      },

      updateName: function updateName(name) {
        if (this.hasInitialized) {
          this.helpers.showAccount(name);
        }
      },

      refreshHiddenLinks: function refreshHiddenLinks() {
        var _this = this;

        if (this.hasInitialized) {
          this.fetcher.fetchFeatureToggles().done(function (data) {
            _this.helpers.revealLinksViaFeatureToggles(data);
          });
          this.fetcher.fetchScopes().done(function (data) {
            _this.helpers.revealLinksViaScopes(data.scopes);
          });
        }
      },

      updateSubusers: function updateSubusers() {
        var _this = this;

        if (this.hasInitialized) {
          if (this.impersonating) {
            this.parentFetcher.fetchSubusers().done(function (subusers) {
              if (subusers.length > 1) {
                // can't re-impersonate as same subuser
                $("[role=switch-menu]").css("opacity", 1);
              } else {
                $("[role=switch-menu]").css("opacity", 0);
              }
              _this.subusersHelper.populateSubusers(subusers, _this.impersonating);
            });
          } else {
            this.fetcher.fetchSubusers().done(function (subusers) {
              if (subusers.length === 0) {
                $("[role=switch-subuser]").hide();
              }
              _this.subusersHelper.populateSubusers(subusers);
            });
          }
        }
      },

      defaultLogout: function defaultLogout() {
        // Remove reseller banner cookie first
        // Since this can get called before SendGridTiara.init, remove cookie without jQuery
        // TODO This should be done in site logout
        document.cookie = RESELLER_BANNER_COOKIE + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = ADMIN_IMPERSONATION_COOKIE + "=; domain=.sendgrid.com; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.href = "https://sendgrid.com/logout";
      },

      getImpersonatingUsername: function getImpersonatingUsername() {
        return $.cookie(IMPERSONATING_USERNAME_COOKIE);
      },

      analytics: function analytics() {
        return window.analytics;
      },

      analyticsTrack: function analyticsTrack(eventName) {
        if (window.analytics) {
          window.analytics.track(eventName, undefined, {
            integrations: this.segmentIntegrations
          });
        }
      },

      analyticsPage: function analyticsPage() {
        if (window.analytics) {
          window.analytics.page(undefined, undefined, undefined, {
            integrations: this.segmentIntegrations
          });
        }
      },

      // private

      _defaultImpersonateCallback: function _defaultImpersonateCallback(subuserId, subuserUsername) {
        $.cookie(IMPERSONATING_USERNAME_COOKIE, subuserUsername);
        window.location.reload();
      },

      _defaultBackToParentCallback: function _defaultBackToParentCallback() {
        $.removeCookie(IMPERSONATING_USERNAME_COOKIE);
        window.location.reload();
      },

      _wrapTarget: function _wrapTarget($target) {
        var _this = this;

        var $tiaraContentContainer = $("<div class=\"tiara-content-container\"></div>");
        $target.wrap($tiaraContentContainer);
        $(".tiara-content-container").wrap("<div class=\"tiara-container\"></div>");
        $(".tiara-container").prepend(Templates.sidebarHtml({
          nlvxHost: this.nlvxHost,
          makoHost: this.makoHost
        }));
        $(".tiara-container").prepend("<header class=\"tiara-headers\" data-tiara-generated=\"true\"></header>");
        if (this.disableImpersonation) {
          $("[role=switch-subuser]").hide();
        }
        if (this.impersonating) {
          $(".tiara-headers").prepend(Templates.impersonationBanner(this.impersonating));
          $("[role=back-to-parent-account]").click(this.backToParentCallback);
        }
        if (this.resellerHeader) {
          if (this.resellerHeader.reseller_boomerang_header) {
            (function () {
              var self = _this;
              $.getScript(_this.resellerHeader.reseller_boomerang_header, function () {
                Boomerang.init({
                  app: self.resellerHeader.reseller_heroku_app,
                  addon: "SendGrid"
                });
              });
            })();
          }
        }
      },

      _getReadTooltips: function _getReadTooltips() {
        try {
          return JSON.parse($.cookie(READ_TOOLTIPS_COOKIE));
        } catch (err) {
          return null;
        }
      },

      _hasReadTooltip: function _hasReadTooltip(tooltip) {
        if (this.readTooltips) {
          return this.readTooltips[tooltip] || false;
        } else {
          return false;
        }
      },

      _setReadTooltip: function _setReadTooltip(tooltip) {
        if (!this.readTooltips) {
          this.readTooltips = {};
        }
        this.readTooltips[tooltip] = true;
        $.cookie(READ_TOOLTIPS_COOKIE, JSON.stringify(this.readTooltips), { expires: 365500 });
      },

      _createDeferreds: function _createDeferreds() {
        var defs = {};

        // Use a no-op if we don't want to log them out when auth token is expired
        var logoutCallback = this.shouldLogoutOnAuthFail ? this.logoutCallback : function () {};

        if (this.auth_token && this.shouldMakeRequests) {
          if (this.impersonating) {
            this.fetcher = new Fetcher($, this.auth_token, {
              api_host: this.api_host,
              impersonating: this.impersonating,
              logoutCallback: logoutCallback
            });
            this.parentFetcher = new Fetcher($, this.auth_token, { api_host: this.api_host });

            defs.account = this.fetcher.fetchAccount();
            defs.credits = this.fetcher.fetchCredits();
            defs.email_stats = this.fetcher.fetchEmailStats();
            defs.profile = this.fetcher.fetchProfile();
            defs.feature_toggles = this.fetcher.fetchFeatureToggles();
            defs.scopes = this.fetcher.fetchScopes();
            defs.username = this.fetcher.fetchUsername();
            defs.email = this.fetcher.fetchEmail();
            defs.pkg = this.fetcher.fetchPackage();
            defs.subusers = $.Deferred().resolve([]); // subusers never have subusers
            defs.parent_subusers = this.parentFetcher.fetchSubusers();
          } else {
            this.fetcher = new Fetcher($, this.auth_token, {
              api_host: this.api_host,
              logoutCallback: logoutCallback
            });

            defs.account = this.fetcher.fetchAccount();
            defs.credits = this.fetcher.fetchCredits();
            defs.email_stats = this.fetcher.fetchEmailStats();
            defs.profile = this.fetcher.fetchProfile();
            defs.feature_toggles = this.fetcher.fetchFeatureToggles();
            defs.scopes = this.fetcher.fetchScopes();
            defs.username = this.fetcher.fetchUsername();
            defs.email = this.fetcher.fetchEmail();
            defs.pkg = this.fetcher.fetchPackage();
            defs.subusers = this.fetcher.fetchSubusers();
            defs.parent_subusers = $.Deferred().reject();
          }
        } else {
          defs.account = $.Deferred().reject();
          defs.credits = $.Deferred().reject();
          defs.email_stats = $.Deferred().reject();
          defs.profile = $.Deferred().reject();
          defs.feature_toggles = $.Deferred().reject();
          defs.scopes = $.Deferred().reject();
          defs.username = $.Deferred().reject();
          defs.email = $.Deferred().reject();
          defs.pkg = $.Deferred().reject();
          defs.subusers = $.Deferred().reject();
          defs.parent_subusers = $.Deferred().reject();
        }

        return defs;
      },

      _getAllRoutes: function _getAllRoutes(makoHost, nlvxHost) {
        var routes = [];
        var pageData = Pages.getPageData({ makoHost: this.makoHost, nlvxHost: this.nlvxHost });
        for (var i in pageData) {
          routes.push(this._getSubpages(pageData[i]));
        }
        routes = _.flatten(routes);
        routes = _.sortBy(routes, "length");
        return routes;
      },

      _getSubpages: function _getSubpages(page) {
        var hrefs = page.href ? [page.href] : [];
        if (page.subpages) {
          for (var i in page.subpages) {
            hrefs.push(this._getSubpages(page.subpages[i]));
          }
        }
        return hrefs;
      },

      _getResellerHeader: function _getResellerHeader() {
        try {
          return JSON.parse(atob($.cookie(RESELLER_BANNER_COOKIE)));
        } catch (err) {
          return null;
        }
      }
    };
  }
};

},{"./deferred_handlers":3,"./fetcher":4,"./helpers":5,"./pages":6,"./subusers":7,"./templates":8}],10:[function(require,module,exports){
module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg width=\"25px\" height=\"20px\" viewBox=\"0 0 25 20\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n    <!-- Generator: Sketch 3.3.2 (12043) - http://www.bohemiancoding.com/sketch -->\n    <title>SG MARK</title>\n    <desc>Created with Sketch.</desc>\n    <defs></defs>\n    <g id=\"-Dashboard\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Dashboard\" sketch:type=\"MSArtboardGroup\" transform=\"translate(-27.000000, -35.000000)\" fill=\"#1A82E2\">\n            <g id=\"Sidebar-Nav\" sketch:type=\"MSLayerGroup\">\n                <g id=\"Sidebar-BG-+-LOGO-2-+-SendGrid-2\" sketch:type=\"MSShapeGroup\">\n                    <g id=\"SG-MARK\" transform=\"translate(27.000000, 35.000000)\">\n                        <path d=\"M24.7533784,12.3452703 C24.6202703,11.7202703 24.2655405,11.2966216 23.7358108,11.0668919 C23.3641892,10.9047297 22.9074324,10.8385135 22.3824324,10.8635135 C19.5736486,11.0452703 15.6094595,14.622973 15.0006757,15.1864865 C22.6932432,17.1844595 24.8972973,14.4486486 24.8094595,12.7655405 C24.8013514,12.6162162 24.7817568,12.477027 24.7533784,12.3452703\" id=\"Fill-1\"></path>\n                        <path d=\"M24.6864865,10.9378378 C24.1533784,7.42635135 22.6635135,2.93581081 22.6635135,2.93581081 C22.1655405,1.46824324 21.3587838,0.339864865 18.8986486,0.339864865 C16.4391892,0.339864865 13.9391892,2.28581081 10.6621622,5.18513514 C10.6621622,5.18513514 6.11351351,9.53513514 2.88851351,9.70337838 C1.81418919,9.75945946 1.00878378,9.45067568 0.606756757,8.7527027 C1.62297297,13.6891892 2.62972973,16.7547297 2.62972973,16.7547297 C3.1277027,18.2216216 3.93513514,19.3506757 6.39459459,19.3506757 C8.85472973,19.3506757 11.3540541,17.4047297 14.6310811,14.5054054 C14.6310811,14.5054054 19.1797297,10.1554054 22.4047297,9.98648649 C23.4797297,9.93040541 24.2844595,10.2398649 24.6864865,10.9378378 L24.6864865,10.9378378 Z M5.51216216,14.3101351 L8.17364865,7.89459459 L10.7405405,16.9736486 L5.51216216,14.3101351 L5.51216216,14.3101351 Z M12.7101351,9.56891892 L14.6790541,2.58648649 L17.1310811,11.7554054 L12.7101351,9.56891892 L12.7101351,9.56891892 Z M21.3905405,1.70405405 C21.3905405,1.70405405 22.7939189,5.45 23.5824324,9.53378378 L19.6398649,5.775 L21.3905405,1.70405405 L21.3905405,1.70405405 Z\" id=\"Fill-2\"></path>\n                        <path d=\"M1.56351351,8.62364865 C1.93513514,8.78513514 2.39189189,8.85202703 2.91689189,8.82702703 C5.72567568,8.64527027 9.68986486,5.06756757 10.2986486,4.50337838 C2.60675676,2.50608108 0.402027027,5.24189189 0.489864865,6.925 C0.497972973,7.07432432 0.518243243,7.21351351 0.545945946,7.34527027 C0.67972973,7.96959459 1.03445946,8.39391892 1.56351351,8.62364865\" id=\"Fill-3\"></path>\n                    </g>\n                </g>\n            </g>\n        </g>\n    </g>\n</svg>";

},{}],11:[function(require,module,exports){
module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg width=\"17px\" height=\"17px\" viewBox=\"0 0 17 17\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n    <!-- Generator: Sketch 3.3.3 (12072) - http://www.bohemiancoding.com/sketch -->\n    <title>Close-hover</title>\n    <desc>Created with Sketch.</desc>\n    <defs></defs>\n    <g id=\"v3---final-version---dev-documentation\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Banner-Tool-Tip-1e-Copy-3\" sketch:type=\"MSArtboardGroup\" transform=\"translate(-212.000000, -20.000000)\">\n            <g id=\"Banner-Copy\" sketch:type=\"MSLayerGroup\" transform=\"translate(-125.000000, 8.000000)\">\n                <g id=\"Close-hover\" transform=\"translate(337.000000, 12.000000)\" sketch:type=\"MSShapeGroup\">\n                    <path d=\"M8.5,16 C12.6421356,16 16,12.6421356 16,8.5 C16,4.35786438 12.6421356,1 8.5,1 C4.35786438,1 1,4.35786438 1,8.5 C1,12.6421356 4.35786438,16 8.5,16 L8.5,16 Z M8.5,17 L8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 L8.5,17 Z\" id=\"Shape\" fill=\"#284661\"></path>\n                    <g id=\"Line-+-Line-Copy\" transform=\"translate(8.467514, 8.467514) rotate(-45.000000) translate(-8.467514, -8.467514) translate(3.967514, 3.467514)\" stroke=\"#284661\" stroke-linecap=\"square\">\n                        <path d=\"M4.26619796,0.658049232 L4.26619796,9.19044515\" id=\"Line\"></path>\n                        <path d=\"M1.26121336e-13,5.1598628 L8.53239592,5.1598628\" id=\"Line-Copy\"></path>\n                    </g>\n                </g>\n            </g>\n        </g>\n    </g>\n</svg>";

},{}],12:[function(require,module,exports){
module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg width=\"7px\" height=\"4px\" viewBox=\"0 0 7 4\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n    <!-- Generator: Sketch 3.3.3 (12081) - http://www.bohemiancoding.com/sketch -->\n    <title>Slice 1</title>\n    <desc>Created with Sketch.</desc>\n    <defs>\n        <path id=\"path-1\" d=\"M6.32019312,0.276671093 L6.11975133,0.0909368766 C5.99336992,-0.0303122922 5.78743879,-0.0303122922 5.66105739,0.0909368766 L3.21775407,2.5932359 L0.713263572,0.0909368831 C0.585599104,-0.0303122858 0.379667975,-0.0303122858 0.253286567,0.0909368831 L0.0947860566,0.259349783 C-0.0315953522,0.379957422 -0.0315953522,0.5762656 0.0947860566,0.698156299 L2.98680327,3.48881177 C3.11446774,3.60941941 3.32039887,3.60941941 3.44678027,3.48881177 L6.32019312,0.715477609 C6.44785759,0.59422844 6.44785759,0.397278732 6.32019312,0.276671093 Z\"></path>\n    </defs>\n    <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Caret\" opacity=\"0.595876873\">\n            <use fill=\"#284661\" fill-rule=\"evenodd\" sketch:type=\"MSShapeGroup\" xlink:href=\"#path-1\"></use>\n            <use fill=\"none\" xlink:href=\"#path-1\"></use>\n        </g>\n    </g>\n</svg>";

},{}],13:[function(require,module,exports){
module.exports = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<svg version=\"1.1\" id=\"Layer_1\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\"\r\n\t xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"-290 382 30 30\"\r\n\t style=\"enable-background:new -290 382 30 30;\" xml:space=\"preserve\">\r\n<g>\r\n\t<path style=\"fill:#FF9900\" d=\"M-264.8,405.2l-2.7-2.7c0.5-0.6,0.8-1.4,0.8-2.3c0-2.1-1.7-3.8-3.8-3.8c-2.1,0-3.8,1.7-3.8,3.8\r\n\t\ts1.7,3.8,3.8,3.8c0.9,0,1.6-0.3,2.3-0.8l2.7,2.7L-264.8,405.2z M-270.5,403c-1.5,0-2.8-1.2-2.8-2.8c0-1.5,1.2-2.8,2.8-2.8\r\n\t\tc1.5,0,2.8,1.2,2.8,2.8C-267.6,401.8-268.9,403-270.5,403z\"/>\r\n\t<path style=\"fill:#284661\" d=\"M-266.2,389.5v6.5h1v-6.5c0-0.7-0.8-1.5-1.5-1.5h-17c-0.7,0-1.5,0.8-1.5,1.5v11c0,0.7,0.8,1.5,1.5,1.5h7.5v-1\r\n\t\th-7.5c-0.1,0-0.5-0.4-0.5-0.5v-11l0,0l8.8,5.1c0.1,0,0.2,0.1,0.3,0.1c0.1,0,0.2,0,0.3-0.1L-266.2,389.5L-266.2,389.5z\r\n\t\t M-275.1,393.8l-8-4.6h15.7L-275.1,393.8z\"/>\r\n</g>\r\n</svg>\r\n";

},{}],14:[function(require,module,exports){
module.exports = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<svg version=\"1.1\" id=\"Layer_1\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\"\r\n\t xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"-290 382 30 30\"\r\n\t style=\"enable-background:new -290 382 30 30;\" xml:space=\"preserve\">\r\n<g id=\"Page-1\" sketch:type=\"MSPage\">\r\n\t<g id=\"Icon\" transform=\"translate(1.000000, 1.000000)\" sketch:type=\"MSLayerGroup\">\r\n\t\t<circle id=\"Oval\" sketch:type=\"MSShapeGroup\" style=\"fill:#1A82E2\" cx=\"-276\" cy=\"399\" r=\"1\"> </circle>\r\n\t\t<path style=\"fill:#284661;\" d=\"M-265.5,403.5h-21v-4.8c0-5.6,4.9-10.2,11-10.2c5.3,0,10,4.8,10,10.2V403.5z M-285.5,402.5h19v-3.8\r\n\t\t\tc0-4.9-4.2-9.2-9-9.2c-5.5,0-10,4.1-10,9.2V402.5z\"/>\r\n\t\t<path id=\"Rectangle\" sketch:type=\"MSShapeGroup\" style=\"fill:#FDD835\" d=\"M-283,399L-283,399c0.6,0,1,0.2,1,0.5l0,0c0,0.3-0.4,0.5-1,0.5\r\n\t\t\tl0,0c-0.6,0-1-0.2-1-0.5l0,0C-284,399.2-283.6,399-283,399z\"/>\r\n\t\t<path id=\"Rectangle_1_\" sketch:type=\"MSShapeGroup\" style=\"fill:#FDD835\" d=\"M-282.5,396L-282.5,396c0.3,0,0.5,0.2,0.5,0.5l0,0\r\n\t\t\tc0,0.3-0.2,0.5-0.5,0.5l0,0c-0.3,0-0.5-0.2-0.5-0.5l0,0C-283,396.2-282.8,396-282.5,396z\"/>\r\n\t\t<path id=\"Rectangle_2_\" sketch:type=\"MSShapeGroup\" style=\"fill:#FDD835\" d=\"M-280.5,394L-280.5,394c0.3,0,0.5,0.2,0.5,0.5l0,0\r\n\t\t\tc0,0.3-0.2,0.5-0.5,0.5l0,0c-0.3,0-0.5-0.2-0.5-0.5l0,0C-281,394.2-280.8,394-280.5,394z\"/>\r\n\t\t<path id=\"Rectangle_3_\" sketch:type=\"MSShapeGroup\" style=\"fill:#FDD835\" d=\"M-278.5,392L-278.5,392c0.3,0,0.5,0.2,0.5,0.5l0,0\r\n\t\t\tc0,0.3-0.2,0.5-0.5,0.5l0,0c-0.3,0-0.5-0.2-0.5-0.5l0,0C-279,392.2-278.8,392-278.5,392z\"/>\r\n\t\t<path id=\"Rectangle_4_\" sketch:type=\"MSShapeGroup\" style=\"fill:#FDD835\" d=\"M-273.5,392L-273.5,392c0.3,0,0.5,0.2,0.5,0.5l0,0\r\n\t\t\tc0,0.3-0.2,0.5-0.5,0.5l0,0c-0.3,0-0.5-0.2-0.5-0.5l0,0C-274,392.2-273.8,392-273.5,392z\"/>\r\n\t\t<path id=\"Rectangle_6_\" sketch:type=\"MSShapeGroup\" style=\"fill:#FDD835\" d=\"M-269.5,396L-269.5,396c0.3,0,0.5,0.2,0.5,0.5l0,0\r\n\t\t\tc0,0.3-0.2,0.5-0.5,0.5l0,0c-0.3,0-0.5-0.2-0.5-0.5l0,0C-270,396.2-269.8,396-269.5,396z\"/>\r\n\t\t<path id=\"Rectangle_7_\" sketch:type=\"MSShapeGroup\" style=\"fill:#FDD835\" d=\"M-269,399L-269,399c0.6,0,1,0.2,1,0.5l0,0c0,0.3-0.4,0.5-1,0.5\r\n\t\t\tl0,0c-0.6,0-1-0.2-1-0.5l0,0C-270,399.2-269.6,399-269,399z\"/>\r\n\t\t<path id=\"Rectangle_8_\" sketch:type=\"MSShapeGroup\" style=\"fill:#FDD835\" d=\"M-276,391L-276,391c0.6,0,1,0.4,1,1l0,0c0,0.6-0.4,1-1,1l0,0\r\n\t\t\tc-0.6,0-1-0.4-1-1l0,0C-277,391.4-276.6,391-276,391z\"/>\r\n\t\t\r\n\t\t\t<rect x=\"-273.6\" y=\"393.1\" transform=\"matrix(-0.7069 -0.7074 0.7074 -0.7069 -746.2077 482.7252)\" style=\"fill:#FF5722\" width=\"1\" height=\"5.8\"/>\r\n\t</g>\r\n</g>\r\n</svg>\r\n";

},{}],15:[function(require,module,exports){
module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg viewBox=\"0 0 30 30\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n    <defs></defs>\n    <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Icon\" sketch:type=\"MSLayerGroup\">\n            <path d=\"M8,18.4389205 C8,20.6648519 9.24949612,22.5309386 11.2968616,23.44125 C11.5491867,23.5534403 11.8446848,23.4398385 11.956875,23.1875134 C12.0690653,22.9351883 11.9554635,22.6396902 11.7031384,22.5275 C10.0119925,21.7755729 9,20.2641911 9,18.4389205 L9,12.984375 C9,12.7082326 8.77614237,12.484375 8.5,12.484375 C8.22385763,12.484375 8,12.7082326 8,12.984375 L8,18.4389205 Z\" id=\"Shape\" fill=\"#B71C1C\" sketch:type=\"MSShapeGroup\"></path>\n            <path d=\"M19,15.875 C19,16.496 18.328,17 17.5,17 L17,17 L17,14 L17.5,14 C18.328,14 19,14.504 19,15.125 L19,15.875 L19,15.875 Z\" id=\"Stroke\" fill=\"#2196F3\" sketch:type=\"MSShapeGroup\"></path>\n            <path d=\"M7,12 C5.99993896,12 5,12.6733125 5,14 L5,16 C5,17.3266875 5.93743896,18 7,18 L8,18 C14.2335714,18.25 13.85,20.62225 17,22 L17,9 C13.8564286,10.375 14.2371429,11.75 8,12 L7,12 Z\" id=\"Stroke\" stroke=\"#284661\" stroke-linecap=\"round\" stroke-linejoin=\"round\" sketch:type=\"MSShapeGroup\"></path>\n            <path d=\"M18.828125,10.03125 C20.185125,11.38825 21.025125,13.26325 21.025125,15.33425 C21.025125,17.40525 20.185125,19.28025 18.828125,20.63725\" id=\"Stroke\" stroke=\"#7B1FA2\" stroke-linecap=\"round\" sketch:type=\"MSShapeGroup\"></path>\n            <path d=\"M21.140625,7.015625 C23.221625,9.096625 24.508625,11.971625 24.508625,15.147625 C24.508625,18.323625 23.221625,21.198625 21.140625,23.279625\" id=\"Stroke\" stroke=\"#DEA7E8\" stroke-linecap=\"round\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n    </g>\n</svg>\n";

},{}],16:[function(require,module,exports){
module.exports = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<svg version=\"1.1\" id=\"Layer_1\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\"\r\n\t xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"-290 382 30 30\"\r\n\t style=\"enable-background:new -290 382 30 30;\" xml:space=\"preserve\">\r\n<g>\r\n\t<path style=\"fill:#E3471B\" d=\"M-269.6,395.9c-2.5,0-4.6,2.1-4.6,4.6s2.1,4.6,4.6,4.6s4.6-2.1,4.6-4.6S-267.1,395.9-269.6,395.9z\r\n\t\t M-273.2,400.5c0-2,1.6-3.6,3.6-3.6c0.8,0,1.5,0.3,2.1,0.7l-5,5C-272.9,402-273.2,401.3-273.2,400.5z M-269.6,404.1\r\n\t\tc-0.8,0-1.5-0.3-2.1-0.7l5-5c0.5,0.6,0.7,1.3,0.7,2.1C-266.1,402.5-267.8,404.1-269.6,404.1z\"/>\r\n\t<path style=\"fill:#284661\" d=\"M-266.5,388.9h-17c-0.7,0-1.5,0.8-1.5,1.5v11c0,0.7,0.8,1.5,1.5,1.5h7.5v-1h-7.5c-0.1,0-0.5-0.4-0.5-0.5v-11\r\n\t\tl0,0l8.8,5.1c0.1,0,0.2,0.1,0.3,0.1c0.1,0,0.2,0,0.3-0.1l8.7-5.2l0,0v4.5h1v-4.5C-265,389.8-265.8,388.9-266.5,388.9z\r\n\t\t M-274.9,394.6l-8-4.6h15.7L-274.9,394.6z\"/>\r\n</g>\r\n</svg>\r\n";

},{}],17:[function(require,module,exports){
module.exports = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<svg version=\"1.1\" id=\"Layer_1\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\"\r\n\t xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"-290 382 30 30\"\r\n\t style=\"enable-background:new -290 382 30 30;\" xml:space=\"preserve\">\r\n<g>\r\n\t<path style=\"fill:#284661\" d=\"M-266,387.5h-18c-0.3,0-0.5,0.2-0.5,0.5v18c0,0.3,0.2,0.5,0.5,0.5h18c0.3,0,0.5-0.2,0.5-0.5v-18\r\n\t\tC-265.5,387.7-265.7,387.5-266,387.5z M-266.5,405.5h-17v-17h17V405.5z\"/>\r\n\t<rect x=\"-270\" y=\"390\" style=\"fill:#284661\" width=\"1\" height=\"6\"/>\r\n\t<rect x=\"-270\" y=\"398\" style=\"fill:#284661\" width=\"1\" height=\"1\"/>\r\n\t<rect x=\"-280\" y=\"390\" style=\"fill:#284661\" width=\"1\" height=\"4\"/>\r\n\t<rect x=\"-280\" y=\"396\" style=\"fill:#284661\" width=\"1\" height=\"3\"/>\r\n\t<rect x=\"-275\" y=\"390\" style=\"fill:#284661\" width=\"1\" height=\"1\"/>\r\n\t<rect x=\"-275\" y=\"393\" style=\"fill:#284661\" width=\"1\" height=\"6\"/>\r\n\t<polygon style=\"fill:#4CB04F\" points=\"-279,396 -277,396 -277,394 -279,394 -280,394 -282,394 -282,396 -280,396 \t\"/>\r\n\t<polygon style=\"fill:#8AC24A\" points=\"-274,393 -272,393 -272,391 -274,391 -275,391 -277,391 -277,393 -275,393 \t\"/>\r\n\t<polygon style=\"fill:#CBDB39\" points=\"-272,396 -272,398 -270,398 -269,398 -267,398 -267,396 -269,396 -270,396 \t\"/>\r\n\t<path style=\"fill:#00BCD4\" d=\"M-269.4,401.1c-1,0-1.8,0.8-1.8,1.8s0.8,1.8,1.8,1.8s1.8-0.8,1.8-1.8S-268.4,401.1-269.4,401.1z M-269.4,403.7\r\n\t\tc-0.4,0-0.8-0.3-0.8-0.8s0.3-0.8,0.8-0.8s0.8,0.3,0.8,0.8S-269,403.7-269.4,403.7z\"/>\r\n\t<path style=\"fill:#2196F3\" d=\"M-274.4,401.1c-1,0-1.8,0.8-1.8,1.8s0.8,1.8,1.8,1.8s1.7-0.8,1.7-1.8S-273.5,401.1-274.4,401.1z M-274.4,403.7\r\n\t\tc-0.4,0-0.8-0.3-0.8-0.8s0.3-0.8,0.8-0.8c0.4,0,0.7,0.3,0.7,0.8S-274,403.7-274.4,403.7z\"/>\r\n\t<path style=\"fill:#303F9F\" d=\"M-279.4,401.1c-1,0-1.8,0.8-1.8,1.8s0.8,1.8,1.8,1.8s1.8-0.8,1.8-1.8S-278.5,401.1-279.4,401.1z M-279.4,403.7\r\n\t\tc-0.4,0-0.8-0.3-0.8-0.8s0.3-0.8,0.8-0.8s0.8,0.3,0.8,0.8S-279,403.7-279.4,403.7z\"/>\r\n</g>\r\n</svg>\r\n";

},{}],18:[function(require,module,exports){
module.exports = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<svg version=\"1.1\" id=\"Layer_1\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\"\r\n\t xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"-300 382 30 30\"\r\n\t style=\"enable-background:new -300 382 30 30;\" xml:space=\"preserve\">\r\n<g id=\"Barbershop-UI-Guide\" sketch:type=\"MSPage\">\r\n\t<g id=\"Nav_1_\" transform=\"translate(-30.000000, -475.000000)\" sketch:type=\"MSArtboardGroup\">\r\n\t\t<g id=\"Navbar\" sketch:type=\"MSLayerGroup\">\r\n\t\t\t<g id=\"Nav\" transform=\"translate(0.000000, 115.000000)\" sketch:type=\"MSShapeGroup\">\r\n\t\t\t\t<g id=\"Stats\" transform=\"translate(0.000000, 350.000000)\">\r\n\t\t\t\t\t<g id=\"Icon\" transform=\"translate(30.000000, 10.000000)\">\r\n\t\t\t\t\t\t<path id=\"Stroke\" style=\"fill:#FF4081\" d=\"M-292,402h-2v4h2V402z\"/>\r\n\t\t\t\t\t\t<path id=\"Stroke_1_\" style=\"fill:#DEA7E8\" d=\"M-287,398h-2v8h2V398z\"/>\r\n\t\t\t\t\t\t<path id=\"Stroke_2_\" style=\"fill:#7C4DFF\" d=\"M-282,400h-2v6h2V400z\"/>\r\n\t\t\t\t\t\t<path id=\"Stroke_3_\" style=\"fill:#7B1FA2\" d=\"M-277,394h-2v12h2V394z\"/>\r\n\t\t\t\t\t\t<rect id=\"Rectangle\" x=\"-295\" y=\"406\" style=\"fill:#284661\" width=\"20\" height=\"1\"/>\r\n\t\t\t\t\t\t<path id=\"Stroke_4_\" style=\"fill:#284561\" d=\"M-291,396c0,0.6-0.4,1-1,1c-0.6,0-1-0.4-1-1s0.4-1,1-1C-291.4,395-291,395.4-291,396\r\n\t\t\t\t\t\t\tL-291,396z\"/>\r\n\t\t\t\t\t\t<path id=\"Stroke_5_\" style=\"fill:#284561\" d=\"M-287,392c0,0.6-0.4,1-1,1c-0.6,0-1-0.4-1-1s0.4-1,1-1C-287.4,391-287,391.4-287,392\r\n\t\t\t\t\t\t\tL-287,392z\"/>\r\n\t\t\t\t\t\t<path id=\"Stroke_6_\" style=\"fill:#284561\" d=\"M-282,394c0,0.6-0.4,1-1,1c-0.6,0-1-0.4-1-1s0.4-1,1-1C-282.4,393-282,393.4-282,394\r\n\t\t\t\t\t\t\tL-282,394z\"/>\r\n\t\t\t\t\t\t<path id=\"Stroke_7_\" style=\"fill:#284561\" d=\"M-277,388c0,0.6-0.4,1-1,1c-0.6,0-1-0.4-1-1s0.4-1,1-1C-277.4,387-277,387.4-277,388\r\n\t\t\t\t\t\t\tL-277,388z\"/>\r\n\t\t\t\t\t</g>\r\n\t\t\t\t</g>\r\n\t\t\t</g>\r\n\t\t</g>\r\n\t</g>\r\n</g>\r\n</svg>\r\n";

},{}],19:[function(require,module,exports){
module.exports = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<svg version=\"1.1\" id=\"Layer_1\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\"\r\n\t xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"-300 381.5 30 30\"\r\n\t style=\"enable-background:new -300 381.5 30 30;\" xml:space=\"preserve\">\r\n<g id=\"Barbershop-UI-Guide\" sketch:type=\"MSPage\">\r\n\t<g id=\"Nav_1_\" transform=\"translate(-30.000000, -415.000000)\" sketch:type=\"MSArtboardGroup\">\r\n\t\t<g id=\"Navbar\" sketch:type=\"MSLayerGroup\">\r\n\t\t\t<g id=\"Nav\" transform=\"translate(0.000000, 115.000000)\" sketch:type=\"MSShapeGroup\">\r\n\t\t\t\t<g id=\"Templates\" transform=\"translate(0.000000, 290.000000)\">\r\n\t\t\t\t\t<g id=\"Icon\" transform=\"translate(30.000000, 10.000000)\">\r\n\t\t\t\t\t\t<path style=\"fill:#4CB04F\" d=\"M-274.5,391.5h-21v-5h21V391.5z M-294.5,390.5h19v-3h-19V390.5z\"/>\r\n\t\t\t\t\t\t<path style=\"fill:#284661\" d=\"M-274.5,406.5h-21v-5h21V406.5z M-294.5,405.5h19v-3h-19V405.5z\"/>\r\n\t\t\t\t\t\t<path style=\"fill:#00BCD4\" d=\"M-286.5,399.5h-9v-5h9V399.5z M-294.5,398.5h7v-3h-7V398.5z\"/>\r\n\t\t\t\t\t\t<path style=\"fill:#00BCD4\" d=\"M-274.5,399.5h-9v-5h9V399.5z M-282.5,398.5h7v-3h-7V398.5z\"/>\r\n\t\t\t\t\t</g>\r\n\t\t\t\t</g>\r\n\t\t\t</g>\r\n\t\t</g>\r\n\t</g>\r\n</g>\r\n</svg>\r\n";

},{}]},{},[2])