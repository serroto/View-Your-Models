class inputsExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options, event, fragProxy) {
        super(viewer, options);
        this._group = null;
        this._button = null;
        this.event = event;
        this.fragProxy = fragProxy;
    }

    load() {
        console.log('inputs Extension has been loaded');
        return true;
    }

    addEventListener() {
        viewer.addEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, this.onSelected);
    }

    onSelected(event) {
        this.fragProxy = viewer.impl.getFragmentProxy(viewer.model, event.selections[0].fragIdsArray[0]);
        this.fragProxy.getAnimTransform();
        let frags = viewer.model.getFragmentList();
        let bbox = new THREE.Box3();
        let fragId = event.selections[0].fragIdsArray[0];
        frags.getWorldBounds(fragId, bbox);
        this.originalX = (bbox.max.x - bbox.min.x);
        this.originalY = (bbox.max.y - bbox.min.y);
        this.originalZ = (bbox.max.z - bbox.min.z);
        document.getElementById("scaleX").value = this.originalX;
        document.getElementById("scaleY").value = this.originalY;
        document.getElementById("scaleZ").value = this.originalZ;
    }

    unload() {
        viewer.removeEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, this.onSelected);
        console.log('deactivate');
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('inputs Extension has been unloaded');
        return true;
    }

    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('allinputsExtensionsToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('allinputsExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('allinputsExtensionButton');
        this._button.onClick = (ev) => {
            this.isActivate = !this.isActivate;
            if (this.isActivate) {
                console.log("add")
                this.addEventListener();
            } else {
                console.log("remove")
                viewer.removeEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, this.onSelected);
            }
        };
        this._button.setToolTip('Original Dimensions Extension');
        this._button.addClass('inputsExtensionIcon');
        this._group.addControl(this._button);

    }
}
Autodesk.Viewing.theExtensionManager.registerExtension('serra_inputsExtension', inputsExtension);

