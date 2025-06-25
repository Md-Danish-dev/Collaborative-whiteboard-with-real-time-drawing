// import React, { useEffect, useLayoutEffect, useState } from "react";
// import rough from "roughjs/bundled/rough.esm";
// // import { emitElementUpdate } from "../socketConn/socketConn";

// const generator = rough.generator();

// const Canvas = ({ canvasRef, ctx, color, setElements, elements, tool, strokeWidth,user,socket }) => {
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [img,setImg] = useState(null);

//   useEffect(() => {
//     socket.on("whiteboardResponse", (data) => {
//       setImg(data.imgURL)
//     });
//   }, [socket]);



//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     canvas.width = window.innerWidth * 2;
//     canvas.height = window.innerHeight * 2;
//     canvas.style.width = `${window.innerWidth}px`;
//     canvas.style.height = `${window.innerHeight}px`;

//     const context = canvas.getContext("2d");
//     context.scale(2, 2);
//     context.lineCap = "round";
//     context.lineWidth = strokeWidth;
//     context.strokeStyle = color;
//     ctx.current = context;
//   }, []);

//   useEffect(() => {
//     if (ctx.current) {
//       ctx.current.strokeStyle = tool === "eraser" ? "#ffffff" : color;
//       ctx.current.lineWidth = strokeWidth;
//     }
//   }, [color, tool, strokeWidth]);

//   useLayoutEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas || !ctx.current) return;
//     ctx.current.clearRect(0, 0, canvas.width, canvas.height);
//     const roughCanvas = rough.canvas(canvas);

//     elements.forEach((ele) => {
//       switch (ele.element) {
//         case "rect":
//           roughCanvas.draw(
//             generator.rectangle(ele.offsetX, ele.offsetY, ele.width, ele.height, {
//               stroke: ele.stroke,
//               strokeWidth: ele.strokeWidth,
//               roughness: 0,
//             })
//           );

//           break;
//         case "circle":
//           roughCanvas.draw(
//             generator.ellipse(
//               ele.offsetX + ele.radiusX / 2,
//               ele.offsetY + ele.radiusY / 2,
//               Math.abs(ele.radiusX),
//               Math.abs(ele.radiusY),
//               {
//                 stroke: ele.stroke,
//                 strokeWidth: ele.strokeWidth,
//                 roughness: 0,
//               }
//             )
//           );
//           break;
//         case "line":
//           roughCanvas.draw(
//             generator.line(ele.offsetX, ele.offsetY, ele.width, ele.height, {
//               stroke: ele.stroke,
//               strokeWidth: ele.strokeWidth,
//               roughness: 0,
//             })
//           );
//           break;
//         case "pencil":
//         case "eraser":
//           roughCanvas.linearPath(ele.path, {
//             stroke: ele.stroke,
//             strokeWidth: ele.strokeWidth,
//             roughness: 0,
//           });
//           break;
//         case "text":
//           ctx.current.font = `${ele.fontSize}px Arial`;
//           ctx.current.fillStyle = ele.stroke;
//           ctx.current.fillText(ele.text, ele.offsetX, ele.offsetY);
//           break;
//         default:
//           break;
//       }
//     });
//     const whiteboardImage = canvasRef.current.toDataURL();
//     socket.emit("whiteboardData", whiteboardImage);
//   }, [elements]);

//   const handleMouseDown = (e) => {
//     const canvasBounds = canvasRef.current.getBoundingClientRect();
//     const offsetX = e.clientX - canvasBounds.left;
//     const offsetY = e.clientY - canvasBounds.top;

//     if (tool === "text") {
//       const text = prompt("Enter text:");
//       if (text && text.trim() !== "") {
//         setElements((prev) => [
//           ...prev,
//           {
//             offsetX,
//             offsetY,
//             text: text.trim(),
//             element: "text",
//             stroke: color,
//             fontSize: strokeWidth * 4,
//           },
//         ]);
//       }
//       return;
//     }

