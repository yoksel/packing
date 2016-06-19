(function (window) {

  'use strict';

  var $ = tinyLib;

  if ( !config ) {
    console.log( 'Конфиг не найден' );
  }

  var volumesContent = $.get('.volumes__list');
  var resultContent = $.get('.result__list');

  var volumes = config.volumes;
  var boxes = config.boxes;

  var volumesSum = 0;

  //------------------------------

  function sumVolumes() {
    var sum = 0;
    // console.log( volumes );

    for (var i = 0; i < volumes.length; i++) {
      var item = volumes[i];
      var volume = Calculator.compute( item.metrics )
      sum += volume;

      var metricsElem = $.create('span').addClass('metrics').html( item.metrics );
      var metricsOut = metricsElem.elem.outerHTML;

      var out = [
      '<b>' + item.name + '</b>' ,
        metricsOut + ' / ' + volume + ' см<sup>3</sup>',
      ].join( '<br>' );

      var item = $.create('li').addClass('volumes__item').html( out );
      volumesContent.append( item );
    }

    volumesSum = sum;
  }

  //------------------------------

  function countBoxes() {

    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[ i ];
      var boxVolume = Calculator.compute( box.metrics );
      var boxCount = Math.ceil( volumesSum / boxVolume );

      var metricsElem = $.create('span').addClass('metrics').html( box.metrics );
      var metricsOut = metricsElem.elem.outerHTML;

      var out = [
        metricsOut + ' — ' + box.price + ' р.',
        'Нужное количество: ' + boxCount + ' шт.',
        'Стоимость: ' + box.price * boxCount + ' р.' ,
      ].join( '<br>' );

      var item = $.create('li').addClass('result__item').html( out );
      resultContent.append( item );
    }

  }

  //------------------------------

  sumVolumes();
  countBoxes();

})(window);
