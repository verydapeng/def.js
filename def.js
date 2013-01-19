window.def = window.def || (function() {
    var mod = {}; // cache, name -> dfd
    var noop = {resolve : $.noop};
    var ns = {}; // what are the names in use

    $(function() { // safe guard against the unresolvables
        $.each(mod, function(k, v) {
            if (v.state() == 'pending') {
                console.log(k + ' is not resolved, upon page load');
            }
        });
    });

    function depend(name) {
        if (!name) {
            return noop;
        } else if (!mod[name]) {
            mod[name] = $.Deferred();
        }
        return mod[name];
    };

    function construct(dfd, dependencies, fn) {
        $.when.apply(null, $.map(dependencies, depend)).done(function() {
            dfd.resolve(fn.apply(null, arguments));
        });
    }

    function print(name, dependencies) {
        name = name || '*anonymous*';
        console.log(name + " -> [" + dependencies + "]");
    }
    
    function checkUnique(name) {
        if (!name) {
            return;
        }

        if (ns[name]) {
            throw name + ' is already in use';
        } else {
            ns[name] = true;
        }
    }

    return function(name) {
        
        checkUnique(name);

        var dfd = depend(name);
        var dependencies = [];

        var result = {
            using: function() {
                dependencies = $.map(arguments, function(v){return v;});
                return result;
            }, 
            as: function(obj) {
                print(name, dependencies);
                construct(dfd, dependencies, function() {
                    return obj;
                });
            }, 
            by: function(fn) {
                print(name, dependencies);
                construct(dfd, dependencies, fn);
            }
        };

        return result;
    };
}());