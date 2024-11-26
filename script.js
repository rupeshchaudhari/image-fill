function generateImage() {
  const imageInput = document.getElementById("imageInput").files[0];
  const copies = parseInt(document.getElementById("copies").value);
  const widthInches = parseFloat(document.getElementById("width").value);
  const heightInches = parseFloat(document.getElementById("height").value);

  if (!imageInput) {
    alert("Please select an image.");
    return;
  }

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  const url = URL.createObjectURL(imageInput);

  img.onload = function () {
    const canvasWidth = widthInches * 96; // Convert to pixels
    const canvasHeight = heightInches * 96; // Convert to pixels
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const aspectRatio = img.width / img.height;

    // Calculate appropriate dimensions to maintain aspect ratio
    let scaledWidth = canvasWidth / Math.ceil(Math.sqrt(copies));
    let scaledHeight = scaledWidth / aspectRatio;

    if (scaledHeight * Math.ceil(Math.sqrt(copies)) > canvasHeight) {
      scaledHeight = canvasHeight / Math.ceil(Math.sqrt(copies));
      scaledWidth = scaledHeight * aspectRatio;
    }

    let count = 0;
    for (let y = 0; y < Math.ceil(canvasHeight / scaledHeight); y++) {
      for (let x = 0; x < Math.ceil(canvasWidth / scaledWidth); x++) {
        if (count < copies) {
          ctx.drawImage(
            img,
            x * scaledWidth,
            y * scaledHeight,
            scaledWidth,
            scaledHeight
          );
          count++;
        }
      }
    }

    URL.revokeObjectURL(url);

    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = canvas.toDataURL("image/png");
  };

  img.src = url;
}