//     const newElement = tool === "pencil" || tool === "eraser"
//       ? {
//           offsetX,
//           offsetY,
//           path: [[offsetX, offsetY]],
//           stroke: tool === "eraser" ? "#ffffff" : color,
//           strokeWidth,
//           element: tool,
//         }
//       : {
//           offsetX,
//           offsetY,
//           stroke: color,
//           strokeWidth,
//           element: tool,
//         };

//     setElements((prev) => [...prev, newElement]);
//     setIsDrawing(true);
//   };

//   const handleMouseMove = (e) => {
//     if (!isDrawing) return;
//     const canvasBounds = canvasRef.current.getBoundingClientRect();
//     const offsetX = e.clientX - canvasBounds.left;
//     const offsetY = e.clientY - canvasBounds.top;

//     setElements((prev) =>
//       prev.map((ele, idx) => {
//         if (idx !== prev.length - 1) return ele;
//         switch (ele.element) {
//           case "pencil":
//           case "eraser":
//             return {
//               ...ele,
//               path: [...ele.path, [offsetX, offsetY]],
//             };
//           case "line":
//             return {
//               ...ele,
//               width: offsetX,
//               height: offsetY,
//             };
//           case "rect":
//             return {
//               ...ele,
//               width: offsetX - ele.offsetX,
//               height: offsetY - ele.offsetY,
//             };
//           case "circle":
//             return {
//               ...ele,
//               radiusX: offsetX - ele.offsetX,
//               radiusY: offsetY - ele.offsetY,
//             };
//           default:
//             return ele;
//         }
//       })
//     );
//   };

//   const handleMouseUp = () => setIsDrawing(false);

//   if(!user?.presenter){
//     return (
//      <div
//       className="bg-white w-full h-[80vh] relative border border-gray-300 overflow-hidden"
      
//     >
//       <img src={img} alt="whiteboard"
//       //  className="w-100 h-100"
//       style={{ height: "127%", width: window.innerWidth * 2 }}
//       />
//     </div>
//     )
    
//   }
//   return (
//     <div
//       className="bg-white w-full h-[80vh] relative border border-gray-300 overflow-hidden"
//       onMouseDown={handleMouseDown}
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//     >
//       <canvas ref={canvasRef}
//        className="absolute top-0 left-0 z-0" 
//         style={{ height: window.innerHeight, width: window.innerWidth * 2 }}

//        />
//     </div>
//   );
// };

// export default Canvas;

