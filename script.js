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
  const rows = parseInt(document.getElementById("rows").value);
  const columns = parseInt(document.getElementById("columns").value);
  const width = parseFloat(document.getElementById("width").value);
  const height = parseFloat(document.getElementById("height").value);
  const unit = document.getElementById("unit").value;
  const dpi = parseInt(document.getElementById("dpi").value);
  const orientation = document.getElementById("orientation").value;

  if (!imageInput) {
    alert("Please select an image.");
    return;
  }

  if (!rows || !columns || !width || !height || !unit || !dpi) {
    alert("Please fill in all fields.");
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

    const cellWidth = canvasWidth / columns;
    const cellHeight = canvasHeight / rows;

    let imgWidth = img.width;
    let imgHeight = img.height;

    // Adjust dimensions if orientation is portrait
    if (orientation === "portrait") {
      [imgWidth, imgHeight] = [imgHeight, imgWidth];
    }

    const aspectRatio = imgWidth / imgHeight;
    let scaledWidth, scaledHeight;

    if (aspectRatio > 1) {
      scaledWidth = cellWidth;
      scaledHeight = cellWidth / aspectRatio;
      if (scaledHeight > cellHeight) {
        scaledHeight = cellHeight;
        scaledWidth = scaledHeight * aspectRatio;
      }
    } else {
      scaledHeight = cellHeight;
      scaledWidth = cellHeight * aspectRatio;
      if (scaledWidth > cellWidth) {
        scaledWidth = cellWidth;
        scaledHeight = scaledWidth / aspectRatio;
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const offsetX = col * cellWidth + (cellWidth - scaledWidth) / 2;
        const offsetY = row * cellHeight + (cellHeight - scaledHeight) / 2;
        ctx.save();
        if (orientation === "portrait") {
          ctx.translate(offsetX + scaledWidth / 2, offsetY + scaledHeight / 2);
          ctx.rotate((90 * Math.PI) / 180);
          ctx.drawImage(
            img,
            -scaledHeight / 2,
            -scaledWidth / 2,
            scaledHeight,
            scaledWidth
          );
        } else {
          ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
        }
        ctx.restore();
      }
    }

    URL.revokeObjectURL(url);

    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = canvas.toDataURL("image/png");
  };

  img.onerror = function () {
    alert("Failed to load the image. Please try again with a different image.");
  };

  img.src = url;
}

function resetForm() {
  document.getElementById("imageInput").value = "";
  document.getElementById("imagePreview").style.display = "none";
  document.getElementById("rows").value = "3";
  document.getElementById("columns").value = "3";
  document.getElementById("width").value = "12";
  document.getElementById("height").value = "18";
  document.getElementById("unit").value = "inches";
  document.getElementById("dpi").value = "300";
  document.getElementById("orientation").value = "landscape";
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
