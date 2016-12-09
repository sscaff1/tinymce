define(
  'ephox.alloy.spec.SpecSchema',

  [
    'ephox.alloy.spec.UiSubstitutes',
    'ephox.boulder.api.FieldPresence',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.Objects',
    'ephox.boulder.api.ValueSchema',
    'ephox.compass.Arr',
    'ephox.compass.Obj',
    'ephox.highway.Merger',
    'ephox.numerosity.api.JSON',
    'ephox.peanut.Fun',
    'global!Error'
  ],

  function (UiSubstitutes, FieldPresence, FieldSchema, Objects, ValueSchema, Arr, Obj, Merger, Json, Fun, Error) {
    var getPartsSchema = function (partNames, _optPartNames) {
      if (partNames.length === 0) return [ ];
      var optPartNames = _optPartNames !== undefined ? _optPartNames : [ ];

      // temporary hacking
      var partsSchema = FieldSchema.strictObjOf(
        'parts',
        Arr.flatten([
          Arr.map(partNames, FieldSchema.strict),
          Arr.map(optPartNames, function (optPart) {
            return FieldSchema.defaulted(optPart, UiSubstitutes.single(false, function () {
              throw new Error('The optional part: ' + optPart + ' was not specified in the config, but it was used in components');
            }));
          })
        ])
      );

      var partUidsSchema = FieldSchema.state(
        'partUids',
        function (spec) {
          if (! Objects.hasKey(spec, 'parts')) throw new Error(
            'Part uid definition requires "parts"\nSpec: ' +
            Json.stringify(spec, null, 2)
          );
          var uids = Obj.map(spec.parts, function (v, k) {
            return Objects.readOptFrom(v, 'uid').getOrThunk(function () {
              return spec.uid + '-' + k;
            });
          });
          return uids;
        }
      );

      return [ partsSchema, partUidsSchema ];
    };

    var base = function (label, partNames, optPartNames, spec) {
      var partsSchema = getPartsSchema(partNames, optPartNames !== undefined ? optPartNames : [ ]);

      return partsSchema.concat([
        FieldSchema.strict('uid'),
        FieldSchema.defaulted('dom', { }), // Maybe get rid of.
        FieldSchema.defaulted('components', [ ]),
        FieldSchema.state('originalSpec', Fun.identity)
      ]);
    };


    var asRawOrDie = function (label, schema, spec, partNames, optPartNames) {

      var baseS = base(label, partNames, optPartNames, spec);
      return ValueSchema.asRawOrDie(label + ' [SpecSchema]', ValueSchema.objOf(baseS.concat(schema)), spec);
    };

    var asStructOrDie = function (label, schema, spec, partNames, optPartNames) {
      var baseS = base(label, partNames, optPartNames, spec);
      return ValueSchema.asStructOrDie(label + ' [SpecSchema]', ValueSchema.objOf(baseS.concat(schema)), spec);
    };

    var extend = function (builder, original, nu) {
      // Merge all at the moment.
      var newSpec = Merger.deepMerge(original, nu);
      return builder(newSpec);
    };

    var addBehaviours = function (original, behaviours) {
      return Merger.deepMerge(original, behaviours);
    };

    
    return {
      asRawOrDie: asRawOrDie,
      asStructOrDie: asStructOrDie,
      addBehaviours: addBehaviours,

      getPartsSchema: getPartsSchema,
      extend: extend
    };
  }
);