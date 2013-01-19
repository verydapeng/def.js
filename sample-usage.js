def('dev/d1').as({
    name : 'i am d1'
});

def('dev/d2').as({
    name : 'i am d2'
});

def('team').using('dev/d1', 'dev/d2').by(function(d1, d2) {
    console.log(d1.name === 'i am d1');
    console.log(d2.name === 'i am d2');
});