# advertol

Advertisement zones manager. *Cure for your advertisement management headaches.*

Features:

* Custom advetisement servers implementation
* Lifecycle hooks for controlling zones and contexts

By default Advertol doesn’t apply any functionality but relies on [core][advertol-core] and plugins for control, context and service. Read documentation for each plugin type to learn how to create your custom plugin.

* [Control](docs/control.md)
* [Context](docs/context.md)
* [Service](docs/service.md)

## Related packages

* [@advertol/core][advertol-core] - Core module for creating Advertol instance.
* [@advertol/control-element-classes][advertol-control-element-classes] - Add HTML classes to zone DOM elements based on zone state.
* [@advertol/context-media-query][advertol-context-media-query] - Control zone visibility with CSS media query listeners.
* [@advertol/service-google-dfp][advertol-service-google-dfp] - Google DFP/Ad Manager service.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

[advertol-core]: https://github.com/niksy/advertol-core
[advertol-control-element-classes]: https://github.com/niksy/advertol-control-element-classes
[advertol-context-media-query]: https://github.com/niksy/advertol-context-media-query
[advertol-service-google-dfp]: https://github.com/niksy/advertol-service-google-dfp
