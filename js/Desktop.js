/**
 * @author fabiodjmix
 */
var DesktopAttributes = {
	'defaultWallpaper':'images/wallpaper.jpg',
	'cssClass':'desktop',
	'id':'desktop',
	'centered':1,
	'repeated':2,
	'scaled':3,
	'default':0,
	'scaled':4
};

var Desktop = Component.extend({
	
	'dockbars':$H({}),
	
	'options':{
		'wallpaper':undefined,
		'wallpaperStyle':DesktopAttributes['centered']
	},
	
	'initialize':function(params){
		
		if ( !params ) return this;
		this.components = $A([]);
		this.options = $merge(this.options, params);
		
		this.parent( this.options );
		
		this.element.addClass( 'fde_desktop' );
		
		this.hide();
		
		return this;
		
	},
	
	'show':function(){
		this.parent();
		if (this.options.wallpaper && !this.wallpaperDrawed )
			this.setWallpaper( this.options.wallpaper );
		this.element.removeClass('fde_hide');
		return this;
	},
	
	'paint':function(){
		
		this.parent();
		this.injectElement();
		
		if ( this.options.wallpaper )
			this.doCanvas();
		
		return this;
	},
	
	'hide':function(){
		this.element.addClass('fde_hide');
		this.parent();
	},
	
	'setIdentity':function(id){
		this.parent();
		//TODO
		this.element.setProperty('id', this.getIdentity() );
	},
	
	'doCanvas':function(){
		if (!this.canvas) {
			this.canvas = new Element('canvas',{
				'class':'fde_background'
			});
		}
		if ( ! this.element.hasChild( this.canvas ) ){
			if (window.ie) {
				this.canvas.setProperty('id','tmpID');
				this.canvas.inject(document.body);
				G_vmlCanvasManager.initElement(this.canvas);
				this.canvas = document.body.getElement('canvas[id=tmpID]');
				this.canvas.removeProperty('id');
				this.canvas.remove();
			}
			this.canvas.inject(this.element,'top');
		}
		this.canvas.setProperties({
			'height': this.element.offsetHeight,
			'width': this.element.offsetWidth
		});
		if ( ! this.ctx )
			this.ctx = this.canvas.getContext('2d');
	},
	
	'setWallpaper':function(path){
		this.doCanvas();
		var newimage = new Image();
		$(newimage);
		newimage.addClass('fde_tmp');
		
		newimage.src = path + '?' + new Date().getTime();
		
		if (window.ie) {
			var tmr = null;
			var a = function(oldValue){
				if (oldValue != (newimage.offsetHeight * newimage.offsetWidth)) {
					this.drawWallpaper.bind(this,[$(newimage)])();
					$clear( tmr );
				}
			}
			tmr = a.periodical( 10, this, [newimage.offsetHeight * newimage.offsetWidth] );
		}else
			newimage.onload = this.drawWallpaper.bind(this,[$(newimage)]);
		$(newimage).inject(document.body);
		
	},
	
	'drawWallpaper':function(image){
		this.ctx.clearRect(0,0, this.canvas.getProperty('width') ,this.canvas.getProperty('height'))
		var hw = image.offsetHeight;
		var ww = image.offsetWidth;
		
		switch ( this.options['wallpaperStyle']  ){
			case DesktopAttributes['scaled']:
				//this.ctx.scale( this.canvas.getProperty('width') / ww , this.canvas.getProperty('height') / hw );
				this.ctx.drawImage( image , 0 , 0 , this.canvas.getProperty('width'), this.canvas.getProperty('height') );
				break;
			case DesktopAttributes['repeated']:
				
				var nH = ((this.canvas.getProperty('height') / hw ) + 1).toInt();
				var nW = ((this.canvas.getProperty('width') / ww ) + 1).toInt();
				
				var posY =0;
				for ( var i=0 ; i<nH ; i++ ){
					var posX=0;
					for ( var j =0; j<nW; j++){
						this.ctx.drawImage(image,posX,posY, ww ,hw);
						posX += ww;
					}
					posY += hw;
				}
				break;
			case DesktopAttributes['centered']:
			
				var posX=0;var posY =0;
				
				posY = (this.canvas.getProperty('height') / 2).toInt()  -  (hw /2).toInt();
				posX = (this.canvas.getProperty('width') / 2).toInt()  -  (ww /2).toInt();
			
				this.ctx.drawImage(image,posX,posY , ww ,hw);
			
				break;
			case DesktopAttributes['default']:
			default:
				this.ctx.drawImage(image,0,0);
		}
		this.wallpaper = image;
		this.wallpaperDrawed = true;
		image.remove();
	}
	
});

Desktop.implement(new Events,new Options);
document.write( '<link rel="stylesheet" type="text/css" href="css/desktop.css" />');