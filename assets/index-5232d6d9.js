(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const _ of i)if(_.type==="childList")for(const c of _.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function n(i){const _={};return i.integrity&&(_.integrity=i.integrity),i.referrerPolicy&&(_.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?_.credentials="include":i.crossOrigin==="anonymous"?_.credentials="omit":_.credentials="same-origin",_}function r(i){if(i.ep)return;i.ep=!0;const _=n(i);fetch(i.href,_)}})();var F,a,Se,L,ie,Ce,Z,Ee,I={},$e=[],Me=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,z=Array.isArray;function P(t,e){for(var n in e)t[n]=e[n];return t}function Pe(t){var e=t.parentNode;e&&e.removeChild(t)}function B(t,e,n){var r,i,_,c={};for(_ in e)_=="key"?r=e[_]:_=="ref"?i=e[_]:c[_]=e[_];if(arguments.length>2&&(c.children=arguments.length>3?F.call(arguments,2):n),typeof t=="function"&&t.defaultProps!=null)for(_ in t.defaultProps)c[_]===void 0&&(c[_]=t.defaultProps[_]);return R(t,c,r,i,null)}function R(t,e,n,r,i){var _={type:t,props:e,key:n,ref:r,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:i??++Se};return i==null&&a.vnode!=null&&a.vnode(_),_}function J(t){return t.children}function W(t,e){this.props=t,this.context=e}function A(t,e){if(e==null)return t.__?A(t.__,t.__.__k.indexOf(t)+1):null;for(var n;e<t.__k.length;e++)if((n=t.__k[e])!=null&&n.__e!=null)return n.__e;return typeof t.type=="function"?A(t):null}function xe(t){var e,n;if((t=t.__)!=null&&t.__c!=null){for(t.__e=t.__c.base=null,e=0;e<t.__k.length;e++)if((n=t.__k[e])!=null&&n.__e!=null){t.__e=t.__c.base=n.__e;break}return xe(t)}}function ee(t){(!t.__d&&(t.__d=!0)&&L.push(t)&&!j.__r++||ie!==a.debounceRendering)&&((ie=a.debounceRendering)||Ce)(j)}function j(){var t,e,n,r,i,_,c,l,s;for(L.sort(Z);t=L.shift();)t.__d&&(e=L.length,r=void 0,i=void 0,_=void 0,l=(c=(n=t).__v).__e,(s=n.__P)&&(r=[],i=[],(_=P({},c)).__v=c.__v+1,_e(s,c,_,n.__n,s.ownerSVGElement!==void 0,c.__h!=null?[l]:null,r,l??A(c),c.__h,i),we(r,c,i),c.__e!=l&&xe(c)),L.length>e&&L.sort(Z));j.__r=0}function He(t,e,n,r,i,_,c,l,s,y,m){var o,h,f,u,p,$,g,v,C,S=0,b=r&&r.__k||$e,U=b.length,x=U,T=e.length;for(n.__k=[],o=0;o<T;o++)(u=n.__k[o]=(u=e[o])==null||typeof u=="boolean"||typeof u=="function"?null:typeof u=="string"||typeof u=="number"||typeof u=="bigint"?R(null,u,null,null,u):z(u)?R(J,{children:u},null,null,null):u.__b>0?R(u.type,u.props,u.key,u.ref?u.ref:null,u.__v):u)!=null?(u.__=n,u.__b=n.__b+1,(v=We(u,b,g=o+S,x))===-1?f=I:(f=b[v]||I,b[v]=void 0,x--),_e(t,u,f,i,_,c,l,s,y,m),p=u.__e,(h=u.ref)&&f.ref!=h&&(f.ref&&re(f.ref,null,u),m.push(h,u.__c||p,u)),p!=null&&($==null&&($=p),(C=f===I||f.__v===null)?v==-1&&S--:v!==g&&(v===g+1?S++:v>g?x>T-g?S+=v-g:S--:S=v<g&&v==g-1?v-g:0),g=o+S,typeof u.type!="function"||v===g&&f.__k!==u.__k?typeof u.type=="function"||v===g&&!C?u.__d!==void 0?(s=u.__d,u.__d=void 0):s=p.nextSibling:s=Te(t,p,s):s=Le(u,s,t),typeof n.type=="function"&&(n.__d=s))):(f=b[o])&&f.key==null&&f.__e&&(f.__e==s&&(s=A(f)),te(f,f,!1),b[o]=null);for(n.__e=$,o=U;o--;)b[o]!=null&&(typeof n.type=="function"&&b[o].__e!=null&&b[o].__e==n.__d&&(n.__d=b[o].__e.nextSibling),te(b[o],b[o]))}function Le(t,e,n){for(var r,i=t.__k,_=0;i&&_<i.length;_++)(r=i[_])&&(r.__=t,e=typeof r.type=="function"?Le(r,e,n):Te(n,r.__e,e));return e}function Ue(t,e){return e=e||[],t==null||typeof t=="boolean"||(z(t)?t.some(function(n){Ue(n,e)}):e.push(t)),e}function Te(t,e,n){return n==null||n.parentNode!==t?t.insertBefore(e,null):e==n&&e.parentNode!=null||t.insertBefore(e,n),e.nextSibling}function We(t,e,n,r){var i=t.key,_=t.type,c=n-1,l=n+1,s=e[n];if(s===null||s&&i==s.key&&_===s.type)return n;if(r>(s!=null?1:0))for(;c>=0||l<e.length;){if(c>=0){if((s=e[c])&&i==s.key&&_===s.type)return c;c--}if(l<e.length){if((s=e[l])&&i==s.key&&_===s.type)return l;l++}}return-1}function qe(t,e,n,r,i){var _;for(_ in n)_==="children"||_==="key"||_ in e||K(t,_,null,n[_],r);for(_ in e)i&&typeof e[_]!="function"||_==="children"||_==="key"||_==="value"||_==="checked"||n[_]===e[_]||K(t,_,e[_],n[_],r)}function ce(t,e,n){e[0]==="-"?t.setProperty(e,n??""):t[e]=n==null?"":typeof n!="number"||Me.test(e)?n:n+"px"}function K(t,e,n,r,i){var _;e:if(e==="style")if(typeof n=="string")t.style.cssText=n;else{if(typeof r=="string"&&(t.style.cssText=r=""),r)for(e in r)n&&e in n||ce(t.style,e,"");if(n)for(e in n)r&&n[e]===r[e]||ce(t.style,e,n[e])}else if(e[0]==="o"&&e[1]==="n")_=e!==(e=e.replace(/(PointerCapture)$|Capture$/,"$1")),e=e.toLowerCase()in t?e.toLowerCase().slice(2):e.slice(2),t.l||(t.l={}),t.l[e+_]=n,n?r||t.addEventListener(e,_?ue:le,_):t.removeEventListener(e,_?ue:le,_);else if(e!=="dangerouslySetInnerHTML"){if(i)e=e.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(e!=="width"&&e!=="height"&&e!=="href"&&e!=="list"&&e!=="form"&&e!=="tabIndex"&&e!=="download"&&e!=="rowSpan"&&e!=="colSpan"&&e in t)try{t[e]=n??"";break e}catch{}typeof n=="function"||(n==null||n===!1&&e[4]!=="-"?t.removeAttribute(e):t.setAttribute(e,n))}}function le(t){return this.l[t.type+!1](a.event?a.event(t):t)}function ue(t){return this.l[t.type+!0](a.event?a.event(t):t)}function _e(t,e,n,r,i,_,c,l,s,y){var m,o,h,f,u,p,$,g,v,C,S,b,U,x,T,E=e.type;if(e.constructor!==void 0)return null;n.__h!=null&&(s=n.__h,l=e.__e=n.__e,e.__h=null,_=[l]),(m=a.__b)&&m(e);e:if(typeof E=="function")try{if(g=e.props,v=(m=E.contextType)&&r[m.__c],C=m?v?v.props.value:m.__:r,n.__c?$=(o=e.__c=n.__c).__=o.__E:("prototype"in E&&E.prototype.render?e.__c=o=new E(g,C):(e.__c=o=new W(g,C),o.constructor=E,o.render=je),v&&v.sub(o),o.props=g,o.state||(o.state={}),o.context=C,o.__n=r,h=o.__d=!0,o.__h=[],o._sb=[]),o.__s==null&&(o.__s=o.state),E.getDerivedStateFromProps!=null&&(o.__s==o.state&&(o.__s=P({},o.__s)),P(o.__s,E.getDerivedStateFromProps(g,o.__s))),f=o.props,u=o.state,o.__v=e,h)E.getDerivedStateFromProps==null&&o.componentWillMount!=null&&o.componentWillMount(),o.componentDidMount!=null&&o.__h.push(o.componentDidMount);else{if(E.getDerivedStateFromProps==null&&g!==f&&o.componentWillReceiveProps!=null&&o.componentWillReceiveProps(g,C),!o.__e&&(o.shouldComponentUpdate!=null&&o.shouldComponentUpdate(g,o.__s,C)===!1||e.__v===n.__v)){for(e.__v!==n.__v&&(o.props=g,o.state=o.__s,o.__d=!1),e.__e=n.__e,e.__k=n.__k,e.__k.forEach(function(M){M&&(M.__=e)}),S=0;S<o._sb.length;S++)o.__h.push(o._sb[S]);o._sb=[],o.__h.length&&c.push(o);break e}o.componentWillUpdate!=null&&o.componentWillUpdate(g,o.__s,C),o.componentDidUpdate!=null&&o.__h.push(function(){o.componentDidUpdate(f,u,p)})}if(o.context=C,o.props=g,o.__P=t,o.__e=!1,b=a.__r,U=0,"prototype"in E&&E.prototype.render){for(o.state=o.__s,o.__d=!1,b&&b(e),m=o.render(o.props,o.state,o.context),x=0;x<o._sb.length;x++)o.__h.push(o._sb[x]);o._sb=[]}else do o.__d=!1,b&&b(e),m=o.render(o.props,o.state,o.context),o.state=o.__s;while(o.__d&&++U<25);o.state=o.__s,o.getChildContext!=null&&(r=P(P({},r),o.getChildContext())),h||o.getSnapshotBeforeUpdate==null||(p=o.getSnapshotBeforeUpdate(f,u)),He(t,z(T=m!=null&&m.type===J&&m.key==null?m.props.children:m)?T:[T],e,n,r,i,_,c,l,s,y),o.base=e.__e,e.__h=null,o.__h.length&&c.push(o),$&&(o.__E=o.__=null)}catch(M){e.__v=null,(s||_!=null)&&(e.__e=l,e.__h=!!s,_[_.indexOf(l)]=null),a.__e(M,e,n)}else _==null&&e.__v===n.__v?(e.__k=n.__k,e.__e=n.__e):e.__e=Ge(n.__e,e,n,r,i,_,c,s,y);(m=a.diffed)&&m(e)}function we(t,e,n){for(var r=0;r<n.length;r++)re(n[r],n[++r],n[++r]);a.__c&&a.__c(e,t),t.some(function(i){try{t=i.__h,i.__h=[],t.some(function(_){_.call(i)})}catch(_){a.__e(_,i.__v)}})}function Ge(t,e,n,r,i,_,c,l,s){var y,m,o,h=n.props,f=e.props,u=e.type,p=0;if(u==="svg"&&(i=!0),_!=null){for(;p<_.length;p++)if((y=_[p])&&"setAttribute"in y==!!u&&(u?y.localName===u:y.nodeType===3)){t=y,_[p]=null;break}}if(t==null){if(u===null)return document.createTextNode(f);t=i?document.createElementNS("http://www.w3.org/2000/svg",u):document.createElement(u,f.is&&f),_=null,l=!1}if(u===null)h===f||l&&t.data===f||(t.data=f);else{if(_=_&&F.call(t.childNodes),m=(h=n.props||I).dangerouslySetInnerHTML,o=f.dangerouslySetInnerHTML,!l){if(_!=null)for(h={},p=0;p<t.attributes.length;p++)h[t.attributes[p].name]=t.attributes[p].value;(o||m)&&(o&&(m&&o.__html==m.__html||o.__html===t.innerHTML)||(t.innerHTML=o&&o.__html||""))}if(qe(t,f,h,i,l),o)e.__k=[];else if(He(t,z(p=e.props.children)?p:[p],e,n,r,i&&u!=="foreignObject",_,c,_?_[0]:n.__k&&A(n,0),l,s),_!=null)for(p=_.length;p--;)_[p]!=null&&Pe(_[p]);l||("value"in f&&(p=f.value)!==void 0&&(p!==t.value||u==="progress"&&!p||u==="option"&&p!==h.value)&&K(t,"value",p,h.value,!1),"checked"in f&&(p=f.checked)!==void 0&&p!==t.checked&&K(t,"checked",p,h.checked,!1))}return t}function re(t,e,n){try{typeof t=="function"?t(e):t.current=e}catch(r){a.__e(r,n)}}function te(t,e,n){var r,i;if(a.unmount&&a.unmount(t),(r=t.ref)&&(r.current&&r.current!==t.__e||re(r,null,e)),(r=t.__c)!=null){if(r.componentWillUnmount)try{r.componentWillUnmount()}catch(_){a.__e(_,e)}r.base=r.__P=null,t.__c=void 0}if(r=t.__k)for(i=0;i<r.length;i++)r[i]&&te(r[i],e,n||typeof t.type!="function");n||t.__e==null||Pe(t.__e),t.__=t.__e=t.__d=void 0}function je(t,e,n){return this.constructor(t,n)}function Ke(t,e,n){var r,i,_,c;a.__&&a.__(t,e),i=(r=typeof n=="function")?null:n&&n.__k||e.__k,_=[],c=[],_e(e,t=(!r&&n||e).__k=B(J,null,[t]),i||I,I,e.ownerSVGElement!==void 0,!r&&n?[n]:i?null:e.firstChild?F.call(e.childNodes):null,_,!r&&n?n:i?i.__e:e.firstChild,r,c),we(_,t,c)}function se(t,e,n){var r,i,_,c,l=P({},t.props);for(_ in t.type&&t.type.defaultProps&&(c=t.type.defaultProps),e)_=="key"?r=e[_]:_=="ref"?i=e[_]:l[_]=e[_]===void 0&&c!==void 0?c[_]:e[_];return arguments.length>2&&(l.children=arguments.length>3?F.call(arguments,2):n),R(t.type,l,r||t.key,i||t.ref,null)}function Ie(t,e){var n={__c:e="__cC"+Ee++,__:t,Consumer:function(r,i){return r.children(i)},Provider:function(r){var i,_;return this.getChildContext||(i=[],(_={})[e]=this,this.getChildContext=function(){return _},this.shouldComponentUpdate=function(c){this.props.value!==c.value&&i.some(function(l){l.__e=!0,ee(l)})},this.sub=function(c){i.push(c);var l=c.componentWillUnmount;c.componentWillUnmount=function(){i.splice(i.indexOf(c),1),l&&l.call(c)}}),r.children}};return n.Provider.__=n.Consumer.contextType=n}F=$e.slice,a={__e:function(t,e,n,r){for(var i,_,c;e=e.__;)if((i=e.__c)&&!i.__)try{if((_=i.constructor)&&_.getDerivedStateFromError!=null&&(i.setState(_.getDerivedStateFromError(t)),c=i.__d),i.componentDidCatch!=null&&(i.componentDidCatch(t,r||{}),c=i.__d),c)return i.__E=i}catch(l){t=l}throw t}},Se=0,W.prototype.setState=function(t,e){var n;n=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=P({},this.state),typeof t=="function"&&(t=t(P({},n),this.props)),t&&P(n,t),t!=null&&this.__v&&(e&&this._sb.push(e),ee(this))},W.prototype.forceUpdate=function(t){this.__v&&(this.__e=!0,t&&this.__h.push(t),ee(this))},W.prototype.render=J,L=[],Ce=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,Z=function(t,e){return t.__v.__b-e.__v.__b},j.__r=0,Ee=0;var N,k,X,fe,D=0,Be=[],q=[],ae=a.__b,he=a.__r,de=a.diffed,pe=a.__c,me=a.unmount;function V(t,e){a.__h&&a.__h(k,t,D||e),D=0;var n=k.__H||(k.__H={__:[],__h:[]});return t>=n.__.length&&n.__.push({__V:q}),n.__[t]}function Y(t){return D=1,oe(De,t)}function oe(t,e,n){var r=V(N++,2);if(r.t=t,!r.__c&&(r.__=[n?n(e):De(void 0,e),function(l){var s=r.__N?r.__N[0]:r.__[0],y=r.t(s,l);s!==y&&(r.__N=[y,r.__[1]],r.__c.setState({}))}],r.__c=k,!k.u)){var i=function(l,s,y){if(!r.__c.__H)return!0;var m=r.__c.__H.__.filter(function(h){return h.__c});if(m.every(function(h){return!h.__N}))return!_||_.call(this,l,s,y);var o=!1;return m.forEach(function(h){if(h.__N){var f=h.__[0];h.__=h.__N,h.__N=void 0,f!==h.__[0]&&(o=!0)}}),!(!o&&r.__c.props===l)&&(!_||_.call(this,l,s,y))};k.u=!0;var _=k.shouldComponentUpdate,c=k.componentWillUpdate;k.componentWillUpdate=function(l,s,y){if(this.__e){var m=_;_=void 0,i(l,s,y),_=m}c&&c.call(this,l,s,y)},k.shouldComponentUpdate=i}return r.__N||r.__}function Ne(t,e){var n=V(N++,4);!a.__s&&Ae(n.__H,e)&&(n.__=t,n.i=e,k.__h.push(n))}function H(t){return D=5,Q(function(){return{current:t}},[])}function Q(t,e){var n=V(N++,7);return Ae(n.__H,e)?(n.__V=t(),n.i=e,n.__h=t,n.__V):n.__}function ze(t,e){return D=8,Q(function(){return t},e)}function Re(t){var e=k.context[t.__c],n=V(N++,9);return n.c=t,e?(n.__==null&&(n.__=!0,e.sub(k)),e.props.value):t.__}function Je(){for(var t;t=Be.shift();)if(t.__P&&t.__H)try{t.__H.__h.forEach(G),t.__H.__h.forEach(ne),t.__H.__h=[]}catch(e){t.__H.__h=[],a.__e(e,t.__v)}}a.__b=function(t){k=null,ae&&ae(t)},a.__r=function(t){he&&he(t),N=0;var e=(k=t.__c).__H;e&&(X===k?(e.__h=[],k.__h=[],e.__.forEach(function(n){n.__N&&(n.__=n.__N),n.__V=q,n.__N=n.i=void 0})):(e.__h.forEach(G),e.__h.forEach(ne),e.__h=[],N=0)),X=k},a.diffed=function(t){de&&de(t);var e=t.__c;e&&e.__H&&(e.__H.__h.length&&(Be.push(e)!==1&&fe===a.requestAnimationFrame||((fe=a.requestAnimationFrame)||Ve)(Je)),e.__H.__.forEach(function(n){n.i&&(n.__H=n.i),n.__V!==q&&(n.__=n.__V),n.i=void 0,n.__V=q})),X=k=null},a.__c=function(t,e){e.some(function(n){try{n.__h.forEach(G),n.__h=n.__h.filter(function(r){return!r.__||ne(r)})}catch(r){e.some(function(i){i.__h&&(i.__h=[])}),e=[],a.__e(r,n.__v)}}),pe&&pe(t,e)},a.unmount=function(t){me&&me(t);var e,n=t.__c;n&&n.__H&&(n.__H.__.forEach(function(r){try{G(r)}catch(i){e=i}}),n.__H=void 0,e&&a.__e(e,n.__v))};var ve=typeof requestAnimationFrame=="function";function Ve(t){var e,n=function(){clearTimeout(r),ve&&cancelAnimationFrame(e),setTimeout(t)},r=setTimeout(n,100);ve&&(e=requestAnimationFrame(n))}function G(t){var e=k,n=t.__c;typeof n=="function"&&(t.__c=void 0,n()),k=e}function ne(t){var e=k;t.__c=t.__(),k=e}function Ae(t,e){return!t||t.length!==e.length||e.some(function(n,r){return n!==t[r]})}function De(t,e){return typeof e=="function"?e(t):e}let w;const Qe=(t,e)=>{if(w=void 0,e&&e.type==="click"){if(e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||e.button!==0)return t;const n=e.target.closest("a[href]");if(!n||n.origin!=location.origin||/^#/.test(n.getAttribute("href"))||!/^(_?self)?$/i.test(n.target))return t;w=!0,e.preventDefault(),e=n.href.replace(location.origin,"")}else typeof e=="string"?w=!0:e=location.pathname+location.search;return w===!0?history.pushState(null,"",e):w===!1&&history.replaceState(null,"",e),e},Xe=(t,e,n)=>{t=t.split("/").filter(Boolean),e=(e||"").split("/").filter(Boolean);for(let r=0,i,_;r<Math.max(t.length,e.length);r++){let[,c,l,s]=(e[r]||"").match(/^(:?)(.*?)([+*?]?)$/);if(i=t[r],!(!c&&l==i)){if(!c&&i&&s=="*"){n.rest="/"+t.slice(r).map(decodeURIComponent).join("/");break}if(!c||!i&&s!="?"&&s!="*")return;if(_=s=="+"||s=="*",_?i=t.slice(r).map(decodeURIComponent).join("/"):i&&(i=decodeURIComponent(i)),n.params[l]=i,l in n||(n[l]=i),_)break}}return n};function O(t){const[e,n]=oe(Qe,t.url||location.pathname+location.search),r=w===!0,i=Q(()=>{const _=new URL(e,location.origin),c=_.pathname.replace(/(.)\/$/g,"$1");return{url:e,path:c,query:Object.fromEntries(_.searchParams),route:n,wasPush:r}},[e]);return Ne(()=>(addEventListener("click",n),addEventListener("popstate",n),()=>{removeEventListener("click",n),removeEventListener("popstate",n)}),[]),B(O.ctx.Provider,{value:i},t.children)}const Ye=Promise.resolve();function Fe(t){const[e,n]=oe(v=>v+1,0),{url:r,query:i,wasPush:_,path:c}=Oe(),{rest:l=c,params:s={}}=Re(ge),y=H(!1),m=H(c),o=H(0),h=H(),f=H(),u=H(),p=H(!1),$=H();$.current=!1,h.current=Q(()=>{this.__v&&this.__v.__k&&this.__v.__k.reverse(),o.current++,f.current=h.current;let v,C,S;return Ue(t.children).some(b=>{if(Xe(l,b.props.path,S={path:l,query:i,params:s,rest:""}))return v=se(b,S);b.props.default&&(C=se(b,S))}),B(ge.Provider,{value:S},v||C)},[r]);const g=f.current;return f.current=null,this.__c=v=>{$.current=!0,f.current=g,t.onLoadStart&&t.onLoadStart(r),y.current=!0;let C=o.current;v.then(()=>{C===o.current&&(f.current=null,Ye.then(n))})},Ne(()=>{const v=this.__v&&this.__v.__e;if($.current){!p.current&&!u.current&&(u.current=v);return}!p.current&&u.current&&(u.current!==v&&u.current.remove(),u.current=null),p.current=!0,m.current!==c&&(_&&scrollTo(0,0),t.onLoadEnd&&y.current&&t.onLoadEnd(r),t.onRouteChange&&t.onRouteChange(r),y.current=!1,m.current=c)},[c,_,e]),[B(ye,{r:h}),B(ye,{r:f})]}const ye=({r:t})=>t.current;Fe.Provider=O;O.ctx=Ie({});const ge=Ie({}),be=t=>B(t.component,t),Oe=()=>Re(O.ctx),ke=a.__e;a.__e=(t,e,n)=>{if(t&&t.then){let r=e;for(;r=r.__;)if(r.__c&&r.__c.__c)return e.__e==null&&(e.__e=n.__e,e.__k=n.__k),e.__k||(e.__k=[]),r.__c.__c(t,e)}ke&&ke(t,e,n)};const Ze=""+new URL("domino-e65ff0a1.svg",import.meta.url).href;var et=0;function d(t,e,n,r,i,_){var c,l,s={};for(l in e)l=="ref"?c=e[l]:s[l]=e[l];var y={type:t,props:s,key:n,ref:c,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:--et,__source:i,__self:_};if(typeof t=="function"&&(c=t.defaultProps))for(l in c)s[l]===void 0&&(s[l]=c[l]);return a.vnode&&a.vnode(y),y}function tt(){return Oe(),d("header",{children:[d("div",{class:"headerLogo",children:d("img",{src:Ze,alt:"Juega ke perdiste! logo",height:"",width:"90"})}),d("div",{class:"headerTitle",children:d("h4",{children:"Juega ke perdiste!"})})]})}function nt(){const[t,e]=Y([]),[n,r]=Y(0),[i,_]=Y(0),c=ze((h,f)=>{t.push({them:parseInt(h),us:parseInt(f)}),e(t),l(),document.getElementById("them").value="",document.getElementById("us").value=""},[]);function l(){let h=0,f=0;t.forEach(u=>{h+=u.them,f+=u.us}),r(h),_(f)}function s(h){let f=m()?m():0,u=o()?o():0;console.log("themInputScore: "+f),console.log("usInputScore: "+u),(f>0||u>0)&&c(f,u)}function y(h){t.length=0,r(0),_(0)}function m(){return document.getElementById("them").value}function o(){return document.getElementById("us").value}return d("div",{class:"home",children:d("section",{children:d("table",{class:"gameHands",children:[d("thead",{children:d("tr",{children:[d("th",{children:"Them"}),d("th",{children:"Us"}),d("th",{children:d("button",{type:"submit",class:"newGameButton",onClick:y,children:"New Game!"})})]})}),d("tbody",{children:[t.map(h=>d("tr",{children:[d("td",{children:h.them}),d("td",{children:h.us}),d("td",{})]})),d("tr",{children:[d("td",{children:d("input",{type:"number",id:"them",name:"them",placeholder:"0",min:"0",max:"168"})}),d("td",{children:d("input",{type:"number",id:"us",name:"us",placeholder:"0",min:"0",max:"168"})}),d("td",{children:d("button",{type:"submit",class:"addHandButton",onClick:s,children:"Add"})})]})]}),d("tfoot",{children:d("tr",{children:[d("th",{children:n}),d("th",{children:i}),d("th",{})]})})]})})})}function _t(){return d("section",{children:[d("h1",{children:"404: Not Found"}),d("p",{children:"It's gone :("})]})}function rt(){return d(O,{children:[d(tt,{}),d("main",{children:d(Fe,{children:[d(be,{default:!0,path:"/",component:nt}),d(be,{component:_t})]})})]})}Ke(d(rt,{}),document.getElementById("app"));
