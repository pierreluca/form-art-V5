$( document ).ready( function() {
	

	app.init();

	$( document ).on('scroll', function(){
		app.generalRebuild();
	});

	$( window ).on('resize', function(){
		special.resizeWelcomeBox();
		special.resizeElementLike( '.become__content--back', '.become__content' );
		form.setOrder( utility.getDevice() );
	});
});



var form = function() {
	// Get the form.
    var $form 			= $('#richiesta');
    // Get the messages div.
    var $formMessages 	= $('#form-messages');

    var $inNome 		= $('input[name=nome]'),
    	$inCognome 		= $('input[name=cognome]'),
    	$inEmail 		= $('input[name=email]'),
    	$inTel 			= $('input[name=tel]'),
    	$inCodFiscale 	= $('input[name=cod-fiscale]'),
    	$inGenereLetterario = $('select[name=genere-letterario]'),
    	$inPrivacy 		= $('input[name=privacy]'),
    	validator;

	function init() {
	    // Set up an event listener for the contact form.
		$form.submit(function(event) {
		    // Stop the browser from submitting the form.
		    event.preventDefault();

		    if( checkForm() ){
		    	// Serialize the form data.
				var formData = $form.serialize();
				
				// Submit the form using AJAX.
				$.ajax({
				    type: 'POST',
				    url: $form.attr('action'),
				    data: formData
				})
				.done(function(response) {
				    // Make sure that the formMessages div has the 'success' class.
				    ////$formMessages.removeClass('error');
				    ////$formMessages.addClass('success');
				    $formMessages.css('background-color','green');

				    // Set the message text.
				    $formMessages.text(response);

				    // Clear the form.
				    ////$('#name').val('');
				    ////$('#email').val('');
				    ////$('#message').val('');
				})
				.fail(function(data) {
				    // Make sure that the formMessages div has the 'error' class.
				    ////$formMessages.removeClass('success');
				    ////$formMessages.addClass('error');
				    $formMessages.css('background-color','red');

				    // Set the message text.
				    if (data.responseText !== '') {
				        $formMessages.text(data.responseText);
				    } else {
				        $formMessages.text('Oops! An error occured and your message could not be sent.');
				    }
				});
			}

		});
	}

	function setOrder(device){
		if( device == "smartphone" || ( device == "tablet" &&  $(window).width() < 750  ) ){
			$inCognome.parent().insertBefore( $inEmail.parent() );
		} else {
			$inEmail.parent().insertBefore( $inCognome.parent() );
		}
	}

	function checkForm(){
		
		/*
		if($inNome.val() == "") { $inNome.css('border','2px solid red') }
		if($inCognome.val() == "") { $inCognome.css('border','2px solid red') }
		if($inCodFiscale.val() == "") { $inCodFiscale.css('border','2px solid red') }
		if($inEmail.val() == "") { $inEmail.css('border','2px solid red') }
		if($inTel.val() == "") { $inTel.css('border','2px solid red') }
		if($inGenereLetterario.val() == "") { $inGenereLetterario.css('border','2px solid red') }
		*/
		//console.log( $inGenereLetterario.val() );
		//console.log( $inPrivacy.prop('checked') );
		validator = $("#richiesta").validate();
		if( validator.form() ){ console.log('SEND FORM'); }
		
		return false;
	}

	return {
		init: init,
		setOrder: setOrder
	}
}();


