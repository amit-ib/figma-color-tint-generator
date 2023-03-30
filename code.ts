// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {
  width: 320,
  height: 640,
  title: "Colour Tint Generator",
});

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  //console.log(msg.type);
  if (msg.type === "actionGenerate") {
    // received myFormDataObj from html file
    console.log(msg.myFormDataObj);

    // Destructuring form data (Note: should be in same order as in clg)
    const {
      circleSize,
      circleSpacing,
      colorCode,
      colorName,
      frameDirection,
      tintNumber,
    } = msg.myFormDataObj;

    // Creating Frame
    const parentFrame = figma.createFrame();
    parentFrame.name = "Tints for the " + colorName + " color";

    // Add auto layout to the frame and set direction, padding, spacing, size
    parentFrame.layoutMode = frameDirection.toUpperCase();
    parentFrame.paddingBottom = 64;
    parentFrame.paddingTop = 64;
    parentFrame.paddingLeft = 64;
    parentFrame.paddingRight = 64;
    parentFrame.itemSpacing = parseInt(circleSpacing);

    // Auto resize frame based on items inside it
    parentFrame.primaryAxisSizingMode = "AUTO";
    parentFrame.counterAxisSizingMode = "AUTO";

    // Generating colour swatches
    for (let i = 0; i < tintNumber; i++) {
      const tintNode = figma.createEllipse();
      // Naming swatches
      tintNode.name = colorName + " " + (100 - i * 10);
      // Sizing
      tintNode.resize(parseInt(circleSize), parseInt(circleSize));
      // Colouring
      //tintNode.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }]; // Static RGB Colouring(just for ref)

      // Converting # value to RGB
      const hexToRgb = (hex: string) => {
        let rgbColor = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return rgbColor
          ? {
              r: parseInt(rgbColor[1], 16) / 255,
              g: parseInt(rgbColor[2], 16) / 255,
              b: parseInt(rgbColor[3], 16) / 255,
            }
          : null;
      };
      const colorRGB = hexToRgb(colorCode);
      if (colorRGB) {
        tintNode.fills = [
          {
            type: "SOLID",
            color: { r: colorRGB.r, g: colorRGB.g, b: colorRGB.b },
          },
        ];
      }

      // Color Opacity
      tintNode.opacity = (100 - i * 10) / 100;

      // Adding generated node to parent frame
      parentFrame.appendChild(tintNode);

      // Select and zoom to generated frame
      const selectFrame: FrameNode[] = [];
      selectFrame.push(parentFrame);
      figma.currentPage.selection = selectFrame;
      figma.viewport.scrollAndZoomIntoView(selectFrame);
    }

    // Displaying message based on "type"
    figma.closePlugin("Tints Generated Successfully");
  } else if (msg.type === "actionExit") {
    figma.closePlugin();
  }

  // if (msg.type === "create-rectangles") {
  //   const nodes: SceneNode[] = [];
  //   for (let i = 0; i < msg.count; i++) {
  //     const rect = figma.createRectangle();
  //     rect.x = i * 150;
  //     rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
  //     figma.currentPage.appendChild(rect);
  //     nodes.push(rect);
  //   }
  //   figma.currentPage.selection = nodes;
  //   figma.viewport.scrollAndZoomIntoView(nodes);
  // }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  //figma.closePlugin();
};
