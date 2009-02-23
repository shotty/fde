var Popups = new Abstract({
	
	FOCUS_ZINDEX : 1004,
	MINIMIZED_ZINDEX : 1005,
	NOTFOCUS_ZINDEX:10,
	MINIMIZED_STATUS : -100,
	MAXIMIZED_STATUS : -101,
	NORMAL_STATUS : -102,
	
	'popups':$H({}),
	'minimizedPopups':$H({}),
	'add':function( popup ){
		
		popup.getContainer().timeStamp = popup.getContainer().timeStamp || new Date().getTime();
		var _time = popup.getContainer().timeStamp;
		
		var _popups = this.popups.get( _time ) || $A([]);
		
		if ( _popups.contains ( popup )  ) return this;
		
		_popups.push( popup );
		
		this.popups.set( _time , _popups );
		
		return this;
		
	},
	
	'focus':function( popup ){
	
		popup.getContainer().timeStamp = popup.getContainer().timeStamp || new Date().getTime();
		var _time = popup.getContainer().timeStamp;

		var _popups = this.popups.get( _time ) || $A([]);;
		
		var index = _popups.indexOf( popup );
		if (index > -1) 
			_popups.removeByIndex(index);
		
		_popups.push( popup );
		popup.getMaster().setOpacity('1.0');
		popup.getMaster().setStyle('visibility','');	//BUG FIX - compatibility
		popup.getMaster().setStyle( 'z-index' , this.FOCUS_ZINDEX );
		popup.isFocused = true;
		
		this.popups.set( _time , _popups );
		
		return this;
	},
	
	'notFocus':function( popup , container ){
		container = ( popup ) ? popup.getContainer() : container ;
		if ( !container ) return this;

		container.timeStamp = container.timeStamp || new Date().getTime();
		var _time = container.timeStamp;
		
		var _popups = this.popups.get( _time );
		
		if ( !popup ){
			
			_popups.each( function ( p , index ){
				p.getMaster().setOpacity('0.5');
				if ( p.getStatus() == this.MINIMIZED_STATUS )
					p.getMaster().setStyle('z-index', this.MINIMIZED_ZINDEX);
				else
					p.getMaster().setStyle('z-index', this.NOTFOCUS_ZINDEX + index);
				p.isFocused = false;
			} , this );
			
		}else{
		
			var index = _popups.indexOf( popup );
			if (index == -1) {
				_popups.push(popup);
				index = _popups.indexOf( popup );
			}
			popup.getMaster().setOpacity('0.5');
			if ( popup.getStatus() == Popups.MINIMIZED_STATUS )
				popup.getMaster().setStyle('z-index', this.MINIMIZED_ZINDEX);
			else
				popup.getMaster().setStyle('z-index', NOTFOCUS_ZINDEX + index);
			popup.isFocused = false;
		
		}
		
		this.popups.set( _time , _popups );
		
		
		return this;
	},
	
	'remove':function( popup ){
		if ( popup.getContainer().timeStamp )
			this.popups.get( popup.getContainer().timeStamp ).remove( popup );
		if ( popup.getAnchor().timeStamp )
			this.minimizedPopups.get( popup.getAnchor().timeStamp ).remove( popup );
		return this;
	},
	
	'notDisplay':function( popup ){
		popup.getMaster().addClass('fde_notPresent');
		popup.getBackground().addClass('fde_notPresent');
		return this;
	},
	'hide':function( popup ){
		popup.getMaster().addClass('fde_hide');
		popup.getBackground().addClass('fde_hide');
		return this;
	},
	
	'display':function( popup ){
		popup.getMaster().removeClass('fde_notPresent');
		popup.getBackground().removeClass('fde_notPresent');
		return this;
	},
	'show':function( popup ){
		popup.getMaster().removeClass('fde_hide');
		popup.getBackground().removeClass('fde_hide');
		return this;
	},
	
	'close':function( popup )	{
		return this;
	},
	
	'maximize':function( popup ){
		
		return this;
	},
	
	'minimize':function( popup ){
		
		popup.getContainer().timeStamp = popup.getContainer().timeStamp || new Date().getTime();
		popup.getAnchor().timeStamp = popup.getAnchor().timeStamp || new Date().getTime();
		
		var _cTime = popup.getContainer().timeStamp;
		var _aTime = popup.getAnchor().timeStamp;
	
		var _popups = this.popups.get( _cTime )  || $A([]) ;
		var _minPopups = this.minimizedPopups.get( _aTime ) || $A([]) ; 
	
		_popups.remove( popup );
		_minPopups.push( popup );
	
		var _index = _minPopups.indexOf( popup );
		popup.getMaster().setStyles({
			'top': popup.getContainer().offsetHeight - popup.getMaster().offsetHeight,
			'left': _index * popup.getMaster().offsetWidth,
			'z-index': this.MINIMIZED_ZINDEX
		});
	
		if ( popup.getAnchor() !== popup.getContainer() ) {
			popup.getMaster().remove();
			popup.getMaster().inject( popup.getAnchor() );
		}
		
		/*if ( popup.getAnchor() === popup.getContainer() ) {
			var pos = this.popups.get( popup.getContainer() ).indexOf( popup );
			
		}else{
			var _minimizedPopups = this.minimizedPopups.get( popup.getAnchor() ) || $A([]);
			_minimizedPopups.push( popup );
			this.minimizedPopups.set( popup.getAnchor() , _minimizedPopups );
			popup.getMaster().remove();
			popup.getMaster().inject( popup.getAnchor() );
		}*/
		
		
		this.notFocus( null , popup.getContainer() );

		/* Focus previous popup , management windows focus */
		_index = _popups.length ;
		if ( _index > 0 ) /* return this; */
			this.focus ( _popups[ _index -1 ]  ) ;
			
		this.popups.set( _cTime , _popups );
		this.minimizedPopups.set( _aTime , _minPopups );
		
		return this;
	},
	
	'restore':function( popup ){
	
		popup.getContainer().timeStamp = popup.getContainer().timeStamp || new Date().getTime();
		popup.getAnchor().timeStamp = popup.getAnchor().timeStamp || new Date().getTime();
		
		var _cTime = popup.getContainer().timeStamp;
		var _aTime = popup.getAnchor().timeStamp;
	
		var _popups = this.popups.get( _cTime ) || $A([]);
		var _minPopups = this.minimizedPopups.get( _aTime ) || $A([]) ; 
	
		_minPopups.remove( popup );
		_popups.push( popup );
		
		if ( popup.getAnchor() !== popup.getContainer() ) {
			popup.getMaster().remove();
			popup.getMaster().inject( popup.getContainer() );
		}
		
		this.popups.set( _cTime , _popups );
		this.minimizedPopups.set( _aTime , _minPopups );
		
		return this;
	}
	
});

