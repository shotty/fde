/**
 * @author fabiodjmix
 */

var ButtonConstants = {
	'PERSONAL':-1,
	'OPENPOPUP':0,
	'OPENBROWSER':1
};

var Button = Component.extend({
	'options':{
		'icon': undefined,
		'actions':{
			'click':[
				Class.empty
			]
		},
		'animate':true,
		'tooltip':undefined
	},
	
	'initialize':function(params){
		if ( !params ) return this;
		this.components = $A([]);
		
		this.options = $merge(this.options, params);
		
		this.parent( this.options );
		
		this.element.addClass( 'fde_button' );
		
		if ( this.options['tooltip'] )
			this.element.title = this.options['tooltip'] ;
		
		this.hide();
		
		$H(this.options.actions).each( function( value , key){
			value.each( function( fn ){
				this.element.addEvent( key , fn.bind( this , [ this.element , this ] ) );
			},this);
		},this);
		
		if ( this.options['animate'] == true )
			this.doAnimate();
		
		return this;
	},
	
	'show':function(){
		
		var _anchor = this.anchor;
		if ( _anchor !== document.body )
			_anchor = _anchor.getElement();
		
		var _width = _anchor.offsetWidth;
		var _height = _anchor.offsetHeight;
		
		var _dimension = ( _width > _height ) ? _height : _width;
		
		this.element.setStyles({
			'width': _dimension -1,
			'height': _dimension-1
		});
		
		if ( this.options['icon'] )
			this.setIcon();
		
		this.element.removeClass('fde_hide');
		this.element.removeClass('fde_notPresent');
		
		return this.parent();
	},
	
	'hide':function(){
		this.element.addClass('fde_hide');
		return this.parent();
	},
	
	'paint':function(){
		this.parent();	//paint on other subelement
		
		this.injectElement();
		
		return this;
	},
	
	'setIcon':function( icon ){
		var _newImage = $( new Image() );
		_newImage.addClass('fde_tmp');
		
		_newImage.src = icon || this.options['icon'];
		
		if (window.ie) {
			var tmr = null;
			var a = function(oldValue){
				if ( oldValue != ( _newImage.offsetHeight * _newImage.offsetWidth ) ) {
					this.drawImage.bind(this,[ _newImage ])();
					$clear( tmr );
				}
			}
			tmr = a.periodical( 10, this, [ _newImage.offsetHeight * _newImage.offsetWidth] );
		}else
			_newImage.onload = this.drawImage.bind(this,[ _newImage ]);
		
		_newImage.inject( document.body );
	},
	
	'doCanvas':function(){
		if ( ! this.icon )
			this.icon = new Element('canvas',{
				'class':'fde_icon'
			});

		if ( ! this.element.hasChild( this.icon ) ){
			if (window.ie) {
				this.icon.setProperty('id','tmpID');
				this.icon.inject(document.body);
				G_vmlCanvasManager.initElement(this.icon);
				this.icon = document.body.getElement('canvas[id=tmpID]');
				this.icon.removeProperty('id');
				this.icon.remove();
			}
		}
		
		var _dimension = ( this.element.offsetWidth > this.element.offsetHeight ) ? this.element.offsetHeight : this.element.offsetWidth;
		
		this.icon.setStyles({
			'width': _dimension,
			'height': _dimension
		});
		this.icon.setProperties({
			'width': _dimension,
			'height': _dimension
		});
		
		this.icon.inject(this.element,'top');
		
		if ( ! this.ctx )
			this.ctx = this.icon.getContext('2d');
	},
	
	'drawImage':function( image ){
		this.doCanvas();
		
		this.ctx = this.icon.getContext('2d');
		this.ctx.clearRect( 0 , 0 , this.icon.getProperty('width') , this.icon.getProperty('height')  );
		
		this.ctx.drawImage( image , 0 , 0 , this.icon.getProperty('width') , this.icon.getProperty('height') );
		
		image.remove();
	},
	
	'doAnimate':function(){
		
		this.bound = {
			'start' : this.start.bindAsEventListener( this ),
			'stop' : this.stop.bindAsEventListener( this ),
			'animate' : this.animate.bindAsEventListener( this )
		}
		
		this.element.addEvent('mouseover' , this.bound.start );
		this.element.addEvent('mouseout' , this.bound.stop );
	},
	
	'start': function( e ){
		var event = new Event( e || window.event );
		

		this.element.setStyle('background' , '#000000');
		
		this.defaultOffset = {
			'top':'',
			'left':'',
			'width': this.element.offsetWidth,
			'height':this.element.offsetHeight,
			'position':''
		};
		
		this.element.setStyles({
			'top': this.element.offsetTop,
			'left':this.element.offsetLeft,
			'position': 'absolute'
		});
		
		this._parentElement = this.element.getParent();
		this.element.inject( document.body );
		
		this.element.addEvent('mousemove' , this.bound.animate );
		
		this.animate( e );
		
	},
	'stop': function( event ){
		this.element.removeEvent( 'mousemove' , this.bound.animate );
		this.element.setStyle('background' , '#FFFFFF');
		event = new Event( event || window.event );
		this.element.setStyles( this.defaultOffset );
		this.element.inject( this._parentElement );
	},
	
	'animate': function( e ){
		
		var event = new Event( e || window.event );
		
		throw 'ciao';
		
		var _mouse = {
			'x' : event.page.x - this.element.offsetLeft,
			'y' : event.page.y - this.element.offsetTop
		}
		
		
		
	}
	
});

Button.implement(new Events,new Options);

document.write( '<link rel="stylesheet" type="text/css" href="css/button.css" />');