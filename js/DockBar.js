/**
 * @author fabiodjmix
 */

var DockBarAttributes = {
	'dockbarClassName':'fde_dockbar',
	'NORTH':10,
	'SOUTH':11,
	'EST':12,
	'WEST':13,
	'CENTERED': 44,
	'DIMENSION':[ 16 , 32 , 48 , 64],
	'DEFAULT_DIMESION': 2,
	'MAX_WIDTH':'100%',
	'fill':22,
	'stroke':21
};

var DockBar = Component.extend({
	
	'options':{
		'dockbar':undefined ,
		'orientate': DockBarAttributes.NORTH ,
		'dimension': {
			'scale' : DockBarAttributes.DEFAULT_DIMESION ,
			'occupation':'80%'
		},
		'position': DockBarAttributes.NORTH ,
		'opacity': 1.0 ,
		'color': undefined ,
		'drawstyle':DockBarAttributes.fill ,
		'automatic-hide':false ,
		'draggable':false
	},
	
	
	'initialize': function(params){
		if ( !params ) return this;
		this.components = $A([]);
		this.options = $merge(this.options, params);
		
		this.parent( this.options );
		
		this.element.addClass( 'fde_dockbar' );
		this.element.addClass( 'clearfix' );
		
		var _dimension = this.options['dimension'];
		
		if (  [ DockBarAttributes.WEST , DockBarAttributes.EST ].contains( this.options['orientate'] )  ){
			
			this.element.setStyles({
				'width': DockBarAttributes.DIMENSION[ _dimension.scale ],
				'height': _dimension.occupation
			});
			
		}else{
			
			this.element.setStyles({
				'height': DockBarAttributes.DIMENSION[ _dimension.scale ],
				'width': _dimension.occupation
			});
		}
		
		var _css = 'fde_dockbar_';
		switch ( this.options['orientate'] ) {
			case DockBarAttributes.WEST:
				_css += 'west'
				break;
			case DockBarAttributes.EST:
				_css += 'est'
				break;
			case DockBarAttributes.NORTH:
				_css += 'north'
				break;
			case DockBarAttributes.SOUTH:
				_css += 'south'
		}
		this.element.addClass( _css );

		_css = 'fde_dockbar_';
		switch ( this.options['position'] ) {
			case DockBarAttributes.WEST:
				_css += 'west'
				break;
			case DockBarAttributes.EST:
				_css += 'est'
				break;
			case DockBarAttributes.NORTH:
				_css += 'north'
				break;
			case DockBarAttributes.SOUTH:
				_css += 'south';
				break;
			default:
				_css='';
		}
		if ( _css )
			this.element.addClass( _css );
		
		this.hide();
		
		return this;
	},
	
	'getOrientate':function(){
		return this.options['orientate'];
	},
	
	'paint':function(){
		
		this.parent();
		
		this.injectElement();
		
		this.doCanvas();
		
		return this;
	},
	
	
	'addComponent':function(element,key){
		
		if (element.constructor === Component ) {
			
			element.setAnchor( this );
			
		}else if( $type(element) == 'element' ){
			
			element = new Button({
				'button': $(element),
				'anchor': this
			})
		}
		
		this.parent( element ) ;
		
		return element;
	},
	
	
	'setIdentity':function(id){
		this.parent();
		
		this.components.each(function( component , index , components ){
			component.setIdentity( this.getIdentity() + '_button_' + index );
		},this);
		
		this.element.setProperty('id', this.getIdentity() );
	},
	
	'showHide':function(ev){
		if ( this.inUse ) return true;
		this.canvas.setStyle('visibility','');
		if (ev) {
			ev = new Event(ev);
			if (( ev.page.x >= this.clipRound.left) && ( ev.page.x <= (this.clipRound.left + this.clipRound.width) )) {
				if ((ev.page.y >= this.clipRound.top) && (ev.page.y <= (this.clipRound.top + this.clipRound.height) )) {
					this.element.removeClass('fde_hide');
					//this.canvas.setStyle('visibility','visible');
					return true;
				}
			}
		}
		this.element.addClass('fde_hide');
		return true;
	},
	
	'show':function(){
		this.parent();
		this.repaint();
		if ( !this.personalized ) this.doPersonalize();
		this.element.removeClass('fde_hide');
		this.element.removeClass('fde_notPresent');
		if ( [DockBarAttributes.NORTH , DockBarAttributes.SOUTH ].contains( this.getOrientate() )  ){
			this.components.each( function( component ){
				component.getElement().setStyle('float','left');
			});
		}
		return this;
	},
	
	'doPersonalize':function(){
		if (this.options['position'] == DockBarAttributes.CENTERED ) {
			var bHeight = document.getElement('html').clientHeight;
			var bWidth = document.getElement('html').clientWidth;
			if ( [ DockBarAttributes.WEST, DockBarAttributes.EST].contains( this.options['orientate'] )  ) {
				this.element.setStyle('top', ((bHeight /2) - (this.element.offsetHeight /2)).toInt() );
			}else{
				this.element.setStyle('left', ((bWidth /2) - (this.element.offsetWidth /2)).toInt() );
			}
		}
		
		this.clipRound = this.element.getCoordinates();
		
		if ( this.options['automatic-hide'] ){
			this.anchor.getElement().addEvent('mousemove', this.showHide.bindAsEventListener(this));
			this.showHide( null );
		}
		this.personalized = true;
		return this;
	},
	
	'hide':function(){
		this.element.addClass('fde_hide');
		return this.parent();
	},

	'getOrientate':function(){
		return this.options['orientate'];
	},
	
	'doCanvas':function(){
		
		if ( !this.canvas ){
			this.canvas = new Element('canvas',{
				'class':'fde_decoration'
			});
		}
		
		
		if ( !this.element.hasChild( this.canvas ) ) {
			if ( window.ie ){
				this.canvas.setProperty('id','tmpID');
				this.canvas.inject ( document.body);
				G_vmlCanvasManager.initElement( this.canvas );
				this.canvas = document.body.getElement('canvas[id=tmpID]');
				this.canvas.removeProperty('id');
				this.canvas.remove();
			}
			
			this.canvas.inject( this.element ,'top' );
		}
		
		this.canvas.setStyle('opacity', this.options['opacity'] );
		this.canvas.setStyle('visibility','');
		if (!this.ctx )
			this.ctx = this.canvas.getContext('2d');
	},
	
	'getElement':function(){
		return this.element;
	},


	'repaint':function(){
		
		this.canvas.setProperties({
			'width': this.element.offsetWidth,
			'height' : this.element.offsetHeight
		 });
		
		var radius = 8;
		var h = this.canvas.getProperty('height');
		var w = this.canvas.getProperty('width');
		
		this.ctx.beginPath();
		this.ctx.moveTo(0,radius);
		
		this.ctx.lineTo( 0 , h - radius);
		this.ctx.quadraticCurveTo( 0 , h, radius, h);
		
		this.ctx.lineTo( w-radius , h );
		this.ctx.quadraticCurveTo( h , w , w, h - radius );
		
		this.ctx.lineTo( w, radius);
		this.ctx.quadraticCurveTo( w, 0 , w-radius, 0 );
		this.ctx.lineTo( radius , 0);
		this.ctx.quadraticCurveTo( 0,0, 0, radius );
		
		if (this.options.drawstyle && this.options.color) {
			switch (this.options.drawstyle) {
				case DockBarAttributes.stroke:
					this.ctx.strokeStyle = this.options['color'];
					this.ctx.stroke();
					break;
				case DockBarAttributes.fill:
				default:
					this.ctx.fillStyle = this.options['color'];
					this.ctx.fill();
			}
		}
		
	}
});

document.write( '<link rel="stylesheet" type="text/css" href="css/dockbar.css" />');
