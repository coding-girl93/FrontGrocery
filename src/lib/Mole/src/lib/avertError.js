setTimeout(function(){
    !window.Mole && (window.Mole={});
    Mole.performance = Mole.performance || {};
    Mole.performance.firstScreenTime = Mole.performance.firstScreenTime || function(){};
    Mole.performance.custom = Mole.performance.custom || function(){};
    Mole.log = Mole.log || {};
    Mole.log.debug = Mole.log.debug || function(){};
    Mole.log.error = Mole.log.error || function(){};
    Mole.init = Mole.init || function(){};
},0);