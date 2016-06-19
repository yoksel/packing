(function (window) {

  var $ = tinyLib;
  var volumesContent = $.get('.volumes__list');
  var resultContent = $.get('.result__list');

  var volumesSum = 0;

  var Calculator = {
    signs: ['*','/','+', '-'],
    firstSigns: ['*','/'],
    secondSigns: ['+','-'],
    parts: [],
    result: 0
  };

  //------------------------------

  Calculator.compute = function ( str ) {

    this.str = str;
    this.strToArr();
    this.handleParts();

    return this.result;
  }

  //------------------------------

  Calculator.strToArr = function () {
    var stack = '';
    var parts = [];

    for (var i = 0; i < this.str.length; i++) {
      var item = this.str[i];

      if ( this.signs.indexOf( item ) >= 0 ) {
        parts.push( +stack );
        stack = '';

        parts.push( item );
      }
      else if ( item !== ' ' ) {
        stack += item;
      }
    }
    parts.push( +stack );

    this.parts = parts;
  }

  //------------------------------

  Calculator.handleParts = function () {
    var parts = this.parts;
    var result = 0;

    this.handleBySigns( this.firstSigns );
    this.handleBySigns( this.secondSigns );

    this.result = this.parts[ 0 ];
  }

  //------------------------------

  Calculator.handleBySigns = function ( currentSigns ) {
    var parts = this.parts;

    for (var k = 0; k <= parts.length; k++) {
      var item = parts[k];

      if ( currentSigns.indexOf( item ) >= 0 ) {
        var sign = item;
        var prev = +parts[ k - 1 ];
        var next = +parts[ k + 1 ];
        var mathResult = doMath( sign, prev, next);
        var removeItems = parts.splice(k - 1, 3, mathResult);
        k--;
      }
    }
  }

  //------------------------------

  function doMath( sign, prev, next ) {
    var result = 0;

    if ( sign === '*' ) {
      result = prev * next;
    }
    else if ( sign === '/' ) {
      result = prev / next;
    }
    else if ( sign === '+' ) {
      result = prev + next;
    }
    else if ( sign === '-' ) {
      result = prev - next;
    }

    return result;
  }

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
        metricsOut + ' — ' + box.price + 'р.',
        'Нужное количество: ' + boxCount,
        'Стоимость: ' + box.price * boxCount + 'р.' ,
      ].join( '<br>' );

      var item = $.create('li').addClass('result__item').html( out );
      resultContent.append( item );
    }

  }

  //------------------------------

  sumVolumes();
  countBoxes();

  //------------------------------


  // input.elem.oninput = function () {
  //   console.log( Calculator.compute( this.value ) );

  // }

})(window);
