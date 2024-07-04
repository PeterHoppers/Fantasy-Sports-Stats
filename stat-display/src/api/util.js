function downloadObjectAsJson(objectToDownload) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
        new Blob([JSON.stringify(objectToDownload)], {type:"application/json"})
    );
    a.download = "myFile.json";
    a.click();
}
