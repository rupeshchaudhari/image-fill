function previewImage() {
  const imageInput = document.getElementById("imageInput").files[0];
  const imagePreview = document.getElementById("imagePreview");

  if (imageInput) {
    const url = URL.createObjectURL(imageInput);
    imagePreview.src = url;
    imagePreview.style.display = "block";
  } else {
    imagePreview.src = "";
    imagePreview.style.display = "none";
  }
}

function generateImage() {
  const imageInput = document.getElementById("imageInput").files[0];
  const copies = parseInt(document.getElementById("copies").value);
  const width = parseFloat(document.getElementById("width").value);
  const height = parseFloat(document.getElementById("height").value);
  const unit = document.getElementById("unit").value;
  const gap = parseInt(document.getElementById("gap").value);
  const dpi = parseInt(document.getElementById("dpi").value);

  if (!imageInput) {
    alert("Please select an image.");
    return;
  }

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  const url = URL.createObjectURL(imageInput);

  // Convert width and height to pixels
  let canvasWidth, canvasHeight;
  if (unit === "inches") {
    canvasWidth = width * dpi;
    canvasHeight = height * dpi;
  } else if (unit === "cm") {
    canvasWidth = (width * dpi) / 2.54;
    canvasHeight = (height * dpi) / 2.54;
  } else {
    canvasWidth = width;
    canvasHeight = height;
  }

  img.onload = function () {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const aspectRatio = img.width / img.height;
    const cols = Math.ceil(Math.sqrt(copies));
    const rows = Math.ceil(copies / cols);

    const maxImageWidth = (canvasWidth - (cols - 1) * gap) / cols;
    const maxImageHeight = (canvasHeight - (rows - 1) * gap) / rows;

    let scaledWidth, scaledHeight;

    if (aspectRatio > 1) {
      scaledWidth = maxImageWidth;
      scaledHeight = maxImageWidth / aspectRatio;
      if (scaledHeight > maxImageHeight) {
        scaledHeight = maxImageHeight;
        scaledWidth = scaledHeight * aspectRatio;
      }
    } else {
      scaledHeight = maxImageHeight;
      scaledWidth = maxImageHeight * aspectRatio;
      if (scaledWidth > maxImageWidth) {
        scaledWidth = maxImageWidth;
        scaledHeight = scaledWidth / aspectRatio;
      }
    }

    let count = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (count < copies) {
          const offsetX = x * (scaledWidth + gap);
          const offsetY = y * (scaledHeight + gap);
          if (
            offsetX + scaledWidth <= canvasWidth &&
            offsetY + scaledHeight <= canvasHeight
          ) {
            ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
            count++;
          }
        }
      }
    }

    URL.revokeObjectURL(url);

    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = canvas.toDataURL("image/png");
  };

  img.src = url;
}