var Popup = new Class({

	isShown:false,

	'options':{
		'onBeforeShow': Class.empty,
		'onAfterShow': Class.empty,
		'onBeforeClose': Class.empty,
		'onAfterClose': Class.empty,
		'onCompleteAjax': Class.empty,
		'onErrorAjax': Class.empty,
		'onRequestAjax': Class.empty,
		'onMinimize': Class.empty,
		'onMaximize': Class.empty,
		'onResize': Class.empty,
		'onRestore':Class.empty,
		'onLoad':Class.empty,
		'title':'Title window',
		'effects':true,
		'draggable':true,
		'resize':true,
		'maximize':true,
		'minimize':true,
		'close':true,
		'background':false,
		'dimension':{
			'top':0,
			'left':0,
			'width':600,
			'height':500
		},
		'centered':true,
		'container':undefined,
		'anchor':undefined,
		'decoration':{
			'background':'#000000',
			'title':'#0000AA',
			'body':'#AAAAAA',
			'title-color':'#FFFFFF',
			'icon':undefined,
			'border':8,
			'resize':{'background':'#EEEEEE'},
			'close':{
				'background':'',
				'font':'#00FF00'
			},
			'maximize':{
				'background':'',
				'font':'#00FF00'
			},
			'minimize':{
				'background':'',
				'font':'#00FF00'
			}
		}
	},


	'initialize':function(  params ){
		if ( !params ) return this;
		
		this.options = $merge( this.options , params );
		
		/*Create all elements */
		this.master = new Element('div', { 'class':'fde_popup'} );
		this.title = new Element('div', { 'class':'fde_popup_title'} );
		this.content = new Element('div', { 'class':'fde_popup_content'} );
		this.canvas = new Element('canvas', { 'class':'fde_popup_canvas'} );
		
		/*optional element*/
		this.closer = new Element('div', { 'class':'fde_popup_close'} );
		this.resizer = new Element('div', { 'class':'fde_popup_resize'} );
		this.minimizer = new Element('div', { 'class':'fde_popup_minimize'} );
		this.maximizer = new Element('div', { 'class':'fde_popup_maximize'} );
		this.background = new Element('div', { 'class':'fde_popup_background'} );
		
		
		this.container = this.options.container || document.body;	//container on show element
		this.anchor = this.options.anchor  || this.options.container;	//container on minimize event
		
		this.title.setHTML( this.options.title );
		
		/*inject elements*/
		this.title.inject( this.master );
		this.content.inject( this.master );
		
		
		/* Modal Popup */
		if ( this.options.background == true )
			this.options.minimize = false;
		
		/*optional element inject */
		if ( this.options.resize )
			this.resizer.inject( this.master );
		if ( this.options.minimize )
			this.minimizer.inject ( this.master );
		if ( this.options.maximize ){
			this.maximizer.inject ( this.master );
			this.title.addEvent('dblclick', this.maximize.bindAsEventListener( this ) );
		}
		if ( this.options.close )
			this.closer.inject( this.master );
		
		
		
		/*
		 * Event management
		 */
		this.addEvent ( 'onBeforeShow' 	,	this.options['onBeforeShow']  	);
		this.addEvent ( 'onAfterShow' 	, 	this.options['onAfterShow']  	);
		this.addEvent ( 'onBeforeClose' , 	this.options['onBeforeClose']  	);
		this.addEvent ( 'onAfterClose' 	, 	this.options['onAfterClose']  	);
		this.addEvent ( 'onMinimize' 	,	this.options['onMinimize']  	);
		this.addEvent ( 'onMaximize' 	,	this.options['onMaximize']  	);
		this.addEvent ( 'onResize' 	,	this.options['onResize']  	);
		this.addEvent ( 'onLoad' 	,	this.options['onLoad']  	);
		

		this.setFocusableEvents();

		Popups.add( this );
		
		return this.reset();
		
	},
	
	/*Navigate with ajax in popup content
	 * parameters:
	 * {
	 * 		'url': String - URL to send the request,
	 * 		'updateContent': boolean - write response string into content of popup
	 * 		'parameters': String - parameter to send by ajax
	 * 		'evalScripts': boolean - eval the scrips in ajax response
	 * 		'onComplete': Function - function to invoke in return response event
	 * 		'onFailure': Function - function to invoke in failure ajax request event
	 * 		'onRequest': Function - function to inoke in on ajax request start event
	 * }
	 */
	'navigate':function( options ){
		
		options = $merge( {
				'url':'',
				'updateContent':true,
				'parameters':'',
				'onComplete':Class.empty,
				'onFailure':Class.empty,
				'onRequest':Class.empty
			} , options );
		
		
		if ( !options.url ) return this;
		
		var onComplete = function( response ){
			
			if ( options['updateContent'] )
				this.setContentHTML( response );
				
			options['onComplete']( response , this );
			
			this.show();
			
			if ( options['evalScripts'] )
				this.ajax.evalScripts();
			
		};
		
		
		//if ( !this.ajax )
		this.ajax = new Ajax( options['url'] ,{
			'method':'POST',
			'onComplete':onComplete.bind( this ),
			'onRequest':options['onRequest'],
			'onFailure':options['onFailure']
		}).request( options['parameters'] );
		
		return this;
		
	},
	
	
	'load':function(){
		if ( this.loaded ) return this;
		
		if ( this.master.getParent() )
			this.master.remove();
		if ( this.background.getParent() )
			this.background.remove();
		
		Popups.notDisplay( this );
		
		if ( this.options.background )
			this.background.inject ( this.container );
		
		this.master.inject ( this.container );
		
		this.doCanvas();
		
		
		this.canvas.inject( this.master , 'top');
		
		
		this.loaded = true;
		
		this.fireEvent( 'onLoad' , [ this ] );
		
		return this;
		
	},
	
	'show':function(){
		
		if ( !this.loaded ) this.load();
		if ( this.isShown ) return this;
		
		Popups.hide( this );
		Popups.display( this );
		
		this.master.addClass('fde_popup_normal');
		
		this.fireEvent('onBeforeShow', [ this ]  );
		
		this.setDimension();
		
		this.paint();
		
		if ( this.options.effects  ){
			this.doEffects();
		}
		
		if ( this.bgEffect ){
			this.background.setOpacity('0.0');
			this.background.removeClass('fde_hide');
			this.bgEffect.start( {'opacity':0.5} ).chain((function(){
				Popups.show( this );
			}).bind(this));
		}else{
			this.background.setOpacity( '0.5');
			Popups.show( this );
		}
		
		this.isShown = true;
		
		Popups.notFocus( null , this.container );
		Popups.focus( this );
		
		this.fireEvent('onAfterShow', [ this ]  );
				
		return this;
		
	},
	
	'reset':function(){
		
		this.content.setHTML('');
		this.loaded = false;
		this.isShown = false;
		
		if ( $(this.container).hasChild ( this.master )  ||  $(this.anchor).hasChild( this.master )  )
			this.master.remove();
			
		if ( this.container.hasChild( this.background ) )
			this.background.remove();
		
		return this;
		
	},


	'setContentHTML':function( str ){
		if ( !this.loaded ) this.load();
		if ( this.content && this.loaded ){
			this.content.empty().setHTML ( str );
			var tmp_element = this.content.getElement('*');
			if ( tmp_element )
				tmp_element.referPopup = this;
		}
		return this;
	},
	
	'doCanvas':function(){
		if ( window.ie ){
			this.canvas.setProperty('id','tmpId');
			this.canvas.inject ( document.body );
			G_vmlCanvasManager.initElement( this.canvas );
			this.canvas = document.body.getElement('canvas[id=tmpId]');
			this.canvas.remove();
			this.canvas.removeProperty('id');
		}
	},
	
	
	'setDimension':function( dimension ){
		dimension = dimension || this.options.dimension;
		
		if ( this.options.centered ){
			var w = this.container.offsetWidth;
			var h = this.container.offsetHeight;
			dimension.left = parseInt( (w/2) - (parseInt(dimension.width)/2)  ) ;
			dimension.top = parseInt(  (h/2) - (parseInt(dimension.height)/2) );
		}
		
		this.master.setStyles({
			'top': dimension.top,
			'left':dimension.left,
			'width':dimension.width,
			'height':dimension.height
		});
		
		this.canvas.setProperties({
			'width':this.master.offsetWidth,
			'height':this.master.offsetHeight
		});
		
		
		this.currentDimension = dimension;
		
		if ( this.isShown )
			this.paint();
		
	},
	
	'updateDimension':function( dimension ){
		this.options.dimension = dimension || {
			'top':this.master.offsetTop,
			'left':this.master.offsetLeft,
			'width':this.master.offsetWidth,
			'height':this.master.offsetHeight
		}
	},
	
	'doEffects':function(){
		
		this.background.setStyle('background-color', this.options.decoration.background);
		
		if ( this.options.background && this.bgEffect )
			this.bgEffect = this.background.effects(  { duration: 500 , transition : Fx.Transitions.Quart.easeOut }  );
		
		if (  this.options.draggable && !this.dragEffect ){
			var w=this.master.offsetWidth
			var h=this.master.offsetHeight
		
			this.title.setStyle('cursor','move');
			
			this.dragEffect = new Drag.Base( this.master, {
				'container': this.container,
				'handle':this.title,
				'limit':{
					'x':[ this.container.offsetLeft , this.container.offsetWidth - this.master.offsetWidth ],
					'y':[ this.container.offsetTop , this.container.offsetHeight - this.master.offsetHeight ]
				},
				'onBeforeStart':(function(){
					return  ! (  this.master.hasClass('fde_popup_maximized') || this.master.hasClass('fde_popup_minimized')  ) ;
				}).bind(this),
				'onDrag':(function(){
					this.master.setOpacity('0.8');
				}).bind(this),
				'onComplete':(function(){
					this.master.setOpacity('1.0');
					this.master.setStyle('visibility','');
					this.updateDimension();
				}).bind(this)
			});
		}
		
		if ( this.options.resize && !this.master.resizable ){
			this.resizer.setStyle('cursor','nw-resize');
			//Resize popup
			this.master.makeResizable({
				limit: {
					x: [ this.master.offsetWidth, 	this.container.offsetWidth  ], 
					y: [ this.master.offsetHeight, 	this.container.offsetHeight ]
				},
				handle: this.resizer,
				'onSnap':(function(){this.fireEvent('onResize',[this]);}).bind( this ),
				onStart:(function(){this.master.setOpacity('0.8');}).bind(this),
				onComplete: (function(){
					this.master.setOpacity('1.0');
					this.master.setStyle('visibility','');
					this.updateDimension();
					return this.paint();
				}).bind(this)
			});
			this.master.resizable = true;
		}
		
		if ( this.options.minimize ){
			this.minimizer.removeEvents().addEvent('click', this.minimize.bindAsEventListener( this )  );
		}
		
		if ( this.options.maximize ){
			this.maximizer.removeEvents().addEvent('click', this.maximize.bindAsEventListener( this )  );
		}
		
		if ( this.options.close ){
			this.closer.removeEvents().addEvent('click', this.close.bindAsEventListener( this )  );
		}
		
	},
	
	'paint':function( decoration ){
		this.ctx = this.ctx || this.canvas.getContext('2d');
		
		this.canvas.setProperties({
			'width':this.master.offsetWidth,
			'height':this.master.offsetHeight
		});
		
		/*
		'decoration':{
			'background':'#000000',
			'title':'#0000AA',
			'body':'#AAAAAA',
			'title-color':'#FFFFFF',
			'icon':undefined,
			'border':8,
			'close':{
				'background':'#00FF00',
				'font':'#FFFFFF'
			},
			'minimize':{
				'background':'#FF0000',
				'font':'#FFFFFF'
			},
			'maximize':{
				'background':'#0000FF',
				'font':'#FFFFFF'
			}
		}
		*/
		
		decoration = decoration || this.options.decoration;
		
		this.title.setStyle('color', decoration['title-color'] );
		
		var maxH = this.master.offsetHeight;
		var maxW = this.master.offsetWidth;
		var heightTitle = this.title.offsetHeight;

		this.ctx.clearRect( 0, 0 , maxW , maxH);

		/** Header */
		this.ctx.beginPath();
		var lingrad = this.ctx.createLinearGradient(0, 0, 0,heightTitle);
		lingrad.addColorStop(0, decoration.title );	//scelgo i colori per il gradient
		lingrad.addColorStop(1, decoration.body );

		this.ctx.fillStyle = lingrad;
		this.ctx.moveTo(0,heightTitle);
		this.ctx.lineTo(maxW, heightTitle );
		this.ctx.lineTo(maxW, decoration.border );
		this.ctx.quadraticCurveTo( maxW,0 , maxW-decoration.border,0 );
		this.ctx.lineTo( decoration.border,0);
		this.ctx.quadraticCurveTo( 0,0,0,decoration.border );
		this.ctx.closePath();
		this.ctx.fill();

		/** Body */
		this.ctx.beginPath();
		this.ctx.fillStyle = decoration.body;
		this.ctx.moveTo(0, heightTitle);
		this.ctx.lineTo(0, maxH - decoration.border );
		this.ctx.quadraticCurveTo( 0 , maxH , decoration.border , maxH );
		this.ctx.lineTo( maxW - decoration.border , maxH );
		this.ctx.quadraticCurveTo( maxW , maxH , maxW , maxH - decoration.border );
		this.ctx.lineTo(maxW, heightTitle);
		this.ctx.closePath();
		this.ctx.fill();
		
		
		/* draw icon */
		//decoration.icon='images/tips.gif';
		
		if ( decoration.icon  ){
			if ( $type( decoration.icon ) != 'string' ) this.icon = $( decoration.icon );
			var wh = ((heightTitle - 10) < 13) ? 13 : heightTitle - 10;
			if (!this.icon) {
				this.icon = new Image();
				$(this.icon);
				this.icon.addClass('fde_popup_icon_tmp');
				this.icon.src = decoration.icon;
				
				var fnOnLoad = function(evt){
					evt = new Event(evt);
					try{this.ctx.drawImage( this.icon , 0 , 0 , wh , wh );}catch(e){}
					this.icon.remove();
				}
				
				if (window.ie) {
					var tmr = null;
					var a = function(oldValue){
						if (oldValue != (this.icon.offsetHeight * this.icon.offsetWidth)) {
							fnOnLoad.bindAsEventListener(this)();
							$clear(tmr);
						}
					}
					tmr = a.periodical(10, this, [this.icon.offsetHeight * this.icon.offsetWidth]);
				}
				else 
					this.icon.onload = fnOnLoad.bindAsEventListener(this);
				
				this.icon.inject(document.body);
				
			}else
				try{this.ctx.drawImage(this.icon , 0 , 0 , wh , wh );}catch(e){}
		}
		
		
		
		
		
		
		if ( this.getStatus() == Popups.MINIMIZED_STATUS && this.anchor !== this.container ) return this;
		
		var distance = 3;
		var optDecoration =undefined;
		var pos = undefined;
		/** X */
		if (this.options.close) {
			optDecoration = decoration.close;
			pos = {
				'left':this.closer.offsetLeft,
				'top':this.closer.offsetTop,
				'height':this.closer.offsetHeight,
				'width':this.closer.offsetWidth
			};
			if ( optDecoration.background ){
				this.ctx.beginPath();
				this.ctx.fillStyle = optDecoration.background;
				this.ctx.arc(  
						parseInt( pos.left + (pos.width/2) )  , //X
						parseInt( pos.top + (pos.height/2) )  , //Y
						parseInt(pos.width/2), 0, Math.PI * 2, true);			//Options
				this.ctx.fill();
			}
			this.ctx.beginPath()
			this.ctx.strokeStyle = optDecoration.font;
			this.ctx.moveTo( pos.left + distance , pos.top + distance   );
			this.ctx.lineTo( (pos.left + pos.width) -distance , (pos.top + pos.height) -distance  );
			this.ctx.moveTo( (pos.left + pos.width ) -distance , pos.top +distance );
			this.ctx.lineTo( pos.left +distance , 	( pos.top + pos.height ) -distance );
			this.ctx.stroke();
		}
		
		
		/** Maximize */
		if ( this.options.maximize ){
			optDecoration = decoration.maximize;
			pos = {
				'left':this.maximizer.offsetLeft,
				'top':this.maximizer.offsetTop,
				'height':this.maximizer.offsetHeight,
				'width':this.maximizer.offsetWidth
			};
			if ( optDecoration.background ){
				this.ctx.beginPath();
				this.ctx.fillStyle = optDecoration.background;
				this.ctx.arc(  
						parseInt( pos.left + (pos.width/2) )  , //X
						parseInt( pos.top + (pos.height/2) )  , //Y
						parseInt(pos.width/2), 0, Math.PI * 2, true);			//Options
				this.ctx.fill();
			}
			this.ctx.beginPath();
			this.ctx.strokeStyle = optDecoration.font;
			this.ctx.moveTo( pos.left + distance , pos.top + distance  );
			this.ctx.lineWidth = 2;
			this.ctx.lineTo( (pos.left + pos.width)-distance , pos.top + distance );
			this.ctx.stroke();
			this.ctx.beginPath();
			this.ctx.lineWidth = 1;
			this.ctx.moveTo( (pos.left + pos.width)-distance , pos.top + distance  );
			this.ctx.lineTo( (pos.left + pos.width)-distance , (pos.top + pos.height ) - distance );
			this.ctx.lineTo( pos.left + distance , (pos.top + pos.height ) - distance );
			this.ctx.lineTo( pos.left + distance , pos.top + distance );
			this.ctx.stroke();
			
		}
		
		
		/** Minimize */
		if ( this.options.minimize ){
			optDecoration = decoration.minimize;
			pos = {
				'left':this.minimizer.offsetLeft,
				'top':this.minimizer.offsetTop,
				'height':this.minimizer.offsetHeight,
				'width':this.minimizer.offsetWidth
			};
			if ( optDecoration.background ){
				this.ctx.beginPath();
				this.ctx.fillStyle = optDecoration.background;
				this.ctx.arc(  
						parseInt( pos.left + (pos.width/2) )  , //X
						parseInt( pos.top + (pos.height/2) )  , //Y
						parseInt(pos.width/2), 0, Math.PI * 2, true);			//Options
				this.ctx.fill();
			}
			
			this.ctx.beginPath();
			this.ctx.lineWidth = 2;
			this.ctx.strokeStyle = optDecoration.font;
			this.ctx.moveTo( pos.left + distance , (pos.top + pos.height ) - distance  );
			this.ctx.lineTo( (pos.left +pos.width )- distance , (pos.top + pos.height ) - distance );
			this.ctx.stroke();
		}
		
		if ( this.options.resize && this.getStatus() == Popups.NORMAL_STATUS ){
			
			optDecoration = decoration.resize;
			pos = {
				'left':this.resizer.offsetLeft,
				'top':this.resizer.offsetTop,
				'height':this.resizer.offsetHeight,
				'width':this.resizer.offsetWidth
			};
			this.ctx.beginPath();
			this.ctx.fillStyle = optDecoration.background;
			this.ctx.lineWidth=1;
			
			distance = 8;
			
			this.ctx.moveTo( (pos.left + distance) , (pos.top + pos.height) );
			this.ctx.lineTo( (pos.left + pos.width) , (pos.top + pos.height) );
			this.ctx.lineTo( (pos.left + pos.width)  , (pos.top+distance) );
			
			this.ctx.closePath();
			
			this.ctx.fill();
		}
		
		return this;
	},


	'SKIP_UNLOAD': -11,
	'SKIP_CLOSE': -10,
	
	'close':function( ev ){
		
		var rsp = this.fireEvent( 'onBeforeClose' , [ this ] );
		if ( rsp == this.SKIP_CLOSE )
			return this;
		
		
		this.master.addClass('fde_hide');
		
		if ( this.bgEffect )
			this.bgEffect.start( {'opacity':0.0} );
		
		Popups.notDisplay( this );
		
		this.master.removeClass('fde_hide');
		
		this.isShown = false;
		
		rsp = this.fireEvent( 'onAfterClose' , [ this ] );
		if ( rsp == this.SKIP_UNLOAD )
			return this;
		
		
		Popups.remove( this );
		
		if ( ev )
			new Event( ev ).stop();
		
		return this.reset();
	},
	
	'restore':function(){
		this.master.addClass('fde_popup_normal')
		
		/* Restore from default */
		this.background.removeClass('fde_notPresent');
		this.background.removeClass('fde_hide');
		this.master.removeClass('fde_notPresent');
		this.master.removeClass('fde_hide');

		/* Restore from minimize use */
		if ( this.options.draggable )
			this.title.setStyle ('cursor','move') ;
		this.master.removeClass ('fde_popup_minimized') ;
		this.master.removeClass ('fde_popup_otherAnchor') ;
		this.master.setStyles ( {'width': '','height': ''}) ;
		this.title.setStyle('margin-top' , '' );

		/* Restore from maximize use */
		this.master.removeClass('fde_popup_maximized');

		this.setDimension();
		Popups.restore( this );
		Popups.notFocus( null , this.container );
		Popups.focus( this );
		
		this.fireEvent('onRestore' , [ this ] );
		return this;
	},
	
	
	'SKIP_MINIMIZE': -13,
	
	'minimize':function( ev ){
		
		if ( this.master.hasClass('fde_popup_minimized') ) return this.restore();
		
		if ( this.fireEvent('onMinimize', [this] ) == this.SKIP_MINIMIZE )
			return this;
		
		this.master.removeClass('fde_popup_maximized');
		
		this.currentDimension = {
			'top':this.master.offsetTop,
			'left':this.master.offsetLeft,
			'height':this.master.offsetHeight,
			'width':this.master.offsetWidth
		};
		
		this.master.removeClass( 'fde_popup_normal');
		this.master.addClass( 'fde_popup_minimized');


		/* Anchor on other element */
		var _w = '';var _h = ''; _t =0;
		if ( this.anchor !== this.container ){
			this.master.addClass( 'fde_popup_otherAnchor' );
			_w = this.anchor.offsetWidth;
			_h = this.anchor.offsetHeight;
			if ( _w > _h ){ _t = _h; _w = ''; _h = '100%';}
			else{ _t = _w; _h = ''; _w = '100%';}
			var _pos = parseInt( _t / 2  , 10 ) ;
			this.title.setStyle('margin-top' , '-' +  ( _pos + parseInt( this.title.offsetHeight / 2 , 10 ) ) + 'px' );
		}
		
		this.master.setStyles( {
			'width': _w,
			'height': _h
		} );

		this.title.setStyle('cursor','default');
		
		this.background.addClass('fde_notPresent');
				
		Popups.minimize( this );
		Popups.notFocus( this );
		
		this.master.setStyle('visibility','');
		
		this.paint();
		
		return this;
	},
	

	'SKIP_MAXIMIZE': -14,
	
	'maximize':function( ev ){
		
		if ( this.master.hasClass('fde_popup_maximized') ) return this.restore();
		
		if ( this.fireEvent('onMinimize', [this] ) == this.SKIP_MAXIMIZE )
			return this;
		
		this.master.removeClass('fde_popup_minimized');
		
		this.currentDimension = {
			'top':this.master.offsetTop,
			'left':this.master.offsetLeft,
			'height':this.master.offsetHeight,
			'width':this.master.offsetWidth
		};
		
		this.master.removeClass( 'fde_popup_normal');
		this.master.addClass( 'fde_popup_maximized');
		
		this.master.setStyles( {
			'top':0,
			'left':0,
			'width':'',
			'height':''
		} );
		
		this.title.setStyle('cursor','default');
		
		this.background.addClass('fde_notPresent');
		
		Popups.maximize( this );
		
		this.paint();
		
		if ( ev )
			new Event( ev ).stop();
			
		return this;
	},
	
	'getStatus':function(){
		if ( this.master.hasClass('fde_popup_normal')  )
			return Popups.NORMAL_STATUS;
		if ( this.master.hasClass('fde_popup_minimized')  )
			return Popups.MINIMIZED_STATUS;
		if ( this.master.hasClass('fde_popup_maximized')  )
			return Popups.MAXIMIZED_STATUS;
	},
	
	'getMaster':function(){
		return this.master;
	},
	'getContent':function(){
		return this.content;
	},
	'getTitle':function(){
		return this.title;
	},
	'getBackground':function(){
		return this.background;
	},
	'getContainer':function(){
		return this.container;
	},
	'getAnchor':function(){
		return this.anchor;
	},
	
	'focus':function(){
		if ( this.master.hasClass('fde_popup_otherAnchor') )
			this.restore();
			
		if ( this.isFocused ) return this;
		Popups.notFocus( null , this.container );
		Popups.focus( this );
		
		this.isFocused = true;
		return this;
	},
	
	'notFocus':function(){
		if ( !this.isFocused ) return this;
		this.isFocused = false;
	},
	
	'setFocusableEvents':function(){
		this.master.addEvent('mousedown', this.focus.bind(this) );
		this.title.addEvent('mousedown', this.focus.bind(this) );
		this.content.addEvent('mousedown', this.focus.bind(this) );
		this.canvas.addEvent('mousedown', this.focus.bind(this) );
		
		/*optional element*/
		this.closer.addEvent('mousedown', this.focus.bind(this) );
		this.resizer.addEvent('mousedown', this.focus.bind(this) );
		this.minimizer.addEvent('mousedown', this.focus.bind(this) );
		this.maximizer.addEvent('mousedown', this.focus.bind(this) );
		return this;
	}
});

Popup.implement( new Options , new Events );

document.write( '<link rel="stylesheet" type="text/css" href="css/popups.css" />');