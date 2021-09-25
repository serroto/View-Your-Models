
class scaleextension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
        var isActivate = false;
    }

    onSelected(event){
        let fragProxy = viewer.impl.getFragmentProxy(viewer.model, event.selections[0].fragIdsArray[0]);
        let x = document.getElementById("scaleX").value; 
        let y = document.getElementById("scaleY").value;
        let z = document.getElementById("scaleZ").value;
        fragProxy.getAnimTransform();
        fragProxy.scale = new THREE.Vector3(x,y,z);
        console.log(fragProxy);
        fragProxy.updateAnimTransform();
        viewer.impl.sceneUpdated(true);
    }

    load() {
        console.log('scale load');
        return true;
    }

    addEventListener() {
        viewer.addEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, this.onSelected);
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
        console.log('scaleextension has been unloaded');
        return true;
    }

    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('allscaleextensionToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('allscaleextensionToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('scaleextensionButton');
        this._button.onClick = (ev) => {
            // Execute an action here
            // Get current selection
            this.isActivate = !this.isActivate;
            if (this.isActivate) {
                console.log("add")
                this.addEventListener();
            } else {
                console.log("remove")
                viewer.removeEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, this.onSelected);
            }

        };
        this._button.setToolTip('Scale Extension');
        this._button.addClass('scaleextensionIcon');
        this._group.addControl(this._button);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('serra_scaleextension', scaleextension);