window.Modernizr=function(t,e,n){function r(t){y.cssText=t}function i(t,e){return typeof t===e}function a(t,e){return!!~(""+t).indexOf(e)}function o(t,e){for(var r in t){var i=t[r];if(!a(i,"-")&&y[i]!==n)return"pfx"==e?i:!0}return!1}function s(t,e,r){for(var a in t){var o=e[t[a]];if(o!==n)return r===!1?t[a]:i(o,"function")?o.bind(r||e):o}return!1}function l(t,e,n){var r=t.charAt(0).toUpperCase()+t.slice(1),a=(t+" "+$.join(r+" ")+r).split(" ");return i(e,"string")||i(e,"undefined")?o(a,e):(a=(t+" "+T.join(r+" ")+r).split(" "),s(a,e,n))}var c,d,u,p="2.6.2",f={},h=!0,m=e.documentElement,v="modernizr",g=e.createElement(v),y=g.style,w=({}.toString," -webkit- -moz- -o- -ms- ".split(" ")),b="Webkit Moz O ms",$=b.split(" "),T=b.toLowerCase().split(" "),E={},F=[],_=F.slice,k=function(t,n,r,i){var a,o,s,l,c=e.createElement("div"),d=e.body,u=d||e.createElement("body");if(parseInt(r,10))for(;r--;)s=e.createElement("div"),s.id=i?i[r]:v+(r+1),c.appendChild(s);return a=["&#173;",'<style id="s',v,'">',t,"</style>"].join(""),c.id=v,(d?c:u).innerHTML+=a,u.appendChild(c),d||(u.style.background="",u.style.overflow="hidden",l=m.style.overflow,m.style.overflow="hidden",m.appendChild(u)),o=n(c,t),d?c.parentNode.removeChild(c):(u.parentNode.removeChild(u),m.style.overflow=l),!!o},x={}.hasOwnProperty;u=i(x,"undefined")||i(x.call,"undefined")?function(t,e){return e in t&&i(t.constructor.prototype[e],"undefined")}:function(t,e){return x.call(t,e)},Function.prototype.bind||(Function.prototype.bind=function(t){var e=this;if("function"!=typeof e)throw new TypeError;var n=_.call(arguments,1),r=function(){if(this instanceof r){var i=function(){};i.prototype=e.prototype;var a=new i,o=e.apply(a,n.concat(_.call(arguments)));return Object(o)===o?o:a}return e.apply(t,n.concat(_.call(arguments)))};return r}),E.touch=function(){var n;return"ontouchstart"in t||t.DocumentTouch&&e instanceof DocumentTouch?n=!0:k(["@media (",w.join("touch-enabled),("),v,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(t){n=9===t.offsetTop}),n},E.cssanimations=function(){return l("animationName")},E.csstransitions=function(){return l("transition")};for(var C in E)u(E,C)&&(d=C.toLowerCase(),f[d]=E[C](),F.push((f[d]?"":"no-")+d));return f.addTest=function(t,e){if("object"==typeof t)for(var r in t)u(t,r)&&f.addTest(r,t[r]);else{if(t=t.toLowerCase(),f[t]!==n)return f;e="function"==typeof e?e():e,"undefined"!=typeof h&&h&&(m.className+=" "+(e?"":"no-")+t),f[t]=e}return f},r(""),g=c=null,function(t,e){function n(t,e){var n=t.createElement("p"),r=t.getElementsByTagName("head")[0]||t.documentElement;return n.innerHTML="x<style>"+e+"</style>",r.insertBefore(n.lastChild,r.firstChild)}function r(){var t=g.elements;return"string"==typeof t?t.split(" "):t}function i(t){var e=v[t[h]];return e||(e={},m++,t[h]=m,v[m]=e),e}function a(t,n,r){if(n||(n=e),d)return n.createElement(t);r||(r=i(n));var a;return a=r.cache[t]?r.cache[t].cloneNode():f.test(t)?(r.cache[t]=r.createElem(t)).cloneNode():r.createElem(t),a.canHaveChildren&&!p.test(t)?r.frag.appendChild(a):a}function o(t,n){if(t||(t=e),d)return t.createDocumentFragment();n=n||i(t);for(var a=n.frag.cloneNode(),o=0,s=r(),l=s.length;l>o;o++)a.createElement(s[o]);return a}function s(t,e){e.cache||(e.cache={},e.createElem=t.createElement,e.createFrag=t.createDocumentFragment,e.frag=e.createFrag()),t.createElement=function(n){return g.shivMethods?a(n,t,e):e.createElem(n)},t.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+r().join().replace(/\w+/g,function(t){return e.createElem(t),e.frag.createElement(t),'c("'+t+'")'})+");return n}")(g,e.frag)}function l(t){t||(t=e);var r=i(t);return g.shivCSS&&!c&&!r.hasCSS&&(r.hasCSS=!!n(t,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),d||s(t,r),t}var c,d,u=t.html5||{},p=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,f=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,h="_html5shiv",m=0,v={};!function(){try{var t=e.createElement("a");t.innerHTML="<xyz></xyz>",c="hidden"in t,d=1==t.childNodes.length||function(){e.createElement("a");var t=e.createDocumentFragment();return"undefined"==typeof t.cloneNode||"undefined"==typeof t.createDocumentFragment||"undefined"==typeof t.createElement}()}catch(n){c=!0,d=!0}}();var g={elements:u.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:u.shivCSS!==!1,supportsUnknownElements:d,shivMethods:u.shivMethods!==!1,type:"default",shivDocument:l,createElement:a,createDocumentFragment:o};t.html5=g,l(e)}(this,e),f._version=p,f._prefixes=w,f._domPrefixes=T,f._cssomPrefixes=$,f.testProp=function(t){return o([t])},f.testAllProps=l,f.testStyles=k,f.prefixed=function(t,e,n){return e?l(t,e,n):l(t,"pfx")},m.className=m.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(h?" js "+F.join(" "):""),f}(this,this.document),function(t,e,n){function r(t){return"[object Function]"==v.call(t)}function i(t){return"string"==typeof t}function a(){}function o(t){return!t||"loaded"==t||"complete"==t||"uninitialized"==t}function s(){var t=g.shift();y=1,t?t.t?h(function(){("c"==t.t?p.injectCss:p.injectJs)(t.s,0,t.a,t.x,t.e,1)},0):(t(),s()):y=0}function l(t,n,r,i,a,l,c){function d(e){if(!f&&o(u.readyState)&&(w.r=f=1,!y&&s(),u.onload=u.onreadystatechange=null,e)){"img"!=t&&h(function(){$.removeChild(u)},50);for(var r in k[n])k[n].hasOwnProperty(r)&&k[n][r].onload()}}var c=c||p.errorTimeout,u=e.createElement(t),f=0,v=0,w={t:r,s:n,e:a,a:l,x:c};1===k[n]&&(v=1,k[n]=[]),"object"==t?u.data=n:(u.src=n,u.type=t),u.width=u.height="0",u.onerror=u.onload=u.onreadystatechange=function(){d.call(this,v)},g.splice(i,0,w),"img"!=t&&(v||2===k[n]?($.insertBefore(u,b?null:m),h(d,c)):k[n].push(u))}function c(t,e,n,r,a){return y=0,e=e||"j",i(t)?l("c"==e?E:T,t,e,this.i++,n,r,a):(g.splice(this.i++,0,t),1==g.length&&s()),this}function d(){var t=p;return t.loader={load:c,i:0},t}var u,p,f=e.documentElement,h=t.setTimeout,m=e.getElementsByTagName("script")[0],v={}.toString,g=[],y=0,w="MozAppearance"in f.style,b=w&&!!e.createRange().compareNode,$=b?f:m.parentNode,f=t.opera&&"[object Opera]"==v.call(t.opera),f=!!e.attachEvent&&!f,T=w?"object":f?"script":"img",E=f?"script":T,F=Array.isArray||function(t){return"[object Array]"==v.call(t)},_=[],k={},x={timeout:function(t,e){return e.length&&(t.timeout=e[0]),t}};p=function(t){function e(t){var e,n,r,t=t.split("!"),i=_.length,a=t.pop(),o=t.length,a={url:a,origUrl:a,prefixes:t};for(n=0;o>n;n++)r=t[n].split("="),(e=x[r.shift()])&&(a=e(a,r));for(n=0;i>n;n++)a=_[n](a);return a}function o(t,i,a,o,s){var l=e(t),c=l.autoCallback;l.url.split(".").pop().split("?").shift(),l.bypass||(i&&(i=r(i)?i:i[t]||i[o]||i[t.split("/").pop().split("?")[0]]),l.instead?l.instead(t,i,a,o,s):(k[l.url]?l.noexec=!0:k[l.url]=1,a.load(l.url,l.forceCSS||!l.forceJS&&"css"==l.url.split(".").pop().split("?").shift()?"c":n,l.noexec,l.attrs,l.timeout),(r(i)||r(c))&&a.load(function(){d(),i&&i(l.origUrl,s,o),c&&c(l.origUrl,s,o),k[l.url]=2})))}function s(t,e){function n(t,n){if(t){if(i(t))n||(u=function(){var t=[].slice.call(arguments);p.apply(this,t),f()}),o(t,u,e,0,c);else if(Object(t)===t)for(l in s=function(){var e,n=0;for(e in t)t.hasOwnProperty(e)&&n++;return n}(),t)t.hasOwnProperty(l)&&(!n&&!--s&&(r(u)?u=function(){var t=[].slice.call(arguments);p.apply(this,t),f()}:u[l]=function(t){return function(){var e=[].slice.call(arguments);t&&t.apply(this,e),f()}}(p[l])),o(t[l],u,e,l,c))}else!n&&f()}var s,l,c=!!t.test,d=t.load||t.both,u=t.callback||a,p=u,f=t.complete||a;n(c?t.yep:t.nope,!!d),d&&n(d)}var l,c,u=this.yepnope.loader;if(i(t))o(t,0,u,0);else if(F(t))for(l=0;l<t.length;l++)c=t[l],i(c)?o(c,0,u,0):F(c)?p(c):Object(c)===c&&s(c,u);else Object(t)===t&&s(t,u)},p.addPrefix=function(t,e){x[t]=e},p.addFilter=function(t){_.push(t)},p.errorTimeout=1e4,null==e.readyState&&e.addEventListener&&(e.readyState="loading",e.addEventListener("DOMContentLoaded",u=function(){e.removeEventListener("DOMContentLoaded",u,0),e.readyState="complete"},0)),t.yepnope=d(),t.yepnope.executeStack=s,t.yepnope.injectJs=function(t,n,r,i,l,c){var d,u,f=e.createElement("script"),i=i||p.errorTimeout;f.src=t;for(u in r)f.setAttribute(u,r[u]);n=c?s:n||a,f.onreadystatechange=f.onload=function(){!d&&o(f.readyState)&&(d=1,n(),f.onload=f.onreadystatechange=null)},h(function(){d||(d=1,n(1))},i),l?f.onload():m.parentNode.insertBefore(f,m)},t.yepnope.injectCss=function(t,n,r,i,o,l){var c,i=e.createElement("link"),n=l?s:n||a;i.href=t,i.rel="stylesheet",i.type="text/css";for(c in r)i.setAttribute(c,r[c]);o||(m.parentNode.insertBefore(i,m),h(n,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))},function(t,e,n){function r(t){return t}function i(t){return a(decodeURIComponent(t.replace(s," ")))}function a(t){return 0===t.indexOf('"')&&(t=t.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")),t}function o(t){return l.json?JSON.parse(t):t}var s=/\+/g,l=t.cookie=function(a,s,c){if(s!==n){if(c=t.extend({},l.defaults,c),null===s&&(c.expires=-1),"number"==typeof c.expires){var d=c.expires,u=c.expires=new Date;u.setDate(u.getDate()+d)}return s=l.json?JSON.stringify(s):String(s),e.cookie=[encodeURIComponent(a),"=",l.raw?s:encodeURIComponent(s),c.expires?"; expires="+c.expires.toUTCString():"",c.path?"; path="+c.path:"",c.domain?"; domain="+c.domain:"",c.secure?"; secure":""].join("")}for(var p=l.raw?r:i,f=e.cookie.split("; "),h=a?null:{},m=0,v=f.length;v>m;m++){var g=f[m].split("="),y=p(g.shift()),w=p(g.join("="));if(a&&a===y){h=o(w);break}a||(h[y]=o(w))}return h};l.defaults={},t.removeCookie=function(e,n){return null!==t.cookie(e)?(t.cookie(e,null,n),!0):!1}}(jQuery,document),function(){var t={}.hasOwnProperty,e=function(e,n){function r(){this.constructor=e}for(var i in n)t.call(n,i)&&(e[i]=n[i]);return r.prototype=n.prototype,e.prototype=new r,e.__super__=n.prototype,e};Nlvx.TeslaVersionEditor=function(t){function n(){return n.__super__.constructor.apply(this,arguments)}return e(n,t),n}(Nlvx.BaseVersionEditor)}.call(this),window.Nlvx=window.Nlvx||{},function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};!function(e){return Nlvx.TemplateForm=function(){function n(n,r){this.resetTarget=t(this.resetTarget,this),this.unbindEvents=t(this.unbindEvents,this),this.bindEvents=t(this.bindEvents,this),this.displayTemplateForm=t(this.displayTemplateForm,this),this.$target=e(n),this.options=e.extend(!0,{edit:!1},r),this.url=r.url,this.initial_data=null,this.$form=null,this.$name_input=null}return n.prototype.render=function(){var t;return t=e.ajax({url:this.url,dataType:"html"}),t.done(this.displayTemplateForm),t.done(this.bindEvents),e("#no-templates").hide()},n.prototype.displayTemplateForm=function(t){return this.initial_data=e.trim(this.$target.html()),this.$target.html(t).show(),this.$form=this.$target.find("form").validateForm(),this.$name_input=this.$target.find("#templates_client_template_name").focus()},n.prototype.bindEvents=function(){return this.$target.on("click",'[data-cancel="template"]',this.resetTarget)},n.prototype.unbindEvents=function(){return this.$target.off("click",'[data-cancel="template"]',this.resetTarget)},n.prototype.resetTarget=function(){return this.options.edit?this.destroy():(this.$name_input.val(""),this.$form.validateForm("check"),this.$target.hide()),e("#no-templates").show()},n.prototype.update=function(t){return this.options=e.extend(!0,this.options,t),this.$target.show(),e("#no-templates").hide(),this.$name_input.focus()},n.prototype.destroy=function(){return this.unbindEvents(),this.$target.html(this.initial_data),e.removeData(this.$target.get(0),"templateForm")},n}(),e.fn.templateForm=function(t){var n,r;return n=e.makeArray(arguments),r=n.slice(1),this.each(function(){var i;return i=e.data(this,"templateForm"),i?"string"==typeof t?i[t].apply(i,r):i.update.apply(i,n):(i=new Nlvx.TemplateForm(this,t),e.data(this,"templateForm",i),i.render())})}}(jQuery)}.call(this),function(){Nlvx.TestTemplateModal=function(){function t(t){r=$(t),e=r.find("#send_test_form"),n=e.find("input[name=to_address]")}var e,n,r,i,a;return r=null,e=null,n=null,t.prototype.render=function(t,n,i){return r.find("iframe").attr("src",t),e.attr("action",n),r.find("#subject").html(i),this.bindEvents(),r.modal("show")},t.prototype.submitForm=function(){return e.unbind("submit"),e.submit()},t.prototype.bindEvents=function(){return r.find('[data-action="mobile-view"]').click(a),r.find('[data-action="desktop-view"]').click(i),e.on("submit",function(t){return function(e){return e.preventDefault(),Nlvx.EmailValidator.is_valid(n.val())?t.submitForm():Nlvx.FlashMessageHandler.add("danger","Please enter a valid email address.")}}(this))},a=function(){return r.find(".desktop-view").addClass("mobile-view").removeClass("desktop-view"),r.find('[data-action="mobile-view"] i').addClass("active"),r.find('[data-action="desktop-view"] i').removeClass("active")},i=function(){return r.find(".mobile-view").addClass("desktop-view").removeClass("mobile-view"),r.find('[data-action="desktop-view"] i').addClass("active"),r.find('[data-action="mobile-view"] i').removeClass("active")},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};Nlvx.VersionList=function(){function e(e,n,r){this.renderNewVersionModal=t(this.renderNewVersionModal,this),this.renderTestModal=t(this.renderTestModal,this),this.renderPreviewModal=t(this.renderPreviewModal,this),this.renderDeleteFailureFlash=t(this.renderDeleteFailureFlash,this),this.renderDeleteModal=t(this.renderDeleteModal,this),this.renderEditTemplateForm=t(this.renderEditTemplateForm,this),this.renderNewTemplateForm=t(this.renderNewTemplateForm,this),this.toggleView=t(this.toggleView,this),this.$target=$(e),this.$previewModal=n,this.$testModal=r}return e.prototype.init=function(){var t,e;return this.initializeTemplateViewState(),this.bindEvents(),t=this.$target.find("#no-templates"),t.length&&(e=t.data("action"),"add"===e)?$('[data-add="template"]').click():void 0},e.prototype.initializeTemplateViewState=function(){return"list"===$.cookie("template_view_state")?(this.$target.find(".thumbnail-view").hide(),this.$target.find(".list-view").show(),this.$target.find(".view-toggle").toggleClass("active")):void 0},e.prototype.bindEvents=function(){return this.$target.find(".view-toggle").click(this.toggleView),this.$target.find(".modal").on("hidden.bs.modal",function(){return $(this).removeData("bs.modal")}),this.$target.on("click",'[data-add="template"]',this.renderNewTemplateForm),this.$target.on("click",'[data-edit="template"]',this.renderEditTemplateForm),this.$target.find('[data-add="version"]').click(this.renderNewVersionModal),this.$target.find("#save_new_version").click(function(t){return function(){return t.$target.find("#new_version_form").submit()}}(this)),this.$target.find('[data-action="delete"]').click(this.renderDeleteModal),this.$target.find('[data-action="delete-flash"]').click(this.renderDeleteFailureFlash),this.$target.find('[data-action="preview"]').click(this.renderPreviewModal),this.$target.find('[data-action="test"]').click(this.renderTestModal)},e.prototype.toggleView=function(){return this.$target.find(".thumbnail-view, .list-view").toggle(),this.$target.find(".view-toggle").toggleClass("active"),this.toggleTemplateViewState()},e.prototype.toggleTemplateViewState=function(){return"list"===$.cookie("template_view_state")?$.cookie("template_view_state","thumbnail",{expires:3650}):$.cookie("template_view_state","list",{expires:3650})},e.prototype.renderNewTemplateForm=function(t){return $("#new_template_form.template-version-list").templateForm({url:$(t.currentTarget).data("target")})},e.prototype.renderEditTemplateForm=function(t){return $("#template_"+t.currentTarget.getAttribute("data-id")+" .template-name").templateForm({url:$(t.currentTarget).data("target"),edit:!0})},e.prototype.renderDeleteModal=function(t){var e,n;return n="",null!==t.currentTarget.getAttribute("data-type")&&(n=t.currentTarget.getAttribute("data-type")+"_"),e=n+t.currentTarget.getAttribute("data-id"),$(".modal").modal("hide"),this.$target.find(".modal[data-id='"+e+"']").modal({show:!0,backdrop:"static"}),$(".modal-backdrop").remove()},e.prototype.renderDeleteFailureFlash=function(t){return t.preventDefault(),Nlvx.FlashMessageHandler.add("danger","Only empty templates can be deleted.")},e.prototype.renderPreviewModal=function(t){var e,n,r;return e=$(t.currentTarget),r=e.data("path"),n=e.data("editPath"),this.$previewModal.render(r,n)},e.prototype.renderTestModal=function(t){var e,n,r;return e=t.currentTarget.getAttribute("data-path"),n=t.currentTarget.getAttribute("data-send-test-path"),r=t.currentTarget.getAttribute("data-subject"),this.$testModal.render(e,n,r)},e.prototype.renderNewVersionModal=function(t){var e,n;return n=t.currentTarget.getAttribute("data-template-id"),n&&this.$target.find("#template_id").val(n),e=this.$target.find("#new_version_form").get(0),e.setAttribute("action","/templates/"+n+"/versions"),this.$target.find(".modal#add_version_modal").modal("show")},e}()}.call(this);