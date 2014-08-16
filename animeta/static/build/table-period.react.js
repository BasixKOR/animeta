webpackJsonp([2],{0:function(e,t,n){function r(){return"/login/?next="+encodeURIComponent(location.pathname)}function o(e){return[!e,e]}function i(e){"use strict";p.call(this),this.$ScheduleStore_items=e.items,this.$ScheduleStore_ordering=window.localStorage["animeta.table."+PERIOD+".ordering"]||"schedule",this.$ScheduleStore_containsKRSchedule=e.contains_kr_schedule,this.$ScheduleStore_sort()}function a(e){var t=e.split("Q"),n=t[0],r=t[1];return n+"년 "+[1,4,7,10][r-1]+"월"}function s(e){var t=WEEKDAYS[e.getDay()];return l.zerofill(e.getMonth()+1)+"/"+l.zerofill(e.getDate())+" ("+t+")"}function u(){return{items:C.getAllItems(),ordering:C.getOrdering(),excludeKR:!C.containsKRSchedule()}}var c=n(27),l=n(36),p=n(34),d=n(35);n(167);var h=l.keyComparator(function(e){return o(e.schedule.jp&&e.schedule.jp.date)}),f=l.keyComparator(function(e){return o(e.schedule.kr&&e.schedule.kr.date||e.schedule.jp&&e.schedule.jp.date)}),m=l.keyComparator(function(e){return-e.record_count}),v={schedule:h,"schedule.kr":f,recordCount:m};for(var g in p)p.hasOwnProperty(g)&&(i[g]=p[g]);var y=null===p?null:p.prototype;i.prototype=Object.create(y),i.prototype.constructor=i,i.__superConstructor__=p,i.prototype.getAllItems=function(){"use strict";return this.$ScheduleStore_items},i.prototype.getOrdering=function(){"use strict";return this.$ScheduleStore_ordering},i.prototype.setOrdering=function(e){"use strict";this.$ScheduleStore_ordering=e,window.localStorage["animeta.table."+PERIOD+".ordering"]=e,this.$ScheduleStore_sort(),this.emitChange()},i.prototype.$ScheduleStore_sort=function(){"use strict";this.$ScheduleStore_items.sort(v[this.$ScheduleStore_ordering])},i.prototype.containsKRSchedule=function(){"use strict";return this.$ScheduleStore_containsKRSchedule},i.prototype.favoriteItem=function(e){"use strict";return $.post("/api/v1/records",{work:e.title,status_type:"interested"}).then(function(t){e.record={id:t.record_id},e.record_count++,this.emitChange({event:"favorite-added",title:e.title})}.bind(this))};var C=new i(APP_DATA),b=c.createClass({displayName:"HeaderView",render:function(){var e,t=a(this.props.period);e=this.props.excludeKR?[{value:"schedule",label:"날짜"},{value:"recordCount",label:"인기"}]:[{value:"schedule",label:"날짜 (日)"},{value:"schedule.kr",label:"날짜 (韓)"},{value:"recordCount",label:"인기"}];var n=e.map(function(e){return c.DOM.span({className:this.props.ordering==e.value?"active":"",key:e.value,onClick:function(){return C.setOrdering(e.value)}},e.label)}.bind(this));return c.DOM.div({className:"page-header"},c.DOM.div({className:"settings"},c.DOM.div({className:"settings-item prefer-kr"},c.DOM.label(null,"정렬: "),c.DOM.div({className:"switch"},n))),c.DOM.h1({className:"page-title"},t," 신작"))}});SOURCE_TYPE_MAP={manga:"만화 원작",original:"오리지널",lightnovel:"라노베 원작",game:"게임 원작","4koma":"4컷 만화 원작",visualnovel:"비주얼 노벨 원작",novel:"소설 원작"},WEEKDAYS=["일","월","화","수","목","금","토"];var E=c.createClass({displayName:"FavButton",render:function(){return c.DOM.label({className:"btn-fav"+(this.props.active?" active":""),onClick:this.props.onClick},c.DOM.i({className:"fa fa-check"})," "+this.props.count)}}),x=c.createClass({displayName:"ItemView",render:function(){var e=this.props.item;return c.DOM.div({className:"item"},c.DOM.div({className:"item-inner"},c.DOM.div({className:"item-poster-wrap"},d({src:e.image_url,width:233,height:318,className:"item-poster"})),c.DOM.div({dangerouslySetInnerHTML:{__html:x.template(this.getTemplateContext())}}),c.DOM.div({className:"item-actions"},E({active:null!=e.record,count:e.record_count,onClick:this.handleFavButtonClick}))))},handleFavButtonClick:function(){if(!USERNAME)return alert("로그인 후 관심 등록할 수 있습니다."),void(location.href=r());var e=this.props.item.record;e?window.open("/records/"+e.id+"/"):C.favoriteItem(this.props.item)},getTemplateContext:function(){var e=l.deepCopy(this.props.item);return e.studios&&(e.studios=e.studios.join(", ")),e.source&&(e.source=SOURCE_TYPE_MAP[e.source]),e.schedule.jp||(e.schedule.jp={}),["jp","kr"].forEach(function(t){var n=e.schedule[t];if(n){var r=n.date;r&&(r=new Date(r),n.date=s(r),n.time=l.formatTime(r)),n.broadcasts&&(n.broadcasts=n.broadcasts.join(", "))}}),e},statics:{template:Handlebars.compile($("#template-item-info").html())}}),D=c.createClass({displayName:"NotificationView",getInitialState:function(){return{hidden:!0}},componentWillUnmount:function(){this.state.timer&&clearTimeout(this.state.timer)},show:function(e,t){var n={message:e,hidden:!1};this.state.timer&&clearTimeout(this.state.timer),t&&(n.timer=setTimeout(function(){return this.setState({hidden:!0})}.bind(this),t)),this.setState(n)},render:function(){return c.DOM.div({className:"panel"+(this.state.hidden?" hidden":"")},c.DOM.div({className:"panel-inner"},this.state.message))}}),M=c.createClass({displayName:"AppView",getInitialState:function(){return u()},componentDidMount:function(){C.addChangeListener(this._onChange),USERNAME||this.refs.notification.show(["관심 등록은 로그인 후 가능합니다. ",c.DOM.a({href:r(),className:"btn btn-login"},"로그인")])},componentWillUnmount:function(){C.removeChangeListener(this._onChange)},render:function(){return c.DOM.div(null,b({period:this.props.period,ordering:this.state.ordering,excludeKR:this.state.excludeKR}),c.DOM.div({className:"items"},this.state.items.map(function(e){return x({item:e,key:e.id})})),D({ref:"notification"}))},_onChange:function(e){this.setState(u()),e&&"favorite-added"==e.event&&this.refs.notification.show(["관심 등록 완료 — ",c.DOM.b(null,e.title)],3e3)}});c.renderComponent(M({period:PERIOD}),$(".anitable-container")[0])},34:function(e){function t(){"use strict";this.$BaseStore_listeners=[]}t.prototype.addChangeListener=function(e){"use strict";this.$BaseStore_listeners.push(e)},t.prototype.removeChangeListener=function(e){"use strict";this.$BaseStore_listeners=this.$BaseStore_listeners.filter(function(t){return t!=e})},t.prototype.emitChange=function(e){"use strict";this.$BaseStore_listeners.forEach(function(t){return t(e)})},e.exports=t},35:function(e,t,n){function r(){this.invalidation||(this.invalidation=setTimeout(function(){a.revalidate(),this.invalidation=null}.bind(this),0))}var o=n(27),i="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",a=null;/i(Phone|Pad|Pod)|Android|Safari/.test(navigator.userAgent)||(document.documentElement.className+=" b-fade",a=new Blazy);var s=a?o.createClass({render:function(){return this.transferPropsTo(o.DOM.img({src:i,"data-src":this.props.src,width:this.props.width,height:this.props.height,className:"b-lazy"}))},componentDidMount:function(){r()},componentDidUpdate:function(){r()}}):o.DOM.img;e.exports=s},36:function(e){e.exports.keyComparator=function(e){return function(t,n){return t=e(t),n=e(n),n>t?-1:t>n?1:0}},e.exports.zerofill=zerofill=function(e){return e=String(e),1==e.length&&(e="0"+e),e},e.exports.getTime=function(e){return zerofill(e.getHours())+":"+zerofill(e.getMinutes())};for(var t=[],n=0;24>n;n++){var r;r=12>n?"오전 "+n+"시":12==n?"정오":"오후 "+(n-12)+"시",t[n]=r}e.exports.formatTime=function(e){var n=t[e.getHours()],r=e.getMinutes();return r>0&&(n+=" "+zerofill(r)+"분"),n},e.exports.debounce=function(e,t){var n;return function(){var r=this;n&&clearTimeout(n),n=setTimeout(function(){e.call(r),n=null},t)}},e.exports.deepCopy=function(e){return $.extend(!0,{},e)}},53:function(e){e.exports=function(e){var t=document.createElement("style");t.type="text/css";var n=document.getElementsByTagName("head")[0];return n.appendChild(t),t.styleSheet?t.styleSheet.cssText=e:t.appendChild(document.createTextNode(e)),function(){n.removeChild(t)}}},90:function(e,t,n){e.exports='#content{width:auto;padding:0}#nav{display:none}.anitable-container{color:#444;font-size:14px;line-height:1;max-width:962px;margin:20px auto;padding:0 10px}.anitable-container a{color:#666}.anitable-container form{margin:0}.page-title{font-size:20px;text-align:center;margin:0}.page-header{margin:0 0 20px;position:relative}.page-header .settings{position:absolute;right:0}.page-header .settings-item{float:left;margin-left:10px}.settings .switch{border:1px solid #27ae60;line-height:20px;display:inline-block}.settings .switch span{padding:0 5px;color:#666;display:inline-block;cursor:pointer}.settings .switch span:hover{color:#27ae60}.settings .switch .active{font-weight:700;background-color:#27ae60;color:#fff!important}.settings span:not(.active){position:relative}.settings span:not(.active):after{content:"";position:absolute;top:-12px;left:-12px;right:-12px;bottom:-12px}.items{clear:both;margin-left:-10px;overflow:hidden}.item{float:left;margin-bottom:10px;width:25%}.item-inner{margin-left:10px;position:relative;overflow:hidden;background:#2c3e50}.item-poster{display:block;width:100%;height:auto;position:absolute;top:0}.item-poster-wrap:before{content:"";display:block;padding-top:136.4806867%}.item-poster-wrap{position:relative;margin-bottom:34px}.b-fade .item-poster{opacity:0;transition:opacity 500ms ease-in-out 100ms;backface-visibility:hidden}.b-fade .item-poster.b-loaded{opacity:1}.item-frame{top:0;bottom:34px;box-shadow:inset 0 0 5px rgba(0,0,0,.25)}.item-frame,.item-overlay{position:absolute;left:0;right:0}.item-overlay{padding:12px 10px;bottom:0;color:#fff;background:#000;background:rgba(0,0,0,.8)}html.cssgradients .item-overlay{padding-top:40px;background:-webkit-linear-gradient(rgba(0,0,0,0)0,rgba(0,0,0,.65)50%,rgba(0,0,0,.9)100%);background:linear-gradient(rgba(0,0,0,0)0,rgba(0,0,0,.65)50%,rgba(0,0,0,.9)100%)}.item-actions{position:absolute;top:0;right:0;padding:10px}.item-actions .btn-fav{cursor:pointer}.btn-fav{display:block;height:32px;line-height:32px;text-align:center;border-radius:999em;padding:0 8px;text-decoration:none;box-shadow:0 2px 8px #222;font-size:18px;background:#fff;color:#444;border:3px solid #fff;transition:background-color .1s ease,border-color .1s ease,color .1s ease;position:relative}.btn-fav:hover{border-color:#27ae60}.btn-fav:active,.btn-fav.active{border-color:#27ae60;color:#fff;background-color:#27ae60}.btn-fav input{position:absolute;opacity:0;filter:alpha(opacity=0);cursor:pointer;pointer-events:none}html.touch .btn-fav{position:relative}html.touch .btn-fav:after{content:"";position:absolute;top:-12px;left:-12px;right:-12px;bottom:-12px}.item-links{position:absolute;left:0;right:0;bottom:0;height:33px;line-height:33px;text-align:center;background-color:#e8e8e8;border:1px solid #bbb;border-top:0}.item-links .link{font-size:12px;color:#444;text-decoration:none;margin-right:10px}.item-links .link:hover{text-decoration:underline}.item-links .link:last-child{margin-right:0}.item-title{font-size:16px;text-shadow:0 1px 0 #000;margin:0;line-height:1.2;padding-bottom:7px}.item-info{font-size:13px;color:#ddd;padding-bottom:10px}.item-info .studio,.item-info .source{white-space:nowrap}.item-schedule{font-size:13px;color:#fff;padding-bottom:2px}.item-schedule .date{font-weight:700;margin-right:2px}.item-schedule .broadcasts{color:#ccc;font-size:12px;white-space:nowrap}.item-schedule-jp:before{content:"";background:url('+n(91)+') left center no-repeat;background-size:16px 16px;padding-left:22px}.item-schedule-kr{padding-top:7px}.item-schedule-kr:before{content:"";background:url('+n(92)+") left center no-repeat;background-size:16px 16px;padding-left:22px}.panel-inner{max-width:962px;margin:0 auto}.panel{box-shadow:0 2px 8px #222;background:#27ae60;background:rgba(39,174,96,.95);padding:30px 10px;position:fixed;left:0;right:0;bottom:0;color:#fff;font-size:20px;text-align:center;transition:opacity 250ms ease,bottom 250ms ease;opacity:1}.panel.hidden{bottom:-100px;opacity:0}.panel .btn{display:inline-block;border-radius:5px;padding:10px 20px;text-decoration:none;font-size:16px;cursor:pointer;background:#fff;color:#444;border:3px solid #fff;transition:background-color .1s ease,border-color .1s ease,color .1s ease}.panel .btn:hover{border-color:#34495e}.panel .btn:active,.panel .btn.active{border-color:#34495e;color:#fff;background-color:#34495e}@media screen and (max-width:960px){.item{width:33.3333%}}@media screen and (max-width:640px){.page-title{text-align:left}.item{width:50%}.item-title{letter-spacing:-1px;font-size:15px}.item-info{font-size:12px}.item-schedule{letter-spacing:-1px}.item-schedule .broadcasts{display:none}.item-schedule-kr .broadcasts{display:inline}.panel{padding:20px 10px;font-size:16px;font-weight:700;line-height:1.5}.btn-fav,.btn-login{transition:none}}"},91:function(e,t,n){e.exports=n.p+"6a2cd71e1695e248f7500f7740bc2dbb.png"},92:function(e,t,n){e.exports=n.p+"882cfc5614e6f161bce888e08d4f9756.png"},167:function(e,t,n){n(53)(n(90))}});