var app = function(){

	var $body			= $('html,body'),
		$sections 		= $('section'),
		sections		= ['.one','.two','.three','.four','.five','.six','.seven','.eight'],
		$firstSection 	= $('section:nth-child(1)'),
		$header			= $('header'),
		$arrow__down	= $('.arrow__down'),
		$arrow__up		= $('.arrow__up'),
		$arrow__page	= $('.arrow--in-page'),
		$arrow__top		= $('.arrow__top'),
		$inputMainName	= $('#name_top'),
		$namePlaceholder= $('.name-placeholder'),
		duration		= 600,
		appRunning		= false,
		sectionActive 	= null;

	$inputMainName
		.on('input', function(){
			var value = $inputMainName.val();
			value.length > 0 ? start() : init();
		});	

	function init(){
		appRunning = false;
		sectionActive = null;
		special.resizeWelcomeBox();
		$sections.hide();
		$firstSection.show();
		generalRebuild();
		scrollTo('top');
		$inputMainName.off('keypress');
		$inputMainName.focus();
	}

	function start(){
		if( appRunning == false ){
			appRunning = true;
			$sections.show();
			$inputMainName
				.keypress( function(e){
					var key = e.which;
					if( key == 13 ){ 
						$inputMainName.blur();
						scrollTo('next');
					}
				})
				.on('change', function(){
					$namePlaceholder.text( $(this).val() );
				});
			generalRebuild();
			special.resizeElementLike('.become__content--back', '.become__content');
			form.setOrder( utility.getDevice() );
			form.init();
		}
	}

	function generalRebuild(){
		if( appRunning == false ) {
			
			$arrow__down.addClass('arrow--disabled');
			$arrow__page.addClass('arrow--disabled');
			$arrow__top.hide();

		} else {
			
			var i = getSectionActive();
			
			if( i != sectionActive ){

				sectionActive = i;

				$arrow__up.off('click');
				$arrow__down.off('click');
				$arrow__top.off('click');
				$arrow__page.off('click');

				if( i == 0 ){
					
					$arrow__page.removeClass('arrow--disabled');
					$arrow__page.on('click', function(){
						scrollTo('next');
					});

					$arrow__up.addClass('arrow--disabled');
					
					$arrow__down.removeClass('arrow--disabled');
					$arrow__down.on('click', function(){
						scrollTo('next');
					});

					$arrow__top.hide();

				} else if( i > 0 ) {
					
					$arrow__down.removeClass('arrow--disabled');
					$arrow__down.on('click', function(){
						scrollTo('next');
					});
					
					$arrow__up.removeClass('arrow--disabled');
					$arrow__up.on('click', function(){
						scrollTo('prev');
					});

					$arrow__top.show();
					$arrow__top.removeClass('arrow--disabled');
					$arrow__top.on('click', function(){
						scrollTo('top');
					});

					if( i >= sections.length ){
					
						$arrow__down.off('click');
						$arrow__down.addClass('arrow--disabled');

					}
				}

			}
			
		}
	}

	function getSectionActive(){
		var currentTop = window.pageYOffset || document.documentElement.scrollTop,
			i = 0,
			sectionTop = 0,
			heightHeader = $header.height();
		
		for(;i<sections.length;i++){
			sectionTop = $( sections[i] ).offset().top;
			if( currentTop+heightHeader <= sectionTop ){ break }
		}
		return i;
	}

	function scrollTo(where){
		var destinationY = 0;
		if( where == "undefined" ){ return false }
		else if( where == "next" || where == "prev" ){ destinationY = getSectionTop(where); }
		$body.animate({ 
			scrollTop: destinationY 
		}, {
			duration: duration,
			queue: true
		}).promise().then( function(){
			generalRebuild();
		});
	}

	function getSectionTop(which){
		var i = getSectionActive();
		if( which == 'next' && i==0 ) { i++; }
		else if( which == 'prev' && i > 1 ) { i=i-2; }
		else if( which == 'prev' && i <= 1 ) { i--; }
		var destinationTop = $( sections[i] ).offset().top,
			heightHeader = $header.outerHeight();
		if( i == 0 ) { destinationTop = destinationTop - 20; }
		else { destinationTop = destinationTop + 1; }
		return destinationTop - heightHeader;
	}

	return {
		init: init,
		generalRebuild: generalRebuild
	}

}();

