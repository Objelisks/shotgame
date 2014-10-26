define(function(require, exports) {
    var buttonActionMap = {
        'joystick': {
            0: 'a',
            1: 'b',
            2: 'x',
            3: 'y',
            4: 'leftShoulder',
            5: 'rightShoulder',
            6: 'leftTrigger',
            7: 'rightTrigger',
            8: 'back',
            9: 'start',
            10: 'leftStick',
            11: 'rightStick',
            12: 'up',
            13: 'down',
            14: 'left',
            15: 'right'
        }
    };

    var Input = function() {
        this.leftStick = new THREE.Vector2(0, 0);
        this.rightStick = new THREE.Vector2(0, 0);
        this.gamepadIndex = 0;
        this.lastButtons = {};

        // stack of event dispatchers
        // highest level one is the 'default' dispatcher
        // when something wants to take over all the input events, it pushes a dispatcher onto a stack
        this.inputDispatchers = [new THREE.EventDispatcher()];
    }

    Input.prototype.take = function(dispatcher) {
        this.inputDispatchers.push(dispatcher);
    }

    Input.prototype.release = function() {
        return this.inputDispatchers.pop();
    }

    Input.prototype.dispatchEvent = function(event) {
        return this.inputDispatchers[this.inputDispatchers.length-1].dispatchEvent(event);
    }

    Input.prototype.update = function(delta) {
        if(this.gamepadIndex === null) return;
        var gamepads = navigator.getGamepads();
        if(gamepads[this.gamepadIndex] === undefined) return;

        var updatedValues = navigator.getGamepads()[this.gamepadIndex];
        if(!updatedValues.connected) return;

        var self = this;

        // send button messages (pushed)
        var buttons = updatedValues.buttons;
        if(this.lastButtons !== null) {
          buttons.forEach(function(buttonValue, buttonIndex) {
            // monitor only for button value changes
            if(self.lastButtons[buttonIndex] !== undefined
              && buttonValue.value !== self.lastButtons[buttonIndex]) {
              self.dispatchEvent({
                'type': buttonActionMap['joystick'][buttonIndex],
                'message': buttonValue.value,
                'delta': delta
              });
            }

            self.lastButtons[buttonIndex] = buttonValue.value;
          });
        }

        // update axis values (pushed)
        var axes = updatedValues.axes;
        this.dispatchEvent({
          'type': 'leftStick',
          'message': new THREE.Vector2(axes[0], axes[1]),
          'delta': delta
        });
        this.dispatchEvent({
          'type': 'rightStick',
          'message': new THREE.Vector2(axes[2], axes[3]),
          'delta': delta
        });
    };


    // singleton
    return new Input();

});