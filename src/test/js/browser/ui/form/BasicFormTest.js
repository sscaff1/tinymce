asynctest(
  'Basic Form',
 
  [
    'ephox.agar.api.Keyboard',
    'ephox.agar.api.Keys',
    'ephox.agar.api.Step',
    'ephox.alloy.api.GuiFactory',
    'ephox.alloy.api.ui.Form',
    'ephox.alloy.construct.EventHandler',
    'ephox.alloy.test.GuiSetup',
    'ephox.peanut.Fun'
  ],
 
  function (Keyboard, Keys, Step, GuiFactory, Form, EventHandler, GuiSetup, Fun) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    GuiSetup.setup(function (store, doc, body) {
      return GuiFactory.build(
        Form.build({
          dom: {
            tag: 'div'
          },
          parts: {
            'form.ant': {
              type: 'text-input',
              parts: { }
            }
          },
          members: {
            ui: {
              munge: Fun.identity
            }
          }
        })
      );

    }, function (doc, body, gui, component, store) {
      return [
        Step.fail('Basic form demo')
      ];
    }, function () { success(); }, failure);

  }
);