var special = function(){

	var	hWelcomeOrig	= 0,
		wWelcomeOrig	= 0;

	function resizeElementLike(elResize, elLike){
		var $el = $( elLike ),
			elW = $el.outerWidth(),
			elH = $el.outerHeight(),
			$elBack = $( elResize );
		$elBack.css('width',elW).css('height',elH);
	}

	function changeTab(tab){
		$('.box-red__content p').addClass('h-d-none');
		$('.p-'+tab).removeClass('h-d-none');
		$('.box-red__tab').addClass('box-red__tab--active');
		$('.tab-'+tab).removeClass('box-red__tab--active');
	}
	function changeListTab(n){
		closeListTab();
		$('.list-tab-'+n).removeClass('h-h-zero').removeClass('h-op-zero').addClass('h-op-one');
	}
	function closeListTab(){
		$('.box-red__tab-mask').removeClass('h-op-one').addClass('h-op-zero').addClass('h-h-zero');
	}

	function showTabStatuto(){
		$('.tab-statuto').removeClass('h-h-zero').removeClass('h-op-zero').addClass('h-op-one');
	}
	function closeTabStatuto(){
		$('.tab-statuto').removeClass('h-op-one').addClass('h-op-zero').addClass('h-h-zero');
	}

	function resizeWelcomeBox(){
		if( utility.getDevice()=='desktop' ){ 
			resizeElementByPercentageScreen( '.welcome', 58, 'h' ); 
		} else if( utility.getDevice()=='tablet' ){ 
			resizeElementByPercentageScreen( '.welcome', 40, 'w' ); 
		} else if( utility.getDevice()=='smartphone' ){ 
			resizeElementByPercentageScreen( '.welcome', 66, 'w' ); 
		}
	}

	function resizeElementByPercentageScreen( el, percentage, wORh ){
		if( wORh=="undefined" ){ var wORh='h'}

		var $el = $(el),
			hWin = $(window).outerHeight(),
			wWin = $(window).outerWidth();

		if( hWelcomeOrig==0 && wWelcomeOrig==0 ) {
			hWelcomeOrig = $el.outerHeight();
			wWelcomeOrig = $el.outerWidth();
		}

		if( wORh=='h' ){
			var hWelNew = parseInt( ( hWin * percentage ) / 100 ),
				wWelNew = parseInt( ( wWelcomeOrig * hWelNew ) / hWelcomeOrig );
		} else if( wORh=='w' ){
			var hWelNew = parseInt( ( wWin * percentage ) / 100 ),
				wWelNew = parseInt( ( wWelcomeOrig * hWelNew ) / hWelcomeOrig );
		}
		
		$el.css('width',wWelNew+'px').css('height',hWelNew+'px');
		//$('.a').text(wWelNew);
		//$('.b').text(hWelNew);
		
		var m, z;
		z = (parseInt(hWelNew / 10))*2;
		$('.arrow--in-page').css('width',z+'px').css('height',z+'px');

		if( hWelNew <= 185 ){ m = 0.4; }
		else if( hWelNew >= 186 && hWelNew <= 240 ){ m = 0.9; }
		else if( hWelNew >= 241 && hWelNew <= 315 ){ m = 1.3; }
		else if( hWelNew >= 316 && hWelNew <= 480 ){ m = 1.6; }
		else if( hWelNew >= 481 ){ m = 2; }
		var n = ( hWelNew / 100 ) - m;
		$el.css('font-size',n+'em');
		//$('#name').css('font-size',(n+20)+'px');
	}

	return {
		resizeElementLike: resizeElementLike,
		changeTab: changeTab,
		changeListTab: changeListTab,
		closeListTab: closeListTab,
		showTabStatuto: showTabStatuto,
		closeTabStatuto: closeTabStatuto,
		resizeWelcomeBox: resizeWelcomeBox
	}

}();



var utility = function(){
	
	function isMobile(val=false){
		if(val==false){
			if($(window).width() <= 960){
				return true;
			}
		} else if (val=="tablet"){
			if($(window).width() <= 768){
				return true;
			}
		} else if (val=="smartphone"){
			if($(window).width() <= 480){
				return true;
			}
		}
	}

	function getDevice(){
		if( $(window).width() >= 960 ){
			return 'desktop';
		} else {
			if( $(window).width() >= 480 ){
				return 'tablet';
			} else {
				return 'smartphone';
			}
		} 
	}

	return {
		getDevice: getDevice
	}

}();