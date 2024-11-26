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
    const aspectRatio = img.width / img.height;
    const width = widthInches * 96; // Convert to pixels
    const height = heightInches * 96; // Convert to pixels
    const scaledWidth = width / Math.ceil(width / img.width);
    const scaledHeight = scaledWidth / aspectRatio;

    canvas.width = width;
    canvas.height = height;

    for (let y = 0; y < Math.ceil(height / scaledHeight); y++) {
      for (let x = 0; x < Math.ceil(width / scaledWidth); x++) {
        ctx.drawImage(
          img,
          x * scaledWidth,
          y * scaledHeight,
          scaledWidth,
          scaledHeight
        );
      }
    }

    URL.revokeObjectURL(url);

    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = canvas.toDataURL("image/png");
  };

  img.src = url;
}
