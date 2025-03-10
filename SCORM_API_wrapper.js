// SCORM_API_wrapper.js
var scorm = pipwerks.SCORM;
scorm.version = "1.2";

function initSCORM() {
    scorm.init();
}

function recordInteraction(interactionID, result) {
    scorm.set("cmi.interactions." + interactionID + ".result", result);
}

function finishSCORM() {
    scorm.save();
    scorm.quit();
}
