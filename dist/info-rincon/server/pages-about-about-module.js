exports.ids=[7],exports.modules={UoYK:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"AboutModule",function(){return AboutModule});var shared_module=__webpack_require__("PCNd"),router=__webpack_require__("tyNb"),core=__webpack_require__("fXoL"),section_header_component=__webpack_require__("PdlT");class AboutComponent{constructor(){}ngOnInit(){}}AboutComponent.\u0275fac=function AboutComponent_Factory(t){return new(t||AboutComponent)},AboutComponent.\u0275cmp=core.Kc({type:AboutComponent,selectors:[["app-about"]],decls:3,vars:1,consts:[[3,"title"],[1,"section-wrapper"]],template:function AboutComponent_Template(rf,ctx){1&rf&&(core.Rc(0,"app-section-header",0),core.Wc(1,"div",1),core.Kd(2," Esta es una WebApp desarrollada para el Ayuntamiento de Rinc\xf3n de Soto\n"),core.Vc()),2&rf&&core.od("title","Acerca de La Agenda Rinconera")},directives:[section_header_component.a],styles:[""]});const routes=[{path:"",component:AboutComponent}];class AboutRoutingModule{}AboutRoutingModule.\u0275mod=core.Oc({type:AboutRoutingModule}),AboutRoutingModule.\u0275inj=core.Nc({factory:function AboutRoutingModule_Factory(t){return new(t||AboutRoutingModule)},imports:[[router.e.forChild(routes)],router.e]});class AboutModule{}AboutModule.\u0275mod=core.Oc({type:AboutModule}),AboutModule.\u0275inj=core.Nc({factory:function AboutModule_Factory(t){return new(t||AboutModule)},imports:[[AboutRoutingModule,shared_module.a]]})}};