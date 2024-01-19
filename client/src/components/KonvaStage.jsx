import React, { useState, useRef, useEffect } from 'react';
// Image - you use the 'Image' component to draw images on the canvas
// Transformer - allows you to transform Konva primitives and shapes. doesn't change the width and height properties of nodes when you resize them - changes the scaleX and scaleY properties
import { Stage, Layer, Rect, Image, Transformer } from 'react-konva';
// use-image is a library designed to be used with Konva. convenient way to load images and ensure they are ready to be rendered on the canvas.
import useImage from 'use-image';
import { useDispatch, useSelector } from 'react-redux';
import { updateComponentRectangle } from '../utils/reducers/designSliceV2';

const KonvaStage = ({ userImage, selectedIdx, setSelectedIdx }) => {

    const [image, status] = useImage(userImage);
    const maxWidth = 800;
    const dispatch = useDispatch();

    // redux state
    const components = useSelector((state) => state.designV2.components);
    console.log('this is components from KonvaStage', components);
    const isPastDesign = useSelector((state) => state.designV2.isPastDesign);

    // refs and other state
    // creating a ref object. object has a property called '.current' and the value of this property is persisted across renders. it will reference a konva Transformer component
    const trRef = useRef();
    const [rectangles, setRectangles] = useState([]);
    console.log('this is the rectangles state array', rectangles);
    // state to track the ID of the selected rectangle to resize
    const [selectedId, setSelectedId] = useState(null);
    const [rectanglesInitialized, setRectanglesInitialized] = useState(false);
  
    // imageWidth and imageHeight calculated based on the natural size of the image and the maxWidth. height is adjusted to maintain the aspect ratio
    let imageWidth = maxWidth;
    let imageHeight = image ? (image.height * maxWidth) / image.width : 0;
    if (image && image.width < maxWidth) {
      imageWidth = image.width;
      imageHeight = image.height;
    };
    
    // for past designs and new component rectangles
    useEffect(() => {
        if (isPastDesign && !rectanglesInitialized) {
            const initialRectangles = components.map((component, index) => ({
                x: component.rectangle.x,
                y: component.rectangle.y,
                width: component.rectangle.width,
                height: component.rectangle.height,
                isResizable: index !== 0 && component.rectangle.isresizable,
                stroke: component.rectangle.stroke || component.borderColor || 'black',
                key: component._id,
                component_id: component._id,
            }));
            setRectangles(initialRectangles);
            setRectanglesInitialized(true);
        }
        else if (components.length > 0 && rectanglesInitialized) {
            const updatedRectangles = components.map((component, index) => {
                const existingRectangle = rectangles.find(rect => rect.component_id === component._id);
                return {
                    ...existingRectangle,
                    x: existingRectangle ? existingRectangle.x : 0,
                    y: existingRectangle ? existingRectangle.y : 0,
                    width: existingRectangle ? existingRectangle.width : 100,
                    height: existingRectangle ? existingRectangle.height : 100,
                    isResizable: index !== 0,
                    stroke: component.borderColor || 'black',
                    key: component._id,
                    component_id: component._id,
                };
            });
            setRectangles(updatedRectangles);
        } 
    }, [components, isPastDesign, rectanglesInitialized]);

    // for new photo and first rectangle
    useEffect(() => {
        // handle new image
        if (status === 'loaded' && userImage && components.length === 1 && !rectanglesInitialized) {
            setRectangles([{
                x: 0,
                y: 0,
                width: imageWidth,
                height: imageHeight,
                isResizable: false, // Assuming the first rectangle should not be resizable
                stroke: 'black',
                key: components[0]._id,
                component_id: components[0]._id,
            }]);
            setRectanglesInitialized(true);
        }
    }, [status, userImage, imageWidth, imageHeight, components, rectanglesInitialized]);
  
    // used to automatically select the latest component added
    useEffect(() => {
      if (components.length > 0) {
        setSelectedIdx(components.length - 1);
      }
    }, [components]); // had dispatch in here
  
    // listen to changes in selectedIdx and select the corresponding rectangle
    useEffect(() => {
        if (selectedIdx !== null && selectedIdx >= 0 && selectedIdx < components.length) {
            const correspondingRect = rectangles.find(r => r.component_id === components[selectedIdx]._id);
            if (correspondingRect) {
                  setSelectedId(correspondingRect.component_id);
            }
        }
    }, [selectedIdx, components, rectangles]); // originally had this
  
    // update transformer to wrap around the selected rectangle
    useEffect(() => {
        if (selectedId && trRef.current) {
            const selectedRect = rectangles.find(rect => rect.component_id === selectedId);
            if (selectedRect && selectedRect.node) {
                trRef.current.nodes([selectedRect.node]);
                trRef.current.getLayer().batchDraw();
            }
        } else if (trRef.current){
            trRef.current.nodes([]);
            trRef.current.getLayer().batchDraw();
        }
    }, [selectedId, rectangles]);
  
    // event handlers
    const handleRectClick = (e, rectId) => {
      // prevent stage from deselecting the shape
      e.cancelBubble = true;
      const clickedIndex = components.findIndex(c => c._id === rectId);
      // console.log('Rectangle clicked:', rectangles[i]);
      setSelectedId(rectId);
      setSelectedIdx(clickedIndex);
    };
  
    // handle drag and update rectangle positions
    const handleDragEnd = (e, rectId) => {
      const rectIndex = rectangles.findIndex(r => r.component_id === rectId);
      console.log('this is rectIndex in handleDragEnd', rectIndex);
      if (rectIndex === -1) {
          console.error('Rectangle not found', rectId);
          return;
      };
  
      const updatedRect = {
          ...rectangles[rectIndex],
          x: e.target.x(),
          y: e.target.y(),
      };
  
      setRectangles(rects => rects.map(rect => rect.component_id === rectId ? updatedRect : rect));
  
      dispatch(updateComponentRectangle({
          componentId: rectId,
          body: updatedRect,
      }));
    };
  
    // handle resize and update rectangle dimensions
    const handleTransformEnd = (e, rectId) => {
      const rectIndex = rectangles.findIndex(r => r.component_id === rectId);
      if (rectIndex === -1) {
          console.error('Rectangle not found', rectId);
          return;
      }
      // get konva shape that was transformed
      const shape = e.target;
      const scaleX = shape.scaleX();
      const scaleY = shape.scaleY();
  
      // reset the scale to 1
      shape.scaleX(1);
      shape.scaleY(1);
  
      const updatedRect = {
          ...rectangles[rectIndex],
          x: shape.x(),
          y: shape.y(),
          width: shape.width() * scaleX,
          height: shape.height() * scaleY,
      };
  
      setRectangles(rects => rects.map(rect => rect.component_id === rectId ? updatedRect : rect));
  
      dispatch(updateComponentRectangle({
          componentId: rectId,
          body: updatedRect
      }));
    };

    return (
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
        >
          {/* component used as a container for shapes. all the Rect (rectangle) components should be inside this */}
          <Layer>
            {/* Image component displays an image on the canvas */}
            {image && (
              <Image image={image} width={imageWidth} height={imageHeight} />
            )}
            {/* map over the entire rectangles array, creating a new Rect component for each rectangle */}
            {rectangles.map((rect, i) => (
          <React.Fragment key={`${rect.component_id}-${i}-${rect.stroke}-${rect.key}`}>
           <Rect
              key={i}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              fill='transparent'
              stroke={rect.stroke}
              strokeWidth={3}
              draggable={selectedId === rect.component_id && rect.isResizable} // ={selectedId === rect.key}
              onClick={(e) => handleRectClick(e, rect.component_id)}
              onTap={(e) => handleRectClick(e, rect.component_id)}
              onDragEnd={(e) => handleDragEnd(e, rect.component_id)}
              onTransformEnd={(e) => handleTransformEnd(e, rect.component_id)}
              // reference to Konva 'Rect' instance stored in each rectangle object to use for transformation
              ref={(node) => {
                if (node) {
                    rect.node = node;
                }
              }}
            />
            {/* only show transformer for non-background rectangles */}
            {selectedId === rect.component_id && rect.isResizable && i !== 0 && (
                <Transformer
                    ref={trRef}
                    rotateEnabled={false}
                />
            )}
          </React.Fragment>
            ))}
            {/* <Transformer ref={trRef} rotateEnabled={false} /> */}
          </Layer>
        </Stage>
      );
    };

export default KonvaStage;
