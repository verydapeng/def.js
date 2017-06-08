/*Copyright 2017 Liu Dapeng

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
