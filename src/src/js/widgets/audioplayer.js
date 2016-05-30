

$(function(){



  $('.widget-audioplayer').initialize(function(e) {
      var that = $(this);
      var volumeDefault   = 0;
      that.data('current', 0);
      playlist = that.find('.playlist');
      that.find('.audioplayer-time-duration').html( '&hellip;' );

      var audio = new Audio();
      audio.setSinkId(settings.get('sounddevice'));    
      audio.play();

      fs.readdir(that.parent('li').data('path'), function(err, files) {
        for(var i in files) {
          
          var filename = files[i];
          var extension = path.extname(filename)

          if (extension == ".wav" || extension == '.mp3' || extension == '.ogg') {
            that.find('.playlist').append('<li><span href="'+that.parent('li').data('path') +'\\'+ filename +'">'+filename+'</span></li>');
          }
        }
        that.find('.playlist').find('li:first-child').addClass('active');
        link = that.find('.playlist').find('span')[0];
        run($(link), false)

        that.find('.playlist').find('span').click(function(e) {
            e.preventDefault();
            link = $(this);
            that.data('current', link.parent().index());
            run(link, true);
        });
      });

      that.find('.audioplayer-playpause').click(function(e) {
          if (audio.paused === true) {
            audio.play();
            that.find('.audioplayer').addClass("audioplayer-playing")
          } else {
            audio.pause();
            that.find('.audioplayer').removeClass("audioplayer-playing")
          }
      });

      audio.addEventListener( 'loadeddata', function() {
          that.find('.audioplayer-time-duration').text( secondsToTime( audio.duration ) );
          that.find('.audioplayer-volume-adjust div').find( 'div' ).height( audio.volume * 100 + '%' );
      });

      audio.addEventListener( 'timeupdate', function() {
          that.find('.audioplayer-time-current').text( secondsToTime( audio.currentTime ) );
          that.find('.audioplayer-bar-played').width( ( audio.currentTime / audio.duration ) * 100 + '%' );
      });

      audio.addEventListener('ended',function(e) {
          that.data('current', parseInt(that.data('current'))+1);
          if(parseInt(that.data('current')) >= that.find('.playlist').find('span').length){
              that.data('current', 0);
              link = that.find('.playlist').find('span')[0];
          }else{
              link = that.find('.playlist').find('span')[parseInt(that.data('current'))];    
          }
          run($(link), true);
      });

      audio.addEventListener( 'volumechange', function()
        {
          that.find('.audioplayer-volume-adjust div').find( 'div' ).height( audio.volume * 100 + '%' );
          if( audio.volume > 0 && that.find('.audioplayer').hasClass( "mute" ) ) that.find('.audioplayer').removeClass( "mute" );
          if( audio.volume <= 0 && !that.find('.audioplayer').hasClass( "mute" ) ) that.find('.audioplayer').addClass( "mute" );
          volumeDefault = audio.volume;
        });

      that.find('.audioplayer-bar').on( 'click', function()
        {
          if( that.find('.audioplayer').hasClass( "mute" ) )
          {
            that.find('.audioplayer').removeClass( "mute" );
            audio.volume = volumeDefault;
          }
          else
          {
            that.find('.audioplayer').addClass( "mute" );
            volumeDefault = audio.volume;
            audio.volume = 0;
          }
          return false;
        });

      that.find('.audioplayer-bar').on( 'mousedown', function( e )        {
        adjustCurrentTime( e );
        that.find('.audioplayer-bar').on( 'mousemove', function( e ) { adjustCurrentTime( e ); } );
      })
      .on( 'mouseup', function()
      {
        that.find('.audioplayer-bar').unbind( 'mousemove' );
      });

      that.find('.audioplayer-volume-adjust').on( 'mousedown', function( e )
      {
        adjustVolume( e );
        that.find('.audioplayer-volume-adjust').on( 'mousemove', function( e ) { adjustVolume( e ); } );
      })
      .on( 'mouseup', function()
      {
        that.find('.audioplayer-volume-adjust').unbind( 'mousemove' );
      });

      function secondsToTime( secs ) {
        var hours = Math.floor( secs / 3600 ), minutes = Math.floor( secs % 3600 / 60 ), seconds = Math.ceil( secs % 3600 % 60 );
        return ( hours == 0 ? '' : hours > 0 && hours.toString().length < 2 ? '0'+hours+':' : hours+':' ) + ( minutes.toString().length < 2 ? '0'+minutes : minutes ) + ':' + ( seconds.toString().length < 2 ? '0'+seconds : seconds );
      }

      function adjustCurrentTime( e ) {
        audio.currentTime = Math.round( ( audio.duration * ( e.pageX - that.find('.audioplayer-bar').offset().left ) ) / that.find('.audioplayer-bar').width() );
      }

      function adjustVolume(e) {
            audio.volume = Math.abs( ( e.pageY - ( that.find('.audioplayer-volume-adjust').offset().top + that.find('.audioplayer-volume-adjust').height() ) ) / that.find('.audioplayer-volume-adjust').height() );
      }

      function run(link, autoplay){
          audio.src = link.attr('href');
          par = link.parent();
          par.addClass('active').siblings().removeClass('active');
          audio.load();
          if (autoplay) {
            audio.play();
            that.find('.audioplayer').addClass("audioplayer-playing")
          }
      }
  });

  

});