import React, { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

const Canvas = ({ canvasRef, ctx, color, setElements, elements, tool, strokeWidth, user, socket }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [img, setImg] = useState(null);

  // ✅ Receive full image for viewers (non-presenters)
  useEffect(() => {
    socket.on("whiteboardResponse", (data) => {
      setImg(data.imgURL);
    });

    // ✅ Receive individual elements (for presenter collaboration)
    socket.on("whiteboardElementFromServer", (element) => {
      if (user?.presenter) {
        setElements((prev) => [...prev, element]);
      }
    });
  }, [socket]);

  // ✅ Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.lineWidth = strokeWidth;
    context.strokeStyle = color;
    ctx.current = context;
  }, []);

  // ✅ Update stroke style or tool
  useEffect(() => {
    if (ctx.current) {
      ctx.current.strokeStyle = tool === "eraser" ? "#ffffff" : color;
      ctx.current.lineWidth = strokeWidth;
    }
  }, [color, tool, strokeWidth]);

  // ✅ Draw elements on canvas
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ctx.current) return;
    ctx.current.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);

    elements.forEach((ele) => {
      switch (ele.element) {
        case "rect":
          roughCanvas.draw(
            generator.rectangle(ele.offsetX, ele.offsetY, ele.width, ele.height, {
              stroke: ele.stroke,
              strokeWidth: ele.strokeWidth,
              roughness: 0,
            })
          );
          break;
        case "circle":
          roughCanvas.draw(
            generator.ellipse(
              ele.offsetX + ele.radiusX / 2,
              ele.offsetY + ele.radiusY / 2,
              Math.abs(ele.radiusX),
              Math.abs(ele.radiusY),
              {
                stroke: ele.stroke,
                strokeWidth: ele.strokeWidth,
                roughness: 0,
              }
            )
          );
          break;
        case "line":
          roughCanvas.draw(
            generator.line(ele.offsetX, ele.offsetY, ele.width, ele.height, {
              stroke: ele.stroke,
              strokeWidth: ele.strokeWidth,
              roughness: 0,
            })
          );
          break;
        case "pencil":
        case "eraser":
          roughCanvas.linearPath(ele.path, {
            stroke: ele.stroke,
            strokeWidth: ele.strokeWidth,
            roughness: 0,
          });
          break;
        case "text":
          ctx.current.font = `${ele.fontSize}px Arial`;
          ctx.current.fillStyle = ele.stroke;
          ctx.current.fillText(ele.text, ele.offsetX, ele.offsetY);
          break;
        default:
          break;
      }
    });

    // ✅ Only presenter emits image for viewers
    if (user?.presenter) {
      const whiteboardImage = canvasRef.current.toDataURL();
      socket.emit("whiteboardData", whiteboardImage);
    }
  }, [elements]);

  // ✅ Broadcast individual element (for presenter collaboration)
  const broadcastElement = (element) => {
    socket.emit("whiteboardElementFromClient", element);
  };

  // ✅ Handle draw start
  const handleMouseDown = (e) => {
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - canvasBounds.left;
    const offsetY = e.clientY - canvasBounds.top;

    if (tool === "text") {
      const text = prompt("Enter text:");
      if (text && text.trim() !== "") {
        const textElement = {
          offsetX,
          offsetY,
          text: text.trim(),
          element: "text",
          stroke: color,
          fontSize: strokeWidth * 4,
        };
        setElements((prev) => [...prev, textElement]);
        if (user?.presenter) broadcastElement(textElement);
      }
      return;
    }

    const newElement =
      tool === "pencil" || tool === "eraser"
        ? {
            offsetX,
            offsetY,
            path: [[offsetX, offsetY]],
            stroke: tool === "eraser" ? "#ffffff" : color,
            strokeWidth,
            element: tool,
          }
        : {
            offsetX,
            offsetY,
            stroke: color,
            strokeWidth,
            element: tool,
          };

    setElements((prev) => [...prev, newElement]);
    setIsDrawing(true);
  };

  // ✅ Handle drawing movement
  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - canvasBounds.left;
    const offsetY = e.clientY - canvasBounds.top;

    setElements((prev) =>
      prev.map((ele, idx) => {
        if (idx !== prev.length - 1) return ele;
        switch (ele.element) {
          case "pencil":
          case "eraser":
            return {
              ...ele,
              path: [...ele.path, [offsetX, offsetY]],
            };
          case "line":
            return {
              ...ele,
              width: offsetX,
              height: offsetY,
            };
          case "rect":
            return {
              ...ele,
              width: offsetX - ele.offsetX,
              height: offsetY - ele.offsetY,
            };
          case "circle":
            return {
              ...ele,
              radiusX: offsetX - ele.offsetX,
              radiusY: offsetY - ele.offsetY,
            };
          default:
            return ele;
        }
      })
    );
  };

  // ✅ On draw end — send final element
  const handleMouseUp = () => {
    setIsDrawing(false);
    if (user?.presenter && elements.length > 0) {
      const lastElement = elements[elements.length - 1];
      broadcastElement(lastElement);
    }
  };

  // ✅ Viewer mode: just render received image
  if (!user?.presenter) {
    return (
      <div className="bg-white w-full h-[80vh] relative border border-gray-300 overflow-hidden">
        <img
          src={img}
          alt="whiteboard"
          style={{ height: "127%", width: window.innerWidth * 2 }}
        />
      </div>
    );
  }

  // ✅ Presenter: show and use canvas
  return (
    <canvas
      ref={canvasRef}
      className="bg-white w-full h-[80vh] border border-gray-300 rounded shadow"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default Canvas;

