webpackJsonp([2],{341:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var u=n(206),r=o(u),l=n(17),a=o(l),c=n(20),i=o(c),f=n(18),s=o(f),d=n(19),p=o(d),_=n(1),m=o(_),h=n(61),v=function(e){function t(e){(0,a.default)(this,t);var n=(0,s.default)(this,(t.__proto__||(0,r.default)(t)).call(this,e));return n.toLearner=function(){n.props.history.replace("/")},console.log("window:",window),n}return(0,p.default)(t,e),(0,i.default)(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){return console.log("登录页信息:",this.props),m.default.createElement("div",{className:"login-box"},"这里是登录页面 ,",m.default.createElement("a",{onClick:this.toLearner},"已登录"))}}]),t}(_.Component),w=function(e){return{userInfo:e.common.userInfo}};t.default=(0,h.connect)(w)(v),e.exports=t.default}});