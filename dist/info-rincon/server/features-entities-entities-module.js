exports.ids=[1],exports.modules={MXrR:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"EntitiesModule",function(){return EntitiesModule});var common=__webpack_require__("ofXK"),fesm2015_router=__webpack_require__("tyNb"),paginator=__webpack_require__("M9IT"),sort=__webpack_require__("Dh3D"),table=__webpack_require__("+0xr"),map=__webpack_require__("lJxs"),sweetalert2_all=__webpack_require__("PSD3"),sweetalert2_all_default=__webpack_require__.n(sweetalert2_all),core=__webpack_require__("fXoL"),log_service=__webpack_require__("oQ8E"),entities_service=__webpack_require__("c72l"),spinner_service=__webpack_require__("+YuW"),section_header_component=__webpack_require__("PdlT"),form_field=__webpack_require__("kmnG"),input=__webpack_require__("qFsG"),icon=__webpack_require__("NFeN"),fesm2015_button=__webpack_require__("bTqV");function EntitiesComponent_th_16_Template(rf,ctx){1&rf&&(core.Wc(0,"th",30),core.Kd(1,"Rol"),core.Vc())}function EntitiesComponent_td_17_Template(rf,ctx){if(1&rf&&(core.Wc(0,"td",31),core.Wc(1,"div",32),core.Kd(2),core.Vc(),core.Vc()),2&rf){const entity_r20=ctx.$implicit;core.Ec(2),core.Ld(entity_r20.roleDefault)}}function EntitiesComponent_th_19_Template(rf,ctx){1&rf&&(core.Wc(0,"th",30),core.Kd(1,"Id."),core.Vc())}function EntitiesComponent_td_20_Template(rf,ctx){if(1&rf&&(core.Wc(0,"td",31),core.Kd(1),core.Vc()),2&rf){const entity_r21=ctx.$implicit;core.Ec(1),core.Ld(entity_r21.id)}}function EntitiesComponent_th_22_Template(rf,ctx){1&rf&&core.Rc(0,"th",33)}function EntitiesComponent_td_23_Template(rf,ctx){if(1&rf){const _r24=core.Xc();core.Wc(0,"td",34),core.Wc(1,"img",35),core.dd("click",function EntitiesComponent_td_23_Template_img_click_1_listener(){core.Bd(_r24);const element_r22=ctx.$implicit;return core.hd().gotoEntity(element_r22)}),core.Vc(),core.Vc()}if(2&rf){const element_r22=ctx.$implicit;core.Ec(1),core.od("src",element_r22.image,core.Dd)}}function EntitiesComponent_th_25_Template(rf,ctx){1&rf&&(core.Wc(0,"th",36),core.Kd(1,"Info de la entidad"),core.Vc())}function EntitiesComponent_td_26_Template(rf,ctx){if(1&rf){const _r27=core.Xc();core.Wc(0,"td",37),core.dd("click",function EntitiesComponent_td_26_Template_td_click_0_listener(){core.Bd(_r27);const item_r25=ctx.$implicit;return core.hd().gotoItem(item_r25)}),core.Wc(1,"div",38),core.Kd(2),core.Vc(),core.Kd(3),core.Wc(4,"div",39),core.Kd(5),core.Vc(),core.Vc()}if(2&rf){const item_r25=ctx.$implicit;core.Ec(2),core.Md(" ",item_r25.description," "),core.Ec(1),core.Md(" ",item_r25.name," "),core.Ec(2),core.Md(" ",null==item_r25||null==item_r25.place?null:item_r25.place.name," ")}}function EntitiesComponent_th_28_Template(rf,ctx){1&rf&&(core.Wc(0,"th",40),core.Kd(1,"Nombre de la entidad"),core.Vc())}function EntitiesComponent_td_29_Template(rf,ctx){if(1&rf&&(core.Wc(0,"td",31),core.Kd(1),core.Vc()),2&rf){const entity_r28=ctx.$implicit;core.Ec(1),core.Ld(entity_r28.name)}}function EntitiesComponent_th_31_Template(rf,ctx){1&rf&&(core.Wc(0,"th",40),core.Kd(1,"Categor\xedas"),core.Vc())}function EntitiesComponent_td_32_Template(rf,ctx){if(1&rf&&(core.Wc(0,"td",31),core.Kd(1),core.Vc()),2&rf){const entity_r29=ctx.$implicit;core.Ec(1),core.Ld(entity_r29.description)}}function EntitiesComponent_th_34_Template(rf,ctx){1&rf&&core.Rc(0,"th",30)}function EntitiesComponent_td_35_img_1_Template(rf,ctx){if(1&rf&&core.Rc(0,"img",42),2&rf){const element_r30=core.hd().$implicit;core.od("src",null==element_r30||null==element_r30.place?null:element_r30.place.image,core.Dd)}}function EntitiesComponent_td_35_Template(rf,ctx){if(1&rf&&(core.Wc(0,"td",31),core.Id(1,EntitiesComponent_td_35_img_1_Template,1,1,"img",41),core.Vc()),2&rf){const element_r30=ctx.$implicit;core.Ec(1),core.od("ngIf",null==element_r30||null==element_r30.place?null:element_r30.place.image)}}function EntitiesComponent_th_37_Template(rf,ctx){1&rf&&(core.Wc(0,"th",30),core.Kd(1,"Lugar por defecto"),core.Vc())}function EntitiesComponent_td_38_Template(rf,ctx){if(1&rf&&(core.Wc(0,"td",31),core.Kd(1),core.Vc()),2&rf){const entity_r33=ctx.$implicit;core.Ec(1),core.Ld(null==entity_r33||null==entity_r33.place?null:entity_r33.place.name)}}function EntitiesComponent_th_40_Template(rf,ctx){1&rf&&(core.Wc(0,"th",43),core.Kd(1,"Acciones "),core.Vc())}function EntitiesComponent_td_41_Template(rf,ctx){if(1&rf){const _r36=core.Xc();core.Wc(0,"td",44),core.Wc(1,"button",45),core.dd("click",function EntitiesComponent_td_41_Template_button_click_1_listener(){core.Bd(_r36);const entity_r34=ctx.$implicit;return core.hd().gotoEntity(entity_r34)}),core.Wc(2,"mat-icon",46),core.Kd(3," remove_red_eye "),core.Vc(),core.Vc(),core.Wc(4,"button",47),core.dd("click",function EntitiesComponent_td_41_Template_button_click_4_listener(){core.Bd(_r36);const entity_r34=ctx.$implicit;return core.hd().editEntity(entity_r34)}),core.Wc(5,"mat-icon",48),core.Kd(6," build_circle "),core.Vc(),core.Vc(),core.Wc(7,"button",49),core.dd("click",function EntitiesComponent_td_41_Template_button_click_7_listener(){core.Bd(_r36);const entity_r34=ctx.$implicit;return core.hd().deleteEntity(entity_r34)}),core.Wc(8,"mat-icon",50),core.Kd(9," delete "),core.Vc(),core.Vc(),core.Vc()}}function EntitiesComponent_tr_42_Template(rf,ctx){1&rf&&core.Rc(0,"tr",51)}function EntitiesComponent_tr_43_Template(rf,ctx){1&rf&&core.Rc(0,"tr",52)}const _c0=function(){return[5,10,25,100]};class entities_component_EntitiesComponent{constructor(router,logSrv,entitySrv,spinnerSvc){this.router=router,this.logSrv=logSrv,this.entitySrv=entitySrv,this.spinnerSvc=spinnerSvc,this.listOfObservers=[],this.loading=!0,this.dataSource=new table.k,this.displayedColumns=["roleDefault","id","image","collapsed-info","name","categories","placeImage","placeName","actions3"],this.spinnerSvc.show()}ngOnInit(){const subs1$=this.entitySrv.getAllEntities().pipe(Object(map.a)(entities=>entities.map(entity=>(entity.description=entity.categories.reduce((acc,value)=>`${acc} ${value.substr(0,value.indexOf(" "))}`,""),Object.assign({},entity))))).subscribe(entities=>{this.entities=entities,this.dataSource=new table.k(this.entities),this.spinnerSvc.hide(),this.dataSource.paginator=this.paginator,this.dataSource.sort=this.sort});this.listOfObservers.push(subs1$)}applyFilter(filterValue){this.dataSource.filter=filterValue.trim().toLowerCase(),this.dataSource.paginator&&this.dataSource.paginator.firstPage()}gotoItem(entity){this.router.navigate([`entidades/${entity.id}`])}editEntity(entity){this.router.navigate([`entidades/${entity.id}/editar`])}deleteEntity(entity){this.logSrv.info(`Borrando ${entity.id}`),sweetalert2_all_default.a.fire({title:"\xbfEst\xe1s seguro?",text:"No podr\xe1s deshacer esta acci\xf3n de borrado!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"\xa1S\xed, b\xf3rralo!"}).then(result=>{result.isConfirmed&&(this.entitySrv.deleteEntity(entity),sweetalert2_all_default.a.fire("\xa1Borrado!",`${entity.name} ha sido borrado`,"success"))})}addItem(){this.router.navigate(["entidades/0/editar"])}ngOnDestroy(){this.listOfObservers.forEach(sub=>sub.unsubscribe())}}entities_component_EntitiesComponent.\u0275fac=function EntitiesComponent_Factory(t){return new(t||entities_component_EntitiesComponent)(core.Qc(fesm2015_router.b),core.Qc(log_service.a),core.Qc(entities_service.a),core.Qc(spinner_service.a))},entities_component_EntitiesComponent.\u0275cmp=core.Kc({type:entities_component_EntitiesComponent,selectors:[["app-entities"]],viewQuery:function EntitiesComponent_Query(rf,ctx){if(1&rf&&(core.Od(paginator.a,1),core.Od(sort.a,1)),2&rf){let _t;core.yd(_t=core.ed())&&(ctx.paginator=_t.first),core.yd(_t=core.ed())&&(ctx.sort=_t.first)}},decls:45,vars:7,consts:[[3,"title"],[1,"section-wrapper"],[1,"section-list-options"],["matInput","","placeholder","Filtrar",3,"keyup"],["matSuffix",""],[1,"buttons"],["mat-mini-fab","",1,"btn-1",3,"click"],[1,"mat-elevation-z8"],["mat-table","","matSort","",3,"dataSource"],["matColumnDef","roleDefault"],["mat-header-cell","","class","td-extra-lg",4,"matHeaderCellDef"],["mat-cell","","class","td-extra-lg",4,"matCellDef"],["matColumnDef","id"],["matColumnDef","image"],["mat-header-cell","",4,"matHeaderCellDef"],["mat-cell","",4,"matCellDef"],["matColumnDef","collapsed-info"],["mat-header-cell","","class","td-collapsed-info","mat-sort-header","",4,"matHeaderCellDef"],["mat-cell","","class","td-collapsed-info",3,"click",4,"matCellDef"],["matColumnDef","name"],["mat-header-cell","","class","td-extra-lg","mat-sort-header","",4,"matHeaderCellDef"],["matColumnDef","categories"],["matColumnDef","placeImage"],["matColumnDef","placeName"],["matColumnDef","actions3"],["mat-header-cell","","class","td-extra-md",4,"matHeaderCellDef"],["mat-cell","","class","td-extra-md",4,"matCellDef"],["mat-header-row","",4,"matHeaderRowDef"],["mat-row","",4,"matRowDef","matRowDefColumns"],["showFirstLastButtons","",3,"pageSizeOptions","pageSize"],["mat-header-cell","",1,"td-extra-lg"],["mat-cell","",1,"td-extra-lg"],[1,"inside"],["mat-header-cell",""],["mat-cell",""],["alt","element.name",1,"img-thumbnail",3,"src","click"],["mat-header-cell","","mat-sort-header","",1,"td-collapsed-info"],["mat-cell","",1,"td-collapsed-info",3,"click"],[1,"full-inside"],[2,"font-size","smaller","color","gray"],["mat-header-cell","","mat-sort-header","",1,"td-extra-lg"],["class","img-thumbnail","alt","element?.place?.image",3,"src",4,"ngIf"],["alt","element?.place?.image",1,"img-thumbnail",3,"src"],["mat-header-cell","",1,"td-extra-md"],["mat-cell","",1,"td-extra-md"],["mat-icon-button","","matTooltip","Click to View",1,"iconbutton",3,"click"],["aria-label","View",1,"btn-1"],["mat-icon-button","","matTooltip","Click to Edit",1,"iconbutton",3,"click"],["aria-label","Edit",1,"btn-1"],["mat-icon-button","","matTooltip","Click to Delete",1,"iconbutton",3,"click"],["aria-label","Delete",1,"btn-1"],["mat-header-row",""],["mat-row",""]],template:function EntitiesComponent_Template(rf,ctx){1&rf&&(core.Rc(0,"app-section-header",0),core.Wc(1,"div",1),core.Wc(2,"div",2),core.Wc(3,"mat-form-field"),core.Wc(4,"mat-label"),core.Kd(5,"Filtro"),core.Vc(),core.Wc(6,"input",3),core.dd("keyup",function EntitiesComponent_Template_input_keyup_6_listener($event){return ctx.applyFilter($event.target.value)}),core.Vc(),core.Wc(7,"mat-icon",4),core.Kd(8,"search"),core.Vc(),core.Vc(),core.Wc(9,"div",5),core.Wc(10,"button",6),core.dd("click",function EntitiesComponent_Template_button_click_10_listener(){return ctx.addItem()}),core.Wc(11,"mat-icon"),core.Kd(12,"add"),core.Vc(),core.Vc(),core.Vc(),core.Vc(),core.Wc(13,"div",7),core.Wc(14,"table",8),core.Uc(15,9),core.Id(16,EntitiesComponent_th_16_Template,2,0,"th",10),core.Id(17,EntitiesComponent_td_17_Template,3,1,"td",11),core.Tc(),core.Uc(18,12),core.Id(19,EntitiesComponent_th_19_Template,2,0,"th",10),core.Id(20,EntitiesComponent_td_20_Template,2,1,"td",11),core.Tc(),core.Uc(21,13),core.Id(22,EntitiesComponent_th_22_Template,1,0,"th",14),core.Id(23,EntitiesComponent_td_23_Template,2,1,"td",15),core.Tc(),core.Uc(24,16),core.Id(25,EntitiesComponent_th_25_Template,2,0,"th",17),core.Id(26,EntitiesComponent_td_26_Template,6,3,"td",18),core.Tc(),core.Uc(27,19),core.Id(28,EntitiesComponent_th_28_Template,2,0,"th",20),core.Id(29,EntitiesComponent_td_29_Template,2,1,"td",11),core.Tc(),core.Uc(30,21),core.Id(31,EntitiesComponent_th_31_Template,2,0,"th",20),core.Id(32,EntitiesComponent_td_32_Template,2,1,"td",11),core.Tc(),core.Uc(33,22),core.Id(34,EntitiesComponent_th_34_Template,1,0,"th",10),core.Id(35,EntitiesComponent_td_35_Template,2,1,"td",11),core.Tc(),core.Uc(36,23),core.Id(37,EntitiesComponent_th_37_Template,2,0,"th",10),core.Id(38,EntitiesComponent_td_38_Template,2,1,"td",11),core.Tc(),core.Uc(39,24),core.Id(40,EntitiesComponent_th_40_Template,2,0,"th",25),core.Id(41,EntitiesComponent_td_41_Template,10,0,"td",26),core.Tc(),core.Id(42,EntitiesComponent_tr_42_Template,1,0,"tr",27),core.Id(43,EntitiesComponent_tr_43_Template,1,0,"tr",28),core.Vc(),core.Rc(44,"mat-paginator",29),core.Vc(),core.Vc()),2&rf&&(core.od("title","Panel de Configuraci\xf3n de Entidades"),core.Ec(14),core.od("dataSource",ctx.dataSource),core.Ec(28),core.od("matHeaderRowDef",ctx.displayedColumns),core.Ec(1),core.od("matRowDefColumns",ctx.displayedColumns),core.Ec(1),core.od("pageSizeOptions",core.pd(6,_c0))("pageSize",10))},directives:[section_header_component.a,form_field.c,form_field.g,input.b,icon.a,form_field.h,fesm2015_button.b,table.j,sort.a,table.c,table.e,table.b,table.g,table.i,paginator.a,table.d,table.a,sort.b,common.n,table.f,table.h],styles:[""]});var tap=__webpack_require__("vkgz"),models_entity=__webpack_require__("wVdn"),seo_service=__webpack_require__("KBIk"),card=__webpack_require__("Wp6s"),tabs=__webpack_require__("wZkO"),chips=__webpack_require__("A5z7");function EntityViewComponent_app_section_header_0_Template(rf,ctx){if(1&rf&&core.Rc(0,"app-section-header",4),2&rf){const entity_r4=ctx.ngIf;core.od("title",entity_r4.name+" | Entidad de Rinc\xf3n de Soto")}}function EntityViewComponent_mat_card_3_mat_chip_24_Template(rf,ctx){if(1&rf&&(core.Wc(0,"mat-chip"),core.Kd(1),core.Vc()),2&rf){const category_r8=ctx.$implicit;core.Ec(1),core.Ld(category_r8)}}function EntityViewComponent_mat_card_3_div_34_Template(rf,ctx){if(1&rf&&(core.Wc(0,"div",27),core.Rc(1,"img",28),core.Wc(2,"div"),core.Wc(3,"span",29),core.Kd(4,"Lugar por defecto"),core.Vc(),core.Rc(5,"br"),core.Wc(6,"span",30),core.Kd(7),core.Vc(),core.Vc(),core.Vc()),2&rf){const entity_r5=core.hd().ngIf;core.Ec(1),core.od("src",entity_r5.place.image,core.Dd)("alt",entity_r5.place.name),core.Ec(6),core.Ld(null==entity_r5.place?null:entity_r5.place.name)}}function EntityViewComponent_mat_card_3_Template(rf,ctx){if(1&rf){const _r11=core.Xc();core.Wc(0,"mat-card",5),core.Wc(1,"div",6),core.Wc(2,"div",7),core.Rc(3,"img",8),core.Vc(),core.Wc(4,"div",9),core.Wc(5,"mat-card-content"),core.Wc(6,"mat-tab-group"),core.Wc(7,"mat-tab",10),core.Wc(8,"mat-form-field",11),core.Rc(9,"input",12),core.Wc(10,"mat-icon",13),core.Kd(11,"check_circle_outline"),core.Vc(),core.Vc(),core.Wc(12,"mat-form-field",11),core.Rc(13,"input",14),core.Wc(14,"mat-icon",13),core.Kd(15,"assignment_ind"),core.Vc(),core.Vc(),core.Wc(16,"mat-form-field",11),core.Rc(17,"input",15),core.Wc(18,"mat-icon",13),core.Kd(19,"info"),core.Vc(),core.Vc(),core.Wc(20,"div",16),core.Wc(21,"span"),core.Kd(22,"Categor\xedas:"),core.Vc(),core.Wc(23,"mat-chip-list",17),core.Id(24,EntityViewComponent_mat_card_3_mat_chip_24_Template,2,1,"mat-chip",18),core.Vc(),core.Vc(),core.Vc(),core.Wc(25,"mat-tab",19),core.Wc(26,"mat-form-field",11),core.Rc(27,"input",20),core.Wc(28,"mat-icon",13),core.Kd(29,"manage_accounts"),core.Vc(),core.Vc(),core.Wc(30,"mat-form-field",11),core.Rc(31,"input",21),core.Wc(32,"mat-icon",13),core.Kd(33,"label"),core.Vc(),core.Vc(),core.Id(34,EntityViewComponent_mat_card_3_div_34_Template,8,3,"div",22),core.Vc(),core.Vc(),core.Vc(),core.Wc(35,"mat-card-actions",23),core.Wc(36,"button",24),core.dd("click",function EntityViewComponent_mat_card_3_Template_button_click_36_listener(){core.Bd(_r11);return core.hd().gotoList()}),core.Wc(37,"mat-icon"),core.Kd(38,"list"),core.Vc(),core.Vc(),core.Wc(39,"button",25),core.dd("click",function EntityViewComponent_mat_card_3_Template_button_click_39_listener(){core.Bd(_r11);return core.hd().editItem()}),core.Wc(40,"mat-icon"),core.Kd(41,"edit"),core.Vc(),core.Vc(),core.Wc(42,"a",26),core.Wc(43,"mat-icon"),core.Kd(44,"verified"),core.Vc(),core.Vc(),core.Vc(),core.Vc(),core.Vc(),core.Vc()}if(2&rf){const entity_r5=ctx.ngIf;core.Ec(3),core.od("src",entity_r5.image,core.Dd),core.Ec(6),core.od("value",entity_r5.active),core.Ec(4),core.od("value",entity_r5.name),core.Ec(4),core.od("value",entity_r5.description),core.Ec(7),core.od("ngForOf",entity_r5.categories),core.Ec(3),core.od("value",entity_r5.roleDefault),core.Ec(4),core.od("value",entity_r5.scheduleTypeDefault),core.Ec(3),core.od("ngIf",entity_r5.place)}}function EntityViewComponent_ng_template_5_Template(rf,ctx){1&rf&&core.Kd(0," No existe tal entidad\n")}class entity_view_component_EntityViewComponent{constructor(route,router,seo,entitiesSrv){this.route=route,this.router=router,this.seo=seo,this.entitiesSrv=entitiesSrv,this.entity$=null}ngOnInit(){this.idEntity=this.route.snapshot.paramMap.get("id"),this.idEntity&&this.getDetails(this.idEntity)}getDetails(idEntity){this.entity$=this.entitiesSrv.getOneEntity(idEntity).pipe(Object(tap.a)(entity=>this.seo.generateTags({title:`${entity.name} | Entidad de Rinc\xf3n de Soto`,description:entity.description,image:entity.image})))}gotoList(){this.router.navigate([`/${models_entity.a.PATH_URL}`])}editItem(){this.router.navigate([`/${models_entity.a.PATH_URL}/${this.idEntity}/editar`])}}entity_view_component_EntityViewComponent.\u0275fac=function EntityViewComponent_Factory(t){return new(t||entity_view_component_EntityViewComponent)(core.Qc(fesm2015_router.a),core.Qc(fesm2015_router.b),core.Qc(seo_service.a),core.Qc(entities_service.a))},entity_view_component_EntityViewComponent.\u0275cmp=core.Kc({type:entity_view_component_EntityViewComponent,selectors:[["app-entity-view"]],decls:7,vars:7,consts:[[3,"title",4,"ngIf"],[1,"section-wrapper"],["class","item-view",4,"ngIf","ngIfElse"],["noEntityTemplate",""],[3,"title"],[1,"item-view"],[1,"row"],[1,"col-lg-3","col-md-4","col-12",2,"text-align","center"],[1,"img-thumbnail",3,"src"],[1,"col-lg-9","col-md-8","col-12"],["label","Datos de entidad",1,"tab-card-detail"],[1,"card-detail"],["matInput","","type","text","disabled","true","placeholder","Activo",3,"value"],["matSuffix",""],["matInput","","type","text","disabled","true","placeholder","Nombre",3,"value"],["matInput","","type","text","disabled","true","placeholder","Descripci\xf3n",3,"value"],[1,"card-chip-list"],["aria-label","Categories"],[4,"ngFor","ngForOf"],["label","M\xe1s info",1,"tab-card-detail"],["matInput","","type","text","disabled","true","placeholder","Rol por defecto",3,"value"],["matInput","","type","text","disabled","true","placeholder","Tipo de acto",3,"value"],["class","card-detail-block",4,"ngIf"],[1,"buttons","buttons-center"],["mat-fab","",1,"btn-1",3,"click"],["mat-fab","",1,"btn-extra",3,"click"],["mat-fab","","href","https://cards-dev.twitter.com/validator","target","blank",1,"btn-extra"],[1,"card-detail-block"],[1,"img-thumbnail",3,"src","alt"],[1,"desc"],[1,"name"]],template:function EntityViewComponent_Template(rf,ctx){if(1&rf&&(core.Id(0,EntityViewComponent_app_section_header_0_Template,1,1,"app-section-header",0),core.id(1,"async"),core.Wc(2,"div",1),core.Id(3,EntityViewComponent_mat_card_3_Template,45,8,"mat-card",2),core.id(4,"async"),core.Vc(),core.Id(5,EntityViewComponent_ng_template_5_Template,1,0,"ng-template",null,3,core.Jd)),2&rf){const _r2=core.zd(6);core.od("ngIf",core.jd(1,3,ctx.entity$)),core.Ec(3),core.od("ngIf",core.jd(4,5,ctx.entity$))("ngIfElse",_r2)}},directives:[common.n,section_header_component.a,card.a,card.c,tabs.b,tabs.a,form_field.c,input.b,icon.a,form_field.h,chips.b,common.m,card.b,fesm2015_button.b,fesm2015_button.a,chips.a],pipes:[common.b],styles:[""]});var fesm2015_forms=__webpack_require__("3Pt+"),finalize=__webpack_require__("nYR2"),category_enum=__webpack_require__("7cQS"),base=__webpack_require__("u2ly"),entity_role_enum=__webpack_require__("Okl2"),shedule_type_enum=__webpack_require__("YKUt"),angular_fire_storage=__webpack_require__("fMxG"),places_service=__webpack_require__("HqbV"),slide_toggle=__webpack_require__("1jcm"),fesm2015_select=__webpack_require__("d3UM"),fesm2015_core=__webpack_require__("FKr1");function EntityEditComponent_mat_card_2_mat_option_22_Template(rf,ctx){if(1&rf&&(core.Wc(0,"mat-option",20),core.Kd(1),core.Vc()),2&rf){const category_r9=ctx.$implicit;core.od("value",category_r9),core.Ec(1),core.Ld(category_r9)}}function EntityEditComponent_mat_card_2_mat_option_29_Template(rf,ctx){if(1&rf&&(core.Wc(0,"mat-option",20),core.Kd(1),core.Vc()),2&rf){const place_r10=ctx.$implicit;core.od("value",place_r10),core.Ec(1),core.Md(" ",place_r10.name," ")}}function EntityEditComponent_mat_card_2_mat_option_35_Template(rf,ctx){if(1&rf&&(core.Wc(0,"mat-option",20),core.Kd(1),core.Vc()),2&rf){const rol_r12=ctx.$implicit;core.od("value",rol_r12),core.Ec(1),core.Md(" ",rol_r12," ")}}function EntityEditComponent_mat_card_2_mat_option_42_Template(rf,ctx){if(1&rf&&(core.Wc(0,"mat-option",20),core.Kd(1),core.Vc()),2&rf){const scheduleType_r13=ctx.$implicit;core.od("value",scheduleType_r13),core.Ec(1),core.Md(" ",scheduleType_r13," ")}}function EntityEditComponent_mat_card_2_Template(rf,ctx){if(1&rf){const _r15=core.Xc();core.Wc(0,"mat-card",5),core.Wc(1,"div",6),core.Wc(2,"div",7),core.Wc(3,"img",8),core.dd("click",function EntityEditComponent_mat_card_2_Template_img_click_3_listener(){core.Bd(_r15);return core.zd(5).click()}),core.Vc(),core.Wc(4,"input",9,10),core.dd("change",function EntityEditComponent_mat_card_2_Template_input_change_4_listener($event){core.Bd(_r15);return core.hd().uploadImage($event)}),core.Vc(),core.Rc(6,"hr"),core.Wc(7,"span",11),core.dd("click",function EntityEditComponent_mat_card_2_Template_span_click_7_listener(){core.Bd(_r15);return core.zd(5).click()}),core.Kd(8,"Clica en la imagen para cambiar la foto"),core.Vc(),core.Vc(),core.Wc(9,"div",12),core.Wc(10,"form",13),core.dd("ngSubmit",function EntityEditComponent_mat_card_2_Template_form_ngSubmit_10_listener(){core.Bd(_r15);return core.hd().onSaveForm()}),core.Wc(11,"mat-card-content"),core.Wc(12,"mat-slide-toggle",14),core.Kd(13,"Entidad activa"),core.Vc(),core.Wc(14,"mat-form-field",15),core.Wc(15,"mat-label"),core.Kd(16,"Nombre de la entidad"),core.Vc(),core.Rc(17,"input",16),core.Vc(),core.Wc(18,"mat-form-field",15),core.Wc(19,"mat-label"),core.Kd(20,"Categor\xedas"),core.Vc(),core.Wc(21,"mat-select",17),core.Id(22,EntityEditComponent_mat_card_2_mat_option_22_Template,2,2,"mat-option",18),core.Vc(),core.Vc(),core.Wc(23,"mat-form-field",15),core.Wc(24,"mat-label"),core.Kd(25,"Lugar por defecto"),core.Vc(),core.Wc(26,"mat-select",19),core.dd("selectionChange",function EntityEditComponent_mat_card_2_Template_mat_select_selectionChange_26_listener($event){core.Bd(_r15);return core.hd().onSelectionChanged($event)}),core.Wc(27,"mat-option",20),core.Kd(28," SIN ESPECIFICAR "),core.Vc(),core.Id(29,EntityEditComponent_mat_card_2_mat_option_29_Template,2,2,"mat-option",18),core.id(30,"async"),core.Vc(),core.Vc(),core.Wc(31,"mat-form-field",21),core.Wc(32,"mat-label"),core.Kd(33,"Rol por defecto"),core.Vc(),core.Wc(34,"mat-select",22),core.Id(35,EntityEditComponent_mat_card_2_mat_option_35_Template,2,2,"mat-option",18),core.Vc(),core.Wc(36,"mat-hint"),core.Kd(37,"Roles posibles ORGANIZA, JUEGA..."),core.Vc(),core.Vc(),core.Wc(38,"mat-form-field",21),core.Wc(39,"mat-label"),core.Kd(40,"Tipo de acto por defecto"),core.Vc(),core.Wc(41,"mat-select",23),core.Id(42,EntityEditComponent_mat_card_2_mat_option_42_Template,2,2,"mat-option",18),core.Vc(),core.Wc(43,"mat-hint"),core.Kd(44,"Tipos posibles ACTO, PARTIDO, CONCIERTO..."),core.Vc(),core.Vc(),core.Vc(),core.Wc(45,"mat-card-actions",24),core.Wc(46,"button",25),core.Wc(47,"mat-icon"),core.Kd(48,"check"),core.Vc(),core.Vc(),core.Wc(49,"button",26),core.dd("click",function EntityEditComponent_mat_card_2_Template_button_click_49_listener(){core.Bd(_r15);return core.hd().gotoList()}),core.Wc(50,"mat-icon"),core.Kd(51,"list"),core.Vc(),core.Vc(),core.Vc(),core.Vc(),core.Vc(),core.Vc(),core.Vc()}if(2&rf){const ctx_r0=core.hd();core.Ec(3),core.od("src",ctx_r0.entityForm.get("image").value,core.Dd),core.Ec(7),core.od("formGroup",ctx_r0.entityForm),core.Ec(12),core.od("ngForOf",ctx_r0.CATEGORIES),core.Ec(4),core.od("compareWith",ctx_r0.compareFunction),core.Ec(1),core.od("value",ctx_r0.SECTION_BLANK),core.Ec(2),core.od("ngForOf",core.jd(30,12,ctx_r0.places$)),core.Ec(5),core.od("value",ctx_r0.entityForm.get("roleDefault").value),core.Ec(1),core.od("ngForOf",ctx_r0.ROLES),core.Ec(6),core.od("value",ctx_r0.entityForm.get("scheduleTypeDefault").value),core.Ec(1),core.od("ngForOf",ctx_r0.SCHEDULE_TYPES),core.Ec(4),core.od("title",ctx_r0.entityForm.valid?"Guardar con los datos introducidos":"Deshabilitado hasta que los datos sean v\xe1lidos")("disabled",!ctx_r0.entityForm.valid)}}function EntityEditComponent_div_3_Template(rf,ctx){if(1&rf&&(core.Wc(0,"div",27),core.Kd(1),core.Vc()),2&rf){const ctx_r1=core.hd();core.Ec(1),core.Md(" ",ctx_r1.errorMessage," ")}}function EntityEditComponent_ng_template_4_Template(rf,ctx){1&rf&&core.Kd(0," No existe tal entidad\n")}class entity_edit_component_EntityEditComponent{constructor(afStorage,fb,route,router,logSrv,entitiesSrv,placeSrv){this.afStorage=afStorage,this.fb=fb,this.route=route,this.router=router,this.logSrv=logSrv,this.entitiesSrv=entitiesSrv,this.placeSrv=placeSrv,this.pageTitle="Creaci\xf3n de una nueva entidad",this.errorMessage="",this.listOfObservers=[],this.CATEGORIES=category_enum.b,this.ROLES=models_entity.a.ROLES,this.SCHEDULE_TYPES=shedule_type_enum.a,this.SECTION_BLANK=base.a.InitDefault()}ngOnInit(){const idEntity=this.route.snapshot.paramMap.get("id");idEntity&&(this.getDetails(idEntity),this.entityForm=this.fb.group({id:[{value:"0",disabled:!0}],active:!0,name:["",[fesm2015_forms.q.required,fesm2015_forms.q.minLength(3),fesm2015_forms.q.maxLength(50)]],image:models_entity.a.IMAGE_DEFAULT,categories:[],place:[this.SECTION_BLANK,[fesm2015_forms.q.required]],roleDefault:[entity_role_enum.b.Default],scheduleTypeDefault:[""]}),this.places$=this.placeSrv.getAllPlacesBase())}getDetails(idEntity){if("0"===idEntity)this.pageTitle="Creaci\xf3n de una nueva entidad",this.entity=models_entity.a.InitDefault();else{const subs1$=this.entitiesSrv.getOneEntity(idEntity).subscribe({next:entity=>{this.entity=entity,this.displayEntity(),this.logSrv.info(JSON.stringify(this.entity))},error:err=>{this.errorMessage=`Error: ${err}`}});this.listOfObservers.push(subs1$)}}displayEntity(){var _a,_b;this.entityForm&&this.entityForm.reset(),"0"===this.entity.id?this.pageTitle="Creando una nueva entidad":this.pageTitle=`Editando la entidad ${this.entity.name}`,this.entityForm.patchValue({id:this.entity.id,active:this.entity.active,name:this.entity.name,image:null!==(_a=this.entity.image)&&void 0!==_a?_a:models_entity.a.IMAGE_DEFAULT,categories:null!==(_b=this.entity.categories)&&void 0!==_b?_b:[],place:this.entity.place?{id:this.entity.place.id,name:this.entity.place.name,image:this.entity.place.image}:this.SECTION_BLANK,roleDefault:this.entity.roleDefault,scheduleTypeDefault:this.entity.scheduleTypeDefault}),this.entityForm.controls.id.setValue(this.entity.id)}onSelectionChanged(event){this.placeBaseSelected=event.value}compareFunction(o1,o2){return o1.name===o2.name&&o1.id===o2.id}onResetForm(){this.entityForm.reset()}onSaveForm(){if(this.entityForm.valid){const entityItem=Object.assign(Object.assign({},this.entity),this.entityForm.value);this.compareFunction(entityItem.place,this.SECTION_BLANK)&&(this.logSrv.info("No hay lugar"),entityItem.place=null),"0"===entityItem.id?this.entitiesSrv.addEntity(entityItem):this.entitiesSrv.updateEntity(entityItem),this.router.navigate([models_entity.a.PATH_URL])}else this.errorMessage="Por favor, corrige los mensajes de validaci\xf3n."}onSaveComplete(){this.entityForm.reset(),sweetalert2_all_default.a.fire({icon:"success",title:"Datos guardados con \xe9xito",text:`Los datos de ${this.entity.name} se han guardado correctamente`}),this.router.navigate([`/${models_entity.a.PATH_URL}`])}gotoList(){this.entityForm.reset(),this.router.navigate([`/${models_entity.a.PATH_URL}`])}uploadImage(event){const file=event.target.files[0],filePath=file.name,fileRef=this.afStorage.ref(filePath),task=this.afStorage.upload(filePath,file);this.uploadPercent=task.percentageChanges(),task.snapshotChanges().pipe(Object(finalize.a)(()=>{fileRef.getDownloadURL().subscribe(imageUrl=>{this.entity.image=imageUrl,this.entityForm.patchValue({image:this.entity.image})})})).subscribe()}ngOnDestroy(){this.listOfObservers.forEach(sub=>sub.unsubscribe())}}entity_edit_component_EntityEditComponent.\u0275fac=function EntityEditComponent_Factory(t){return new(t||entity_edit_component_EntityEditComponent)(core.Qc(angular_fire_storage.a),core.Qc(fesm2015_forms.d),core.Qc(fesm2015_router.a),core.Qc(fesm2015_router.b),core.Qc(log_service.a),core.Qc(entities_service.a),core.Qc(places_service.a))},entity_edit_component_EntityEditComponent.\u0275cmp=core.Kc({type:entity_edit_component_EntityEditComponent,selectors:[["app-entity-edit"]],decls:6,vars:4,consts:[[3,"title"],[1,"section-wrapper"],["class","item-edit",4,"ngIf","ngIfElse"],["class","alert-danger",4,"ngIf"],["noEntityTemplate",""],[1,"item-edit"],[1,"row"],[1,"col-lg-3","col-md-4","col-12",2,"text-align","center"],[1,"img-thumbnail",3,"src","click"],["hidden","","type","file",3,"change"],["inputImageProfile",""],[1,"small",3,"click"],[1,"col-lg-9","col-md-8","col-12"],[3,"formGroup","ngSubmit"],["formControlName","active",1,"mb-3","ml-2"],["appearance","outline"],["matInput","","type","text","formControlName","name","placeholder","Nombre"],["formControlName","categories","multiple",""],[3,"value",4,"ngFor","ngForOf"],["placeholder","Lugar","formControlName","place",3,"compareWith","selectionChange"],[3,"value"],["appearance","outline",1,"col-6"],["formControlName","roleDefault",3,"value"],["formControlName","scheduleTypeDefault",3,"value"],[1,"buttons"],["mat-fab","","type","submit",1,"btn-1",3,"title","disabled"],["mat-fab","",1,"btn-1",3,"click"],[1,"alert-danger"]],template:function EntityEditComponent_Template(rf,ctx){if(1&rf&&(core.Rc(0,"app-section-header",0),core.Wc(1,"div",1),core.Id(2,EntityEditComponent_mat_card_2_Template,52,14,"mat-card",2),core.Id(3,EntityEditComponent_div_3_Template,2,1,"div",3),core.Vc(),core.Id(4,EntityEditComponent_ng_template_4_Template,1,0,"ng-template",null,4,core.Jd)),2&rf){const _r2=core.zd(5);core.od("title",ctx.pageTitle),core.Ec(2),core.od("ngIf",ctx.entity)("ngIfElse",_r2),core.Ec(1),core.od("ngIf",ctx.errorMessage)}},directives:[section_header_component.a,common.n,card.a,fesm2015_forms.r,fesm2015_forms.n,fesm2015_forms.h,card.c,slide_toggle.a,fesm2015_forms.m,fesm2015_forms.g,form_field.c,form_field.g,input.b,fesm2015_forms.c,fesm2015_select.a,common.m,fesm2015_core.m,form_field.f,card.b,fesm2015_button.b,icon.a],pipes:[common.b],styles:["form[_ngcontent-%COMP%]{background-color:#fff;color:#000}"]});const routes=[{path:"",component:entities_component_EntitiesComponent},{path:":id",component:entity_view_component_EntityViewComponent},{path:":id/editar",component:entity_edit_component_EntityEditComponent}];class EntitiesRoutingModule{}EntitiesRoutingModule.\u0275mod=core.Oc({type:EntitiesRoutingModule}),EntitiesRoutingModule.\u0275inj=core.Nc({factory:function EntitiesRoutingModule_Factory(t){return new(t||EntitiesRoutingModule)},imports:[[fesm2015_router.e.forChild(routes)],fesm2015_router.e]});var shared_module=__webpack_require__("PCNd");class EntitiesModule{}EntitiesModule.\u0275mod=core.Oc({type:EntitiesModule}),EntitiesModule.\u0275inj=core.Nc({factory:function EntitiesModule_Factory(t){return new(t||EntitiesModule)},imports:[[common.c,shared_module.a,EntitiesRoutingModule]]})}};