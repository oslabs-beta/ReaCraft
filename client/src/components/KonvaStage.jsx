import React, { useState, useRef, useEffect } from 'react';
// Stage - container component that encapsulates all the canvas elements you want to render
// Layer - Konva stages can have multiple layers. a layer is a container for shapes ('Rect', 'Image', etc) and can be used to group elements, control z-index (the stacking order), or to improve performance by isolating parts of the canvas that needs to redraw
// Rect - this component represents a rectangle shape. you can define its position, size, fill, stroke, and other properties
// Image - you use the 'Image' component to draw images on the canvas
// Transformer - allows you to transform Konva primitives and shapes. doesn't change the width and height properties of nodes when you resize them - changes the scaleX and scaleY properties
import { Stage, Layer, Rect, Image, Transformer } from 'react-konva';
// use-image is a library designed to be used with Konva. convenient way to load images and ensure they are ready to be rendered on the canvas.
import useImage from 'use-image';
import { useDispatch, useSelector } from 'react-redux';
import { selectComponent } from '../utils/reducers/designSlice';

const KonvaStage = ({ userImage }) => {
    // loaded image object from the 'useImage' hook
    const [image] = useImage(userImage);
    // max width for the image to have
    const maxWidth = 800;
    // state to store an array of drawn rectangles
    const [rectangles, setRectangles] = useState([]);
    // state to track the ID of the selected rectangle to resize
    const [selectedId, selectShape] = useState(null);
    // creating a ref object. object has a property called '.current' and the value of this property is persisted across renders. it will reference a konva Transformer component
    const trRef = useRef();
    const dispatch = useDispatch();
    const components = useSelector(state => state.design.components);
    console.log('this is components from KonvaStage', components);
    const selectedComponent = useSelector(state => state.design.selectedComponent);

    // imageWidth and imageHeight calculated based on the natural size of the image and the maxWidth. height is adjusted to maintain the aspect ratio
    let imageWidth = maxWidth;
    let imageHeight = image ? (image.height * maxWidth) / image.width : 0;
    // check if the natural width of the image is less than maxwidth
    if (image && image.width < maxWidth) {
        // if true, use the image's natural size instead
        imageWidth = image.width;
        imageHeight = image.height;
    };

    console.log('this is imageWidth and imageHeight', imageWidth, imageHeight);

    // runs whenever there's a change in the components makes sure there's a rectangle associated with each component
    useEffect(() => {
        console.log('useEffect hit for components update');
        setRectangles(currentRectangles => {
            return components.map((component, index) => {
                const existingRectangle = currentRectangles.find(rect => rect.key === component.name);

                // if it's the first component, make the rectangle match the image
                if (index === 0) {
                    return {
                        ...existingRectangle, // spread the existing properties
                        width: imageWidth,
                        height: imageHeight,
                        key: component.name,
                        isResizable: false
                    };
                }
                // for subsequent components, keep them as they are or create new ones
                return existingRectangle ||  {
                    x: 0, y: 0, width: 100, height: 100, key: component.name, isResizable: true
                };
            });
        });
    }, [components, image, imageWidth, imageHeight]);

    // use effect to update the transformer to wrap around the selected rectangle 
    useEffect(() => {
        console.log(`Component selected: ${selectedComponent}`);
        // Find the selected rectangle and update the transformer
        const selectedRect = rectangles.find(r => r.key === selectedComponent);
        console.log('this is trRef in useEffect', trRef);
        console.log('Selected rectangle', selectedRect);
        // check if a rectangle is selected and trRef is valid
        if (selectedRect && trRef.current) {
            // check if the rectangl is resizable
            if (selectedRect.isResizable) {
                // attach the transformer to it (to resize)
                trRef.current.nodes([selectedRect.node]);
            } else {
                // clear the transformer nodes
                trRef.current.nodes([]);
            }
            // redraw the layer to update the canvas with transformer changes
            trRef.current.getLayer().batchDraw();
            // update the state with the rectangles id
            selectShape(selectedRect.key);
        } else if (trRef.current) {
            trRef.current.nodes([]);
            trRef.current.getLayer().batchDraw();
            selectShape(null);
        }
    }, [selectedComponent, rectangles]); // originally had selectedId in the array too

    // used to automatically select the latest component added
    useEffect(() => {
        if (components.length > 0) {
            const latestComponent = components[components.length - 1].name;
            dispatch(selectComponent(latestComponent));
        }
    }, [components, dispatch]);

    // selects a rectangle when it's clicked and prevents event propagation
    const handleRectClick = (e, rectKey) => {
        // prevent stage from deselecting the shape
        e.cancelBubble = true;
        console.log(`Rectangle clicked: ${rectKey}`);
        if (selectedId !== rectKey) {
            // set selectedId state to the id of the clicked rectangle
            selectShape(rectKey);
            // dispatch action to updated the selected component in the global state
            dispatch(selectComponent(rectKey));
        }
    };

    return (
        // stage component is the root Konva component that contains all other konva components
        // represents the canvas element where all rectangles will be drawn
        <Stage
            // set the width and height of the canvas
            width={window.innerWidth}
            height={window.innerHeight}
        >
            {/* component used as a container for shapes. all the Rect (rectangle) components should be inside this */}
            <Layer>
                {/* Image component displays an image on the canvas */}
                {image && (
                    <Image
                        image={image}
                        width={imageWidth}
                        height={imageHeight}
                    />
                )}
                {/* map over the entire rectangles array, creating a new Rect component for each rectangle */}
                {rectangles.map((rect, i) => (
                    <React.Fragment key={i}>
                    <Rect
                        // unique identifier for each element. set to the index of the map function
                        key={i}
                        // x and y props set the position of the rectangle on the canvas
                        x={rect.x}
                        y={rect.y}
                        // width and height props set the size of the rectangle
                        width={rect.width}
                        height={rect.height}
                        // fill prop sets the color of the rectangle. the rectangle will be filled with a transparent color
                        fill="transparent"
                        // stoke prop sets the color of the rectangle's border
                        stroke="black"
                        // property allows the rectangles to be draggable on the canvas
                        draggable={rect.isResizable} // ={selectedId === rect.key}
                        // event handler for interactions with the rectangles
                        // handle clicks and taps (for touch devices) on a rectangle
                        onClick={(e) => handleRectClick(e, rect.key)}
                        onTap={(e) => handleRectClick(e, rect.key)}
                        // called when a rectangle is dragged and released (mouse up after dragging)
                        onDragEnd={(e) => {
                            // create a copy of the current rectangles array
                            const updatedRectangles = [...rectangles];
                            // update the position of the rectangle that was dragged to its new x and y coordinates
                            updatedRectangles[i] = { ...rect, x: e.target.x(), y: e.target.y() };
                            // set the rectangle state with the new updated array
                            setRectangles(updatedRectangles);
                        }}
                        // triggered when a transformation (resizing) applied to a rectangle ends
                        onTransformEnd={(e) => {
                            // create a shallow copy of the 'rectangles' array
                            const updatedRectangles = [...rectangles];
                            // rectangles size is updated according to the transformation, similar to onDragEnd. width and height are set based on the transformed dimensions. 
                            updatedRectangles[i] = {
                                ...rect,
                                x: e.target.x(),
                                y: e.target.y(),
                                width: e.target.width() * e.target.scaleX(),
                                height: e.target.height() * e.target.scaleY()
                            };
                            // reset the scale propertis of the target back to 1 as the actual width and height values have already been adjusted
                            e.target.scaleX(1);
                            e.target.scaleY(1);
                            // update the state with the transformed rectangle's new dimensions
                            setRectangles(updatedRectangles);
                        }}
                        // reference to Konva 'Rect' instance sotred in each rectangle object to use for transformation
                        ref={node => {
                            rect.node = node;
                        }}
                    />
                </React.Fragment>
                ))}
                <Transformer ref={trRef} rotateEnabled={false} />
            </Layer>
        </Stage>
    )
}

export default KonvaStage;