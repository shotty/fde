/**
 * @author fabiodjmix
 */
if ( window.ie )
	document.write('<script language="javascript" type="text/javascript" src="js/excanvas-compressed.js"></script>');

var FDE = new Abstract({
	'components':$A([]),				//Collection of components
	'currentComponent':-1,				//index of current component shown
	
	
	'init':function( components ){
		if ( !components ) return;
		this.components = components || $A([]);
		
		return this;
	},
	
	/*Function:
	 * 	show a component, or show all components
	 */
	'show':function(index){
		//this.hide();		
		if (!$defined(index)) {
			this.components.each(function(component){
				if ( ! component.painted ) 
					component.paint();
				if ( ! component.shown ) 
					component.show();
				component.getElement().setStyle('z-index','');
			});
		}else {
			if ( ! this.components[index].painted ) 
				this.components[index].paint();
			if ( ! this.components[index].shown )
				this.components[index].show();
			this.components[index].getElement().setStyle('z-index','');
		}
		this.currentComponent = index || -1;
		return this;
	},
	
	/*Function:
	 * 	hide a component or hide all components
	 */
	'hide':function( index ){
		if (!$defined(index)) {
			this.components.each(function(component){
				if (component.shown) 
					component.hide();
				component.getElement().setStyle('z-index',-1);
			});
		}else {
			if (this.components[index].shown) 
				this.components[index].hide();
			this.components[index].getElement().setStyle('z-index',-1);
		}
		this.currentComponent = index || -1;
		return this;
	},
	
	
	/*Property:
	 * 	get current component that showed
	 */
	'getCurrentComponent':function(){
		if ( this.currentComponent != -1 )
			return this.components[index];
		return null;
	},
	
	/*Property:
	 * 	set the index of component choosed and return it
	 */
	'setCurrentComponent':function( index ){
		this.currentComponent = index;
		return this.getCurrentComponent();
	}
	
});



var COMPONENT = {
	'className': 'fde_component'
};

var Component = new Class({
	
	'options':{
		'htmlelement':undefined,			//HTML element from page
		'anchor': undefined,				//Anchor of this component
		'title':undefined,					//tooltip text of element
		'subcomponents':undefined
	},
	
	'components':$A([]),					//collection of components in this component
	
	/*
	 * Create an instance of component, set the anchor and get the correct HTMLElement
	 */
	'initialize':function(params){
		if ( !params) return this;
		
		this.options = $merge( this.options , params );
		
		this.element = this.element || this.options.htmlelement || 	new Element('div');
		
		this.element.component = this;
		
		this.element.addClass( COMPONENT.className );
		
		if ( this.options.title )
			this.element.setProperty('title' , this.options.title );
		
		this.setAnchor( this.options.anchor || document.body );
		
		if ( $type(this.options.subcomponents) == 'array' )
			this.options.subcomponents.each( function( component ){
				this.addComponent( component );
			},this);
		
		this.options.subcomponents = undefined;
		
		return this;
		
	},
	
	/*Property:
	 * get and set the anchor-component of this component
	 */
	'getAnchor':function(){
		return this.anchor;
	},
	'setAnchor':function( component ){
		this.anchor = component;
	},
	
	
	/*Function:
	 *	add a component into components collection
	 */
	'addComponent':function( component ){
		component.setAnchor( this );
		this.components.push( component );
	},
	
	
	/*Property:
	 * 	get the HTMLElement of this component
	 */
	'getElement':function(){
		return this.element;
	},
	
	/*Property:
	 * 	get and set the ID property of this component
	 */
	'setId':function(id){
		this.id = id;
	},
	'getId':function(){
		return this.id || '';
	},
	
	
	/*Function:
	 * 	hide the component and hide all its components
	 */
	'hide':function(){
		this.components.each(function(component){
			if ( !component.shown ) return;
			component.hide();
			component.shown = false;
		});
		this.shown = false;
		return this;
	},
	
	/*Function:
	 * 	Show this component and show all its components
	 */
	'show':function(){
		this.components.each(function(component){
			if ( component.shown ) return;
			component.show();
			component.shown = true;
		});
		this.shown = true;
		return this;
	},
	
	
	/*Function:
	 * 	paint this component and paint all its components.
	 * 	this method called once only, and draw this component into HTML
	 */
	'paint': function(){
		if ( this.painted ) return this;
		this.components.each(function(component){
			if ( component.painted ) return;
			component.paint();
			component.painted = true;
		});
		this.painted = true;
		return this;
	},
	
	
	/*Function:
	 * 	inject the HTMLElement into anchor
	 */
	'injectElement':function( where ){
		var element = null;
		if (this.anchor === document.body) 
			element = this.anchor;
		else
			element = this.anchor.getElement();
		if ( element === this.getElement() ) 			return this;
		if ( $(element).hasChild( this.getElement() )  ) 	return this;
		this.getElement().inject( element , where );
		return this;
	},
	
	
	/*Function:
	 * 	serialize settings of component
	 */
	'serialize':function(){
		this.objSerialized = $H({});
		this.components.each(function(component){
			this.objSerialized.extend( component.serialize() );
		});
		return this.objSerialized;
	},
	
	/*Function:
	 * 	get settings from a serialized string
	 */
	'deserialize':function( str ){
		this.components.each(function(component){
			component.deserialize( str );
		});
		return this;
	}
	
});
document.write( '<link rel="stylesheet" type="text/css" href="css/fde.css" />');